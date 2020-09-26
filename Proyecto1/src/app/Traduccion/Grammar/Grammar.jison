%{
    const { ListaInstruccionesT } = require('../ListaInstrucciones');    
    const { ListaGlobalesT } = require('../ListaGlobales');        

    /*----------------------------------------------- EXPRESIONES --------------------------------------------------------------*/
    const { ExpresionBinariaT } = require('../Expresion/ExpresionBinaria');
    const { LiteralT } = require('../Expresion/Literal');
    const { ExpresionUnariaT } = require('../Expresion/ExpresionUnaria');
    const { NativaArregloT } = require('../Instruccion/NativaArreglo');
    const { TernarioT } = require('../Instruccion/TernarioT');


    /*----------------------------------------------- INSTRUCCIONES --------------------------------------------------------------*/
    const { DeclaracionT } = require('../Instruccion/Declaracion');
    const { AsignacionT } = require('../Instruccion/Asignacion');   
    const { FuncionT } = require('../Instruccion/Funcion'); 
    const { LlamadaFuncionT } = require('../Instruccion/LlamadaFuncion'); 
    const { Arreglo2T } = require('../Instruccion/Arreglo2');
    const { ConsoleT } = require('../Instruccion/Console');
    const { ForInOf } = require('../Instruccion/ForInOf');
    const { IncrementoT } = require('../Instruccion/IncrementoT');
    const { AsignacionArrayT } = require('../Instruccion/AsignacionArray');
    const { AsignacionTypeT } = require('../Instruccion/AsignacionType');

    /*--------------------------------------------- SENTENCIAS DE CONTROL --------------------------------------------------------------*/

    const { BloqueInstruccionesT } = require('../Instruccion/BloqueInstrucciones'); 
    const { IfT } = require('../Instruccion/If'); 
    const { WhileT } = require('../Instruccion/While'); 
    const { SwitchT } = require('../Instruccion/Switch');     
    const { CaseT } = require('../Instruccion/Case'); 
    const { SentenciaSalidaT } = require('../Instruccion/SentenciaSalida'); 

    /*----------------------------------------------- ARREGLOS Y TYPES  --------------------------------------------------------------*/

    const { AccesoT } = require('../Expresion/Acceso'); 
    const { AtrTypeT } = require('../Instruccion/AtrType'); 
    const { TypeT } = require('../Instruccion/Type'); 
    const { VariableTypeT } = require('../Instruccion/VariableType'); 
    const { IdAccesoT } = require('../Instruccion/IdAcceso'); 

    /*---------------------------------------------------   ERRORES  --------------------------------------------------------------*/
    const { Error_ } = require("../../Error/Error.ts");
    const { errores } = require("../../Error/Errores.ts");

    let funcionesAnidadas = [];
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
"**"                    return '**'
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
    let error_lexico = new Error_(yylloc.first_line, yylloc.first_column, 'Lexico', yytext);
    errores.push(error_lexico);
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
    | asignacion ';'
    {
        $1.ptComa = ";"
        $$ = $1;
    }
    | Push ';'
    {
        var pushpt = eval('$1');
        pushpt.puntoC = ";";
        $$ = pushpt;
    }
    | Length ';'
    {
        var lengthpt = eval('$1');
        lengthpt.puntoC = ";";
        $$ = lengthpt;
    }        
    | While
    | DoWhile
    | For
    | Switch  
    | Console  
    | funcion
    | Type ';'   
    | llamadaFuncion ';'
    {
        $1.puntoc = ";";
        $$ = $1;
    }
    | ForIn
    | ForOf
    | 'GRAFICAR' '(' ')'
    {
         $$ = new LiteralT("graficar_ts();");
    }
    | 'BREAK' ';'
    {
        $$ = new SentenciaSalidaT(2, null);
    }
    | 'CONTINUE' ';'
    {
        $$ = new SentenciaSalidaT(3, null);
    }
    | 'RETURN' ternario ';'
    {
        $$ = new SentenciaSalidaT(1, $2);
    }
    | 'RETURN' Expr ';'
    {
        $$ = new SentenciaSalidaT(1, $2);
    }
    | 'RETURN' ';'
    {
        $$ = new SentenciaSalidaT(1, null);
    }
    | 'ID' '++' ';'
    {
        $$ = new IncrementoT($1 , $2, ";");
    }
    | 'ID' '--' ';'
    {
        $$ = new IncrementoT($1 , $2, ";");
    }    
    | error  { 
    let error_sint = new Error_(this._$.first_line, this._$.first_column, 'Sintactico', yytext);
    errores.push(error_sint);
    }
;
/*--------------------------------------Declaracion y Asignacion de variables----------------------------------*/

declaracion
    : 'LET'   'ID' ':' tipo corchetes '=' corchetesVacios ';'
    { 
        $$ = new DeclaracionT($2, `${$4}${$5}`, "let", $7 );
    }
    | 'LET'   'ID' ':' tipo corchetes '=' Expr ';'
    { 
        $$ = new DeclaracionT($2, `${$4}${$5}`, "let", $7 );
    }
    | 'LET'   'ID' ':' tipo '=' '{' atributosType '}' ';'
    { 
        $$ = new VariableTypeT($2, $4, "let", $7 );
    }    
    | 'LET'   'ID' ':' tipo  corchetes ';'
    { 
        $$ = new DeclaracionT($2, `${$4}${$5}`, "let", null );
    }        
    | 'LET'   'ID' ':' tipo '=' Expr ';'
    { 
        $$ = new DeclaracionT($2, `${$4}`, "let", $6 );
    }
    | 'LET'   'ID' ':' tipo ';'
    { 
        $$ = new DeclaracionT($2, `${$4}`, "let", null );
    }   
    | 'LET'   'ID'  '=' Expr ';'
    {
        $$ = new DeclaracionT($2, "", "let", $4 );
    }    
    | 'LET' 'ID' ';'
    {
        $$ = new DeclaracionT($2, "", "let", null );
    }
    | 'CONST' 'ID' ':' tipo corchetes '=' corchetesVacios ';'
    { 
        /* const arr : number[][] = [[5]];*/
        $$ = new DeclaracionT($2, `${$4}${$5}`, "let", $7 );
    }
    | 'CONST' 'ID' ':' tipo corchetes '=' Expr ';'
    { 
        $$ = new DeclaracionT($2, `${$4}${$5}`, "const", $7 );
    }    
    | 'CONST' 'ID' ':' tipo '=' Expr ';'
    { 
        $$ = new DeclaracionT($2, `${$4}`, "const", $6 );
    }
    | 'CONST' 'ID' '=' Expr ';'
    { 
        $$ = new DeclaracionT($2, "", "const", $4 );
    }
;

corchetes
    : corchetes '[' ']'
    {
        $$ = $1 + "[]";
    }
    | '[' ']'
    {
        $$ = "[]";
    }
;

corchetesVacios
    :  '[' masCorchetes ']'
    {
         $$ = new Arreglo2T($2); 
    }
    | '[' ']'
    {
         $$ = new Arreglo2T(null); 
    }
;

masCorchetes
    :  masCorchetes ',' corcheteFinal
    {        
        $1.push($3);
        $$ = $1;
    }
    | corcheteFinal
    {
        $$ = [$1];
    }
;

corcheteFinal
    : '[' corcheteFinal ']'
    {
        let arrf = [$2]; 
         $$ = new Arreglo2T(arrf);             
    }
    | '[' ']'
    {
         $$ = new Arreglo2T(null);
    }
;



tipo
    : 'NUMBER'
    {
    }
    | 'STRING'
    {
    }    
    | 'BOOLEAN'
    {
    }
    | 'VOID'
    {
    }
    | 'ID'
    {
    }
;



asignacion  
    : 'ID' accesos '=' corchetesVacios 
    {
        var acc = new IdAccesoT($1, $2);        
        $$ = new AsignacionArrayT( acc , $4 );
    }
    | 'ID' accesos '=' '{' atributosType '}'
    {
        var typeasig = new IdAccesoT($1, $2);         
        $$ = new AsignacionTypeT(typeasig , $5);
    }
    | 'ID' accesos '=' Expr 
    {
        var acc2 = new IdAccesoT($1, $2);        
        $$ = new AsignacionArrayT( acc2 , $4 );
    }
    | 'ID' '+=' Expr 
    {
        $$ = new AsignacionT($1 , $3, $2);
    }
    | 'ID' '=' '{' atributosType '}' 
    {
        $$ = new AsignacionTypeT($1 , $4);
    }    
    | 'ID' '=' Expr 
    {
        $$ = new AsignacionT($1 , $3, $2);
    }
;


/*-----------------------------------------Funciones , llamadas y parametros------------------------------------*/

Console 
    : 'CONSOLE' '.' 'LOG' '(' ListaConsole ')' ';'
    {   $$ = new ConsoleT($5);}
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

Push
    : 'ID' accesos '.' 'PUSH' '(' Expr ')'  
    {
        let accL = new IdAccesoT($1, 0);
        $$ = newNat = new NativaArregloT(accL , 1, $6);
    }
    | 'ID'  '.' 'PUSH' '(' Expr ')'
    {
        $$ = newNat = new NativaArregloT($1 , 1, $5);
    }    
;

Length
    : 'ID' accesos '.' 'LENGTH' 
    {
        let accL2 = new IdAccesoT($1, $2);     
        $$ = new NativaArregloT(accL2 , 0, null);
    }
    | 'ID'  '.' 'LENGTH'
    {
        $$  = new NativaArregloT($1 , 0, null);
    }      
;

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
///////////////////////////////////////                                 ////////////////////////////////////////////////////////////////
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\      SENTENCIAS DE CONTROL      \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
///////////////////////////////////////                                 ////////////////////////////////////////////////////////////////
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/



If
    : 'IF' '(' Expr ')' BloqueInstrucciones Else
    {
        $$ = new IfT($3, $5, $6);
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
        $$ = new WhileT( $3 , $5, 1);
    }
;

DoWhile
    : 'DO' BloqueInstrucciones 'WHILE' '(' Expr ')' ';'
    {
        $$ = new WhileT( $5 , $2, 2);
    }
;

Switch
    : 'SWITCH' '(' Expr ')' '{' BloqueCase Default '}'
    {
        $$ = new SwitchT( $3 , $6 , $7);
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
        $$ = new CaseT( $2 , $4);
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
        $$ = new ForInOf( $3, $5 , $7, $9 , 0);
    }    
;

IncrementoFor
    : asignacion
    {
        $$ = new AsignacionT($1 , $3, $2);
    }    
    | 'ID' '++'
    {
        $$ = new IncrementoT($1 , $2, "");
    }
    | 'ID' '--'
    {
        $$ = new IncrementoT($1 , $2, "");
    }
;


DeclaracionFor
    : 'LET'   'ID' '=' Expr
    { 
        $$ = new DeclaracionT($2, "", "let", $4 );
    }
    | 'CONST'   'ID' '=' Expr
    { 
        $$ = new DeclaracionT($2, "", "const", $4 );
    }
    | 'ID' '=' Expr 
    {
        let asigptD = new AsignacionT($1 , $3, $2);
        asigptD.ptComa = ";"
        $$ = asigptD;
    }
;



ForIn
    : 'FOR' '(' DeclaracionForIn 'IN' Expr ')' BloqueInstrucciones
    {
        $$ = new ForIn( $3 , $5, null,  $7, 2);
    }
;

ForOf
    : 'FOR' '(' DeclaracionForIn 'OF' Expr ')' BloqueInstrucciones
    {
        $$ = new ForIn( $3 , $5, null,  $7, 1);
    }
;

DeclaracionForIn
    : 'LET' 'ID'
    {
        $$ = new DeclaracionT($2, "", "let", null );
    }
    | 'CONST' 'ID'
    {
        $$ = new DeclaracionT($2, "", "const", null );        
    }
;



BloqueInstrucciones
    : '{'  Instrucciones '}'
    {
        $$ = new BloqueInstruccionesT($2);
    } 
    | '{' '}'
    {
        $$ = null;
    }
  ; 



/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
///////////////////////////////////////                                 ////////////////////////////////////////////////////////////////
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\             FUNCIONES            \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
///////////////////////////////////////                                 ////////////////////////////////////////////////////////////////
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/


//Funcion Global
funcion
    : 'FUNCTION' idFuncion '(' parametrosFuncion ')' tipoFuncion  '{' InstruccionesFun '}' 
    {
        $$ = new FuncionT($2.id, $4, $6, $8, "", funcionesAnidadas );
        funcionesAnidadas = [];
    }
;

idFuncion
    : 'ID'
    {
        $$ = {
            padre : "",
             id : $1
        };
    }       
;


parametrosFuncion
    : parametros 
    | { $$ = ""; }
;

tipoFuncion
    : ':' tipo { $$ = `:${$2}`; }
    | { $$ = ""; }
;


InstruccionesFun
    : InstruccionesFun instrFun
    {
        var fnc = eval('$2');
        if(fnc instanceof FuncionT){
            console.log("entro donde debo");
            console.log($2);
            funcionesAnidadas.push($2);
        }else{
            console.log("no entro donde debo");
            console.log($2);
             $1.push($2);
        }
        $$ = $1;
    } 
    | instrFun
    {        
        var fnc = eval('$1');
        if(fnc instanceof FuncionT){
            console.log("entro donde debo");
            console.log($1);
            funcionesAnidadas.push($1);
            $$ = [];
        }else{
             $$ = [$1];
        }
    }
;

instrFun
    : declaracion
    | If
    | asignacion ';'
    {
        var asigpt = eval('$1');
        asigpt.ptComa = ";";
        $$ = asigpt;
    }
    | Push ';'
    {
        var pushpt = eval('$1');
        pushpt.puntoC = ";";
        $$ = pushpt;
    }
    | Length ';'
    {
        var lengthpt = eval('$1');
        lengthpt.puntoC = ";";
        $$ = lengthpt;
    }        
    | While
    | DoWhile
    | For
    | Switch  
    | Console  
    | funcionFun
    | Type ';'   
    | llamadaFuncion ';'
    {
        $1.puntoc = ";";
        $$ = $1;
    }
    | ForIn
    | ForOf
    | 'GRAFICAR' '(' ')'
    {
         $$ = new LiteralT("graficar_ts();");
    }
    | 'BREAK' ';'
    {
        $$ = new SentenciaSalidaT(2, null);
    }
    | 'CONTINUE' ';'
    {
        $$ = new SentenciaSalidaT(3, null);
    }
    | 'RETURN' ternario ';'
    {
        $$ = new SentenciaSalidaT(1, $2);
    }
    | 'RETURN' Expr ';'
    {
        $$ = new SentenciaSalidaT(1, $2);
    }
    | 'RETURN' ';'
    {
        $$ = new SentenciaSalidaT(1, null);
    }
    | 'ID' '++' ';'
    {
        $$ = new IncrementoT($1 , $2, ";");
    }
    | 'ID' '--' ';'
    {
        $$ = new IncrementoT($1 , $2, ";");
    }  
;



funcionFun
    : 'FUNCTION' idFunAnid '(' parametrosFuncion ')' tipoFuncion  '{' InstruccionesFun '}'
    {
        $$ = new FuncionT($2.value, $4, $6, $8, $2.padre );
    } 
;
idFunAnid
    : 'ID'
    {
        //pushear a map traducidas
        var pila = eval('$$');
        var tope = pila.length - 1;
        console.log("================================ PILA");
        console.log(pila[tope - 2]);
        if(pila[tope - 2] == '{'){
            $$ = { padre : pila[tope - 7].id, id: pila[tope - 7].id + `_${$1}` , value : $1  }; 
        }else{
            $$ = { padre : pila[tope - 8].id, id: pila[tope - 8].id + "_" + $1 , value : $1 }; 
        }
    }
;




parametros
    : parametros ',' parametro
    {
        $$ = `${$1},${$3}`;
    }    
    | parametro
    {
        $$ = $1;
    }    
;

parametro
    : 'ID' ':' tipo corchetes
    {
        $$ = `${$1}:${$3}${$4}`;
    }
    | 'ID' ':' tipo
    {
        $$ = `${$1}:${$3}`;
    }
;


llamadaFuncion
    : 'ID' '(' paramsExp ')' 
    {
        $$ = new LlamadaFuncionT($1 , $3);
    }
    | 'ID' '('  ')' 
    {
        $$ = new LlamadaFuncionT($1 , null);
    }
    ;


paramsExp
    : paramsExp ',' Expr
    {
        $1.push($3);
        $$ = $1;
    }
    | Expr
    {
        $$ = [$1];
    }
;





/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
///////////////////////////////////////                                 ////////////////////////////////////////////////////////////////
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\          EXPRESIONES             \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
///////////////////////////////////////                                 ////////////////////////////////////////////////////////////////
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/




/*----------------------------------------Expresiones Aritmeticas y Logicas--------------------------------------*/
Expr
    : '-' Expr %prec UMENOS
    {
        $$ = new ExpresionUnariaT($2, $1);
    }
    | Expr '+' Expr
    {
        $$ = new ExpresionBinariaT($1 , $3, $2);
    }       
    | Expr '-' Expr
    {
        $$ = new ExpresionBinariaT($1 , $3, $2);
    }
    | Expr '**' Expr
    { 
        $$ = new ExpresionBinariaT($1 , $3, $2);
    }    
    | Expr '*' Expr
    { 
        $$ = new ExpresionBinariaT($1 , $3, $2);
    }
    | Expr '%' Expr
    { 
        $$ = new ExpresionBinariaT($1 , $3, $2);
    }           
    | Expr '/' Expr
    {
        $$ = new ExpresionBinariaT($1 , $3, $2);
    }
    | Expr '<' Expr
    {
        $$ = new ExpresionBinariaT($1 , $3, $2);
    }
    | Expr '<=' Expr
    {
        $$ = new ExpresionBinariaT($1 , $3, $2);
    }
    | Expr '>' Expr
    {
        $$ = new ExpresionBinariaT($1 , $3, $2);
    }
    | Expr '>=' Expr
    {
        $$ = new ExpresionBinariaT($1 , $3, $2);
    }
    | Expr '==' Expr
    {
        $$ = new ExpresionBinariaT($1 , $3, $2);
    }
    | Expr '!=' Expr
    {
        $$ = new ExpresionBinariaT($1 , $3, $2);
    }
    | Expr '&&' Expr
    {
        $$ = new ExpresionBinariaT($1 , $3, $2);
    }
    | Expr '||' Expr
    {
        $$ = new ExpresionBinariaT($1 , $3, $2);
    }
    | '!' Expr
    {
        $$ = new ExpresionUnariaT($2, $1);
    }            
    | F
    {
        $$ = $1;
    }
;


F   : '(' Expr ')'
    { 
        $$ = new ExpresionUnariaT($2, $1);
    }
    | 'DECIMAL'
    { 
         $$ = new LiteralT($1);
    }
    | 'ENTERO'
    { 
         $$ = new LiteralT($1);
    }
    | 'CADENA'
    {
         $$ = new LiteralT($1);        
    }
    | 'CADENASIM'
    {
         $$ = new LiteralT($1);        
    }    
    | 'TRUE'
    { 
         $$ = new LiteralT($1);
    }
    | 'FALSE'
    { 
         $$ = new LiteralT($1);
    }
    | 'NULL'
    {
         $$ = new LiteralT($1);
    }   
    | Push
    | Length     
    | llamadaFuncion    
    | 'ID' accesos
    {
        $$ = new IdAccesoT($1, $2);      
    }      
    | 'ID' '++'
    {
        $$ = new IncrementoT($1 , $2, "");
    }
    | 'ID' '--'
    {
        $$ = new IncrementoT($1 , $2, "");
    }
    | '[' paramsExp ']'
    { 
         $$ = new Arreglo2T($2);

    }    
    | 'ID' {
         $$ = new LiteralT($1);
    }
;




/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
///////////////////////////////////////                                 ////////////////////////////////////////////////////////////////
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\          TYPES             \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
///////////////////////////////////////                                 ////////////////////////////////////////////////////////////////
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/


accesos
    : accesos acceso
    {
        $1.push($2);
        $$ = $1;
    }
    | acceso
    {
        $$ = [$1];
    }
;

acceso
    : '.' 'ID'
    {
          $$ = new AccesoT(1, $2);
    }
    | '[' Expr ']'
    {
          $$ = new AccesoT(2, $2);
    }    
;



Type
    : 'TYPE' 'ID' '=' '{' decla_atr_type '}'
    {
        $$ = new TypeT($2, $5);
    }
;//TODO comas en la traduccion de los types


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
    : 'ID' ':' tipo
    {
        $$ = new AtrTypeT(  $1, $3);
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
    : 'ID' ':' Expr
    {
        $$ = new AtrTypeT(  $1, $3);
    }
;


ternario
    :  Expr '?' Expr ':' Expr
    {
        $$ = new TernarioT($1 , $3, $5);
    } 
;