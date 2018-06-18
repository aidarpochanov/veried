var nc = require('console')
var mc = new nc.Console(process.stdout, process.stderr);

var assert = require('assert');
var t = YosysJS.create('test', function() {});
t.verbose = true;
t.echo = true;

function testParent(veriInput, expectedDot, gateName){
    var re = /\$\d+/g
    var ed = expectedDot.replace(re, '')
    // mc.log("\n\n\n\n")
    mc.log("----------------------" + gateName)
    t.write_file("input.v", veriInput)
    t.run("design -reset; read_verilog input.v; proc; opt_clean; show -stretch")
    var resultingDot = t.read_file("show.dot");
    var rd = resultingDot.replace(re, '')
    mc.log('Checking ' + gateName + ' gate.');
    // mc.log('Expect \n\"' + ed + '\" to equal \n\"' + rd + '\".');
    
    try {
        assert.equal(ed, rd);
        mc.log('test ' + gateName + ' Passed.');
        return 1;
    } catch (error) {
        mc.error('test ' + gateName + ' Failed.');
        return 0;
    }
}

function testAnd() {
    var veriInput = "module testAnd(A,B,x);\ninput A,B;\noutput x;\nand g1(x,A,B);\nendmodule";
    var expectedDot = "digraph \"testAnd\" {\nlabel=\"testAnd\";\n" + "rankdir=\"LR\";\nremincross=true;\n" +
    "n1 [ shape=octagon, label=\"x\", color=\"black\", fontcolor=\"black\" ];\n" +
    "n2 [ shape=octagon, label=\"B\", color=\"black\", fontcolor=\"black\" ];\n" + 
    "n3 [ shape=octagon, label=\"A\", color=\"black\", fontcolor=\"black\" ];\n" + 
    "{ rank=\"source\"; n2; n3;}\n" +
    "{ rank=\"sink\"; n1;}\n" +
    "c5 [ shape=record, label=\"{{<p3> A|<p2> B}|\\n$and|{<p4> Y}}\" ];\n" +
    "c5:p4:e -> n1:w [color=\"black\", label=\"\"];\n" + 
    "n2:e -> c5:p2:w [color=\"black\", label=\"\"];\n" + 
    "n3:e -> c5:p3:w [color=\"black\", label=\"\"];\n" +
    "}\n";
    return testParent(veriInput, expectedDot, "AND")
}

function testOr() {
    var veriInput = "module testOr(A,B,x);\ninput A,B;\noutput x;\nor g1(x,A,B);\nendmodule";
    var expectedDot = "digraph \"testOr\" {\nlabel=\"testOr\";\n" + "rankdir=\"LR\";\nremincross=true;\n" +
    "n1 [ shape=octagon, label=\"x\", color=\"black\", fontcolor=\"black\" ];\n" +
    "n2 [ shape=octagon, label=\"B\", color=\"black\", fontcolor=\"black\" ];\n" + 
    "n3 [ shape=octagon, label=\"A\", color=\"black\", fontcolor=\"black\" ];\n" + 
    "{ rank=\"source\"; n2; n3;}\n" +
    "{ rank=\"sink\"; n1;}\n" +
    "c5 [ shape=record, label=\"{{<p3> A|<p2> B}|\\n$or|{<p4> Y}}\" ];\n" +
    "c5:p4:e -> n1:w [color=\"black\", label=\"\"];\n" + 
    "n2:e -> c5:p2:w [color=\"black\", label=\"\"];\n" + 
    "n3:e -> c5:p3:w [color=\"black\", label=\"\"];\n" +
    "}\n";
    return testParent(veriInput, expectedDot, "OR")
}

function testNand() {
    var veriInput = "module testNand(A,B,x);\ninput A,B;\noutput x;\nnand g1(x,A,B);\nendmodule";
    var expectedDot = "digraph \"testNand\" {\nlabel=\"testNand\";\n" + "rankdir=\"LR\";\nremincross=true;\n" +
    "n1 [ shape=octagon, label=\"x\", color=\"black\", fontcolor=\"black\" ];\n" +
    "n2 [ shape=octagon, label=\"B\", color=\"black\", fontcolor=\"black\" ];\n" + 
    "n3 [ shape=octagon, label=\"A\", color=\"black\", fontcolor=\"black\" ];\n" + 
    "{ rank=\"source\"; n2; n3;}\n" +
    "{ rank=\"sink\"; n1;}\n" +
    "c5 [ shape=record, label=\"{{<p3> A|<p2> B}|\\n$nand|{<p4> Y}}\" ];\n" +
    "c5:p4:e -> n1:w [color=\"black\", label=\"\"];\n" + 
    "n2:e -> c5:p2:w [color=\"black\", label=\"\"];\n" + 
    "n3:e -> c5:p3:w [color=\"black\", label=\"\"];\n" +
    "}\n";
    return testParent(veriInput, expectedDot, "NAND")
}

function testNot() {
    var veriInput = "module testNot(A,x);\ninput A;\noutput x;\nnot g1(x,A);\nendmodule";
    var expectedDot = "digraph \"testNot\" {\nlabel=\"testNot\";\n" + "rankdir=\"LR\";\nremincross=true;\n" +
    "n1 [ shape=octagon, label=\"x\", color=\"black\", fontcolor=\"black\" ];\n" +
    "n2 [ shape=octagon, label=\"A\", color=\"black\", fontcolor=\"black\" ];\n" + 
    "{ rank=\"source\"; n2;}\n" +
    "{ rank=\"sink\"; n1;}\n" +
    "c4 [ shape=record, label=\"{{<p2> A}|$1\\n$not|{<p3> Y}}\" ];\n"+
    "c4:p3:e -> n1:w [color=\"black\", label=\"\"];\n"+
    "n2:e -> c4:p2:w [color=\"black\", label=\"\"];\n"+
    "}\n";
    return testParent(veriInput, expectedDot, "NOT")
}

function testXor() {
    var veriInput = "module testXor(A,B,x);\ninput A,B;\noutput x;\nxor g1(x,A,B);\nendmodule";
    var expectedDot = "digraph \"testXor\" {\nlabel=\"testXor\";\n" + "rankdir=\"LR\";\nremincross=true;\n" +
    "n1 [ shape=octagon, label=\"x\", color=\"black\", fontcolor=\"black\" ];\n" +
    "n2 [ shape=octagon, label=\"B\", color=\"black\", fontcolor=\"black\" ];\n" + 
    "n3 [ shape=octagon, label=\"A\", color=\"black\", fontcolor=\"black\" ];\n" + 
    "{ rank=\"source\"; n2; n3;}\n" +
    "{ rank=\"sink\"; n1;}\n" +
    "c5 [ shape=record, label=\"{{<p3> A|<p2> B}|\\n$xor|{<p4> Y}}\" ];\n" +
    "c5:p4:e -> n1:w [color=\"black\", label=\"\"];\n" + 
    "n2:e -> c5:p2:w [color=\"black\", label=\"\"];\n" + 
    "n3:e -> c5:p3:w [color=\"black\", label=\"\"];\n" +
    "}\n";
    return testParent(veriInput, expectedDot, "XOR")
}

function testXnor() {
    var veriInput = "module testXnor(A,B,x);\ninput A,B;\noutput x;\nxnor g1(x,A,B);\nendmodule";
    var expectedDot = "digraph \"testXnor\" {\nlabel=\"testXor\";\n" + "rankdir=\"LR\";\nremincross=true;\n" +
    "n1 [ shape=octagon, label=\"x\", color=\"black\", fontcolor=\"black\" ];\n" +
    "n2 [ shape=octagon, label=\"B\", color=\"black\", fontcolor=\"black\" ];\n" + 
    "n3 [ shape=octagon, label=\"A\", color=\"black\", fontcolor=\"black\" ];\n" + 
    "{ rank=\"source\"; n2; n3;}\n" +
    "{ rank=\"sink\"; n1;}\n" +
    "c5 [ shape=record, label=\"{{<p3> A|<p2> B}|\\n$xnor|{<p4> Y}}\" ];\n" +
    "c5:p4:e -> n1:w [color=\"black\", label=\"\"];\n" + 
    "n2:e -> c5:p2:w [color=\"black\", label=\"\"];\n" + 
    "n3:e -> c5:p3:w [color=\"black\", label=\"\"];\n" +
    "}\n";
    return testParent(veriInput, expectedDot, "XNOR")
}

function testShl() {
    var veriInput = "module testShl(A,B,x);\ninput A,B;\noutput x;\nassign x = A << B;\nendmodule";
    var expectedDot = "digraph \"testShl\" {\nlabel=\"testShl\";\n" + "rankdir=\"LR\";\nremincross=true;\n" +
    "n1 [ shape=octagon, label=\"x\", color=\"black\", fontcolor=\"black\" ];\n" +
    "n2 [ shape=octagon, label=\"B\", color=\"black\", fontcolor=\"black\" ];\n" + 
    "n3 [ shape=octagon, label=\"A\", color=\"black\", fontcolor=\"black\" ];\n" + 
    "{ rank=\"source\"; n2; n3;}\n" +
    "{ rank=\"sink\"; n1;}\n" +
    "c5 [ shape=record, label=\"{{<p3> A|<p2> B}|\\n$shl|{<p4> Y}}\" ];\n" +
    "c5:p4:e -> n1:w [color=\"black\", label=\"\"];\n" + 
    "n2:e -> c5:p2:w [color=\"black\", label=\"\"];\n" + 
    "n3:e -> c5:p3:w [color=\"black\", label=\"\"];\n" +
    "}\n";
    return testParent(veriInput, expectedDot, "SHL")
}

function testShr() {
    var veriInput = "module testShr(A,B,x);\ninput A,B;\noutput x;\nassign x = A >> B;\nendmodule";
    var expectedDot = "digraph \"testShr\" {\nlabel=\"testShr\";\n" + "rankdir=\"LR\";\nremincross=true;\n" +
    "n1 [ shape=octagon, label=\"x\", color=\"black\", fontcolor=\"black\" ];\n" +
    "n2 [ shape=octagon, label=\"B\", color=\"black\", fontcolor=\"black\" ];\n" + 
    "n3 [ shape=octagon, label=\"A\", color=\"black\", fontcolor=\"black\" ];\n" + 
    "{ rank=\"source\"; n2; n3;}\n" +
    "{ rank=\"sink\"; n1;}\n" +
    "c5 [ shape=record, label=\"{{<p3> A|<p2> B}|\\n$shr|{<p4> Y}}\" ];\n" +
    "c5:p4:e -> n1:w [color=\"black\", label=\"\"];\n" + 
    "n2:e -> c5:p2:w [color=\"black\", label=\"\"];\n" + 
    "n3:e -> c5:p3:w [color=\"black\", label=\"\"];\n" +
    "}\n";
    return testParent(veriInput, expectedDot, "SHR")
}

function testSshl() {
    var veriInput = "module testSshl(A,B,x);\ninput A,B;\noutput x;\nassign x = A <<< B;\nendmodule";
    var expectedDot = "digraph \"testSshl\" {\nlabel=\"testSshl\";\n" + "rankdir=\"LR\";\nremincross=true;\n" +
    "n1 [ shape=octagon, label=\"x\", color=\"black\", fontcolor=\"black\" ];\n" +
    "n2 [ shape=octagon, label=\"B\", color=\"black\", fontcolor=\"black\" ];\n" + 
    "n3 [ shape=octagon, label=\"A\", color=\"black\", fontcolor=\"black\" ];\n" + 
    "{ rank=\"source\"; n2; n3;}\n" +
    "{ rank=\"sink\"; n1;}\n" +
    "c5 [ shape=record, label=\"{{<p3> A|<p2> B}|\\n$sshl|{<p4> Y}}\" ];\n" +
    "c5:p4:e -> n1:w [color=\"black\", label=\"\"];\n" + 
    "n2:e -> c5:p2:w [color=\"black\", label=\"\"];\n" + 
    "n3:e -> c5:p3:w [color=\"black\", label=\"\"];\n" +
    "}\n";
    return testParent(veriInput, expectedDot, "SSHL")
}

function testSshr() {
    var veriInput = "module testShr(A,B,x);\ninput A,B;\noutput x;\nassign x = A >>> B;\nendmodule";
    var expectedDot = "digraph \"testShr\" {\nlabel=\"testShr\";\n" + "rankdir=\"LR\";\nremincross=true;\n" +
    "n1 [ shape=octagon, label=\"x\", color=\"black\", fontcolor=\"black\" ];\n" +
    "n2 [ shape=octagon, label=\"B\", color=\"black\", fontcolor=\"black\" ];\n" + 
    "n3 [ shape=octagon, label=\"A\", color=\"black\", fontcolor=\"black\" ];\n" + 
    "{ rank=\"source\"; n2; n3;}\n" +
    "{ rank=\"sink\"; n1;}\n" +
    "c5 [ shape=record, label=\"{{<p3> A|<p2> B}|\\n$sshr|{<p4> Y}}\" ];\n" +
    "c5:p4:e -> n1:w [color=\"black\", label=\"\"];\n" + 
    "n2:e -> c5:p2:w [color=\"black\", label=\"\"];\n" + 
    "n3:e -> c5:p3:w [color=\"black\", label=\"\"];\n" +
    "}\n";
    return testParent(veriInput, expectedDot, "SSHR")
}

function testLogicAnd() {
    var veriInput = "module testLogicAnd(A,B,x);\ninput A,B;\noutput x;\nassign x = A && B;\nendmodule";
    var expectedDot = "digraph \"testLogicAnd\" {\nlabel=\"testLogicAnd\";\n" + "rankdir=\"LR\";\nremincross=true;\n" +
    "n1 [ shape=octagon, label=\"x\", color=\"black\", fontcolor=\"black\" ];\n" +
    "n2 [ shape=octagon, label=\"B\", color=\"black\", fontcolor=\"black\" ];\n" + 
    "n3 [ shape=octagon, label=\"A\", color=\"black\", fontcolor=\"black\" ];\n" + 
    "{ rank=\"source\"; n2; n3;}\n" +
    "{ rank=\"sink\"; n1;}\n" +
    "c5 [ shape=record, label=\"{{<p3> A|<p2> B}|\\n$logic_and|{<p4> Y}}\" ];\n" +
    "c5:p4:e -> n1:w [color=\"black\", label=\"\"];\n" + 
    "n2:e -> c5:p2:w [color=\"black\", label=\"\"];\n" + 
    "n3:e -> c5:p3:w [color=\"black\", label=\"\"];\n" +
    "}\n";
    return testParent(veriInput, expectedDot, "LOGIC_AND")
}

function testLogicOr() {
    var veriInput = "module testLogicOr(A,B,x);\ninput A,B;\noutput x;\nassign x = A || B;\nendmodule";
    var expectedDot = "digraph \"testLogicOr\" {\nlabel=\"testLogicOr\";\n" + "rankdir=\"LR\";\nremincross=true;\n" +
    "n1 [ shape=octagon, label=\"x\", color=\"black\", fontcolor=\"black\" ];\n" +
    "n2 [ shape=octagon, label=\"B\", color=\"black\", fontcolor=\"black\" ];\n" + 
    "n3 [ shape=octagon, label=\"A\", color=\"black\", fontcolor=\"black\" ];\n" + 
    "{ rank=\"source\"; n2; n3;}\n" +
    "{ rank=\"sink\"; n1;}\n" +
    "c5 [ shape=record, label=\"{{<p3> A|<p2> B}|\\n$logic_or|{<p4> Y}}\" ];\n" +
    "c5:p4:e -> n1:w [color=\"black\", label=\"\"];\n" + 
    "n2:e -> c5:p2:w [color=\"black\", label=\"\"];\n" + 
    "n3:e -> c5:p3:w [color=\"black\", label=\"\"];\n" +
    "}\n";
    return testParent(veriInput, expectedDot, "LOGIC_OR")
}

function testEqx() {
    var veriInput = "module testEqx(A,B,x);\ninput A,B;\noutput x;\nassign x = A === B;\nendmodule";
    var expectedDot = "digraph \"testEqx\" {\nlabel=\"testEqx\";\n" + "rankdir=\"LR\";\nremincross=true;\n" +
    "n1 [ shape=octagon, label=\"x\", color=\"black\", fontcolor=\"black\" ];\n" +
    "n2 [ shape=octagon, label=\"B\", color=\"black\", fontcolor=\"black\" ];\n" + 
    "n3 [ shape=octagon, label=\"A\", color=\"black\", fontcolor=\"black\" ];\n" + 
    "{ rank=\"source\"; n2; n3;}\n" +
    "{ rank=\"sink\"; n1;}\n" +
    "c5 [ shape=record, label=\"{{<p3> A|<p2> B}|\\n$eqx|{<p4> Y}}\" ];\n" +
    "c5:p4:e -> n1:w [color=\"black\", label=\"\"];\n" + 
    "n2:e -> c5:p2:w [color=\"black\", label=\"\"];\n" + 
    "n3:e -> c5:p3:w [color=\"black\", label=\"\"];\n" +
    "}\n";
    return testParent(veriInput, expectedDot, "EQX")
}

function testNex() {
    var veriInput = "module testNex(A,B,x);\ninput A,B;\noutput x;\nassign x = A !== B;\nendmodule";
    var expectedDot = "digraph \"testNex\" {\nlabel=\"testNex\";\n" + "rankdir=\"LR\";\nremincross=true;\n" +
    "n1 [ shape=octagon, label=\"x\", color=\"black\", fontcolor=\"black\" ];\n" +
    "n2 [ shape=octagon, label=\"B\", color=\"black\", fontcolor=\"black\" ];\n" + 
    "n3 [ shape=octagon, label=\"A\", color=\"black\", fontcolor=\"black\" ];\n" + 
    "{ rank=\"source\"; n2; n3;}\n" +
    "{ rank=\"sink\"; n1;}\n" +
    "c5 [ shape=record, label=\"{{<p3> A|<p2> B}|\\n$nex|{<p4> Y}}\" ];\n" +
    "c5:p4:e -> n1:w [color=\"black\", label=\"\"];\n" + 
    "n2:e -> c5:p2:w [color=\"black\", label=\"\"];\n" + 
    "n3:e -> c5:p3:w [color=\"black\", label=\"\"];\n" +
    "}\n";
    return testParent(veriInput, expectedDot, "NEX")
}


function testLt() {
    var veriInput = "module testLt(A,B,x);\ninput A,B;\noutput x;\nassign x = A < B;\nendmodule";
    var expectedDot = "digraph \"testLt\" {\nlabel=\"testLt\";\n" + "rankdir=\"LR\";\nremincross=true;\n" +
    "n1 [ shape=octagon, label=\"x\", color=\"black\", fontcolor=\"black\" ];\n" +
    "n2 [ shape=octagon, label=\"B\", color=\"black\", fontcolor=\"black\" ];\n" + 
    "n3 [ shape=octagon, label=\"A\", color=\"black\", fontcolor=\"black\" ];\n" + 
    "{ rank=\"source\"; n2; n3;}\n" +
    "{ rank=\"sink\"; n1;}\n" +
    "c5 [ shape=record, label=\"{{<p3> A|<p2> B}|\\n$lt|{<p4> Y}}\" ];\n" +
    "c5:p4:e -> n1:w [color=\"black\", label=\"\"];\n" + 
    "n2:e -> c5:p2:w [color=\"black\", label=\"\"];\n" + 
    "n3:e -> c5:p3:w [color=\"black\", label=\"\"];\n" +
    "}\n";
    return testParent(veriInput, expectedDot, "LT")
}

function testLe() {
    var veriInput = "module testLe(A,B,x);\ninput A,B;\noutput x;\nassign x = A <= B;\nendmodule";
    var expectedDot = "digraph \"testLe\" {\nlabel=\"testLe\";\n" + "rankdir=\"LR\";\nremincross=true;\n" +
    "n1 [ shape=octagon, label=\"x\", color=\"black\", fontcolor=\"black\" ];\n" +
    "n2 [ shape=octagon, label=\"B\", color=\"black\", fontcolor=\"black\" ];\n" + 
    "n3 [ shape=octagon, label=\"A\", color=\"black\", fontcolor=\"black\" ];\n" + 
    "{ rank=\"source\"; n2; n3;}\n" +
    "{ rank=\"sink\"; n1;}\n" +
    "c5 [ shape=record, label=\"{{<p3> A|<p2> B}|\\n$le|{<p4> Y}}\" ];\n" +
    "c5:p4:e -> n1:w [color=\"black\", label=\"\"];\n" + 
    "n2:e -> c5:p2:w [color=\"black\", label=\"\"];\n" + 
    "n3:e -> c5:p3:w [color=\"black\", label=\"\"];\n" +
    "}\n";
    return testParent(veriInput, expectedDot, "LE")
}

function testEq() {
    var veriInput = "module testEq(A,B,x);\ninput A,B;\noutput x;\nassign x = A == B;\nendmodule";
    var expectedDot = "digraph \"testEq\" {\nlabel=\"testEq\";\n" + "rankdir=\"LR\";\nremincross=true;\n" +
    "n1 [ shape=octagon, label=\"x\", color=\"black\", fontcolor=\"black\" ];\n" +
    "n2 [ shape=octagon, label=\"B\", color=\"black\", fontcolor=\"black\" ];\n" + 
    "n3 [ shape=octagon, label=\"A\", color=\"black\", fontcolor=\"black\" ];\n" + 
    "{ rank=\"source\"; n2; n3;}\n" +
    "{ rank=\"sink\"; n1;}\n" +
    "c5 [ shape=record, label=\"{{<p3> A|<p2> B}|\\n$eq|{<p4> Y}}\" ];\n" +
    "c5:p4:e -> n1:w [color=\"black\", label=\"\"];\n" + 
    "n2:e -> c5:p2:w [color=\"black\", label=\"\"];\n" + 
    "n3:e -> c5:p3:w [color=\"black\", label=\"\"];\n" +
    "}\n";
    return testParent(veriInput, expectedDot, "EQ")
}

function testNe() {
    var veriInput = "module testNe(A,B,x);\ninput A,B;\noutput x;\nassign x = A != B;\nendmodule";
    var expectedDot = "digraph \"testNe\" {\nlabel=\"testNe\";\n" + "rankdir=\"LR\";\nremincross=true;\n" +
    "n1 [ shape=octagon, label=\"x\", color=\"black\", fontcolor=\"black\" ];\n" +
    "n2 [ shape=octagon, label=\"B\", color=\"black\", fontcolor=\"black\" ];\n" + 
    "n3 [ shape=octagon, label=\"A\", color=\"black\", fontcolor=\"black\" ];\n" + 
    "{ rank=\"source\"; n2; n3;}\n" +
    "{ rank=\"sink\"; n1;}\n" +
    "c5 [ shape=record, label=\"{{<p3> A|<p2> B}|\\n$ne|{<p4> Y}}\" ];\n" +
    "c5:p4:e -> n1:w [color=\"black\", label=\"\"];\n" + 
    "n2:e -> c5:p2:w [color=\"black\", label=\"\"];\n" + 
    "n3:e -> c5:p3:w [color=\"black\", label=\"\"];\n" +
    "}\n";
    return testParent(veriInput, expectedDot, "NE")
}

function testGe() {
    var veriInput = "module testGe(A,B,x);\ninput A,B;\noutput x;\nassign x = A >= B;\nendmodule";
    var expectedDot = "digraph \"testGe\" {\nlabel=\"testGe\";\n" + "rankdir=\"LR\";\nremincross=true;\n" +
    "n1 [ shape=octagon, label=\"x\", color=\"black\", fontcolor=\"black\" ];\n" +
    "n2 [ shape=octagon, label=\"B\", color=\"black\", fontcolor=\"black\" ];\n" + 
    "n3 [ shape=octagon, label=\"A\", color=\"black\", fontcolor=\"black\" ];\n" + 
    "{ rank=\"source\"; n2; n3;}\n" +
    "{ rank=\"sink\"; n1;}\n" +
    "c5 [ shape=record, label=\"{{<p3> A|<p2> B}|\\n$ge|{<p4> Y}}\" ];\n" +
    "c5:p4:e -> n1:w [color=\"black\", label=\"\"];\n" + 
    "n2:e -> c5:p2:w [color=\"black\", label=\"\"];\n" + 
    "n3:e -> c5:p3:w [color=\"black\", label=\"\"];\n" +
    "}\n";
    return testParent(veriInput, expectedDot, "GE")
}

function testGt() {
    var veriInput = "module testGt(A,B,x);\ninput A,B;\noutput x;\nassign x = A > B;\nendmodule";
    var expectedDot = "digraph \"testGt\" {\nlabel=\"testGt\";\n" + "rankdir=\"LR\";\nremincross=true;\n" +
    "n1 [ shape=octagon, label=\"x\", color=\"black\", fontcolor=\"black\" ];\n" +
    "n2 [ shape=octagon, label=\"B\", color=\"black\", fontcolor=\"black\" ];\n" + 
    "n3 [ shape=octagon, label=\"A\", color=\"black\", fontcolor=\"black\" ];\n" + 
    "{ rank=\"source\"; n2; n3;}\n" +
    "{ rank=\"sink\"; n1;}\n" +
    "c5 [ shape=record, label=\"{{<p3> A|<p2> B}|\\n$gt|{<p4> Y}}\" ];\n" +
    "c5:p4:e -> n1:w [color=\"black\", label=\"\"];\n" + 
    "n2:e -> c5:p2:w [color=\"black\", label=\"\"];\n" + 
    "n3:e -> c5:p3:w [color=\"black\", label=\"\"];\n" +
    "}\n";
    return testParent(veriInput, expectedDot, "GT")
}

function testAdd() {
    var veriInput = "module testAdd(A,B,x);\ninput A,B;\noutput x;\nassign x = A + B;\nendmodule";
    var expectedDot = "digraph \"testAdd\" {\nlabel=\"testAdd\";\n" + "rankdir=\"LR\";\nremincross=true;\n" +
    "n1 [ shape=octagon, label=\"x\", color=\"black\", fontcolor=\"black\" ];\n" +
    "n2 [ shape=octagon, label=\"B\", color=\"black\", fontcolor=\"black\" ];\n" + 
    "n3 [ shape=octagon, label=\"A\", color=\"black\", fontcolor=\"black\" ];\n" + 
    "{ rank=\"source\"; n2; n3;}\n" +
    "{ rank=\"sink\"; n1;}\n" +
    "c5 [ shape=record, label=\"{{<p3> A|<p2> B}|\\n$add|{<p4> Y}}\" ];\n" +
    "c5:p4:e -> n1:w [color=\"black\", label=\"\"];\n" + 
    "n2:e -> c5:p2:w [color=\"black\", label=\"\"];\n" + 
    "n3:e -> c5:p3:w [color=\"black\", label=\"\"];\n" +
    "}\n";
    return testParent(veriInput, expectedDot, "ADD")
}

function testSub() {
    var veriInput = "module testSub(A,B,x);\ninput A,B;\noutput x;\nassign x = A - B;\nendmodule";
    var expectedDot = "digraph \"testSub\" {\nlabel=\"testSub\";\n" + "rankdir=\"LR\";\nremincross=true;\n" +
    "n1 [ shape=octagon, label=\"x\", color=\"black\", fontcolor=\"black\" ];\n" +
    "n2 [ shape=octagon, label=\"B\", color=\"black\", fontcolor=\"black\" ];\n" + 
    "n3 [ shape=octagon, label=\"A\", color=\"black\", fontcolor=\"black\" ];\n" + 
    "{ rank=\"source\"; n2; n3;}\n" +
    "{ rank=\"sink\"; n1;}\n" +
    "c5 [ shape=record, label=\"{{<p3> A|<p2> B}|\\n$sub|{<p4> Y}}\" ];\n" +
    "c5:p4:e -> n1:w [color=\"black\", label=\"\"];\n" + 
    "n2:e -> c5:p2:w [color=\"black\", label=\"\"];\n" + 
    "n3:e -> c5:p3:w [color=\"black\", label=\"\"];\n" +
    "}\n";
    return testParent(veriInput, expectedDot, "SUB")
}

function testMul() {
    var veriInput = "module testMul(A,B,x);\ninput A,B;\noutput x;\nassign x = A * B;\nendmodule";
    var expectedDot = "digraph \"testMul\" {\nlabel=\"testMul\";\n" + "rankdir=\"LR\";\nremincross=true;\n" +
    "n1 [ shape=octagon, label=\"x\", color=\"black\", fontcolor=\"black\" ];\n" +
    "n2 [ shape=octagon, label=\"B\", color=\"black\", fontcolor=\"black\" ];\n" + 
    "n3 [ shape=octagon, label=\"A\", color=\"black\", fontcolor=\"black\" ];\n" + 
    "{ rank=\"source\"; n2; n3;}\n" +
    "{ rank=\"sink\"; n1;}\n" +
    "c5 [ shape=record, label=\"{{<p3> A|<p2> B}|\\n$mul|{<p4> Y}}\" ];\n" +
    "c5:p4:e -> n1:w [color=\"black\", label=\"\"];\n" + 
    "n2:e -> c5:p2:w [color=\"black\", label=\"\"];\n" + 
    "n3:e -> c5:p3:w [color=\"black\", label=\"\"];\n" +
    "}\n";
    return testParent(veriInput, expectedDot, "MUL")
}

function testDiv() {
    var veriInput = "module testDiv(A,B,x);\ninput A,B;\noutput x;\nassign x = A / B;\nendmodule";
    var expectedDot = "digraph \"testDiv\" {\nlabel=\"testDiv\";\n" + "rankdir=\"LR\";\nremincross=true;\n" +
    "n1 [ shape=octagon, label=\"x\", color=\"black\", fontcolor=\"black\" ];\n" +
    "n2 [ shape=octagon, label=\"B\", color=\"black\", fontcolor=\"black\" ];\n" + 
    "n3 [ shape=octagon, label=\"A\", color=\"black\", fontcolor=\"black\" ];\n" + 
    "{ rank=\"source\"; n2; n3;}\n" +
    "{ rank=\"sink\"; n1;}\n" +
    "c5 [ shape=record, label=\"{{<p3> A|<p2> B}|\\n$div|{<p4> Y}}\" ];\n" +
    "c5:p4:e -> n1:w [color=\"black\", label=\"\"];\n" + 
    "n2:e -> c5:p2:w [color=\"black\", label=\"\"];\n" + 
    "n3:e -> c5:p3:w [color=\"black\", label=\"\"];\n" +
    "}\n";
    return testParent(veriInput, expectedDot, "DIV")
}

function testMod() {
    var veriInput = "module testMod(A,B,x);\ninput A,B;\noutput x;\nassign x = A % B;\nendmodule";
    var expectedDot = "digraph \"testMod\" {\nlabel=\"testMod\";\n" + "rankdir=\"LR\";\nremincross=true;\n" +
    "n1 [ shape=octagon, label=\"x\", color=\"black\", fontcolor=\"black\" ];\n" +
    "n2 [ shape=octagon, label=\"B\", color=\"black\", fontcolor=\"black\" ];\n" + 
    "n3 [ shape=octagon, label=\"A\", color=\"black\", fontcolor=\"black\" ];\n" + 
    "{ rank=\"source\"; n2; n3;}\n" +
    "{ rank=\"sink\"; n1;}\n" +
    "c5 [ shape=record, label=\"{{<p3> A|<p2> B}|\\n$mod|{<p4> Y}}\" ];\n" +
    "c5:p4:e -> n1:w [color=\"black\", label=\"\"];\n" + 
    "n2:e -> c5:p2:w [color=\"black\", label=\"\"];\n" + 
    "n3:e -> c5:p3:w [color=\"black\", label=\"\"];\n" +
    "}\n";
    return testParent(veriInput, expectedDot, "MOD")
}

function testPow() {
    var veriInput = "module testPow(A,B,x);\ninput A,B;\noutput x;\nassign x = A ** B;\nendmodule";
    var expectedDot = "digraph \"testPow\" {\nlabel=\"testPow\";\n" + "rankdir=\"LR\";\nremincross=true;\n" +
    "n1 [ shape=octagon, label=\"x\", color=\"black\", fontcolor=\"black\" ];\n" +
    "n2 [ shape=octagon, label=\"B\", color=\"black\", fontcolor=\"black\" ];\n" + 
    "n3 [ shape=octagon, label=\"A\", color=\"black\", fontcolor=\"black\" ];\n" + 
    "{ rank=\"source\"; n2; n3;}\n" +
    "{ rank=\"sink\"; n1;}\n" +
    "c5 [ shape=record, label=\"{{<p3> A|<p2> B}|\\n$pow|{<p4> Y}}\" ];\n" +
    "c5:p4:e -> n1:w [color=\"black\", label=\"\"];\n" + 
    "n2:e -> c5:p2:w [color=\"black\", label=\"\"];\n" + 
    "n3:e -> c5:p3:w [color=\"black\", label=\"\"];\n" +
    "}\n";
    return testParent(veriInput, expectedDot, "POW")
}

function testMux() {
    var veriInput = "module testMux(S,A,B,x);\ninput S,A,B;\noutput x;\nassign x = S?B:A;\nendmodule";
    var expectedDot = "digraph \"testMux\" {\nlabel=\"testMux\";\n" + "rankdir=\"LR\";\nremincross=true;\n" +
    "n1 [ shape=octagon, label=\"x\", color=\"black\", fontcolor=\"black\" ];\n" +
    "n2 [ shape=octagon, label=\"B\", color=\"black\", fontcolor=\"black\" ];\n" + 
    "n3 [ shape=octagon, label=\"A\", color=\"black\", fontcolor=\"black\" ];\n" + 
    "n4 [ shape=octagon, label=\"S\", color=\"black\", fontcolor=\"black\" ];\n" +
    "{ rank=\"source\"; n2; n3; n4;}\n" +
    "{ rank=\"sink\"; n1;}\n" +
    "c6 [ shape=record, label=\"{{<p3> A|<p2> B|<p4> S}|$2\\n$mux|{<p5> Y}}\" ];\n"+
    "c6:p5:e -> n1:w [color=\"black\", label=\"\"];\n"+
    "n2:e -> c6:p2:w [color=\"black\", label=\"\"];\n"+
    "n3:e -> c6:p3:w [color=\"black\", label=\"\"];\n"+
    "n4:e -> c6:p4:w [color=\"black\", label=\"\"];\n"+
    "}\n";
    return testParent(veriInput, expectedDot, "MUX")
}

function testDff() {
    var veriInput = "module testDff(D,Q,clk);\ninput D,clk;\noutput Q;\nalways @ (posedge clk) Q = D;\nendmodule";
    var expectedDot = "digraph \"testDff\" {\nlabel=\"testDff\";\n" + "rankdir=\"LR\";\nremincross=true;\n" +
    "n1 [ shape=octagon, label=\"Q\", color=\"black\", fontcolor=\"black\" ];\n" +
    "n2 [ shape=octagon, label=\"clk\", color=\"black\", fontcolor=\"black\" ];\n" + 
    "n3 [ shape=octagon, label=\"D\", color=\"black\", fontcolor=\"black\" ];\n" + 
    "{ rank=\"source\"; n2; n3;}\n" +
    "{ rank=\"sink\"; n1;}\n" +
    "c5 [ shape=record, label=\"{{<p4> CLK|<p3> D}|$2\\n$dff|{<p1> Q}}\" ];\n"+
    "c5:p1:e -> n1:w [color=\"black\", label=\"\"];\n"+
    "n2:e -> c5:p4:w [color=\"black\", label=\"\"];\n"+
    "n3:e -> c5:p3:w [color=\"black\", label=\"\"];\n"+
    "}\n";
    return testParent(veriInput, expectedDot, "DFF")
}




function test(){
    var testMethods = [testAnd, testOr, testNand, testNot, testXor, testXnor, testShl, testShr, testSshl, testSshr, testLogicAnd, testLogicOr, testEqx, testNex, testLe, testLt, testEq, testNe, testGe, testGt, testAdd, testSub, testMul, testDiv, testMod, testPow, testMux, testDff]
    var j = 0;
    for(var i = 0; i<testMethods.length; i++){
        j+=testMethods[i]()
    }
    mc.log(j/testMethods.length*100 + "% of tests passed")
    mc.log("Number of tests: " + testMethods.length)
}
// mc.log("asd")
// testAnd();