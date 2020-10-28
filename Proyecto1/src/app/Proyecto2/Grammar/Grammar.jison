%{
    /*=====================================ABSTRACT==============================================*/


    const { Simbolo } = require('../TablaSimbolos/Simbolo');

    /*===================================== UTIL =================================================*/

    const { Tipos, Tipo } = require('../Util/Tipo');
    
    /*=====================================EXPRESION==============================================*/

    //Valores
    const { Primitivo } = require('../Expresion/Literal/Primitivo');
    const { Acceso } = require('../Expresion/Acceso/Acceso');        
    const { AccesoAsig } = require('../Expresion/Literal/AccesoAsig');        


    //Aritmeticas
    const { Mas } = require('../Expresion/Aritmetica/Mas');
    const { Menos } = require('../Expresion/Aritmetica/Menos');
    const { Div } = require('../Expresion/Aritmetica/Div');
    const { Por } = require('../Expresion/Aritmetica/Por');
    const { Modulo} = require('../Expresion/Aritmetica/Modulo');
    
    //Logicas
    
    const { And } = require('../Expresion/Logica/And');
    const { Or } = require('../Expresion/Logica/Or');
    const { Not } = require('../Expresion/Logica/Not');    

    //Relacionales
    const { Mayor } = require('../Expresion/Relacional/Mayor');
    const { Menor } = require('../Expresion/Relacional/Menor');
    const { Igual } = require('../Expresion/Relacional/Igual');    
    const { Dif } = require('../Expresion/Relacional/Dif');        

    /*=====================================INSTRUCCION==============================================*/

    const { Declaracion } = require('../Instruccion/Variables/Declaracion');
    const { Asignacion } = require('../Instruccion/Variables/Asignacion');    


    // Sentencias de Control
    const { If } = require('../Instruccion/SentenciasControl/If');
    const { While } = require('../Instruccion/SentenciasControl/While');        
 

    /*MANEJO DE TYPES-------------------------------------------------------*/
  
    /*MANEJO DE ERRORES-------------------------------------------------------*/
  

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
   // let error_lexico = new Error_(yylloc.first_line, yylloc.first_column, 'Lexico', yytext);
   // errores.push(error_lexico);
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
    : Instrucciones EOF 
    {
        return $1;
    } 
;


/*=========================================================================================================*/
/*=========================================================================================================*/
/*=========================================================================================================*/
/*======================================    INSTRUCCIONES         =========================================*/
/*=========================================================================================================*/
/*=========================================================================================================*/

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
    : declaracion 
    | If 
    | Pushear ';'
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
    | 'GRAFICAR' '(' ')' ';'
    {

    }
    | 'BREAK' ';'
    {

    }
    | 'CONTINUE' ';'
    {

    }
    | 'RETURN' ternario ';'
    {

    }
    | 'RETURN' Expr ';'
    {

    }
    | 'RETURN' ';'
    {

    }
    | 'ID' '++' ';'
    {

    }
    | 'ID' '--' ';'
    {

    }    
    | error  { 

    }
;


/*=========================================================================================================*/
/*=========================================================================================================*/
/*=========================================================================================================*/
/*================================= DECLARACION Y ASIGNACION      =========================================*/
/*=========================================================================================================*/
/*=========================================================================================================*/


declaracion
    : 'LET'   'ID' ':' tipo corchetes '=' corchetesVacios ';'
    { 

    }
    | 'LET'   'ID' ':' tipo corchetes '='  Expr ';'
    { 
        /* let arr : number[][] = [[5]];*/        

    }
    | 'LET'   'ID' ':' tipo '=' '{' atributosType '}' ';'
    { 
        /* let arr : aidi = { value : piola };*/

    }    
    | 'LET'   'ID' ':' tipo  corchetes ';'
    { 
        /* let arr : number[][]; */

    }        
    | 'LET'   'ID' ':' tipo '=' Expr ';'
    { 
        $$ = new Declaracion($4,$2,$6,@1.first_line,@1.first_column);
    }
    | 'LET'   'ID' ':' tipo ';'
    { 
        /* let arr : number;*/        

    }
    | 'CONST' 'ID' ':' tipo corchetes '=' corchetesVacios ';'
    { 
        /* const arr : number[][] = [[5]];*/

    }    
    | 'CONST' 'ID' ':' tipo corchetes '=' Expr ';'
    { 
        /* const arr : number[][] = [[5]];*/

    }    
    | 'CONST' 'ID' ':' tipo '=' Expr ';'
    { 
        /* const arr : number = 5;*/

    }
;

corchetes
    : corchetes '[' ']'
    {
        var cantidad = eval('$1');
        $$ = parseInt( cantidad++);
    }
    | '[' ']'
    {
        $$ = 1;
    }
;


corchetesVacios
    :  '[' masCorchetes ']'
    {

    }
    | '[' ']'
    {

    }
;

masCorchetes
    :  masCorchetes ',' corcheteFinal
    {        

    }
    | corcheteFinal
    {

    }
;

corcheteFinal
    : '[' corcheteFinal ']'
    {

    }
    | '[' ']'
    {

    }
;

tipo
    : 'NUMBER' 
    {
        $$  = new Tipo(Tipos.NUMBER);
    }
    | 'STRING'
    {
        $$  = new Tipo(Tipos.STRING);
    }    
    | 'BOOLEAN'
    {
        $$  = new Tipo(Tipos.BOOLEAN);
    }
    | 'VOID'
    {
        $$  = new Tipo(Tipos.VOID);
    }
    | 'ID'
    {
        
    }
;



asignacion    
    : 'ID' accesos '=' corchetesVacios 
    {

    }
    | 'ID' accesos '=' Expr 
    {

    }
    | 'ID' '+=' Expr 
    {

    }
    | 'ID' '=' '{' atributosType '}' 
    {

    }        
    | 'ID' '=' Expr 
    {
        var idAsig = new AccesoAsig($1, null,  @1.first_line, @1.first_column);
        $$ = new Asignacion(idAsig, $3, @1.first_line, @1.first_column);
    }
;


/*=========================================================================================================*/
/*=========================================================================================================*/
/*=========================================================================================================*/
/*===========================    FUNCIONES NATIVAS ========================================================*/
/*=========================================================================================================*/
/*=========================================================================================================*/

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
    : 'ID' accesos '.' 'PUSH' '(' Expr ')'
    {

    } 
    |  'ID'  '.' 'PUSH' '(' Expr ')'
    {

    } 
;
Length
    : 'ID' accesos '.' 'LENGTH' 
    {

    } 
    | 'ID'  '.' 'LENGTH'
    {

    } 
;

/*=========================================================================================================*/
/*=========================================================================================================*/
/*=========================================================================================================*/
/*==================================== ESTRUCTURAS DE CONTROL     =========================================*/
/*=========================================================================================================*/
/*=========================================================================================================*/


If
    : 'IF' '(' Expr ')' BloqueInstrucciones Else
    {
        $$ = new If($3, $5, $6, @1.first_line, @1.first_column);
    }
;

Else
    : 'ELSE' If
    {
        $$ = $2;
    }
    | 'ELSE' BloqueInstrucciones
    {
        $$ = $2;
    }
    | /* epsilon */ 
    {
        $$ = null;
    }
;

While
    : 'WHILE' '(' Expr ')' BloqueInstrucciones
    {
        $$ = new While($3, $5, @1.first_line, @1.first_column);
    }
;

DoWhile
    : 'DO' BloqueInstrucciones 'WHILE' '(' Expr ')' ';'
    {

    }
;

Switch
    : 'SWITCH' '(' Expr ')' '{' BloqueCase Default '}'
    {

    }
;

BloqueCase
    :  BloqueCase Case
    {
        $1.push($2);
        $$ = $1;
    }
    |  Case
    {
        $$ = [$1];
    }
;

Case 
    : 'CASE' Expr ':' Instrucciones
    {

    }
;

Default 
    : 'DEFAULT' ':' Instrucciones
    {
        $$ = $3;
    }
    | /* epsilon */
    {
        $$ = null;
    }
  ;

For
    : 'FOR' '(' DeclaracionFor ';' Expr ';' IncrementoFor ')' BloqueInstrucciones
    { 

    }    
;

IncrementoFor
    : asignacion
    {
        $$ = $1;
    }    
    | 'ID' '++'
    {

    }
    | 'ID' '--'
    {

    }
;


DeclaracionFor
    : 'LET'   'ID' '=' Expr
    { 

    }
    | 'ID' '=' Expr 
    {

    }
;


ForIn
    : 'FOR' '(' declaracion_for 'IN' Expr ')' BloqueInstrucciones
    {

    }
;

ForOf
    : 'FOR' '(' declaracion_for 'OF' Expr ')' BloqueInstrucciones
    {

    }
;


declaracion_for
    : 'LET'   'ID' ':' tipo 
    { 
        /* let arr : number;*/        

    }
    | 'LET'   'ID'
    { 
        /* let arr : number;*/        

    }
    | 'CONST'   'ID' ':' tipo
    { 
        /* let arr : number;*/        

    }
    | 'CONST'   'ID'  
    { 
        /* let arr : number;*/        

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


/*=========================================================================================================*/
/*=========================================================================================================*/
/*=========================================================================================================*/
/*======================================        FUNCIONES         =========================================*/
/*=========================================================================================================*/
/*=========================================================================================================*/

funcion
    : 'FUNCTION' 'ID' '(' parametros ')' ':' tipo '{' Instrucciones '}'
    {

    }
    | 'FUNCTION' 'ID' '('  ')' ':' tipo '{' Instrucciones '}'
    {

    }
    | 'FUNCTION' 'ID' '(' parametros ')' ':' tipo '{'  '}'
    {

    }
    | 'FUNCTION' 'ID' '('  ')' ':' tipo '{'  '}'
    {

    } 
;

parametros
    : parametros ',' parametro
    {
        $1.push($3);
        $$ = $1;
    }    
    | parametro
    {
        $$ = [$1];
    }    
;

parametro
    : 'ID' ':' tipo corchetes
    {

    }
    | 'ID' ':' tipo 
    {

    }    
;



/*=========================================================================================================*/
/*=========================================================================================================*/
/*=========================================================================================================*/
/*======================================        EXPRESIONES       =========================================*/
/*=========================================================================================================*/
/*=========================================================================================================*/

Expr
    : '-' Expr %prec UMENOS
    {
  
    }
    | Expr '**' Expr
    { 

    }    
    | Expr '+' Expr
    {
        $$ = new Mas($1, $3, @1.first_line, @1.first_column); 
    }       
    | Expr '-' Expr
    {
        $$ = new Menos($1, $3, @1.first_line, @1.first_column); 
    }
    | Expr '*' Expr
    { 
        $$ = new Por($1, $3, @1.first_line, @1.first_column); 
    }
    | Expr '%' Expr
    { 
        $$ = new Modulo($1, $3, @1.first_line, @1.first_column); 
    }       
    | Expr '/' Expr
    {
        $$ = new Div($1, $3, @1.first_line, @1.first_column); 
    }
    | Expr '<' Expr
    {
        $$ = new Menor(false, $1, $3, @1.first_line, @1.first_column); 
    }
    | Expr '<=' Expr
    {
        $$ = new Menor(true, $1, $3, @1.first_line, @1.first_column); 
    }
    | Expr '>' Expr
    {
        $$ = new Mayor(false, $1, $3, @1.first_line, @1.first_column); 
    }
    | Expr '>=' Expr
    {
        $$ = new Mayor(true, $1, $3, @1.first_line, @1.first_column); 
    }
    | Expr '==' Expr
    {
        $$ = new Igual($1, $3, @1.first_line, @1.first_column);
    }
    | Expr '!=' Expr
    {
        $$ = new Dif($1, $3, @1.first_line, @1.first_column);
    }
    | Expr '&&' Expr
    {
        $$ = new And($1, $3, @1.first_line, @1.first_column);
    }
    | Expr '||' Expr
    {
        $$ = new Or($1, $3, @1.first_line, @1.first_column);
    }
    | '!' Expr
    {
        $$ = new Not($2, @1.first_line, @1.first_column);
    }            
    | F
    {
        $$ = $1;
    }
;


F   : '(' Expr ')'
    { 
        $$ = $2;
    }
    | 'DECIMAL'
    { 
        $$ = new Primitivo(Tipos.NUMBER, $1, @1.first_line, @1.first_column);
    }
    | 'ENTERO'
    { 
        $$ = new Primitivo(Tipos.NUMBER, $1, @1.first_line, @1.first_column);
    }
    | 'CADENA'
    {

    }
    | 'CADENASIM'
    {

    }    
    | 'TRUE'
    { 
        $$ = new Primitivo(Tipos.BOOLEAN, true, @1.first_line, @1.first_column); 
    }
    | 'FALSE'
    { 
        $$ = new Primitivo(Tipos.BOOLEAN, false, @1.first_line, @1.first_column); 
    }
    | 'NULL'
    {

    }      
    | Length     
    | llamadaFuncion    
    | 'ID' accesos
    {

    }
    | 'ID' '++'
    {

    }
    | 'ID' '--'
    {

    }                 
    | '[' paramsExp ']'
    { 

    }
    | 'ID' {
        $$ = new Acceso($1,@1.first_line,@1.first_column);
    }


;

accesos
    : accesos acceso
    {

    }
    | acceso
;

acceso
    : '.' 'ID'
    {

    }
    | '[' Expr ']'
    {

    }
    | '.' 'POP' '(' ')'
    {


    }        
;


llamadaFuncion
    : 'ID' '(' paramsExp ')' 
    {

    }
    | 'ID' '('  ')' 
    {

    }
    ;


paramsExp
    : paramsExp ',' Expr
    {
        if($3 != "null"){
        $1.push($3);
        }
        $$ = $1;
    }
    | Expr
    {
        $$ = [$1];
    }
;

Type
    : 'TYPE' 'ID' '=' '{' decla_atr_type '}'
    {

    }
;


decla_atr_type
    : decla_atr_type ',' atr_type
    {
        $1.push($3);
        $$ = $1;
    }
    | atr_type
    {
        $$ = [$1];
    }
;

atr_type
    : 'ID' ':' tipo corchetes
    {

    }
    | 'ID' ':' corchetes
    {

    }
    | 'ID' ':' tipo
    {

    }
;


atributosType
    : atributosType ',' atribType
    {
        $1.push($3);
        $$ = $1;
    }
    | atribType
    {
        $$ = [$1];
    }
;

atribType
    : 'ID' ':' corchetesVacios
    {

    }
    | 'ID' ':' Expr
    {

    }
;



ternario
    :  Expr '?' Expr ':' Expr
    {

    } 
;

