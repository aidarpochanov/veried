module Renderer

open Fable.Core
open Fable.Core.JsInterop
open Fable.Import
open Electron
open Node.Exports
open Fable.PowerPack
open Yosys
open Description

Init().loadViz

let ysReady() = 
    Browser.document.getElementById("popup").style.visibility <- "hidden"
    Browser.document.getElementById("popupmsg").style.visibility <- "Please wait..."


let synth() = 
    let work() = 
        Synthesizer().writeFile("input.v", "code")
        Synthesizer().run
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