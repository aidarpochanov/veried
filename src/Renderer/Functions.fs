module Functions

open Fable.Core
open Fable.Core.JsInterop
open Fable.Import
open Electron
open Node.Exports
open Fable.PowerPack
open Yosys
open Description
open System
open System.Text.RegularExpressions
open Combinators
open Error

// let readLines filePath = System.IO.File.ReadAllLines(filePath);

let errorProcessing er = 
    let a = run error er
    let result = unpack a |> preparse
    result
    


let printToConsole(c: string) = 
        let nodeConsole = check().getConsole
        let myConsole = check().myConsole(nodeConsole)
        myConsole?log(c)

let getErrorMessage() = 
    let report = Synthesizer().getErrorMessage
    printToConsole(report) 
let cmd = "design -reset; read_verilog input.v; show -stretch"
let bbscmd = "design -reset; read_verilog input.v; show -stretch"
let abscmd = "design -reset; read_verilog input.v; proc; opt_clean; show -stretch"
let artlscmd = "design -reset; read_verilog input.v; synth -run coarse; show -stretch"
let aglscmd = "design -reset; read_verilog input.v; synth -run coarse; synth -run fine; show -stretch"

// let generateErrorMessage() = 
    // 

let processInput(input: string) = 
    let mutable rs = input.Replace("$and", "AND")
    // rs <- rs.Replace("octagon", "rectangle")
    rs <- rs.Replace("$not", "NOT")
    rs <- rs.Replace("$pos", "POSITIVE")
    rs <- rs.Replace("$neg", "NEGATIVE")
    rs <- rs.Replace("$reduce_and", "REDUCE AND")
    rs <- rs.Replace("$reduce_or", "REDUCE OR")
    rs <- rs.Replace("$reduce_xor", "REDUCE XOR")
    rs <- rs.Replace("$reduce_xnor", "REDUCE XNOR")
    rs <- rs.Replace("$reduce_bool", "REDUCE BOOL")
    rs <- rs.Replace("$logic_not", "NOT")
    rs <- rs.Replace("$or", "OR")
    rs <- rs.Replace("$nand", "NAND")
    rs <- rs.Replace("$xor", "XOR")
    rs <- rs.Replace("$eq", "=")
    rs <- rs.Replace("$nor", "NOR")
    rs <- rs.Replace("$xnor", "XNOR")
    rs <- rs.Replace("$shr", "SHIFT RIGHT")
    rs <- rs.Replace("$shl", "SHIFT LEFT")
    rs <- rs.Replace("$sshr", "SSHR")
    rs <- rs.Replace("$sshl", "SSHL")
    rs <- rs.Replace("$logic_and", "AND")
    rs <- rs.Replace("$logic_or", "OR")
    rs <- rs.Replace("$eqx", "EQX")
    rs <- rs.Replace("$nex", "NEX")
    rs <- rs.Replace("$lt", "LESS THAN")
    rs <- rs.Replace("$le", "LESS THAN OR EQUAL")
    rs <- rs.Replace("$ne", "NOT EQUAL")
    rs <- rs.Replace("$ge", "GREATER THAN OR EQUAL")
    rs <- rs.Replace("$gt", "GREATER THAN")
    rs <- rs.Replace("$add", "ADDITION")
    rs <- rs.Replace("$sub", "SUBTRACTION")
    rs <- rs.Replace("$mul", "MULTIPLICATION")
    rs <- rs.Replace("$div", "DIVISION")
    rs <- rs.Replace("$mod", "MODULUS")
    rs <- rs.Replace("$pow", "POWER")
    rs <- rs.Replace("$mux", "MULTIPLEXER")
    rs <- rs.Replace("$dff", "D FLIP-FLOP")
    rs <- rs.Replace("$add", "ADDITION")
    rs <- rs.Replace("$sub", "SUBSTRACTION") 

    rs
let init() = 
    Init().loadViz
   

    let ysReady() = 
        Browser.document.getElementById("popup").style.visibility <- "hidden"
        Browser.document.getElementById("popupmsg").style.visibility <- "Please wait..."


    let synth() = 
        let work() = 
            let command = "design -reset; read_verilog input.v; proc; opt_clean; show -stretch"
            let command2 = "help write_json"
            ed().getRidOfError()
            let code = ed().getValue()
            // let a = code.Replace(" n", "s") 
            // printToConsole(code)
            // printToConsole("asdasd")s

            Synthesizer().setErrorMessage
            Synthesizer().writeFile("input.v")
            Synthesizer().run(command)      
            let dotfile: string = Synthesizer().read_file("show.dot")
            let mutable report = ""
            report <- Synthesizer().getErrorMessage
            report <- report.Replace("input.v:", "")
            if (System.String.IsNullOrEmpty report) then 
                report <- "No errors found in your code!"
                Browser.document.getElementById("panel").style.color <- "green"
            else 
                Browser.document.getElementById("panel").style.color <- "red"
                let e = errorProcessing report
                ed().setError(fst e, snd e)
            
            Browser.document.getElementById("panel").innerText <- report
            let replacementDotfile = processInput(dotfile)
            // let svg = readLines "C:\\Users\\User\\Desktop\\FYP\\VERIED\\svg.txt"
            // printToConsole(replacementDotfile)
            let svgText: string = Synthesizer().getSvg(replacementDotfile)
            Synthesizer().dotIntoSvg(replacementDotfile)
            // Browser.document.getElementById("svg").innerHTML <- svgText
            // printToConsole(dotfile)
            // printToConsole(svg)
            Browser.document.getElementById("popup").style.visibility <- "hidden"

        Browser.document.getElementById("popup").style.visibility <- "visible"
        Synthesizer().setTimeout

    let ys = Synthesizer().ys

    ys?verbose <- true
    ys?echo <- true
    previewBtn.addEventListener_click(fun _ ->
        synth()
    )
    // let timer = new Timers.Timer(5000.)
    // let event = Async.AwaitEvent (timer.Elapsed) |> Async.Ignore
    
    // printToConsole(DateTime.Now.ToString "yyyy/MM/dd")
    // timer.Start()
    // printToConsole("A-OK")
    // while true do
    //     // Async.RunSynchronously event
    //     // synth()
    //     printToConsole(DateTime.Now.ToString "yyyy/MM/dd")
    
    

