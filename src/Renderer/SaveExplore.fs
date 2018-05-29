// module SaveExplore

// open Fable.Core
// open Fable.Core.JsInterop
// open Fable.Import
// open Electron
// open Node.Exports
// open Fable.PowerPack
// open Yosys
// open Description
// open System
// open Description
// open Fable.Import.Browser
// open Fable.Import.Node.Exports

// let app = electron.remote
// let dialog = app.dialog




// let fileFilterOpts = 
//     ResizeArray[ 
//         createObj [
//             "name" ==> "Verilog Code"
//             "extensions" ==> ResizeArray ["v"]
//         ]
//     ] |> Some



// let writeToFile str path =
//     let errorHandler _err = // TODO: figure out how to handle errors which can occur
//         ()
//     Fs.writeFile(path, str, errorHandler)

// let writeCurrentCodeToFile path = 
//     let code = ed().getValue()
//     (writeToFile code path)

// let resultUndefined errCase x =
//     match undefined x with
//     | true -> Result.Error errCase
//     | false -> Result.Ok x

// let openFile() = 
//     let options = createEmpty<OpenDialogOptions>
//     options.properties <- ResizeArray(["openFile"; "multiSelections"]) |> Some
//     options.filters <- fileFilterOpts
//     options.defaultPath <- Os.homedir()
//     let readPath (path, tId) = 
//         Fs.readFile(path, (fun err data -> // TODO: find out what this error does
//             loadFileIntoTab tId data
//         ))
//         |> ignore
//         tId // Return the tab id list again to open the last one

//     let makeTab path =
//         let tId = createNamedFileTab (baseFilePath path)
//         setTabFilePath tId path
//         (path, tId)

//     let checkResult (res : ResizeArray<string>) =
//         match isUndefined res with
//         | true -> Result.Error () // No files were opened, so don't do anything
//         | false -> Result.Ok (res.ToArray())

//     electron.remote.dialog.showOpenDialog(options)
//     |> resultUndefined ()
//     |> Result.map (fun x -> x.ToArray())
//     |> Result.map Array.toList
//     |> Result.map (List.map (makeTab >> readPath))
//     |> Result.map List.last
//     |> Result.map selectFileTab
//     |> ignore


    
