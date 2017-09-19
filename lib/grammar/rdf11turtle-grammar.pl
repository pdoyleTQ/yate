
/*

SPARQL 1.1 grammar rules based on the Last Call Working Draft of 24/07/2012:
  http://www.w3.org/TR/2012/WD-sparql11-query-20120724/#sparqlGrammar

Be careful with grammar notation - it is EBNF in prolog syntax!

[...] lists always represent sequence.
or can be used as binary operator or n-ary prefix term - do not put [...] 
inside unless you want sequence as a single disjunct.

*, +, ? - generally used as 1-ary terms 

stephen.cresswell@tso.co.uk
*/

% We need to be careful with end-of-input marker $
% Since we never actually receive this from Codemirror, 
% we can t have it appear on RHS of deployed rules.
% However, we do need it to check whether rules *could* precede 
% end-of-input, so use it with top-level

:-dynamic '==>'/2.

%[1]
 turtleDoc ==> [ *(statement), $ ].

%[2]
 statement ==> [ or(directive, [triples, '.']) ].

%[3]
 directive ==> [ or( prefixID, base, sparqlPrefix, sparqlBase)].

%[4]
 prefixID ==> ['@prefix', 'PNAME_NS', 'IRI_REF', '.'].

%[5]
 base ==> ['@base', 'IRI_REF', '.'].

%[5s]
 sparqlBase ==> ['BASE', 'IRI_REF'].

%[6s]
  sparqlPrefix ==> ['PREFIX', 'PNAME_NS', 'IRI_REF'].

%[6]
 triples ==> [ or( [subject, predicateObjectList], [blankNodePropertyList, ?(predicateObjectList)] ) ].

%[7]
 predicateObjectList ==> [verb, objectList, *([';', ?([verb, objectList])])].

%[8]
 objectList ==> [object, *([',', object]) ].

% storeProperty is a dummy for side-effect of remembering property
storeProperty==>[].

%[9]
 verb ==> [or([storeProperty,predicate],[storeProperty,'a'])].

%[10]
  subject ==> [ or(iri, blankNode, collection) ].

%[11]
  predicate ==> [iri].

%[12]
  object ==> [or(iri, blankNode, collection, blankNodePropertyList, literal)].

%[13]
  literal ==> [or(rdfLiteral, numericLiteral, booleanLiteral)].

%[14]
  blankNodePropertyList ==> ['[', predicateObjectList, ']'].

%[15]
  collection ==> ['(', *(object), ')'].

%[16]
  numericLiteral ==> [or('INTEGER', 'DECIMAL', 'DOUBLE')].

%[128s]
  rdfLiteral ==> [string, ?('LANGTAG' or ['^^',iri])].

%[133s]
  booleanLiteral ==> ['true', 'false'].

%[17]
  string ==> ['STRING_LITERAL_QUOTE'].
  string ==> ['STRING_LITERAL_SINGLE_QUOTE'].
  string ==> ['STRING_LITERAL_LONG_SINGLE_QUOTE'].
  string ==> ['STRING_LITERAL_LONG_QUOTE'].

%[135s]
  iri ==> [ or('IRI_REF', prefixedName) ].

%[136s]
  prefixedName ==> [ or('PNAME_LN', 'PNAME_NS') ].

%[137s]
  blankNode ==> [ or('BLANK_NODE_LABEL', 'ANON') ].


% tokens defined by regular expressions elsewhere
tm_regex([
'IRI_REF',
'PNAME_NS',
'PNAME_LN',
'BLANK_NODE_LABEL',
'@prefix',
'@base',
'LANGTAG',
'INTEGER',
'DECIMAL',
'DOUBLE',
'STRING_LITERAL_QUOTE',
'STRING_LITERAL_SINGLE_QUOTE',
'STRING_LITERAL_LONG_SINGLE_QUOTE',
'STRING_LITERAL_LONG_QUOTE',
'ANON'
]).

% Terminals where name of terminal is uppercased token content
tm_keywords([
'BASE',
'PREFIX',
'true',
'false'
]).

% Other tokens representing fixed, case sensitive, strings
% Care! order longer tokens first - e.g. IRI_REF, <=, <
% e.g. >=, >
% e.g. NIL, '('
% e.g. ANON, [
% e.g. DOUBLE, DECIMAL, INTEGER
% e.g. INTEGER_POSITIVE, PLUS
tm_punct([
'a'= 'a',
'.'= '\\.',
','= ',',
'('= '\\(',
')'= '\\)',
';'= ';',
'['= '\\[',
']'= '\\]',
'^^'= '\\^\\^'
]).
