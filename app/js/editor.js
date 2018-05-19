//export default class CodeEditor extends Component {
//  render() {
//    return (
//        <MonacoEditor
//          requireConfig={{
//            url: `${appPath}/vs/loader.js`,
//            baseUrl: `${appPath}`
//          }}
//        />
//    )
//  }
//}


// Save Monaco's amd require and restore Node's require
var amdRequire = global.require;
global.require = nodeRequire;


// require node modules before loader.js comes in
var path = require('path');
function uriFromPath(_path) {
  var pathName = path.resolve(_path).replace(/\\/g, '/');
  if (pathName.length > 0 && pathName.charAt(0) !== '/') {
    pathName = '/' + pathName;
  }
  return encodeURI('file://' + pathName);
}
amdRequire.config({
  //baseUrl: uriFromPath(path.join(__dirname, '../node_modules/monaco-editor/min'))
  baseUrl: uriFromPath(path.join(__dirname, '../node_modules/monaco-editor/min'))

});
// workaround monaco-css not understanding the environment
self.module = undefined;
// workaround monaco-typescript not understanding the environment
self.process.browser = true;
amdRequire(['vs/editor/editor.main'], function () {

  monaco.languages.register({
    id: 'verilog'
  });
  monaco.languages.setMonarchTokensProvider('verilog', {
    // Set defaultToken to invalid to see what you do not tokenize yet
    defaultToken: 'invalid',

    ignoreCase: true,

    brackets: [
      ['{', '}', 'delimiter.curly'],
      ['[', ']', 'delimiter.square'],
      ['(', ')', 'delimiter.parenthesis'],
      ['<', '>', 'delimiter.angle']
    ],

    operators: [
      '+', '-', '*'
    ],

    keywords: [
      "input",
      "output"
    ],

    // we include these common regular expressions
    symbols: /[=><!~?:&|+\-*\/\^%]+/,

    // C# style strings
    escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

    // The main tokenizer for our languages
    tokenizer: {
      root: [
        // identifiers and keywords
        [/[a-z_$][\w$]*/, {
          cases: {
            '@keywords': 'keyword',
            '@default': 'identifier'
          }
        }],

        // whitespace
        { include: '@whitespace' },

        // delimiters and operators
        [/[{}()\[\]]/, '@brackets'],
        [/[<>](?!@symbols)/, '@brackets'],
        [/@symbols/, {
          cases: {
            '@operators': 'operator',
            '@default': ''
          }
        }],

        // @ annotations.
        // As an example, we emit a debugging log message on these tokens.
        // Note: message are supressed during the first load -- change some lines to see them.
        [/@\s*[a-zA-Z_\$][\w\$]*/, { token: 'annotation', log: 'annotation token: $0' }],

        // numbers
        [/#-?\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
        [/#-?0[xX][0-9a-fA-F]+/, 'number.hex'],
        [/#-?\d+/, 'number'],
        [/-?\d*\.\d+([eE][\-+]?\d+)?/, 'number.barefloat'],
        [/-?0[xX][0-9a-fA-F]+/, 'number.barehex'],
        [/-?\d+/, 'number.bare'],

        // delimiter: after number because of .\d floats
        [/[,.]/, 'delimiter'],

        // strings
        [/"([^"\\]|\\.)*$/, 'string.invalid'],  // non-teminated string
        [/"/, { token: 'string.quote', bracket: '@open', next: '@string' }],

        // characters
        [/'[^\\']'/, 'string'],
        [/(')(@escapes)(')/, ['string', 'string.escape', 'string']],
        [/'/, 'string.invalid'],

        // ARM comments
        [/;(.*)/, 'comment'],

      ],


      string: [
        [/[^\\"]+/, 'string'],
        [/@escapes/, 'string.escape'],
        [/\\./, 'string.escape.invalid'],
        [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
      ],

      whitespace: [
        [/[ \t\r\n]+/, 'white'],
        //        [/\/\*/, 'comment', '@comment'],
        //        [/\/\/.*$/, 'comment'],
      ],
    }
  });


  var editor = monaco.editor.create(document.getElementById('editor'), {
    value: "output out;\rasdasd;\r",
    language: 'javascript',
    theme: 'vs-dark',
    renderWhitespace: 'none',
    roundedSelection: true,
    scrollBeyondLastLine: false,
    automaticLayout: true,
    lineNumbers: "off"
  });

  // var mevent = new CustomEvent("monaco-ready", { "detail": "ready now!" });
  // document.getElementById("test").innerText = window.editor.getValue()
  // // Dispatch/Trigger/Fire the event
  // document.dispatchEvent(mevent);
});





