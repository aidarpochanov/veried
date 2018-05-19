module Renderer

open Fable.Core
open Fable.Core.JsInterop
open Fable.Import
open Electron
open Node.Exports
open Fable.PowerPack
open Yosys
open Description
open System

Init().loadViz

let printToConsole(c: string) = 
    let nodeConsole = check().getConsole
    let myConsole = check().myConsole(nodeConsole)
    myConsole?log(c)

let ysReady() = 
    Browser.document.getElementById("popup").style.visibility <- "hidden"
    Browser.document.getElementById("popupmsg").style.visibility <- "Please wait..."


let synth() = 
    let work() = 
        let command = "design -reset; read_verilog input.v; synth -run coarse; show -stretch"
        let command2 = "design -reset; read_verilog input.v; write_json output.json"
        // let edito = Browser.document.getElementById("editor")
        // Browser.document.getElementById("code").innerText <- Browser.document.getElementById("editor").innerText  <- alterString().replace("editor", "asd") 
        let code = ed().getValue()
        // let a = code.Replace("\n", "s") 
        printToConsole(code)
        // Browser.document.getElementById("code").innerText <- a
        Synthesizer().writeFile("input.v")
        Synthesizer().run(command)
        Synthesizer().getSvg
        Browser.document.getElementById("popup").style.visibility <- "hidden"
        
        
    Browser.document.getElementById("popup").style.visibility <- "visible"
    Synthesizer().setTimeout

let ys = Synthesizer().ys

ys?verbose <- true
ys?echo <- true

previewBtn.addEventListener_click(fun _ ->
    synth()
)