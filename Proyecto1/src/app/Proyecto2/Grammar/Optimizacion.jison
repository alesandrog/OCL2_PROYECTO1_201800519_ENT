%{

    const { AsigOpt } = require("../Optimizacion/AsigOpt");
    const { DeclaracionOpt } = require("../Optimizacion/DeclaracionOpt");    
    const { Encabezado } = require("../Optimizacion/Encabezado");    
    const { FuncionOpt } = require("../Optimizacion/FuncionOpt");
    const { Label } = require("../Optimizacion/Label");    
    const { SaltoCon } = require("../Optimizacion/SaltoCon");
    const { SaltoInc } = require("../Optimizacion/SaltoInc");
    const { GetHeap } = require("../Optimizacion/GetHeap");    
    const { SetHeap } = require("../Optimizacion/SetHeap");
    const { Print } = require("../Optimizacion/Print");        
%}

%lex
%options case-sensitive
entero  '-'?[0-9]+
decimal '-'?{entero}"."{entero}
%%


\s+                   /* skip whitespace */
"//".*										// comentario simple línea
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]			// comentario multiple líneas

{decimal}               return 'DECIMAL'
{entero}                return 'ENTERO'


"#include <stdio.h>"         return 'STDIO'
"#include <math.h>"          return 'MATH'
"double Heap[64000];"        return 'DECLA_HEAP'
"double Stack[64000];"       return 'DECLA_HEAP'
"int enteros[15];"           return 'DECLA_ENT'
"int decimales[5];"          return 'DECLA_DEC'
"int p;"                     return 'DECLA_P'
"int h;"                     return 'DECLA_H'



"*"                     return '*'
"/"                     return '/'
"-"                     return '-'
"+"                     return '+'
"%"                     return '%'

"<="                    return '<='
">="                    return '>='
"<"                     return '<'
">"                     return '>'
"=="                    return '=='
"!="                    return '!='
"="                     return '='
"{"                     return '{'
"}"                     return '}'
"["                     return '['
"]"                     return ']'
":"                     return ':'
"("                     return '('
")"                     return ')'
";"                     return ';'
":"                     return ':'
","                     return ','
"."                     return '.'


"goto"                  return 'GOTO'
"if"                    return 'IF'


"void"                  return 'VOID'
"double"                return 'DOUBLE'
"int"                   return 'INT'
"char"                  return 'CHAR'
"float"                 return 'FLOAT'
"return"                return 'RETURN'
"Stack"                 return 'STACK'
"Heap"                  return 'HEAP'
"printf"                return 'PRINT'
"\"%e\""                return 'PRINT_E'
"\"%c\""                return 'PRINT_C'
"\"%f\""                return 'PRINT_F'
"\"%d\""                return 'PRINT_D'

"copia2 = (int)copia;"  return 'NATIVA_ESP'
"asciiNumero = fmod(numero , 10);" return 'NATIVA_ESP2'
"enteros[iterador] = asciiNumero; " return 'NATIVA_ESP3'
"enteros[iterador] = 45;"  return 'NATIVA_ESP4'
"ascii = enteros[iterador];" return 'NATIVA_ESP5'
"asciiNumero = fmod(vdecimales , 10);" return 'NATIVA_ESP6'
"decimales[iterador] = asciiNumero;" return 'NATIVA_ESP7'
"decimales[iterador] = 46;"  return 'NATIVA_ESP8'
"ascii = decimales[iterador];" return 'NATIVA_ESP9'


([a-zA-Z_])[a-zA-Z0-9_ñÑ]*	return 'ID';
<<EOF>>		            return 'EOF'

. { console.log("error");}


/lex
%left '==', '!='
%left '>=', '<=', '<', '>'
%left '+' '-'
%left '*' '/'
%left '%'

%start Init

%%

Init    
    : Instrucciones EOF 
    {
        return $1;
    } 
;

Instrucciones
    : Instrucciones instruccion{
        $1.push($2);
        $$ = $1;
    }
    | instruccion{
        $$ = [$1];
    }
;

instruccion
    : Encabezado
    {
        $$ = new Encabezado($1, @1.first_line, @1.first_column);
    }
    | Declaracion
    | Funcion 
    | Asignacion 
    | AccesoArreglo
    | SeteoArreglo
    | SaltoCondicional
    | Llamada
    | Label
    | Print    
    | Goto 
    | 'RETURN' ';'
    {
        $$ = new Encabezado("return;",@1.first_line, @1.first_column);
    }
;

Encabezado
    :'STDIO'
    |'MATH'
    |'DECLA_HEAP'
    |'DECLA_HEAP'
    |'DECLA_ENT'
    |'DECLA_DEC'
    |'DECLA_P'
    |'DECLA_H'
    | 'NATIVA_ESP'
    | 'NATIVA_ESP2'
    | 'NATIVA_ESP3'
    | 'NATIVA_ESP4'
    | 'NATIVA_ESP5'
    | 'NATIVA_ESP6'
    | 'NATIVA_ESP7'
    | 'NATIVA_ESP8'
    | 'NATIVA_ESP9' 
;

Declaracion
    : Tipo ListaId ';'
    {
        $$ = new DeclaracionOpt($1, $2, @1.first_line, @1.first_column);
    }        
;

ListaId
    : ListaId ',' 'ID'
    {
        $1.push($3);
    }
    | 'ID'
    {
        $$ = [$1];
    }
;

Tipo 
    : 'INT'
    | 'DOUBLE'
    | 'CHAR'
    | 'VOID'
    | 'FLOAT'
;


DefFunc
    : 'VOID' 'ID' '(' ')'
    {
        $$ = $2;
    }
;
Funcion
    :  DefFunc ';'
    {
        $$ = new Encabezado("void " + $1 + "();", @1.first_line, @1.first_column);        
    }
    |  DefFunc '{' Instrucciones '}'
    {
        $$ = new FuncionOpt($1, $3, @1.first_line, @1.first_column);
    }
;

BloqueInstrucciones
    : '{'  Instrucciones '}'
    {
        $$ = $2;
    } 
    | '{' '}'
    {
        $$ = [];
    }
  ; 


Asignacion 
    : 'ID' '=' 'F' Op 'F' ';'
    {
        $$ = new AsigOpt($1, $3, $4, $5, true, @1.first_line, @1.first_column);
    }
    | 'ID' '=' 'F' ';'
    {
        $$ = new AsigOpt($1, $3, "", "", false, @1.first_line, @1.first_column);        
    }
;


SaltoCondicional
    : 'IF' '(' F Op F ')' 'GOTO' 'ID' ';'
    {
        $$ = new SaltoCon(""+$3,$4,""+$5,$8,@1.first_line,@1.first_column);
    }
;

Goto
    : 'GOTO' 'ID' ';'
    {
        $$ = new SaltoInc($2, @1.first_line, @1.first_column);
    }
;

Label
    : 'ID' ':'
    {
        $$ = new Label($1, @1.first_line, @1.first_column);
    }
;

Op 
    : '+'
    | '-'
    | '*'
    | '/'
    | '%'
    | '=='
    | '!='
    | '<='
    | '<'
    | '>='
    | '>'
;

F
    : 'ENTERO'
    | 'DECIMAL'
    | 'ID'
;



AccesoArreglo
    : 'ID' '=' 'HEAP' '[' Casteo F ']' ';'
    {
        $$ = new GetHeap($3,$5,$1,$6,@1.first_line, @1.first_column);
    }
    | 'ID' '=' 'STACK' '[' Casteo F ']' ';'
    {
        $$ = new GetHeap($3,$5,$1,$6,@1.first_line, @1.first_column);        
    }
;

SeteoArreglo
    :  'HEAP' '[' Casteo F ']' '=' F ';'
    {
        $$ = new SetHeap($1,$3,$7,$4,@1.first_line, @1.first_column);          
    }
    |  'STACK' '[' Casteo F ']' '=' F ';'
    {
        $$ = new SetHeap($1,$3,$7,$4,@1.first_line, @1.first_column);                  
    }
;

Casteo
    : '(' Tipo ')'
    {
        $$ = "(" + $2 + ")"; 
    }
    | { $$ = "" }
;


Print
    : 'PRINT' '(' TipoPrint ',' Casteo F ')' ';'
    {
        $$ = new Print($3, $5, $6, @1.first_line, @1.first_column);
    }
;

TipoPrint
    : 'PRINT_C'
    | 'PRINT_D'
    | 'PRINT_E'
    | 'PRINT_F'
;

Llamada
    : 'ID' '(' ')' ';'
    {
        $$ = new Encabezado($1+"();", @1.first_line, @1.first_column);
    }
;