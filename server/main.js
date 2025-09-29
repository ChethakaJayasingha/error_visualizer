const Lexer = require('./lexer');
const Parser = require('./parser');
const SymbolTable = require('./symbolTable');

class CompilerSimulator {
  constructor() {
    this.lexer = new Lexer();
    this.symbolTable = new SymbolTable();
    this.parser = null;
  }
    compile(sourceCode) {
    try {
        const tokens = this.lexer.tokenize(sourceCode);
        this.parser = new Parser(tokens, this.symbolTable);
        this.parser.parse();
        return { success: true, errors: [] };
    } catch (error) {
        return { success: false, errors: [error.message] };
    }
    }   
}
module.exports = CompilerSimulator;