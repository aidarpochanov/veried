# VeriEd

## About the project
The application is designed to help novice HDL developers to visualise digital schematic developed in Verilog, providing users with smart editing tools, fast feedback(error messaging) and basic interaction with the schematic such as zooming functionality.
## Intro 
The main framework is based on the basis template provided by https://github.com/fable-compiler/samples-electron.

The application code is developed in 'F#' which is further transpiled to 'JavaScript' using [FABLE](https://fable.io). In order to create a desktop application from web-app, [Electron.js](https://electronjs.org) is used.

[Monaco Editor](https://microsoft.github.io/monaco-editor/) is a 'JavaScript' library that implements the editor window in the application.

[Yosys.js](http://www.clifford.at/yosys/yosysjs.html) provides a 'Verilog' parser used in the application.

[Viz.js](https://github.com/mdaines/viz.js/) provides a graphics engine used to render the visualisation of the digital schematic.

## Requirements
1. [Node.js](https://nodejs.org/en/) 6.11 or higher
2. [dotnet SDK](https://www.microsoft.com/net/download/windows) 2.0 or higher
3. 'Yarn' or 'npm' JavaScript dependency manager

## Using the application
1. Install the requirements mentioned above.
2. Download or clone the VeriEd repository.
3. Use command-line interpreter to find the root folder.
4. Install JavaScript dependencies using 'yarn install' or 'npm install'
5. Install .NET dependencies using 'dotnet restore'
6. Run 'yarn start' or 'npm start' for compiling 'F#' into 'JavaScript'. This action compiles all the code at once and looks after any changes made to the source files, recompiling on change. 
7. Run 'yarn launch' or 'npm launch' to open the 'Electron.js' application which renders the 'HTML, CSS and JavaScript' code.
