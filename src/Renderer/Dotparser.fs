module Parsing
open Combinators

type dotValue = 
    | DotID of string
    | DotCompassPoint of string
    | DotPort1 of dotValue * dotValue
    | DotPort2 of dotValue 
    | DotPort of dotValue
    | DotNodeID of dotValue * dotValue option
    | DotEdgeOp of string
    | DotAttribute of dotValue * dotValue
    | DotAttributeList of dotValue list
    | DotNodeStmt of dotValue * dotValue
    | DotEdgeRHS of dotValue
    | DotEdgeStmt of (dotValue * dotValue) * dotValue
    | DotStmt of dotValue
    | DotStmtList of dotValue list 
    | DotEquation of dotValue * dotValue
    | DotIONode of dotValue
    | DotIOList of dotValue list
    | DotSubgraph of dotValue
    | DotGraph of dotValue * dotValue
let createParserForwardedToRef<'a>() =

    let dummyParser= 
        let innerFn input : Return<'a * Input> = failwith "unfixed forwarded parser"
        {parser_function=innerFn; label="unknown"}
    // ref to placeholder Parser
    let parserRef = ref dummyParser 
    // wrapper Parser
    let innerFn input = 
        // forward input to the placeholder
        runParserFunction !parserRef input 
    let wrapperParser = {parser_function=innerFn; label="unknown"}
    wrapperParser, parserRef

let dotValue,dotValueRef = createParserForwardedToRef<dotValue>()

let (>>%) p x =
    p |>> (fun _ -> x)

let dotEdgeOp = 
    let op = matchString "->"
    op |>> DotEdgeOp
    <?> "DotEdgeOp"
 
let dotCompassPoint = 
    let point = matchString "n" <|> matchString "ne" <|> matchString "e" <|> matchString "se" <|> matchString "s" <|> matchString "sw" <|> matchString "w" <|> matchString "nw" <|> matchString "c"
    point |>> DotCompassPoint 
    <?> "DotCompassPoint"

let dotID = 
    let id = chooseAny (['<'; '>'; '{' ; '}'; '|'; '\\'; '\n'] @ ['a'..'z'] @ ['A'..'Z'] @ ['0'..'9'] @ [' '] @ ['_'] @ ['\200'..'\250'])
    matchOneOrMoreCharacters id
    |>> DotID 
    <?> "DotID"

let dotPort1 = 
    let dd = matchString ":"
    let port = dd >>. dotID .>> dd .>>. dotCompassPoint
    port |>> DotPort1
    <?> "DotPort1"

let dotPort2 = 
    let dd = matchString ":"
    let port = dd >>. dotCompassPoint
    port |>> DotPort2
    <?> "DotPort2"

let dotPort = 
    dotPort1 <|> dotPort2 |>> DotPort
    <?> "DotPort"

let dotNodeID =
    let nodeID = dotID .>>. opt dotPort
    nodeID |>> DotNodeID
    <?> "DotNodeID"

let dotAttribute = 
    let attribute = (dotID .>> matchString "=" .>> matchString "\"" .>>. dotID .>> matchString "\"") <|> (dotID .>> matchString "="  .>>. dotID)
    attribute |>> DotAttribute
    <?> "DotAttribute"

let dotAttributeList = 
    let at = dotAttribute
    let lb = zeroOrMoreSpaces >>. matchString "[" .>> zeroOrMoreSpaces
    let rb = zeroOrMoreSpaces >>. matchString "]" .>> zeroOrMoreSpaces
    let separator = (matchString ";" <|> matchString ",") .>> zeroOrMoreSpaces
    let a = separateByOneOrMore at separator
    let al = middle lb a rb
    al |>> DotAttributeList
    <?> "DotAttributeList"
let dotNodeStmt = 
    let node_id = dotNodeID
    let attr_list = dotAttributeList
    let node_stmt = node_id .>>. attr_list
    node_stmt |>> DotNodeStmt
    <?> "DotNodeStmt"
let dotEdgeRHS = 
    let rhs = dotEdgeOp .>> oneOrMoreSpaces >>. dotNodeID
    rhs |>> DotEdgeRHS
    <?> "DotEdgeRHS"
let dotEdgeStmt = 
    let stmt = dotNodeID .>> oneOrMoreSpaces .>>. dotEdgeRHS .>>. dotAttributeList
    stmt |>> DotEdgeStmt
    <?> "DotEdgeStmt"
let dotIONode = 
    let ionode = dotAttribute <|> dotID
    ionode |>> DotIONode
    <?> "DotIONode"

let dotIOList = 
    let separator = matchString ";" .>> zeroOrMoreSpaces
    let list = separateByOneOrMore dotIONode separator
    list |>> DotIOList
    <?> "DotIOList"

let dotSubgraph = 
    let lb = matchString "{ rank=\"source\";" .>> oneOrMoreSpaces
    let rb = matchString ";}"
    let subgraph = middle lb dotIOList rb
    subgraph |>> DotSubgraph
    <?> "DotSubgraph"

let dotStmt = 
    let stmt = (dotNodeStmt <|> dotEdgeStmt <|> dotAttribute .>> matchString ";") <|> dotSubgraph
    stmt |>> DotStmt
    <?> "DotStmt"

let dotStmtList = 
    let separator = matchString "\n"
    let stmtlist = separateByOneOrMore dotStmt separator
    stmtlist |>> DotStmtList
    <?> "DotStmtList"

let dotGraph = 
    let lb = matchString "{" 
    let rb = matchString "}"
    let dg = matchString "digraph"
    let ex = matchString "\""
    let ending = matchString ";"
    let lbreak = matchString "\n" <|> matchString "\r\n"
    let graph = dg >>. oneOrMoreSpaces >>. ex >>. dotID .>> ex .>> oneOrMoreSpaces .>> lb .>> lbreak .>>. dotStmtList .>> lbreak .>> rb
    graph |>> DotGraph
    <?> "DotGraph" 
// let n = run dotCompassPoint "n"
// let ne = run dotCompassPoint "ne"
// let se = run dotCompassPoint "se"

// let a = run dotNodeID "n1:e"

// let b = run dotNodeID "n2:p4:e"

// let c = run dotAttribute "label=\"{{<p3> A|<p2> B}|\nAND|{<p4> Y}}\""

// // let d = run dotAttributeList "[ color=\"black\", fontcolor=\"blue\" ]"

// let e = run dotAttribute "label=\"smpl_circuit\""
// // let a = run dotEdgeRHS "-> n1:w"

// let b = run dotStmtList "label=\"smpl_circuit\";\nn1 [ shape=octagon, label=\"x\", color=\"black\", fontcolor=\"black\" ];\nc5:p4:e -> n1:w [color=\"black\", label=\" \"];\n"

let a = run dotGraph "digraph \"smpl_circuit\" {
label=\"smpl_circuit\";
rankdir=\"LR\";
remincross=true;
n1 [ shape=octagon, label=\"x\", color=\"black\", fontcolor=\"black\" ];
n2 [ shape=octagon, label=\"B\", color=\"black\", fontcolor=\"black\" ];
n3 [ shape=octagon, label=\"A\", color=\"black\", fontcolor=\"black\" ];
c5 [ shape=record, label=\"{{<p3> A|<p2> B}|\nAND|{<p4> Y}}\" ];
{ rank=\"source\"; n2; n3;}
{ rank=\"sink\"; n1;}
c5:p4:e -> n1:w [color=\"black\", label=\" \"];
n2:e -> c5:p2:w [color=\"black\", label=\" \"];
n3:e -> c5:p3:w [color=\"black\", label=\" \"];
}"

// let a = run dotSubgraph "{ rank=\"source\"; n2; n3;}"