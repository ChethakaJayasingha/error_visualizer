class SymbolTable {
  constructor() {
    this.symbols = new Map();
    this.tokenCount = new Map();
  }

  addToken(token) {
    const key = `${token.type}_${token.value}`;

    if (!this.symbols.has(key)) {
      this.symbols.set(key, {
        token: token.value,
        type: token.type,
        firstOccurrence: token.position,
        occurrences: [],
      });
    }

    this.symbols.get(key).occurrences.push(token.position);

    // Count token types
    this.tokenCount.set(token.type, (this.tokenCount.get(token.type) || 0) + 1);
  }

  getTable() {
    return Array.from(this.symbols.values());
  }

  getStatistics() {
    return {
      totalTokens: Array.from(this.tokenCount.values()).reduce(
        (a, b) => a + b,
        0
      ),
      tokensByType: Object.fromEntries(this.tokenCount),
    };
  }
}

export { SymbolTable };
