import express from "express";
import cors from "cors";
import { Lexer } from "./lexer.js";
import { Parser } from "./parser.js";
import { SymbolTable } from "./symbolTable.js";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Helper function to convert parse tree to simple object
function serializeParseTree(node) {
  if (!node) return null;

  return {
    label: node.label,
    value: node.value,
    children: node.children.map((child) => serializeParseTree(child)),
  };
}

app.post("/analyze", (req, res) => {
  try {
    const { input } = req.body;

    if (!input || input.trim() === "") {
      return res.status(400).json({
        error: "Input string is required",
      });
    }

    // Step 1: Lexical Analysis
    const lexer = new Lexer(input);
    let tokens;

    try {
      tokens = lexer.tokenize();
    } catch (lexError) {
      return res.json({
        success: false,
        errorType: "LEXICAL_ERROR",
        message: lexError.message,
        tokens: [],
        symbolTable: [],
        parseTree: null,
      });
    }

    // Step 2: Build Symbol Table
    const symbolTable = new SymbolTable();
    tokens.forEach((token) => {
      if (token.type !== "EOF") {
        symbolTable.addToken(token);
      }
    });

    // Step 3: Parse
    const parser = new Parser(tokens);
    const parseResult = parser.parse();

    if (parseResult.success) {
      return res.json({
        success: true,
        errorType: null,
        message: "Input string accepted!",
        tokens: tokens.map((t) => ({
          type: t.type,
          value: t.value,
          position: t.position,
        })),
        symbolTable: symbolTable.getTable(),
        statistics: symbolTable.getStatistics(),
        parseTree: serializeParseTree(parseResult.parseTree),
      });
    } else {
      return res.json({
        success: false,
        errorType: "SYNTAX_ERROR",
        message: parseResult.errors[0].message,
        errors: parseResult.errors,
        tokens: tokens.map((t) => ({
          type: t.type,
          value: t.value,
          position: t.position,
        })),
        symbolTable: symbolTable.getTable(),
        parseTree: null,
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
