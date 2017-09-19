
top_symbol(turtleDoc).
output_file('_tokenizer-table.js').

js_vars([
  startSymbol='"turtleDoc"',
  acceptEmpty=true
]).

:-reconsult(gen_ll1).
:-reconsult('../rdf11turtle-grammar.pl').
