    
            var app = require('electron').remote;
            var dialog = app.dialog
            var fs = require('fs')
            document.getElementById('save').onclick = () => {
                dialog.showSaveDialog((fileName) => {
                    if(fileName === undefined){
                        alert("You didn't save the file!");
                        return;
                    }

                    var content = monaco.editor.getModels()[0].getValue();

                    fs.writeFile(fileName, content, (err) => {
                        if(err) {console.log(err);}
                        alert("The file has been successfully saved!");
                    })
                });
            };

            document.getElementById("explore").onclick = () => {
                dialog.showOpenDialog((fileNames) => {
                    if(fileNames === undefined){
                        alert("You have not selected a file to open!")
                    } else {
                        read(fileNames[0]);
                    }
                });
            };

            function read(filepath){
                fs.readFile(filepath, 'utf-8', (err, data) => {
                    if(err){
                        alert(err);
                        return;
                    }
                    var editor = monaco.editor.getModels()[0];
                    // var area = document.getElementById("editor")
                    editor.setValue(data);
                });
            }