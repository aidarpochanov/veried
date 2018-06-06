module Yosys

// Copyright (C) 2012 - 2017  Clifford Wolf <clifford@clifford.at>

// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.

// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
// WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
// ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
// WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
// ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
// OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

open Fable.Core
open Fable.Core.JsInterop
open Fable.Import
open Electron
open Node.Exports
open Fable.PowerPack

type Init() = 
    [<Emit("YosysJS.load_viz();")>]
    member __.loadViz with get() = jsNative


type Synthesizer() = 
    [<Emit("ys.write_file($1, code)")>]
    member __.writeFile(filename: string) = jsNative

    [<Emit("ys.run($1)")>]
    member __.run(command: string) = jsNative

    [<Emit("YosysJS.dot_into_svg($1, 'svg');")>]
    member __.dotIntoSvg(file: string) = jsNative

    [<Emit("YosysJS.dot_to_svg($1);")>]
    member __.getSvg(file: string) = jsNative

    [<Emit("window.setTimeout(work, 100);")>]
    member __.setTimeout with get() = jsNative

    [<Emit("YosysJS.create('ys', ysReady);")>]
    member __.ys with get() = jsNative

    [<Emit("ys.read_file($1);")>]
    member __.read_file(file: string) = jsNative

    [<Emit("ys.errmsg;")>]
    member __.getErrorMessage with get(): string= jsNative

    [<Emit("ys.errmsg = \"\";")>]
    member __.setErrorMessage = jsNative
    
type alterString()=
    [<Emit("document.getElementById($1).innerText.replace(/\n/g, /\r\n/g")>]
    member __.replace(element: string, s: string) = jsNative


type check() = 
    [<Emit("require('console')")>]
    member __.getConsole with get() = jsNative

    [<Emit("new $1.Console(process.stdout, process.stderr);")>]
    member __.myConsole(c: obj) = jsNative

type ed() = 
    [<Emit("monaco.editor.getModels()[0].getValue()")>]
    member __.getValue() : string = jsNative

    [<Emit("monaco.editor.setModelMarkers(monaco.editor.getModels()[0], 'test', [{startLineNumber: $1,startColumn: 1,endLineNumber: $1,endColumn: 1000,message: $2,severity: monaco.Severity.Error}]);")>]
    member __.setError(line: int, message: string) = jsNative

    [<Emit("monaco.editor.setModelMarkers(monaco.editor.getModels()[0], 'test', []);")>]
    member __.getRidOfError() = jsNative