// module Parsing

// open pLibrary
// open Graphics
// open System

// type VeriValue = 
//     | VeriInput of VeriValue option * VeriValue
//     | VeriOutput of VeriValue option * VeriValue
//     | VeriName of string
//     | VeriWire of VeriValue option * VeriValue
//     | VeriCode of VeriValue list
//     | VeriBits of VeriValue * VeriValue
//     | UpperBit of string
//     | LowerBit of string
// /// Create a forward reference
// let createParserForwardedToRef<'a>() =

//     let dummyParser= 
//         let innerFn input : Result<'a * Input> = failwith "unfixed forwarded parser"
//         {parseFn=innerFn; label="unknown"}
    
//     // ref to placeholder Parser
//     let parserRef = ref dummyParser 

//     // wrapper Parser
//     let innerFn input = 
//         // forward input to the placeholder
//         runOnInput !parserRef input 
//     let wrapperParser = {parseFn=innerFn; label="unknown"}

//     wrapperParser, parserRef

// let veriValue,veriValueRef = createParserForwardedToRef<VeriValue>()

// let (>>%) p x =
//     p |>> (fun _ -> x)

// let veriName = 
//     let letter = anyOf (['a'..'z'] @ ['A'..'Z'])
//     manyChars letter
//     |>> VeriName
//     <?> "VeriName"

// let upperBit = 
//     let digit = anyOf ['0'..'9']
//     manyChars1 digit 
//     |>> UpperBit
//     <?> "UpperBit"

// let lowerBit = 
//     let digit = anyOf ['0'..'9']
//     manyChars1 digit 
//     |>> LowerBit
//     <?> "LowerBit" 

// let veriBits = 
//     let left = pchar '['
//     let right = pchar ']' 
//     let bits = (upperBit .>> pchar ':' ) .>>. lowerBit
//     between left bits right
//     |>> VeriBits
//     <?> "VeriBits"

// let veriInput = 
//     pstring "Input" <|> pstring "input" .>> spaces >>. opt (veriBits .>> spaces ) .>>. veriName
//     |>> VeriInput
//     <?> "VeriInput"

// let veriOutput = 
//     pint >>. pstring "Output" <|> pstring "output" .>> spaces >>. opt (veriBits .>> spaces ) .>>. veriName
//     // <|> (pstring "Output" <|> pstring "output" .>> spaces >>. veriName)
//     |>> VeriOutput
//     <?> "VeriOutput"

// let veriWire = 
//     pstring "Wire" <|> pstring "wire" .>> spaces >>. opt (veriBits .>> spaces ) .>>. veriName
//     |>> VeriWire
//     <?> "VeriWire"

// let veriCode = 
//     let line = pstring ";\n"
//     let code = veriValue .>> spaces
//     let codes = sepBy1 code line
//     codes
//     |>> VeriCode
//     <?> "VeriCode"

// veriValueRef := choice
//     [
//         veriInput
//         veriOutput
//         veriWire
//         // veriCode
//         veriBits
//     ]


// let getInput bits value = 
//     IOGates().getInput(10, 60)

// let getOutput bits value = 
//     IOGates().getOutput(100, 500)

// let unpack (result: Result<VeriValue * Input>) = 
//     match result with
//     | Success (value, input) -> 
//         value 

// let parse value = 
//     match value with
//     | VeriInput(bits, name) -> getInput bits name 
//     | VeriOutput(bits, name) -> getOutput bits name
//     // | VeriWire(bits, name) -> //sprintf "wire"

// let parseStruct structure = 
//     match structure with
//     | VeriCode(l) -> List.map parse l
 
