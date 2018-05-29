module Description 

open Fable.Core
open Fable.Core.JsInterop
open Fable.Import
open Fable.Import.Browser
open Microsoft.FSharp.Collections

[<Emit("$0 === undefined")>]
let undefined (_: 'a) : bool = jsNative
let getElement = Browser.document.getElementById
let previewBtn = getElement "btn" :?> HTMLButtonElement
let save = getElement "save" :?> HTMLButtonElement
let explore = getElement "explore" :?> HTMLButtonElement
let bbs = getElement "bbs" :?> HTMLButtonElement
let abs = getElement "abs" :?> HTMLButtonElement
let artls = getElement "artls" :?> HTMLButtonElement
let agls = getElement "agls" :?> HTMLButtonElement