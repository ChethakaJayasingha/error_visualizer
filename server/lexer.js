// Token types
const TokenType = {
  NUMBER: "NUMBER",
  IDENTIFIER: "IDENTIFIER",
  PLUS: "PLUS",
  MULTIPLY: "MULTIPLY",
  LPAREN: "LPAREN",
  RPAREN: "RPAREN",
  EOF: "EOF",
};

class Token {
  constructor(type, value, position) {
    this.type = type;
    this.value = value;
    this.position = position;
  }
}

class Lexer {
  constructor(input) {
    this.input = input;
    this.position = 0;
    this.currentChar = this.input[this.position];
  }

  advance() {
    this.position++;
    this.currentChar =
      this.position < this.input.length ? this.input[this.position] : null;
  }

  skipWhitespace() {
    while (this.currentChar !== null && /\s/.test(this.currentChar)) {
      this.advance();
    }
  }

  getNextToken() {
    while (this.currentChar !== null) {
      if (/\s/.test(this.currentChar)) {
        this.skipWhitespace();
        continue;
      }

  
      if (/[0-9]/.test(this.currentChar)) {
        const pos = this.position;
        const value = this.currentChar; 
        this.advance(); 
        return new Token(TokenType.NUMBER, value, pos);
      }

      if (/[a-zA-Z]/.test(this.currentChar)) {
        const pos = this.position;
        const value = this.currentChar; 
        this.advance();
        return new Token(TokenType.IDENTIFIER, value, pos);
      }

      if (this.currentChar === "+") {
        const pos = this.position;
        this.advance();
        return new Token(TokenType.PLUS, "+", pos);
      }

      if (this.currentChar === "*") {
        const pos = this.position;
        this.advance();
        return new Token(TokenType.MULTIPLY, "*", pos);
      }

      if (this.currentChar === "(") {
        const pos = this.position;
        this.advance();
        return new Token(TokenType.LPAREN, "(", pos);
      }

      if (this.currentChar === ")") {
        const pos = this.position;
        this.advance();
        return new Token(TokenType.RPAREN, ")", pos);
      }

      // Invalid character
      throw new Error(
        `Invalid character: '${this.currentChar}' at position ${this.position}`
      );
    }

    return new Token(TokenType.EOF, null, this.position);
  }

  tokenize() {
    const tokens = [];
    let token = this.getNextToken();

    while (token.type !== TokenType.EOF) {
      tokens.push(token);
      token = this.getNextToken();
    }

    tokens.push(token); // Add EOF token
    return tokens;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Lexer, TokenType, Token };
}

export { Lexer, TokenType, Token };