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
    // l

let processInput(input: string) = 
    let mutable rs = input.Replace("$and", "AND")
    // rs <- rs.Replace("octagon", "rectangle")
    rs <- rs.Replace("$or", "OR")
    rs <- rs.Replace("$not", "NOT")
    rs <- rs.Replace("$nand", "NAND")
    rs <- rs.Replace("$xor", "XOR")
    rs <- rs.Replace("$eq", "=")
    rs <- rs.Replace("$nor", "NOR")
    rs <- rs.Replace("$eq", "=")
    rs <- rs.Replace("$xnor", "XNOR")
    rs <- rs.Replace("$shr", "SHIFT RIGHT")
    rs <- rs.Replace("$shl", "SHIFT LEFT")
    rs <- rs.Replace("$mux", "MULTIPLEXER")
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
            // let edito = Browser.document.getElementById("editor")
            // Browser.document.getElementById("code").innerText <- Browser.document.getElementById("editor").innerText  <- alterString().replace("editor", "asd") 
            let code = ed().getValue()
            // let a = code.Replace(" n", "s") 
            // printToConsole(code)
            // printToConsole("asdasd")
            // Browser.document.getElementById("code").innerText <- 
            Synthesizer().setErrorMessage
            Synthesizer().writeFile("input.v")
            Synthesizer().run(command)      
            let dotfile: string = Synthesizer().read_file("show.dot")
            let mutable report = ""
            report <- Synthesizer().getErrorMessage
            if System.String.IsNullOrEmpty report then report <- "No errors found in your code!"
            report <- report.Replace("input.v:", "")
            Browser.document.getElementById("panel").innerText <- report
            let replacementDotfile = processInput(dotfile)
            // printToConsole(replacementDotfile)
            let svgText: string = Synthesizer().getSvg(replacementDotfile)
            Synthesizer().dotIntoSvg(replacementDotfile)
            // printToConsole(svgText)
            Browser.document.getElementById("popup").style.visibility <- "hidden"
            
            
        Browser.document.getElementById("popup").style.visibility <- "visible"
        Synthesizer().setTimeout

    let ys = Synthesizer().ys

    ys?verbose <- true
    ys?echo <- true

    previewBtn.addEventListener_click(fun _ ->
        synth()
    )


    

