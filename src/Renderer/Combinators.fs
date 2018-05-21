module Combinators 

module input_text = //text 
    open System
    type position = { //position in the text
        line : int
        column : int
    }
    let initial_position = {line=0; column=0} //initialize position
    let incrementColumn position = //increment column with a new char
        {position with column=position.column + 1}
    let incrementLine position = //increment line with a new line
        {line=position.line + 1; column=0}

    type initial_state = { //input state for parsers
        lines : string[]
        position : position 
    }
    let getCurrentLine input_state = //return current line
        let line_position = input_state.position.line
        if line_position < input_state.lines.Length then
            input_state.lines.[line_position]
        else
            "end of file"
    let generateInputState str = //generate input state from input
        if String.IsNullOrEmpty(str) then
            {lines=[||]; position=initial_position}
        else
            let sep= [| "\r\n"; "\n" |]
            let lines = str.Split(sep, StringSplitOptions.None)
            {lines=lines; position=initial_position} 
    let getNextChar input = //get next character from input
        let line_position = input.position.line
        let column_position = input.position.column
        if line_position >= input.lines.Length then
            input, None
        else
            let currentLine = getCurrentLine input
            if column_position < currentLine.Length then
                let char = currentLine.[column_position]
                let new_position= incrementColumn input.position 
                let new_state = {input with position=new_position}
                new_state, Some char
            else 
                let char = '\n'
                let new_position = incrementLine input.position 
                let new_state = {input with position=new_position}
                new_state, Some char

open System

type Position = { // class for position
    current_line : string
    line : int
    column : int
    }
type Input = input_text.initial_state  //class for input
type Label = string //label
type Error = string //error
type Return<'a> = //result
    | Success of 'a
    | Failure of Label * Error * Position 
type Parser<'a> = { //parser type
    parser_function : (Input -> Return<'a * Input>)
    label:  Label 
    }
let runParserFunction parser input = //run inner function on input
    parser.parser_function input
let run parser inputStr = //run parser through the input state
   runParserFunction parser (input_text.generateInputState inputStr)
let getParserPosition (input_state:Input) = { //get position
    current_line = input_text.getCurrentLine input_state
    line = input_state.position.line
    column = input_state.position.column
    }
let printResult result = //print result of the parsing
    match result with
    | Success (value,input) -> 
        printfn "%A" value
    | Failure (label,error,parserPos) -> 
        let error_line = parserPos.current_line
        let column_position = parserPos.column
        let line_position = parserPos.line
        let failure = sprintf "%*s^%s" column_position "" error
        printfn "Line:%i Col:%i Error parsing %s\n%s\n%s" line_position column_position label error_line failure 
let getLabel parser = //return label
    parser.label
let setLabel parser new_label = //set label
    let new_parser_function input = 
        let result = parser.parser_function input
        match result with
        | Success s ->
            Success s 
        | Failure (old_label,err,pos) -> 
            Failure (new_label,err,pos) 
    {parser_function=new_parser_function; label=new_label}
let ( <?> ) = setLabel
let matching character label = //parse a character
    let parser_fun input =
        let remaining_input,char_option = input_text.getNextChar input 
        match char_option with
        | None -> 
            let err = "No more input"
            let pos = getParserPosition input
            Failure (label,err,pos)
        | Some first -> 
            if character first then
                Success (first,remaining_input)
            else
                let err = sprintf "Unexpected '%c'" first
                let pos = getParserPosition input
                Failure (label,err,pos)
    {parser_function=parser_fun;label=label}
let bindParser f p = //bind parser to another parser to create a new parser
    let label = "unknown"
    let parser_fun input =
        let result = runParserFunction p input 
        match result with
        | Failure (label,err,pos) -> 
            Failure (label,err,pos)  
        | Success (v,remaining_input) ->
            let p2 = f v
            runParserFunction p2 remaining_input
    {parser_function=parser_fun; label=label}
let ( >>= ) p f = bindParser f p
let returnParser x = 
    let label = sprintf "%A" x
    let parser_fun input =
        Success (x,input)
    {parser_function=parser_fun; label=label}
let mapParser f = 
    bindParser (f >> returnParser)
let ( <!> ) = mapParser
let ( |>> ) x f = mapParser f x
let applyFunction f x =         
    f>>= (fun f -> 
    x>>= (fun x -> 
        returnParser (f x) ))
let ( <*> ) = applyFunction
let lift func xParser yParser =
    returnParser func <*> xParser <*> yParser

let following p1 p2 =         
    let label = sprintf "%s following %s" (getLabel p1) (getLabel p2)
    p1 >>= (fun p1Result -> 
    p2 >>= (fun p2Result -> 
        returnParser (p1Result,p2Result) ))
    <?> label
let ( .>>. ) = following
let eitherOr p1 p2 =
    let label = sprintf "%s eitherOr %s" (getLabel p1) (getLabel p2)
    let parser_fun input =
        let res = runParserFunction p1 input
        match res with
        | Success result -> 
            res
        | Failure _ -> 
            let result1 = runParserFunction p2 input
            result1
    {parser_function=parser_fun; label=label}
let ( <|> ) = eitherOr

let choose parser_list = 
    List.reduce ( <|> ) parser_list 
let rec seq parser_list =
    let f head tail = head::tail
    let fParser = lift f
    match parser_list with
    | [] -> 
        returnParser []
    | head::tail ->
        fParser head (seq tail)
let rec zeroOrMore parser input =
    let first_result = runParserFunction parser input 
    match first_result with
    | Failure (_,_,_) -> 
        ([],input)  
    | Success (first_value,input_after_parser) -> 
        let (seq_values,remainingInput) = 
            zeroOrMore parser input_after_parser
        let values = first_value::seq_values
        (values,remainingInput)  
let manyZeroOrMore p = 
    let label = sprintf "manyZeroOrMore %s" (getLabel p)
    let rec parser_fun input =
        Success (zeroOrMore p input)
    {parser_function=parser_fun; label=label}
let manyOneOrMore p =         
    let label = sprintf "manyOneOrMore %s" (getLabel p)

    p      >>= (fun head -> 
    manyZeroOrMore p >>= (fun tail -> 
        returnParser (head::tail) ))
    <?> label
let opt p = 
    let label = sprintf "opt %s" (getLabel p)
    let some = p |>> Some
    let none = returnParser None
    (some <|> none) <?> label
let (.>>) parser1 parser2 = 
    parser1 .>>. parser2 
    |> mapParser (fun (a,b) -> a) 
let (>>.) parser1 parser2 = 
    parser1 .>>. parser2 
    |> mapParser (fun (a,b) -> b) 
let middle parser1 parser2 parser3 = 
    parser1 >>. parser2 .>> parser3 
let separateByOneOrMore parser separator =
    let separateThenParser = separator >>. parser            
    parser .>>. manyZeroOrMore separateThenParser 
    |>> fun (p,pList) -> p::pList
let separateByZeroOrMore parser separator =
    separateByOneOrMore parser separator <|> returnParser []
let matchChar charToMatch = 
    let label = sprintf "%c" charToMatch 
    let predicate ch = (ch = charToMatch) 
    matching predicate label 
let chooseAny list_of_characters = 
    let label = sprintf "anyOf %A" list_of_characters 
    list_of_characters
    |> List.map matchChar
    |> choose
    <?> label
let charListToStr charList =
    String(List.toArray charList) 
let matchZeroOrMoreCharacters c =
    manyZeroOrMore c
    |>> charListToStr
let matchOneOrMoreCharacters c =
    manyOneOrMore c
    |>> charListToStr
let matchString lbl = 
    let label = lbl 
    lbl
    |> List.ofSeq
    |> List.map matchChar 
    |> seq
    |> mapParser charListToStr 
    <?> label
let matchWhiteSpace (character: char) = 
    match character with
    | ' ' -> true
    | _ -> false
let whitespaceChar = 
    let predicate = matchWhiteSpace
    let label = "whitespace"
    matching predicate label 
let zeroOrMoreSpaces = matchZeroOrMoreCharacters whitespaceChar
let oneOrMoreSpaces = matchOneOrMoreCharacters whitespaceChar
let matchDigit (character: char) = 
    match character with
    | '1' -> true
    | '2' -> true
    | '3' -> true
    | '4' -> true
    | '5' -> true
    | '6' -> true
    | '7' -> true
    | '8' -> true
    | '9' -> true
    | '0' -> true
    | _ -> false
let digitalCharacter = 
    let predicate = matchDigit 
    let label = "digit"
    matching predicate label 
let digits = matchOneOrMoreCharacters digitalCharacter 
let matchInteger = 
    let label = "integer" 
    let resultToInt (sign,digits) = 
        let i = digits |> int 
        match sign with
        | Some ch -> -i
        | None -> i
    opt (matchChar '-') .>>. digits 
    |> mapParser resultToInt
    <?> label