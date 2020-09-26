%{
    const { NodoGraphviz } = require("./NodoGraphviz");
    let nodoActual = 0;
    let listaNodos = [];
%}

%lex
%options case-sensitive
entero  [0-9]+
decimal {entero}"."{entero}
cadena  (\"[^"]*\")
cadenasimple  (\'[^']*\')
%%
\s+                   /* skip whitespace */
"//".*										// comentario simple línea
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]			// comentario multiple líneas

{decimal}               return 'DECIMAL'
{entero}                return 'ENTERO'
{cadena}                return 'CADENA'
{cadenasimple}          return 'CADENASIM'

//Operaciones Aritmeticas
"**"                     return '**'
"*"                     return '*'
"/"                     return '/'
"+="                    return '+='
"++"                    return '++'
"--"                    return '--'
"-"                     return '-'
"+"                     return '+'
"^"                     return '^'
"%"                     return '%'



//Operaciones Relacionales
"<="                    return '<='
">="                    return '>='
"<"                     return '<'
">"                     return '>'
"=="                    return '=='
"!="                    return '!='
"="                     return '='

//Operaciones Logicas
"||"                    return '||'
"&&"                    return '&&'
"!"                     return '!'

//Elementos de sintaxis
"("                     return '('
")"                     return ')' 
"{"                     return '{'
"}"                     return '}'
";"                     return ';'
":"                     return ':'
"["                     return '['
"]"                     return ']'
","                     return ','
"."                     return '.'
"`"                     return '`'
"$"                     return '$'
"?"                     return '?'
"\""                    return '"'
"\'"                    return '\''

/*-----------RESERVADAS-------------------*/

//Estructuras de Control
"if"                    return 'IF'
"else"                  return 'ELSE'
"switch"                return 'SWITCH'
"case"                  return 'CASE'
"default"               return 'DEFAULT'
"while"                 return 'WHILE'
"do"                    return 'DO'
"for"                   return 'FOR'
"in"                    return 'IN'
"of"                    return 'OF'
"true"                  return 'TRUE'
"false"                 return 'FALSE'

//Sentencias de transferencia
"return"                return 'RETURN'
"break"                 return 'BREAK'
"continue"              return 'CONTINUE'

//Funciones y declaracciones
"function"              return 'FUNCTION'
"let"                   return 'LET'
"const"                 return 'CONST'
"console"               return 'CONSOLE'
"log"                   return 'LOG'
"graficar_ts"           return 'GRAFICAR'


//Arrays
"push"                  return 'PUSH'
"pop"                   return 'POP'
"length"                return 'LENGTH'

//Tipos de dato
"void"                  return 'VOID'
"number"                return 'NUMBER'
"string"                return 'STRING'
"boolean"               return 'BOOLEAN'
"type"                  return 'TYPE'
"null"                  return 'NULL'

([a-zA-Z_])[a-zA-Z0-9_ñÑ]*	return 'ID';
<<EOF>>		            return 'EOF'
.   { 
    //let error_lexico = new Error_(yylloc.first_line, yylloc.first_column, 'Lexico', yytext);
    //errores.push(error_lexico);
    }

/lex

%left '||'
%left '&&'
%left '==', '!='
%left '>=', '<=', '<', '>'
%left '+' '-'
%left '*' '/'
%left '**'
%left '%'
%left UMENOS
%right '!'

%start Init

%%

Init    
    : instruccion EOF 
    {
        let aptInit = [$1.id];
        let retInit = new NodoGraphviz(`node_${nodoActual}` , `[label = \"init\"];\n`, aptInit );        
        nodoActual++;
        listaNodos.push(retInit);        
        $$ = retInit;

        console.log(listaNodos);
    } 
;
/*
Instrucciones
    : Instrucciones instruccion
    | instruccion{
        let aptinstr = [$1.id];
        let retinstr = new NodoGraphviz(`node_${nodoActual}` , `[label = \"Instrucciones\"];\n`, aptinstr );        
        nodoActual++;
        listaNodos.push(retinstr);        
        $$ = retinstr;
    }
;
*/
instruccion
    : declaracion 
    {
        let aptinstrDec = [$1.id];
        let instrDecla = new NodoGraphviz(`node_${nodoActual}` , `[label = \"instruccion\"];\n`, aptinstrDec );        
        nodoActual++;
        listaNodos.push(instrDecla);        
        $$ = instrDecla;
    }    
    | If 
    | Pushear
    | asignacion ';'
    | While
    | DoWhile
    | For
    | Switch
    | Console
    | funcion
    | Type ';'
    | llamadaFuncion ';' 
    | ForIn
    | ForOf
    | 'GRAFICAR' '(' ')'
    | 'BREAK' ';'
    | 'CONTINUE' ';'
    | 'RETURN' ternario ';'
    | 'RETURN' Expr ';'
    | 'RETURN' ';'
    | 'ID' '++' ';'
    | 'ID' '--' ';'
    | error  { 
       // var error_sin = new Error_(this._$.first_line, this._$.first_column, 'Sintactico', yytext);
    }
;
/*--------------------------------------Declaracion y Asignacion de variables----------------------------------*/

declaracion
    : 'LET'   'ID' ':' tipo corchetes '=' corchetesVacios ';'
    | 'LET'   'ID' ':' tipo corchetes '='  Expr ';'
    | 'LET'   'ID' ':' tipo '=' '{' atributosType '}' ';'
    | 'LET'   'ID' ':' tipo  corchetes ';'
    | 'LET'   'ID' ':' tipo '=' Expr ';'
    | 'LET'   'ID' ':' tipo ';'
    | 'LET'   'ID'  '=' Expr ';'
    {
        let aptLet7 = new NodoGraphviz(`node_${nodoActual}` ,`[label = \"let\"];\n`, [] );
        nodoActual++;
        let aptId7 = new NodoGraphviz(`node_${nodoActual}` , `[label = \"let\"];\n`, [] );
        nodoActual++;
        let fExp7 = [$4.id];        
        let aptExp7 = new NodoGraphviz(`node_${nodoActual}` , `[label = \"Expr\"];\n`, fExp7);
        nodoActual++;        
        let apt7 = [aptLet7.id , aptId7.id , aptExp7.id];
        let dc7 = new NodoGraphviz(`node_${nodoActual}` , `[label = \"declaracion\"];\n`, apt7 );
        listaNodos.push(aptLet7);
        listaNodos.push(aptId7);
        listaNodos.push(aptExp7);
        listaNodos.push(dc7);
        $$ = dc7;
    }    
    | 'LET' 'ID' ';'
    | 'CONST' 'ID' ':' tipo corchetes '=' corchetesVacios ';'
    | 'CONST' 'ID' ':' tipo corchetes '=' Expr ';'
    | 'CONST' 'ID' ':' tipo '=' Expr ';'
    | 'CONST' 'ID' '=' Expr ';'
;

corchetes
    : corchetes '[' ']'
    | '[' ']'
;


corchetesVacios
    :  '[' masCorchetes ']'
    | '[' ']'
;

masCorchetes
    :  masCorchetes ',' corcheteFinal
    | corcheteFinal
;

corcheteFinal
    : '[' corcheteFinal ']'
    | '[' ']'
;

tipo
    : 'NUMBER' 
    | 'STRING'
    | 'BOOLEAN'
    | 'VOID'
    | 'ID'
;



asignacion    
    : 'ID' accesos '=' corchetesVacios 
    | 'ID' accesos '=' Expr 
    | 'ID' '+=' Expr 
    | 'ID' '=' '{' atributosType '}' 
    | 'ID' '=' Expr 
;


/*-----------------------------------------Funciones , llamadas y parametros------------------------------------*/

Console 
    : 'CONSOLE' '.' 'LOG' '(' ListaConsole ')' ';'
;


ListaConsole
    : ListaConsole ',' Expr
    {
        $1.push($3);
        $$ = $1;
    }
    | Expr
    {
        $$ = [$1];
    }
;


Pushear
    : 'ID' accesosCorchetes '.' 'PUSH' '(' Expr ')'
    |  'ID'  '.' 'PUSH' '(' Expr ')'
;
Length
    : 'ID' accesos '.' 'LENGTH' 
    | 'ID'  '.' 'LENGTH'
;

/*------------------------------------------- Estructuras de Control ---------------------------------------------*/


If
    : 'IF' '(' Expr ')' BloqueInstrucciones Else
;

Else
    : 'ELSE' If
    | 'ELSE' BloqueInstrucciones
    | /* epsilon */ 
;

While
    : 'WHILE' '(' Expr ')' BloqueInstrucciones
;

DoWhile
    : 'DO' BloqueInstrucciones 'WHILE' '(' Expr ')' ';'
;

Switch
    : 'SWITCH' '(' Expr ')' '{' BloqueCase Default '}'
;

BloqueCase
    :  BloqueCase Case
    |  Case
;

Case 
    : 'CASE' Expr ':' Instrucciones
;

Default 
    : 'DEFAULT' ':' Instrucciones
    | /* epsilon */
  ;


For
    : 'FOR' '(' declaracion Expr ';' asignacion ')' BloqueInstrucciones    
    | 'FOR' '(' declaracion Expr ';' Expr ')' BloqueInstrucciones
/*    | 'FOR' '(' asignacion Expr ';' asignacion ')' BloqueInstrucciones
    { 
        $$ = new For( $3, $4 , $6, $8 , @1.first_line, @1.first_column);
    }       
    | 'FOR' '(' asignacion Expr ';' Expr ')' BloqueInstrucciones
    { 
        $$ = new For( $3, $4 , $6, $8 , @1.first_line, @1.first_column);
    }       */
;



ForIn
    : 'FOR' '(' declaracion_for 'IN' Expr ')' BloqueInstrucciones
;

ForOf
    : 'FOR' '(' declaracion_for 'OF' Expr ')' BloqueInstrucciones
;


declaracion_for
    : 'LET'   'ID' ':' tipo 
    | 'LET'   'ID'
    | 'CONST'   'ID' ':' tipo
    | 'CONST'   'ID'  
;


BloqueInstrucciones
    : '{'  Instrucciones '}'
    | '{' '}'
  ; 


/*-----------------------------------------FUNCIONES------------------------------------------------*/

funcion
    : 'FUNCTION' 'ID' '(' parametros ')' ':' tipo '{' Instrucciones '}'
    | 'FUNCTION' 'ID' '(' parametros ')' '{' Instrucciones '}'
    | 'FUNCTION' 'ID' '('  ')' ':' tipo '{' Instrucciones '}'
    | 'FUNCTION' 'ID' '('  ')'  '{' Instrucciones '}'
;

parametros
    : parametros ',' parametro
    | parametro
;

parametro
    : 'ID' ':' tipo corchetes
    | 'ID' ':' tipo 
;



/*----------------------------------------Expresiones Aritmeticas y Logicas--------------------------------------*/
Expr
    : '-' Expr %prec UMENOS
    | Expr '**' Expr
    | Expr '+' Expr
    | Expr '-' Expr
    | Expr '*' Expr
    | Expr '%' Expr
    | Expr '/' Expr
    | Expr '<' Expr
    | Expr '<=' Expr
    | Expr '>' Expr
    | Expr '>=' Expr
    | Expr '==' Expr
    | Expr '!=' Expr
    | Expr '&&' Expr
    | Expr '||' Expr
    | '!' Expr
    | F
    {
        let aptF = [$1.id];
        let f = new NodoGraphviz(`node_${nodoActual}` , `[label = \"F\"];\n`, aptF );
        listaNodos.push(f);
        nodoActual++;        
        $$ = f;
    }
;


F   : '(' Expr ')'
    | 'DECIMAL'
    | 'ENTERO'
    | 'CADENA'
    | 'CADENASIM'
    | 'TRUE'
    | 'FALSE'
    | 'NULL'
    | Length     
    | llamadaFuncion    
    | 'ID' accesos
    | 'ID' '++'
    | 'ID' '--'
    | '[' paramsExp ']'
    | 'ID'
    {
        let fID = new NodoGraphviz(`node_${nodoActual}` , `[label = \"${$1}\"];\n`, [] );
        listaNodos.push(fID);
        nodoActual++;        
        $$ = fID;
    }
;

accesos
    : accesos acceso
    | acceso
;

acceso
    : '.' 'ID'
    | '[' Expr ']'
;

llamadaFuncion
    : 'ID' '(' paramsExp ')' 
    | 'ID' '('  ')' 
;


paramsExp
    : paramsExp ',' Expr
    | Expr
;

Type
    : 'TYPE' 'ID' '=' '{' decla_atr_type '}'
;


decla_atr_type
    : decla_atr_type ',' atr_type
    | atr_type
;

atr_type
    : 'ID' ':' tipo
;


atributosType
    : atributosType ',' atribType
    | atribType
;

atribType
    : 'ID' ':' Expr
;



ternario
    :  Expr '?' Expr ':' Expr
;
