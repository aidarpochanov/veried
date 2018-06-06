module Error

open Combinators

type errorValue = 
    | Beginning of string
    | ErrorLine of int
    | Message of string
    | Error of errorValue * errorValue

let beginning = 
    let b = matchString "Parser error in line "
    b |>> Beginning
    <?> "Beginning"

let errorLine = 
    let d = matchInteger
    d |>> ErrorLine
    <?> "ErrorLine"

let message = 
    let s = matchChar ':'
    let m = chooseAny (['''; '$'; '`';  '<'; '>'; '{' ; '}'; '|'; '\\'; '\n'] @ ['a'..'z'] @ ['A'..'Z'] @ ['0'..'9'] @ [' '] @ ['_'])
    s >>. oneOrMoreSpaces >>. matchOneOrMoreCharacters m
    |>> Message
    <?> "Message"

let error = 
    beginning >>. errorLine .>>. message
    |>> Error
    <?> "Error"


// let a = run error "Parser error in line 3: Module port `\\x1' is not declared in module header."

let unpack (result: Return<errorValue * Input>) = 
    match result with
    | Success (value, input) -> 
        value 
let parse elm =
    match elm with 
    | (ErrorLine(number), Message(mes)) -> (number, mes)
let preparse value = 
    match value with
    | Error(el, m) ->
        parse (el, m)



