module Menu

open Fable.Core
open Fable.Core.JsInterop
open Fable.Import
open Fable.Import.Electron
open Node.Base
open Functions
open Fable

let eventHandler method = System.Func<MenuItem, BrowserWindow, unit> method |> Some

let resizeArray (l: MenuItemOptions list) = 
    ResizeArray<MenuItemOptions> l
let createMenuItemOptions = createEmpty<MenuItemOptions>

let menuSeparator = 
    let separator = createMenuItemOptions
    separator.``type`` <- Some Separator
    separator

// let createMenuItem (name: string) (key: string option) = 
//     let menuItem = createMenuItemOptions
//     menuItem.label <- Some name
//     menuItem.accelerator <- key 
//     // menuItem.click <- eventHandler (fun _ _ -> action())
//     menuItem.role <- U2.Case2 ""
//     menuItem

let createRoleMenuItem (windows: MenuItemRole) = 
    let menuItem = createMenuItemOptions
    menuItem.role <- U2.Case1 windows |> Some
    menuItem

    
    


let createMenu (name: string) (options: MenuItemOptions list) = 
    let subMenu = createMenuItemOptions
    subMenu.label <- Some name
    subMenu.submenu <- options |> resizeArray |> U2.Case2 |> Some
    subMenu

// let file = 
//     createMenu "File" [
//         createMenuItem "New" (Some "CmdOrCtrl+N") 
//         menuSeparator
//         createMenuItem "Save" (Some "CmdOrCtrl+S")
//         createMenuItem "Save As" (Some "CmdOrCtrl+Shift+S")
//         createMenuItem "Open" (Some "CmdOrCtrl+O")
//         menuSeparator
//         createMenuItem "Close" (Some "CmdOrCtrl+W")
//         menuSeparator
//         createMenuItem "Quit" (Some "CmdOrCtrl+Q") 
//     ]

let edit = 
    createMenu "Edit" [
        createRoleMenuItem MenuItemRole.EditMenu 
    ]
let setMenu =
    let template = //an array of options for constructing MenuItem
        ResizeArray<MenuItemOptions> [
            // file
            edit
            //view
        ]
    template
    |> electron.remote.Menu.buildFromTemplate
    |> electron.remote.Menu.setApplicationMenu