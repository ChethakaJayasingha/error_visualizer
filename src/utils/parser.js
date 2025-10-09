/* eslint-disable no-useless-catch */
import { TokenType } from "./lexer.js";

class ParseTreeNode {
  constructor(label, value = null) {
    this.label = label;
    this.value = value;
    this.children = [];
  }

  addChild(node) {
    this.children.push(node);
  }
}

class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.currentTokenIndex = 0;
    this.currentToken = this.tokens[0];
    this.errors = [];
  }

  advance() {
    this.currentTokenIndex++;
    if (this.currentTokenIndex < this.tokens.length) {
      this.currentToken = this.tokens[this.currentTokenIndex];
    }
  }

  error(message) {
    this.errors.push({
      message,
      position: this.currentToken.position,
      token: this.currentToken.value,
    });
    throw new Error(message);
  }

  // E → TE'
  parseE() {
    const node = new ParseTreeNode("E");

    try {
      node.addChild(this.parseT());
      node.addChild(this.parseEPrime());
    } catch (e) {
      throw e;
    }

    return node;
  }

  // E' → +TE' | ε
  parseEPrime() {
    const node = new ParseTreeNode("E'");

    if (this.currentToken.type === TokenType.PLUS) {
      node.addChild(new ParseTreeNode("PLUS", "+"));
      this.advance();
      node.addChild(this.parseT());
      node.addChild(this.parseEPrime());
    } else if (this.currentToken.type === TokenType.MINUS) {
      // NEW: Handle subtraction
      node.addChild(new ParseTreeNode("MINUS", "-"));
      this.advance();
      node.addChild(this.parseT());
      node.addChild(this.parseEPrime());
    } else {
      // Epsilon production
      node.addChild(new ParseTreeNode("ε"));
    }

    return node;
  }

  // T → FT'
  parseT() {
    const node = new ParseTreeNode("T");

    try {
      node.addChild(this.parseF());
      node.addChild(this.parseTPrime());
    } catch (e) {
      throw e;
    }

    return node;
  }

  // T' → *FT' | ε
  parseTPrime() {
    const node = new ParseTreeNode("T'");

    if (this.currentToken.type === TokenType.MULTIPLY) {
      node.addChild(new ParseTreeNode("MULTIPLY", "*"));
      this.advance();
      node.addChild(this.parseF());
      node.addChild(this.parseTPrime());
    } else if (this.currentToken.type === TokenType.DIVIDE) {
      // NEW: Handle division
      node.addChild(new ParseTreeNode("DIVIDE", "/"));
      this.advance();
      node.addChild(this.parseF());
      node.addChild(this.parseTPrime());
    } else {
      // Epsilon production
      node.addChild(new ParseTreeNode("ε"));
    }

    return node;
  }

  // F → (E) | id
  parseF() {
    const node = new ParseTreeNode("F");

    if (this.currentToken.type === TokenType.LPAREN) {
      node.addChild(new ParseTreeNode("LPAREN", "("));
      this.advance();
      node.addChild(this.parseE());

      if (this.currentToken.type !== TokenType.RPAREN) {
        this.error(`Expected ')' but found '${this.currentToken.value}'`);
      }

      node.addChild(new ParseTreeNode("RPAREN", ")"));
      this.advance();
    } else if (
      this.currentToken.type === TokenType.NUMBER ||
      this.currentToken.type === TokenType.IDENTIFIER
    ) {
      node.addChild(new ParseTreeNode("id", this.currentToken.value));
      this.advance();
    } else {
      this.error(
        `Expected identifier or '(' but found '${this.currentToken.value}'`
      );
    }

    return node;
  }

  parse() {
    try {
      const parseTree = this.parseE();

      // Check if we've consumed all tokens (except EOF)
      if (this.currentToken.type !== TokenType.EOF) {
        this.error(`Unexpected token: '${this.currentToken.value}'`);
      }

      return {
        success: true,
        parseTree,
        errors: [],
      };
    } catch (e) {
      return {
        success: false,
        parseTree: null,
        errors: this.errors.length > 0 ? this.errors : [{ message: e.message }],
      };
    }
  }
}

export { Parser, ParseTreeNode };
