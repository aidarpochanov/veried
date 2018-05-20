module Description 

open Fable.Core
open Fable.Core.JsInterop
open Fable.Import
open Fable.Import.Browser
open Microsoft.FSharp.Collections


let getElement = Browser.document.getElementById

let previewBtn = getElement "btn" :?> HTMLButtonElement