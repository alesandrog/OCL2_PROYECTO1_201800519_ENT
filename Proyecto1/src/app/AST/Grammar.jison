%{
    const { NodoGraphviz } = require("./NodoGraphviz");

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

%{
    //Control para creacion de variables temporales
	let nodoActual = 0;
    let listaNodos = [];
%}

%%

Init    
    : Instrucciones EOF 
    {
        let nodo_eof = new NodoGraphviz("node_"+nodoActual , '[label="EOF"];\n', []);
        nodoActual++;        
        let nodo_init = new NodoGraphviz("node_"+nodoActual , '[label="Init"];\n', [$1.id, nodo_eof.id]);
        nodoActual++;
        listaNodos.push(nodo_eof);
        listaNodos.push(nodo_init);

        console.log(listaNodos);
        let graph = "";
        for(let i = 0; i < listaNodos.length; i ++){
            graph += listaNodos[i].id + listaNodos[i].label;
        }
        let punteros = "";
        for(let i = 0; i < listaNodos.length ; i++){
            for(let j = 0; j < listaNodos[i].apuntadores.length ; j++){
                punteros += listaNodos[i].id + " -> " + listaNodos[i].apuntadores[j] + ";\n";
            }
        }
        console.log(graph + "\n" + punteros);
        nodoActual = 0;
        listaNodos = [];
        return $1;
    } 
;

Instrucciones
    : Instrucciones instruccion{
        let nodo_instrucciones = new NodoGraphviz("node_"+nodoActual , '[label="Instrucciones"];\n', [$1.id]);
        nodoActual++;
        let nodo_instr = new NodoGraphviz("node_"+nodoActual , '[label="Instruccion"];\n', [$2.id]);
        nodoActual++;
        let nodo_instrucciones2 = new NodoGraphviz("node_"+nodoActual , '[label="Instrucciones"];\n', [ nodo_instrucciones.id, nodo_instr.id ]);
        nodoActual++;

        listaNodos.push(nodo_instrucciones2);        
        listaNodos.push(nodo_instrucciones);
        listaNodos.push(nodo_instr);
        $$ = nodo_instrucciones2;
    }
    | instruccion{
        let nodo_declaracion = new NodoGraphviz("node_"+nodoActual , '[label="Instruccion"];\n', [$1.id]);
        listaNodos.push(nodo_declaracion);
        nodoActual++;
        $$ = nodo_declaracion;    
    }
;

/*=====================================================================================================*/
/*=====================================================================================================*/
/*=====================================================================================================*/
/*-------------------------------------- INSTRUCCIONES ------------------------------------------------*/
/*=====================================================================================================*/
/*=====================================================================================================*/
/*=====================================================================================================*/

instruccion
    : declaracion
    {
        listaNodos.push($1);
    } 
    | If 
    {
        listaNodos.push($1);        
    }
    | Pushear
    | asignacion ';'
    {
        listaNodos.push($1);        
    }
    | While
    {
        listaNodos.push($1);        
    }
    | DoWhile
    {
        listaNodos.push($1);        
    }
    | For
    | Switch
    {
        listaNodos.push($1);            
    }    
    | Console
    {
        listaNodos.push($1);            
    }
    | funcion
    {
        listaNodos.push($1);            
    }            
    | Type ';'
    {
        listaNodos.push($1);
    }
    | llamadaFuncion ';' 
    | ForIn
    | ForOf
    | 'GRAFICAR' '(' ')' ';'
    {
        let paraGraf = new NodoGraphviz("node_"+nodoActual , '[label="("];\n', [] );
        nodoActual++;        
        let parcGraf = new NodoGraphviz("node_"+nodoActual , '[label=")"];\n', [] );
        nodoActual++;                
        let instGraf = new NodoGraphviz("node_"+nodoActual , '[label="'+$1+'"];\n', [] );
        nodoActual++;
        let resGraf = new NodoGraphviz("node_"+nodoActual , '[label="GraficarTS"];\n', [instGraf.id ,paraGraf.id, parcGraf.id] );
        nodoActual++;                
        listaNodos.push(resGraf);
        listaNodos.push(instGraf);        
        listaNodos.push(paraGraf);
        listaNodos.push(parcGraf);
        $$ = resGraf;        
    }    
    | 'BREAK' ';'
    {
        let instBreak = new NodoGraphviz("node_"+nodoActual , '[label="'+$1+'"];\n', [] );
        nodoActual++;
        listaNodos.push(instBreak);
        $$ = instBreak;            
    }
    | 'CONTINUE' ';'
    {
        let instCont = new NodoGraphviz("node_"+nodoActual , '[label="'+$1+'"];\n', [] );
        nodoActual++;
        listaNodos.push(instCont);
        $$ = instCont;        
    }
    | 'RETURN' ternario ';'
    {
        let instRet3 = new NodoGraphviz("node_"+nodoActual , '[label="'+$1+'"];\n', [] );
        nodoActual++;
        let resReturn3 = new NodoGraphviz("node_"+nodoActual , '[label="Return"];\n', [instRet3.id , $2.id]);
        nodoActual++;                
        listaNodos.push(instRet3);
        listaNodos.push($2);
        listaNodos.push(resReturn3);
        $$ = resReturn3;           
    }
    | 'RETURN' Expr ';'
    {
        let instRet2 = new NodoGraphviz("node_"+nodoActual , '[label="'+$1+'"];\n', [] );
        nodoActual++;
        let resReturn = new NodoGraphviz("node_"+nodoActual , '[label="Return"];\n', [instRet2.id , $2.id]);
        nodoActual++;                
        listaNodos.push(instRet2);
        listaNodos.push($2);
        listaNodos.push(resReturn);
        $$ = resReturn;   
    }
    | 'RETURN' ';'
    {
        let instRet = new NodoGraphviz("node_"+nodoActual , '[label="'+$1+'"];\n', [] );
        nodoActual++;
        listaNodos.push(instRet);
        $$ = instRet;        
    }
    | 'ID' '++' ';'
    {
        let idInc = new NodoGraphviz("node_"+nodoActual , '[label="'+$1+'"];\n', [] );
        nodoActual++;            
        let masmasInc = new NodoGraphviz("node_"+nodoActual , '[label="++"];\n', [] );
        nodoActual++;        
        let resIncMas = new NodoGraphviz("node_"+nodoActual , '[label="Incremento"];\n', [idInc.id,masmasInc.id] );
        nodoActual++;        
        listaNodos.push(resIncMas);        
        listaNodos.push(idInc);
        listaNodos.push(masmasInc);
        $$ = resIncMas;        
    }
    | 'ID' '--' ';'
    {
        let idDecr = new NodoGraphviz("node_"+nodoActual , '[label="'+$1+'"];\n', [] );
        nodoActual++;            
        let menmenInc = new NodoGraphviz("node_"+nodoActual , '[label="--"];\n', [] );
        nodoActual++;        
        let resDecMen = new NodoGraphviz("node_"+nodoActual , '[label="Decremento"];\n', [idDecr.id,menmenInc.id] );
        nodoActual++;        
        listaNodos.push(resDecMen);        
        listaNodos.push(idDecr);
        listaNodos.push(menmenInc);
        $$ = resDecMen;
    }
    | error  { 
       // var error_sin = new Error_(this._$.first_line, this._$.first_column, 'Sintactico', yytext);
       // errores.push(error_sin);
    }
;
/*==============================================================================================================*/
/*==============================================================================================================*/
/*==============================================================================================================*/
/*--------------------------------------Declaracion y Asignacion de variables-----------------------------------*/
/*==============================================================================================================*/
/*==============================================================================================================*/
/*==============================================================================================================*/
/*==============================================================================================================*/
declaracion
    : 'LET'   'ID' ':' tipo corchetes '=' corchetesVacios ';'
    {
        //Nodo LET
        let aptLet1 = new NodoGraphviz("node_"+nodoActual , '[label="let"];\n', [] );
        nodoActual++;
        //Nodo ID
        let aptId1 = new NodoGraphviz("node_"+nodoActual , '[label="'+$2+'"];\n', [] );
        nodoActual++;
        //Nodo ":"
        let aptdsptExp1 = new NodoGraphviz("node_"+nodoActual , '[label=":"];\n', []);
        nodoActual++;
        //Nodo Tipo
        let aptTipoExp1 = new NodoGraphviz("node_"+nodoActual , '[label="tipo"];\n', [$4.id]);
        nodoActual++;        
        //Nodo "="
        let aptigExp1 = new NodoGraphviz("node_"+nodoActual , '[label="="];\n', []);
        nodoActual++;
        //Nodo EXP
        let corchDec1 = new NodoGraphviz("node_"+nodoActual , '[label="corchetes"];\n', [$5.id] );
        nodoActual++; 

        //Nodo EXP
        let corchVac1 = new NodoGraphviz("node_"+nodoActual , '[label="corchetesVacios"];\n', [] );
        nodoActual++; 

        //Nodo Declaracion
        let apt1 = [aptLet1.id , aptId1.id ,aptdsptExp1.id, aptTipoExp1.id, corchDec1.id, aptigExp1.id, corchVac1.id]; //Hijos de declaracion
        let dc1 = new NodoGraphviz("node_"+nodoActual , '[label="declaracion"];\n', apt1 );
        nodoActual++;

        //Ingresar nodos en el orden que fueron creados
        listaNodos.push(aptLet1);
        listaNodos.push(aptId1);
        listaNodos.push(aptdsptExp1);
        listaNodos.push(aptTipoExp1);
        listaNodos.push(corchDec1);
        listaNodos.push(aptigExp1);        
        listaNodos.push(corchVac1);

        $$ = dc1;              
    }
    | 'LET'   'ID' ':' tipo corchetes '='  Expr ';'
    {
        //Nodo LET
        let aptLet2 = new NodoGraphviz("node_"+nodoActual , '[label="let"];\n', [] );
        nodoActual++;
        //Nodo ID
        let aptId2 = new NodoGraphviz("node_"+nodoActual , '[label="'+$2+'"];\n', [] );
        nodoActual++;
        //Nodo ":"
        let aptdsptExp2 = new NodoGraphviz("node_"+nodoActual , '[label=":"];\n', []);
        nodoActual++;
        //Nodo Tipo
        let aptTipoExp2 = new NodoGraphviz("node_"+nodoActual , '[label="tipo"];\n', [$4.id]);
        nodoActual++;        
        //Nodo "="
        let aptigExp2 = new NodoGraphviz("node_"+nodoActual , '[label="="];\n', []);
        nodoActual++;
        //Nodo EXP
        let corchDec2 = new NodoGraphviz("node_"+nodoActual , '[label="corchetes"];\n', [$5.id] );
        nodoActual++;        
        //Nodo Declaracion
        let apt2 = [aptLet2.id , aptId2.id ,aptdsptExp2.id, aptTipoExp2.id, corchDec2.id, aptigExp2.id, $7.id]; //Hijos de declaracion
        let dc2 = new NodoGraphviz("node_"+nodoActual , '[label="declaracion"];\n', apt2 );
        nodoActual++;

        //Ingresar nodos en el orden que fueron creados
        listaNodos.push(aptLet2);
        listaNodos.push(aptId2);
        listaNodos.push(aptdsptExp2);
        listaNodos.push(aptTipoExp2);
        listaNodos.push(corchDec2);
        listaNodos.push(aptigExp2);        
        listaNodos.push($7);

        //Retornar declaracion
        $$ = dc2;        
    }
    | 'LET'   'ID' ':' tipo '=' '{' atributosType '}' ';'
    {
        //Nodo LET
        let aptLet3 = new NodoGraphviz("node_"+nodoActual , '[label="let"];\n', [] );
        nodoActual++;
        //Nodo ID
        let aptId3 = new NodoGraphviz("node_"+nodoActual , '[label="'+$2+'"];\n', [] );
        nodoActual++;
        //Nodo ":"
        let aptdsptExp3 = new NodoGraphviz("node_"+nodoActual , '[label=":"];\n', []);
        nodoActual++;
        //Nodo Tipo
        let aptTipoExp3 = new NodoGraphviz("node_"+nodoActual , '[label="tipo"];\n', [$4.id]);
        nodoActual++;        
        //Nodo "="
        let aptigExp3 = new NodoGraphviz("node_"+nodoActual , '[label="="];\n', []);
        nodoActual++;

        //Nodo "{"
        let aptllaveaExp3 = new NodoGraphviz("node_"+nodoActual , '[label="{"];\n', []);
        nodoActual++;
        //Nodo "}"
        let aptllavecExp3 = new NodoGraphviz("node_"+nodoActual , '[label="}"];\n', []);
        nodoActual++;

        let apt3 = [aptLet3.id , aptId3.id ,aptdsptExp3.id, aptTipoExp3.id, aptigExp3.id, aptllaveaExp3.id, $7.id, aptllavecExp3.id]; //Hijos de declaracion
        let dc3 = new NodoGraphviz("node_"+nodoActual , '[label="declaracion"];\n', apt3 );
        nodoActual++;

        //Ingresar nodos en el orden que fueron creados
        listaNodos.push(aptLet3);
        listaNodos.push(aptId3);
        listaNodos.push(aptdsptExp3);
        listaNodos.push(aptTipoExp3);
        listaNodos.push(aptigExp3);        
        listaNodos.push(aptllaveaExp3);
        listaNodos.push($7);
        listaNodos.push(aptllavecExp3);

        //Retornar declaracion
        $$ = dc3;        
    }
    | 'LET'   'ID' ':' tipo  corchetes ';'
    {
        //Nodo LET
        let aptLet4 = new NodoGraphviz("node_"+nodoActual , '[label="let"];\n', [] );
        nodoActual++;
        //Nodo ID
        let aptId4 = new NodoGraphviz("node_"+nodoActual , '[label="'+$2+'"];\n', [] );
        nodoActual++;
        //Nodo ":"
        let aptdsptExp4 = new NodoGraphviz("node_"+nodoActual , '[label=":"];\n', []);
        nodoActual++;
        //Nodo Tipo
        let aptTipoExp4 = new NodoGraphviz("node_"+nodoActual , '[label="tipo"];\n', [$4.id]);
        nodoActual++;
        //Nodo Corchetes
        let aptCorchExp4 = new NodoGraphviz("node_"+nodoActual , '[label="Corchetes"];\n', [$5.id]);
        nodoActual++;        
                      
        //Nodo Declaracion
        let apt4 = [aptLet4.id , aptId4.id ,aptdsptExp4.id, aptTipoExp4.id, aptCorchExp4.id]; //Hijos de declaracion
        let dc4 = new NodoGraphviz("node_"+nodoActual , '[label="declaracion"];\n', apt4 );
        nodoActual++;

        //Ingresar nodos en el orden que fueron creados
        listaNodos.push(aptLet4);
        listaNodos.push(aptId4);
        listaNodos.push(aptdsptExp4);
        listaNodos.push(aptTipoExp4);
        listaNodos.push(aptCorchetesExp4);        

        //Retornar declaracion
        $$ = dc4;                
    }
    | 'LET'   'ID' ':' tipo '=' Expr ';'
    {
        //Nodo LET
        let aptLet5 = new NodoGraphviz("node_"+nodoActual , '[label="let"];\n', [] );
        nodoActual++;
        //Nodo ID
        let aptId5 = new NodoGraphviz("node_"+nodoActual , '[label="'+$2+'"];\n', [] );
        nodoActual++;
        //Nodo ":"
        let aptdsptExp5 = new NodoGraphviz("node_"+nodoActual , '[label=":"];\n', []);
        nodoActual++;
        //Nodo Tipo
        let aptTipoExp5 = new NodoGraphviz("node_"+nodoActual , '[label="tipo"];\n', [$4.id]);
        nodoActual++;        
        //Nodo "="
        let aptigExp5 = new NodoGraphviz("node_"+nodoActual , '[label="="];\n', []);
        nodoActual++;
        //Nodo EXP
        //let aptExp5 = new NodoGraphviz("node_"+nodoActual , '[label="Expr"];\n', [$6.id] );
        //nodoActual++;        
        //Nodo Declaracion
        let apt5 = [aptLet5.id , aptId5.id ,aptdsptExp5.id, aptTipoExp5.id, aptigExp5.id, $6.id]; //Hijos de declaracion
        let dc5 = new NodoGraphviz("node_"+nodoActual , '[label="declaracion"];\n', apt5 );
        nodoActual++;

        //Ingresar nodos en el orden que fueron creados
        listaNodos.push(aptLet5);
        listaNodos.push(aptId5);
        listaNodos.push(aptdsptExp5);
        listaNodos.push(aptTipoExp5);
        listaNodos.push(aptigExp5);        
//        listaNodos.push(aptExp5);
        listaNodos.push($6);
       // listaNodos.push(dc5);

        //Retornar declaracion
        $$ = dc5;
    }
    | 'LET'   'ID' ':' tipo ';'
    {
        //Nodo LET
        let aptLet6 = new NodoGraphviz("node_"+nodoActual , '[label="let"];\n', [] );
        nodoActual++;
        //Nodo ID
        let aptId6 = new NodoGraphviz("node_"+nodoActual , '[label="'+$2+'"];\n', [] );
        nodoActual++;
        //Nodo ":"
        let aptdsptExp6 = new NodoGraphviz("node_"+nodoActual , '[label=":"];\n', []);
        nodoActual++;
        //Nodo Tipo
        let aptTipoExp6 = new NodoGraphviz("node_"+nodoActual , '[label="tipo"];\n', [$4.id]);
        nodoActual++;              
        //Nodo Declaracion
        let apt6 = [aptLet6.id , aptId6.id ,aptdsptExp6.id, aptTipoExp6.id]; //Hijos de declaracion
        let dc6 = new NodoGraphviz("node_"+nodoActual , '[label="declaracion"];\n', apt6 );
        nodoActual++;

        //Ingresar nodos en el orden que fueron creados
        listaNodos.push(aptLet5);
        listaNodos.push(aptId5);
        listaNodos.push(aptdsptExp5);
        listaNodos.push(aptTipoExp5);
       // listaNodos.push(dc6);

        //Retornar declaracion
        $$ = dc6;        
    }
    | 'LET'   'ID'  '=' Expr ';'
    { 
        //Nodo LET
        let aptLet7 = new NodoGraphviz("node_"+nodoActual , '[label="let"];\n', [] );
        nodoActual++;
        //Nodo ID
        let aptId7 = new NodoGraphviz("node_"+nodoActual , '[label="'+$2+'"];\n', [] );
        nodoActual++;
        //Nodo "="
        let aptigExp7 = new NodoGraphviz("node_"+nodoActual , '[label="="];\n', []);
        nodoActual++;
        //Nodo EXP
//        let aptExp7 = new NodoGraphviz("node_"+nodoActual , '[label="Expr"];\n', [$4.id] );
//        nodoActual++;        
        //Nodo Declaracion
        let apt7 = [aptLet7.id , aptId7.id , aptigExp7.id, $4.id]; //Hijos de declaracion
        let dc7 = new NodoGraphviz("node_"+nodoActual , '[label="declaracion"];\n', apt7 );
        nodoActual++;

        //Ingresar nodos en el orden que fueron creados
        listaNodos.push(aptLet7);
        listaNodos.push(aptId7);
        listaNodos.push(aptigExp7);        
       // listaNodos.push(aptExp7);
        listaNodos.push($4);
       // listaNodos.push(dc7);

        //Retornar declaracion
        $$ = dc7;
    }
    | 'LET' 'ID' ';'
    {
        //Nodo LET
        let aptLet8 = new NodoGraphviz("node_"+nodoActual , '[label="let"];\n', [] );
        nodoActual++;
        //Nodo ID
        let aptId8 = new NodoGraphviz("node_"+nodoActual , '[label="'+$2+'"];\n', [] );
        nodoActual++;
        //Nodo Declaracion
        let apt8 = [aptLet8.id , aptId8.id ]; //Hijos de declaracion
        let dc8 = new NodoGraphviz("node_"+nodoActual , '[label="declaracion"];\n', apt8);
        nodoActual++;

        //Ingresar nodos en el orden que fueron creados
        listaNodos.push(aptLet8);
        listaNodos.push(aptId8);
      //  listaNodos.push(dc8);

        //Retornar declaracion
        $$ = dc8;         
    }
    | 'CONST' 'ID' ':' tipo corchetes '=' corchetesVacios ';'
    | 'CONST' 'ID' ':' tipo corchetes '=' Expr ';'
    {
        //Nodo LET
        let aptLet9 = new NodoGraphviz("node_"+nodoActual , '[label="const"];\n', [] );
        nodoActual++;
        //Nodo ID
        let aptId9 = new NodoGraphviz("node_"+nodoActual , '[label="'+$2+'"];\n', [] );
        nodoActual++;
        //Nodo ":"
        let aptdsptExp9 = new NodoGraphviz("node_"+nodoActual , '[label=":"];\n', []);
        nodoActual++;
        //Nodo Tipo
        let aptTipoExp9 = new NodoGraphviz("node_"+nodoActual , '[label="tipo"];\n', [$4.id]);
        nodoActual++;        
        //Nodo "="
        let aptigExp9 = new NodoGraphviz("node_"+nodoActual , '[label="="];\n', []);
        nodoActual++;
        //Nodo EXP
        let corchDec9 = new NodoGraphviz("node_"+nodoActual , '[label="corchetes"];\n', [$5.id] );
        nodoActual++;        
        //Nodo Declaracion
        let apt9 = [aptLet9.id , aptId9.id ,aptdsptExp9.id, aptTipoExp9.id, corchDec9.id, aptigExp9.id, $7.id]; //Hijos de declaracion
        let dc9 = new NodoGraphviz("node_"+nodoActual , '[label="declaracion"];\n', apt9 );
        nodoActual++;

        //Ingresar nodos en el orden que fueron creados
        listaNodos.push(aptLet9);
        listaNodos.push(aptId9);
        listaNodos.push(aptdsptExp9);
        listaNodos.push(aptTipoExp9);
        listaNodos.push(corchDec9);
        listaNodos.push(aptigExp9);        
        listaNodos.push($7);

        //Retornar declaracion
        $$ = dc9;        

    }
    | 'CONST' 'ID' ':' tipo '=' Expr ';'
    {
        //Nodo CONST
        let aptLet11 = new NodoGraphviz("node_"+nodoActual , '[label="const"];\n', [] );
        nodoActual++;
        //Nodo ID
        let aptId11 = new NodoGraphviz("node_"+nodoActual , '[label="'+$2+'"];\n', [] );
        nodoActual++;
        //Nodo ":"
        let aptdsptExp11 = new NodoGraphviz("node_"+nodoActual , '[label=":"];\n', []);
        nodoActual++;
        //Nodo Tipo
        let aptTipoExp11 = new NodoGraphviz("node_"+nodoActual , '[label="tipo"];\n', [$4.id]);
        nodoActual++;        
        //Nodo "="
        let aptigExp11 = new NodoGraphviz("node_"+nodoActual , '[label="="];\n', []);
        nodoActual++;
        //Nodo EXP
  //      let aptExp11 = new NodoGraphviz("node_"+nodoActual , '[label="Expr"];\n', [$6.id] );
  //      nodoActual++;        
        //Nodo Declaracion
        let apt11 = [aptLet11.id , aptId11.id ,aptdsptExp11.id, aptTipoExp11.id, $6.id,  aptExp11.id]; //Hijos de declaracion
        let dc11 = new NodoGraphviz("node_"+nodoActual , '[label="declaracion"];\n', apt11 );
        nodoActual++;

        //Ingresar nodos en el orden que fueron creados
        listaNodos.push(aptLet11);
        listaNodos.push(aptId11);
        listaNodos.push(aptdsptExp11);
        listaNodos.push(aptTipoExp11);
        listaNodos.push(aptigExp11);        
        //listaNodos.push(aptExp11);
        listaNodos.push($6);
      //  listaNodos.push(dc11);

        //Retornar declaracion
        $$ = dc11;        
    }
    | 'CONST' 'ID' '=' Expr ';'
    {
        //Nodo CONST
        let aptLet12 = new NodoGraphviz("node_"+nodoActual , '[label="const"];\n', [] );
        nodoActual++;
        //Nodo ID
        let aptId12 = new NodoGraphviz("node_"+nodoActual , '[label="'+$2+'"];\n', [] );
        nodoActual++;
        //Nodo "="
        let aptigExp12 = new NodoGraphviz("node_"+nodoActual , '[label="="];\n', []);
        nodoActual++;
        //Nodo EXP
        //let aptExp12 = new NodoGraphviz("node_"+nodoActual , '[label="Expr"];\n', [$4.id] );
        //nodoActual++;        
        //Nodo Declaracion
        let apt12 = [aptLet12.id , aptId12.id , aptigExp12.id, $4.id]; //Hijos de declaracion
        let dc12 = new NodoGraphviz("node_"+nodoActual , '[label="declaracion"];\n', apt12 );
        nodoActual++;

        //Ingresar nodos en el orden que fueron creados
        listaNodos.push(aptLet12);
        listaNodos.push(aptId12);
        listaNodos.push(aptigExp12);        
//        listaNodos.push(aptExp12);
        listaNodos.push($4);
   //     listaNodos.push(dc12);

        //Retornar declaracion
        $$ = dc12;        
    }
;

corchetes
    : corchetes '[' ']'
    {
        let Corchetes = new NodoGraphviz("node_"+nodoActual , '[label="Corchetes"];\n', [$1.id]);
        nodoActual++;

        let corchIzq2 = new NodoGraphviz("node_"+nodoActual , '[label="["];\n', [] );
        nodoActual++;
        let corchDer2 = new NodoGraphviz("node_"+nodoActual , '[label="]"];\n', [] );
        nodoActual++;                
        let corchs2 = new NodoGraphviz("node_"+nodoActual , '[label="corchetes"];\n', [corchIzq2.id, corchDer2.id]);
        nodoActual++;        
        listaNodos.push(corchIzq2);
        listaNodos.push(corchDer2);

        let resCorch = new NodoGraphviz("node_"+nodoActual , '[label="Corchetes"];\n', [ Corchetes.id, corchs2.id ]);
        nodoActual++;       

        listaNodos.push(resCorch);
        listaNodos.push(Corchetes);        
        listaNodos.push(corchs2);

        $$ = resCorch;                
    }
    | '[' ']'
    {
        let corchIzq = new NodoGraphviz("node_"+nodoActual , '[label="["];\n', [] );
        nodoActual++;
        let corchDer = new NodoGraphviz("node_"+nodoActual , '[label="]"];\n', [] );
        nodoActual++;                
        let corchs = new NodoGraphviz("node_"+nodoActual , '[label="corchetes"];\n', [corchIzq.id, corchDer.id]);
        nodoActual++;        
        listaNodos.push(corchIzq);
        listaNodos.push(corchDer);
        listaNodos.push(corchs);
        $$ = corchs;        
    }
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
    {
        let tNum = new NodoGraphviz("node_"+nodoActual , '[label="'+$1+'"];\n', [] );
        listaNodos.push(tNum);
        nodoActual++;        
        $$ = tNum;        
    } 
    | 'STRING'
    {
        let tStr = new NodoGraphviz("node_"+nodoActual , '[label="'+$1+'"];\n', [] );
        listaNodos.push(tStr);
        nodoActual++;        
        $$ = tStr;        
    }
    | 'BOOLEAN'
    {
        let tBool = new NodoGraphviz("node_"+nodoActual , '[label="'+$1+'"];\n', [] );
        listaNodos.push(tBool);
        nodoActual++;        
        $$ = tBool;        
    }
    | 'VOID'
    {
        let tVoid = new NodoGraphviz("node_"+nodoActual , '[label="'+$1+'"];\n', [] );
        listaNodos.push(tVoid);
        nodoActual++;        
        $$ = tVoid;        
    }
    | 'ID'
    {
        let tId = new NodoGraphviz("node_"+nodoActual , '[label="'+$1+'"];\n', [] );
        listaNodos.push(tId);
        nodoActual++;        
        $$ = tId;        
    }
;



asignacion    
    : 'ID' accesos '=' corchetesVacios 
    {
        let asigId1 = new NodoGraphviz("node_"+nodoActual , '[label="'+$1+'"];\n', [] );
        nodoActual++;        
        let asigIg1 = new NodoGraphviz("node_"+nodoActual , '[label="'+$3+'"];\n', [] );
        nodoActual++;                        
        let asigCorchVac = new NodoGraphviz("node_"+nodoActual , '[label="corchetesVacios"];\n', [] );
        nodoActual++;                                
        let resAsig1 = new NodoGraphviz("node_"+nodoActual , '[label="Asignacion"];\n', [asigId1.id , $2.id, asigIg1.id, asigCorchVac.id]);
        nodoActual++;                

        listaNodos.push(asigId1);
        listaNodos.push($2);
        listaNodos.push(asigIg1);
        listaNodos.push(asigCorchVac);
        $$ = resAsig1;        
    }
    | 'ID' accesos '=' Expr
    {
        let asigId2 = new NodoGraphviz("node_"+nodoActual , '[label="'+$1+'"];\n', [] );
        nodoActual++;        
        let asigIg2 = new NodoGraphviz("node_"+nodoActual , '[label="'+$3+'"];\n', [] );
        nodoActual++;                        
        let resAsig2 = new NodoGraphviz("node_"+nodoActual , '[label="Asignacion"];\n', [asigId2.id , $2.id, asigIg2.id, $4.id]);
        nodoActual++;                

        listaNodos.push(asigId2);
        listaNodos.push($2);
        listaNodos.push(asigIg2);
        listaNodos.push($4);
        $$ = resAsig2;
    } 
    | 'ID' '+=' Expr 
    {
        let asigId3 = new NodoGraphviz("node_"+nodoActual , '[label="'+$1+'"];\n', [] );
        nodoActual++;        
        let asigIg3 = new NodoGraphviz("node_"+nodoActual , '[label="'+$2+'"];\n', [] );
        nodoActual++;                
        let resAsig3 = new NodoGraphviz("node_"+nodoActual , '[label="Concat"];\n', [asigId3.id , asigIg3.id, $3.id]);
        nodoActual++;        


        listaNodos.push(asigId3);
        listaNodos.push(asigIg3);
        listaNodos.push($3);
        $$ = resAsig3;
    }    
    | 'ID' '=' '{' atributosType '}'
    {
        let asigId4 = new NodoGraphviz("node_"+nodoActual , '[label="'+$1+'"];\n', [] );
        nodoActual++;        
        let asigIg4 = new NodoGraphviz("node_"+nodoActual , '[label="'+$2+'"];\n', [] );
        nodoActual++;
        let paraAsig4 = new NodoGraphviz("node_"+nodoActual , '[label="{"];\n', [] );
        nodoActual++;
        let parcAsig4 = new NodoGraphviz("node_"+nodoActual , '[label="}"];\n', [] );
        nodoActual++;                                
        let resAsig4 = new NodoGraphviz("node_"+nodoActual , '[label="Asignacion"];\n', [asigId4.id , asigIg4.id, paraAsig4.id, $4.id, parcAsig4.id]);
        nodoActual++;        
        listaNodos.push(asigId4);
        listaNodos.push(asigIg4);
        listaNodos.push(paraAsig4);
        listaNodos.push($4);
        listaNodos.push(parcAsig4);        
        $$ = resAsig4;        
    } 
    | 'ID' '=' Expr 
    {
        let asigId5 = new NodoGraphviz("node_"+nodoActual , '[label="'+$1+'"];\n', [] );
        nodoActual++;        
        let asigIg5 = new NodoGraphviz("node_"+nodoActual , '[label="'+$2+'"];\n', [] );
        nodoActual++;                
        let resAsig5 = new NodoGraphviz("node_"+nodoActual , '[label="Asignacion"];\n', [asigId5.id , asigIg5.id, $3.id]);
        nodoActual++;        
        listaNodos.push(asigId5);
        listaNodos.push(asigIg5);
        listaNodos.push($3);        
        $$ = resAsig5;
    }
;

/*==============================================================================================================*/
/*==============================================================================================================*/
/*==============================================================================================================*/
/*==============================================================================================================*/
/*-----------------------------------------Funciones , llamadas y parametros------------------------------------*/
/*==============================================================================================================*/
/*==============================================================================================================*/
/*==============================================================================================================*/
/*==============================================================================================================*/

Console 
    : 'CONSOLE' '.' 'LOG' '(' ListaConsole ')' ';'
    {
        let instConsole = new NodoGraphviz("node_"+nodoActual , '[label="console"];\n', [] );
        nodoActual++;        
        let ptConsole = new NodoGraphviz("node_"+nodoActual , '[label=":"];\n', [] );
        nodoActual++;                
        let logConsole = new NodoGraphviz("node_"+nodoActual , '[label="log"];\n', [] );
        nodoActual++;                
        let paraConsole = new NodoGraphviz("node_"+nodoActual , '[label="("];\n', [] );
        nodoActual++;                
        let parcConsole = new NodoGraphviz("node_"+nodoActual , '[label=")"];\n', [] );
        nodoActual++;        

        let resinstConsole = new NodoGraphviz("node_"+nodoActual , '[label="Console"];\n', [instConsole.id , ptConsole.id , logConsole.id, paraConsole.id, $5.id, parcConsole.id] );
        nodoActual++;                

        listaNodos.push(instConsole);
        listaNodos.push(ptConsole);
        listaNodos.push(logConsole);
        listaNodos.push(paraConsole);
        listaNodos.push($5);
        listaNodos.push(parcConsole);
        $$ = resinstConsole;
    }
;


ListaConsole
    : ListaConsole ',' Expr
    {
        let listaC = new NodoGraphviz("node_"+nodoActual , '[label="ListaConsole"];\n', [$1.id] );
        nodoActual++;         
        let resListaC = new NodoGraphviz("node_"+nodoActual , '[label="ListaConsole"];\n', [listaC.id , $3.id] );
        nodoActual++;        
        listaNodos.push($1);
        listaNodos.push(listaC);
        listaNodos.push($3);
        $$ = resListaC;

    }
    | Expr
    {
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

/*==============================================================================================================*/
/*==============================================================================================================*/
/*==============================================================================================================*/
/*==============================================================================================================*/
/*------------------------------------------- Estructuras de Control ---------------------------------------------*/
/*==============================================================================================================*/
/*==============================================================================================================*/
/*==============================================================================================================*/

If
    : 'IF' '(' Expr ')' BloqueInstrucciones Else
    {
        //Nodo If
        let instIf = new NodoGraphviz("node_"+nodoActual , '[label="'+$1+'"];\n', [] );
        nodoActual++;
        //Nodo (
        let paraIf = new NodoGraphviz("node_"+nodoActual , '[label="("];\n', [] );
        nodoActual++;
        let parcIf = new NodoGraphviz("node_"+nodoActual , '[label=")"];\n', [] );
        nodoActual++;
        //Llave abrir
        let llaveaIf = new NodoGraphviz("node_"+nodoActual , '[label="{"];\n', [] );
        nodoActual++;
        //Llave cerrar
        let llavecIf = new NodoGraphviz("node_"+nodoActual , '[label="}"];\n', [] );
        nodoActual++;        
        if($5 != null){
            if($6 != null){ //Bloque instrucciones y bloque else
                //Nodo BloqueInstrucciones
                let  blockinstIf = new NodoGraphviz("node_"+nodoActual , '[label="BloqueInstrucciones"];\n', [$5.id] );
                nodoActual++;        
                let ptrsIf = [ instIf.id , paraIf.id , $3.id, parcIf.id , llaveaIf.id, blockinstIf.id , llavecIf.id , $6.id];
                let resIf = new NodoGraphviz("node_"+nodoActual , '[label="If"];\n', ptrsIf );  
                nodoActual++;
                listaNodos.push(instIf);
                listaNodos.push(paraIf);
                listaNodos.push($3);
                listaNodos.push(parcIf);
                listaNodos.push(llaveaIf);
                listaNodos.push(blockinstIf);
                listaNodos.push(llavecIf);
                listaNodos.push($6);
                $$ = resIf;                
            }else{   //Bloque Instrucciones sin else
                let  blockinstIf = new NodoGraphviz("node_"+nodoActual , '[label="BloqueInstrucciones"];\n', [$5.id] );
                nodoActual++;        
                let ptrsIf = [ instIf.id , paraIf.id , $3.id, parcIf.id , llaveaIf.id, blockinstIf.id , llavecIf.id];
                let resIf = new NodoGraphviz("node_"+nodoActual , '[label="If"];\n', ptrsIf );  
                nodoActual++;
                listaNodos.push(instIf);
                listaNodos.push(paraIf);
                listaNodos.push($3);
                listaNodos.push(parcIf);
                listaNodos.push(llaveaIf);
                listaNodos.push(blockinstIf);
                listaNodos.push(llavecIf);
                $$ = resIf;                 
            }
        }else{
            if($6 != null){ //Bloque instrucciones vacio y existe else
                let  blockinstIf = new NodoGraphviz("node_"+nodoActual , '[label="BloqueInstrucciones"];\n', [] );
                nodoActual++;        
                let ptrsIf = [ instIf.id , paraIf.id , $3.id, parcIf.id , llaveaIf.id, blockinstIf.id, llavecIf.id, $6.id];
                let resIf = new NodoGraphviz("node_"+nodoActual , '[label="If"];\n', ptrsIf );  
                nodoActual++;
                listaNodos.push(instIf);
                listaNodos.push(paraIf);
                listaNodos.push($3);
                listaNodos.push(parcIf);
                listaNodos.push(llaveaIf);
                listaNodos.push(blockinstIf);
                listaNodos.push(llavecIf);
                listaNodos.push($6);
                $$ = resIf;                     
            }else{ //Bloque instrucciones vacio sin else
                let  blockinstIf = new NodoGraphviz("node_"+nodoActual , '[label="BloqueInstrucciones"];\n', [] );
                nodoActual++;        
                let ptrsIf = [ instIf.id , paraIf.id , $3.id, parcIf.id, llaveaIf.id, blockinstIf.id, llavecIf.id];                
                let resIf = new NodoGraphviz("node_"+nodoActual , '[label="If"];\n', ptrsIf );  
                nodoActual++;
                listaNodos.push(instIf);
                listaNodos.push(paraIf);
                listaNodos.push($3);
                listaNodos.push(parcIf);
                listaNodos.push(llaveaIf);
                listaNodos.push(blockinstIf);
                listaNodos.push(llavecIf);
                $$ = resIf;               

            }
        }      
    }
;

Else
    : 'ELSE' If
    {
        let instElse = new NodoGraphviz("node_"+nodoActual , '[label="Else"];\n', [] );
        listaNodos.push(instElse);
        nodoActual++;
        listaNodos.push($2);
        let resElse = new NodoGraphviz("node_"+nodoActual , '[label="Else"];\n', [instElse.id , $2.id] );
        nodoActual++;      
        $$ = resElse;  

    }
    | 'ELSE' BloqueInstrucciones
    {
        let instElse2 = new NodoGraphviz("node_"+nodoActual , '[label="Else"];\n', [] );
        listaNodos.push(instElse2);
        nodoActual++;
        if($2 != null){
        let  blockinstIf2 = new NodoGraphviz("node_"+nodoActual , '[label="BloqueInstrucciones"];\n', [$2.id] );
        nodoActual++;             
        let resElse2 = new NodoGraphviz("node_"+nodoActual , '[label="Else"];\n', [instElse2.id, blockinstIf2.id] );
        listaNodos.push(blockinstIf2);
        nodoActual++;      
        $$ = resElse2;
        }else{
        let  blockinstIf2 = new NodoGraphviz("node_"+nodoActual , '[label="BloqueInstrucciones"];\n', [] );
        nodoActual++;             
        let resElse2 = new NodoGraphviz("node_"+nodoActual , '[label="Else"];\n', [instElse2.id, blockinstIf2.id] );
        listaNodos.push(blockinstIf2);
        nodoActual++;      
        $$ = resElse2;
        }
    }
    |
    {
        $$ = null;
    }
;

While
    : 'WHILE' '(' Expr ')' BloqueInstrucciones
    {
        //Nodo If
        let instWhile = new NodoGraphviz("node_"+nodoActual , '[label="'+$1+'"];\n', [] );
        nodoActual++;
        //Nodo (
        let paraWh = new NodoGraphviz("node_"+nodoActual , '[label="("];\n', [] );
        nodoActual++;
        let parcWh = new NodoGraphviz("node_"+nodoActual , '[label=")"];\n', [] );
        nodoActual++;
        //Llave abrir
        let llaveaWh = new NodoGraphviz("node_"+nodoActual , '[label="{"];\n', [] );
        nodoActual++;
        //Llave Cerrar
        let llavecWh = new NodoGraphviz("node_"+nodoActual , '[label="}"];\n', [] );
        nodoActual++;
        if($5 != null){
        //Nodo BloqueInstrucciones
        let  blockinstWh = new NodoGraphviz("node_"+nodoActual , '[label="BloqueInstrucciones"];\n', [$5.id] );
        nodoActual++;    
        let ptrsWh = [instWhile.id , paraWh.id, $3.id, parcWh.id, llaveaWh.id, blockinstWh.id, llavecWh.id];
        let  resWh = new NodoGraphviz("node_"+nodoActual , '[label="While"];\n', ptrsWh );
        nodoActual++;    
        listaNodos.push(instWhile);
        listaNodos.push(paraWh);
        listaNodos.push($3);
        listaNodos.push(parcWh);
        listaNodos.push(llaveaWh);
        listaNodos.push(blockinstWh);
        listaNodos.push(llavecWh);
        $$ = resWh;                 
        }else{
        let  blockinstWh = new NodoGraphviz("node_"+nodoActual , '[label="BloqueInstrucciones"];\n', [] );
        nodoActual++;             
        let ptrsWh = [instWhile.id , paraWh.id, $3.id, parcWh.id, llaveaWh.id, blockinstWh.id, llavecWh.id];
        let  resWh = new NodoGraphviz("node_"+nodoActual , '[label="While"];\n', ptrsWh );
        nodoActual++;    
        listaNodos.push(instWhile);
        listaNodos.push(paraWh);
        listaNodos.push($3);
        listaNodos.push(parcWh);
        listaNodos.push(llaveaWh);
        listaNodos.push(blockinstWh);
        listaNodos.push(llavecWh);        
        $$ = resWh;        
        }
    }
;

DoWhile
    : 'DO' BloqueInstrucciones 'WHILE' '(' Expr ')' ';'
    {
        //Nodo Do
        let instDo = new NodoGraphviz("node_"+nodoActual , '[label="'+$1+'"];\n', [] );
        nodoActual++;
        //Nodo While
        let instDoWh = new NodoGraphviz("node_"+nodoActual , '[label="'+$3+'"];\n', [] );
        nodoActual++;        
        //Nodo (
        let paraDo = new NodoGraphviz("node_"+nodoActual , '[label="("];\n', [] );
        nodoActual++;
        let parcDo = new NodoGraphviz("node_"+nodoActual , '[label=")"];\n', [] );
        nodoActual++;
        //Llave abrir
        let llaveaDo = new NodoGraphviz("node_"+nodoActual , '[label="{"];\n', [] );
        nodoActual++;
        //Llave Cerrar
        let llavecDo = new NodoGraphviz("node_"+nodoActual , '[label="}"];\n', [] );
        nodoActual++;
        if($2 != null){
        //Nodo BloqueInstrucciones
        let  blockinstDo = new NodoGraphviz("node_"+nodoActual , '[label="BloqueInstrucciones"];\n', [$2.id] );
        nodoActual++;    
        let ptrsDo = [instDo.id, llaveaDo.id, blockinstDo.id, llavecDo.id, instDoWh.id, paraDo.id, $5.id, parcDo.id];
        let  resDo = new NodoGraphviz("node_"+nodoActual , '[label="BloqueInstrucciones"];\n', ptrsDo );
        nodoActual++;    
        listaNodos.push(instDo);        
        listaNodos.push(llaveaDo);
        listaNodos.push(blockinstDo);
        listaNodos.push(llavecDo);
        listaNodos.push(instDoWh);
        listaNodos.push(paraDo);
        listaNodos.push($5);
        listaNodos.push(parcDo);
        $$ = resDo;                 
        }else{
        //Nodo BloqueInstrucciones
        let  blockinstDo = new NodoGraphviz("node_"+nodoActual , '[label="BloqueInstrucciones"];\n', [] );
        nodoActual++;    
        let ptrsDo = [instDo.id, llaveaDo.id, blockinstDo.id, llavecDo.id, instDoWh.id, paraDo.id, $5.id, parcDo.id];
        let  resDo = new NodoGraphviz("node_"+nodoActual , '[label="BloqueInstrucciones"];\n', ptrsDo );
        nodoActual++;    
        listaNodos.push(instDo);        
        listaNodos.push(llaveaDo);
        listaNodos.push(blockinstDo);
        listaNodos.push(llavecDo);
        listaNodos.push(instDoWh);
        listaNodos.push(paraDo);
        listaNodos.push($5);
        listaNodos.push(parcDo);
        $$ = resDo;                 
        }        
    }
;

Switch
    : 'SWITCH' '(' Expr ')' '{' BloqueCase Default '}'
    {
        let instSw = new NodoGraphviz("node_"+nodoActual , '[label="switch"];\n', []);
        nodoActual++;        
        //(
        let paraSw = new NodoGraphviz("node_"+nodoActual , '[label="("];\n', []);
        nodoActual++;                
        let parcSw = new NodoGraphviz("node_"+nodoActual , '[label=")"];\n', []);
        nodoActual++;   
        let llaveaSw = new NodoGraphviz("node_"+nodoActual , '[label="{"];\n', []);
        nodoActual++;                
        let llavecSw = new NodoGraphviz("node_"+nodoActual , '[label="}"];\n', []);
        nodoActual++;                        
//        let bloqueSw = new NodoGraphviz("node_"+nodoActual , '[label="BloqueCase"];\n', [$6.id]);
//        nodoActual++;                        

        let ptrsSw = [instSw.id, paraSw.id, $3.id, parcSw.id, llaveaSw.id, $6.id, $7.id, llavecSw.id];
        let resSw = new NodoGraphviz("node_"+nodoActual , '[label="Switch"];\n', ptrsSw);
        nodoActual++;                        
         
        listaNodos.push(instSw);
        listaNodos.push(paraSw);
        listaNodos.push($3);
        listaNodos.push(parcSw);
        listaNodos.push(llaveaSw);
        listaNodos.push($6);
        listaNodos.push($7);
        listaNodos.push(llavecSw);
        
        $$ = resSw;      
    }
;

BloqueCase
    :  BloqueCase Case
    {
        let bloqueC = new NodoGraphviz("node_"+nodoActual , '[label="BloqueCase"];\n', [$1.id]);
        nodoActual++;
        let bloqueCa2 = new NodoGraphviz("node_"+nodoActual , '[label="Case"];\n', [$2.id]);
        nodoActual++;
        let nodo_bloqueC2 = new NodoGraphviz("node_"+nodoActual , '[label="BloqueCase"];\n', [ bloqueC.id, bloqueCa2.id ]);
        nodoActual++;       
        listaNodos.push($1);        
        listaNodos.push(bloqueC);
        listaNodos.push(bloqueCa2);
        $$ = nodo_bloqueC2;        
    }
    |  Case
    {
        let bloqueCa = new NodoGraphviz("node_"+nodoActual , '[label="BloqueCase"];\n', [$1.id]);
        nodoActual++;        
        $$ = bloqueCa;
    }    
;

Case 
    : 'CASE' Expr ':' Instrucciones
    {
        //Nodo Case
        let instCase = new NodoGraphviz("node_"+nodoActual , '[label="'+$1+'"];\n', [] );
        nodoActual++; 
        //Nodo :
        let instdsptCase = new NodoGraphviz("node_"+nodoActual , '[label="'+$3+'"];\n', [] );
        nodoActual++;               
        //Nodo Bloque iNstr
        let bloqueInstCase = new NodoGraphviz("node_"+nodoActual , '[label="BloqueInstrucciones"];\n', [$4.id] );
        nodoActual++;
        //Nodo Res
        let resCase = new NodoGraphviz("node_"+nodoActual , '[label="Case"];\n', [instCase.id, $2.id, instdsptCase.id, bloqueInstCase.id] );
        nodoActual++;                
        listaNodos.push(instCase);
        listaNodos.push($2);
        listaNodos.push(instdsptCase);
        listaNodos.push(bloqueInstCase);
        listaNodos.push(resCase);
        $$ = resCase;
    }
;

Default 
    : 'DEFAULT' ':' Instrucciones
    {
        //Nodo Case
        let instDef = new NodoGraphviz("node_"+nodoActual , '[label="'+$1+'"];\n', [] );
        nodoActual++; 
        //Nodo :
        let instdsptDef = new NodoGraphviz("node_"+nodoActual , '[label="'+$2+'"];\n', [] );
        nodoActual++;               
        //Nodo Bloque iNstr
        let bloqueInstDef = new NodoGraphviz("node_"+nodoActual , '[label="BloqueInstrucciones"];\n', [$3.id] );
        nodoActual++;
        //Nodo Res
        let resDef = new NodoGraphviz("node_"+nodoActual , '[label="Case"];\n', [instDef.id, instdsptDef.id, bloqueInstDef.id] );
        nodoActual++;                
        listaNodos.push(instDef);
        listaNodos.push(instdsptDef);
        listaNodos.push(bloqueInstDef);
        $$ = resDef;    
    }
    | /* epsilon */
    {
        let resDef2 = new NodoGraphviz("node_"+nodoActual , '[label="Case"];\n', [] );
        nodoActual++;
        $$ = resDef2;        
    }
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
    {
        $$ = $2;
    }
    | '{' '}'
    {
        $$ = null;
    }
  ; 

/*==============================================================================================================*/
/*==============================================================================================================*/
/*==============================================================================================================*/
/*-----------------------------------------FUNCIONES------------------------------------------------*/
/*==============================================================================================================*/
/*==============================================================================================================*/
/*==============================================================================================================*/



funcion
    : 'FUNCTION' 'ID' '(' parametros ')' ':' tipo '{' Instrucciones '}'
    {
        //Nodo Function
        let instFunction = new NodoGraphviz("node_"+nodoActual , '[label="function"];\n', [] );
        nodoActual++;       
        //Nodo Function
        let instIdFn = new NodoGraphviz("node_"+nodoActual , '[label="'+$2+'"];\n', [] );
        nodoActual++;                 
        //Nodo Function
        let paraFn = new NodoGraphviz("node_"+nodoActual , '[label="("];\n', [] );
        nodoActual++;                         
        let parcFn = new NodoGraphviz("node_"+nodoActual , '[label=")"];\n', [] );
        nodoActual++;
        let dsptsFn = new NodoGraphviz("node_"+nodoActual , '[label=":"];\n', [] );
        nodoActual++;        
        let tipoFn = new NodoGraphviz("node_"+nodoActual , '[label="tipo"];\n', [$7.id] );
        nodoActual++;

        let llaveaFn = new NodoGraphviz("node_"+nodoActual , '[label="{"];\n', [] );
        nodoActual++;                         
        let llavecFn = new NodoGraphviz("node_"+nodoActual , '[label="}"];\n', [] );
        nodoActual++;        

        let bloqueFn = new NodoGraphviz("node_"+nodoActual , '[label="BloqueInstrucciones"];\n', [$9.id] );
        nodoActual++;        

        let resFn = new NodoGraphviz("node_"+nodoActual , '[label="Funcion"];\n', [instFunction.id, instIdFn.id, paraFn.id, $4.id, parcFn.id, dsptsFn.id , tipoFn.id, llaveaFn.id, bloqueFn.id, llavecFn.id] );
        nodoActual++;     

        listaNodos.push(instFunction);
        listaNodos.push(instIdFn);
        listaNodos.push(paraFn);
        listaNodos.push($4);
        listaNodos.push(parcFn);
        listaNodos.push(dsptsFn);
        listaNodos.push(tipoFn);
        listaNodos.push(llaveaFn);
        listaNodos.push(bloqueFn);
        listaNodos.push(llavecFn);
        $$ = resFn;   
    }
    | 'FUNCTION' 'ID' '(' parametros ')' '{' Instrucciones '}'
    {
        //Nodo Function
        let instFunction2 = new NodoGraphviz("node_"+nodoActual , '[label="function"];\n', [] );
        nodoActual++;       
        //Nodo Function
        let instIdFn2 = new NodoGraphviz("node_"+nodoActual , '[label="'+$2+'"];\n', [] );
        nodoActual++;                 
        //Nodo Function
        let paraFn2 = new NodoGraphviz("node_"+nodoActual , '[label="("];\n', [] );
        nodoActual++;                         
        let parcFn2 = new NodoGraphviz("node_"+nodoActual , '[label=")"];\n', [] );
        nodoActual++;        

        let llaveaFn2 = new NodoGraphviz("node_"+nodoActual , '[label="{"];\n', [] );
        nodoActual++;                         
        let llavecFn2 = new NodoGraphviz("node_"+nodoActual , '[label="}"];\n', [] );
        nodoActual++;        

        let bloqueFn2 = new NodoGraphviz("node_"+nodoActual , '[label="BloqueInstrucciones"];\n', [$7.id] );
        nodoActual++;        

        let resFn2 = new NodoGraphviz("node_"+nodoActual , '[label="Funcion"];\n', [instFunction2.id, instIdFn2.id, paraFn2.id, $4.id, parcFn2.id, llaveaFn2.id, bloqueFn2.id, llavecFn2.id] );
        nodoActual++;     

        listaNodos.push(instFunction2);
        listaNodos.push(instIdFn2);
        listaNodos.push(paraFn2);
        listaNodos.push($4);
        listaNodos.push(parcFn2);
        listaNodos.push(llaveaFn2);
        listaNodos.push(bloqueFn2);
        listaNodos.push(llavecFn2);
        $$ = resFn2;   

    }
    | 'FUNCTION' 'ID' '('  ')' ':' tipo '{' Instrucciones '}'
    {
        //Nodo Function
        let instFunction3 = new NodoGraphviz("node_"+nodoActual , '[label="function"];\n', [] );
        nodoActual++;       
        //Nodo Function
        let instIdFn3 = new NodoGraphviz("node_"+nodoActual , '[label="'+$2+'"];\n', [] );
        nodoActual++;                 
        //Nodo Function
        let paraFn3 = new NodoGraphviz("node_"+nodoActual , '[label="("];\n', [] );
        nodoActual++;                         
        let parcFn3 = new NodoGraphviz("node_"+nodoActual , '[label=")"];\n', [] );
        nodoActual++;
        let dsptsFn3 = new NodoGraphviz("node_"+nodoActual , '[label=":"];\n', [] );
        nodoActual++;        
        let tipoFn3 = new NodoGraphviz("node_"+nodoActual , '[label="tipo"];\n', [$6.id] );
        nodoActual++;

        let llaveaFn3 = new NodoGraphviz("node_"+nodoActual , '[label="{"];\n', [] );
        nodoActual++;                         
        let llavecFn3 = new NodoGraphviz("node_"+nodoActual , '[label="}"];\n', [] );
        nodoActual++;        

        let bloqueFn3 = new NodoGraphviz("node_"+nodoActual , '[label="BloqueInstrucciones"];\n', [$8.id] );
        nodoActual++;        

        let resFn3 = new NodoGraphviz("node_"+nodoActual , '[label="Funcion"];\n', [instFunction3.id, instIdFn3.id, paraFn3.id, parcFn3.id, dsptsFn3.id , tipoFn3.id, llaveaFn3.id, bloqueFn3.id, llavecFn3.id] );
        nodoActual++;     

        listaNodos.push(instFunction);
        listaNodos.push(instIdFn);
        listaNodos.push(paraFn);
        listaNodos.push(parcFn);
        listaNodos.push(dsptsFn);
        listaNodos.push(tipoFn);
        listaNodos.push(llaveaFn);
        listaNodos.push(bloqueFn);
        listaNodos.push(llavecFn);
        $$ = resFn3;           
    }
    | 'FUNCTION' 'ID' '('  ')'  '{' Instrucciones '}'
    {
        let instFunction4 = new NodoGraphviz("node_"+nodoActual , '[label="function"];\n', [] );
        nodoActual++;       
        //Nodo Function
        let instIdFn4 = new NodoGraphviz("node_"+nodoActual , '[label="'+$2+'"];\n', [] );
        nodoActual++;                 
        //Nodo Function
        let paraFn4 = new NodoGraphviz("node_"+nodoActual , '[label="("];\n', [] );
        nodoActual++;                         
        let parcFn4 = new NodoGraphviz("node_"+nodoActual , '[label=")"];\n', [] );
        nodoActual++;        

        let llaveaFn4 = new NodoGraphviz("node_"+nodoActual , '[label="{"];\n', [] );
        nodoActual++;                         
        let llavecFn4 = new NodoGraphviz("node_"+nodoActual , '[label="}"];\n', [] );
        nodoActual++;

        let bloqueFn4 = new NodoGraphviz("node_"+nodoActual , '[label="BloqueInstrucciones"];\n', [$6.id] );
        nodoActual++;                

        let ptrsFn4 = [instFunction4.id , instIdFn4.id, paraFn4.id, parcFn4.id, llaveaFn4.id, bloqueFn4.id, llavecFn4.id];
        let resFn4 = new NodoGraphviz("node_"+nodoActual , '[label="Funcion"];\n', ptrsFn4 );
        nodoActual++;

        listaNodos.push(instFunction4);
        listaNodos.push(instIdFn4);
        listaNodos.push(paraFn4);
        listaNodos.push(parcFn4);
        listaNodos.push(llaveaFn4);
        listaNodos.push(bloqueFn4);
        listaNodos.push(llavecFn4);
        $$ = resFn4;
    }
;

parametros
    : parametros ',' parametro
    {
//        let Params1 = new NodoGraphviz("node_"+nodoActual , '[label="parametros"];\n', [$1.id] );
//        nodoActual++;
        let Params2 = new NodoGraphviz("node_"+nodoActual , '[label="parametro"];\n', [$3.id]);
        nodoActual++;                
        let resParams = new NodoGraphviz("node_"+nodoActual , '[label="parametros"];\n', [$1.id , Params2.id] );
        nodoActual++;        
        listaNodos.push($1);
//        listaNodos.push(Params1);
        listaNodos.push(Params2);
        $$ = resParams;
    }
    | parametro
    {
        let paramParams = new NodoGraphviz("node_"+nodoActual , '[label="parametros"];\n', [$1.id] );
        nodoActual++;
        $$ = paramParams ;                                      
    }
;

parametro
    : 'ID' ':' tipo corchetes
    {
        let paramId = new NodoGraphviz("node_"+nodoActual , '[label="'+$1+'"];\n', [] );
        nodoActual++;                         
        let dsptsParam = new NodoGraphviz("node_"+nodoActual , '[label="'+$2+'"];\n', [] );
        nodoActual++;                                 
        let paramTipo = new NodoGraphviz("node_"+nodoActual , '[label="tipo"];\n', [$3.id] );
        nodoActual++;                                 
        let paramCorch= new NodoGraphviz("node_"+nodoActual , '[label="ListaCorchetes"];\n', [$4.id] );
        nodoActual++;                                 

        let resParam = new NodoGraphviz("node_"+nodoActual , '[label="parametro"];\n', [paramId.id , dsptsParam.id, paramTipo.id, paramCorch.id] );
        nodoActual++;                         

        listaNodos.push(paramId);
        listaNodos.push(dsptsParam);
        listaNodos.push(paramTipo);
        listaNodos.push(paramCorch);
        listaNodos.push(resParam);
        $$ = resParam;
    }
    | 'ID' ':' tipo 
    {
        let paramId2 = new NodoGraphviz("node_"+nodoActual , '[label="'+$1+'"];\n', [] );
        nodoActual++;                         
        let dsptsParam2 = new NodoGraphviz("node_"+nodoActual , '[label="'+$2+'"];\n', [] );
        nodoActual++;                                 
        let paramTipo2 = new NodoGraphviz("node_"+nodoActual , '[label="tipo"];\n', [$3.id] );
        nodoActual++;                                   

        let resParam2 = new NodoGraphviz("node_"+nodoActual , '[label="parametro"];\n', [paramId2.id , dsptsParam2.id, paramTipo2.id]);
        nodoActual++;                         

        listaNodos.push(paramId2);
        listaNodos.push(dsptsParam2);
        listaNodos.push(paramTipo2);
        listaNodos.push(resParam2);
        $$ = resParam2;        
    }
;


/*==============================================================================================================*/
/*==============================================================================================================*/
/*==============================================================================================================*/
/*----------------------------------------Expresiones Aritmeticas y Logicas--------------------------------------*/
/*==============================================================================================================*/
/*==============================================================================================================*/
/*==============================================================================================================*/
Expr
    : '-' Expr %prec UMENOS
    {
        let opNeg = new NodoGraphviz("node_"+nodoActual , '[label="'+$1+'"];\n', [] );
        nodoActual++;
        listaNodos.push(opNeg);
        listaNodos.push($2);
        let expNeg = new NodoGraphviz("node_"+nodoActual , '[label="Expr"];\n', [opNeg.id , $2.id]);
        nodoActual++;        
        $$ = expNeg;        
    }
    | Expr '**' Expr
    {
        listaNodos.push($1);
        let opPot = new NodoGraphviz("node_"+nodoActual , '[label="'+$2+'"];\n', [] );
        nodoActual++;
        listaNodos.push(opPot);
        listaNodos.push($3);
        let expPot = new NodoGraphviz("node_"+nodoActual , '[label="Expr"];\n', [$1.id , opPot.id , $3.id]);
        nodoActual++;        
        $$ = expPot;                        
    }
    | Expr '+' Expr
    {
        listaNodos.push($1);
        let opSum = new NodoGraphviz("node_"+nodoActual , '[label="'+$2+'"];\n', [] );
        nodoActual++;
        listaNodos.push(opSum);
        listaNodos.push($3);
        let expSum = new NodoGraphviz("node_"+nodoActual , '[label="Expr"];\n', [$1.id , opSum.id , $3.id]);
        nodoActual++;        
        $$ = expSum;        
    }
    | Expr '-' Expr
    {
        listaNodos.push($1);
        let opRes = new NodoGraphviz("node_"+nodoActual , '[label="'+$2+'"];\n', [] );
        nodoActual++;
        listaNodos.push(opRes);
        listaNodos.push($3);
        let expRes = new NodoGraphviz("node_"+nodoActual , '[label="Expr"];\n', [$1.id , opRes.id , $3.id]);
        nodoActual++;        
        $$ = expRes;        
    }
    | Expr '*' Expr
    {
        listaNodos.push($1);
        let opMul = new NodoGraphviz("node_"+nodoActual , '[label="'+$2+'"];\n', [] );
        nodoActual++;
        listaNodos.push(opMul);
        listaNodos.push($3);
        let expMul = new NodoGraphviz("node_"+nodoActual , '[label="Expr"];\n', [$1.id , opMul.id , $3.id]);
        nodoActual++;        
        $$ = expMul;        
    }
    | Expr '%' Expr
    {
        listaNodos.push($1);
        let opMod = new NodoGraphviz("node_"+nodoActual , '[label="'+$2+'"];\n', [] );
        nodoActual++;
        listaNodos.push(opMod);
        listaNodos.push($3);
        let expMod = new NodoGraphviz("node_"+nodoActual , '[label="Expr"];\n', [$1.id , opMod.id , $3.id]);
        nodoActual++;        
        $$ = expMod;        
    }
    | Expr '/' Expr
    {
        listaNodos.push($1);
        let opDiv = new NodoGraphviz("node_"+nodoActual , '[label="'+$2+'"];\n', [] );
        nodoActual++;
        listaNodos.push(opDiv);
        listaNodos.push($3);
        let expDiv = new NodoGraphviz("node_"+nodoActual , '[label="Expr"];\n', [$1.id , opDiv.id , $3.id]);
        nodoActual++;        
        $$ = expDiv;        
    }
    | Expr '<' Expr
    {
        listaNodos.push($1);
        let opMen = new NodoGraphviz("node_"+nodoActual , '[label="'+$2+'"];\n', [] );
        nodoActual++;
        listaNodos.push(opMen);
        listaNodos.push($3);
        let expMen = new NodoGraphviz("node_"+nodoActual , '[label="Expr"];\n', [$1.id , opMen.id , $3.id]);
        nodoActual++;        
        $$ = expMen;        
    }
    | Expr '<=' Expr
    {
        listaNodos.push($1);
        let opMenIg = new NodoGraphviz("node_"+nodoActual , '[label="'+$2+'"];\n', [] );
        nodoActual++;
        listaNodos.push(opMenIg);
        listaNodos.push($3);
        let expMenIg = new NodoGraphviz("node_"+nodoActual , '[label="Expr"];\n', [$1.id , opMenIg.id , $3.id]);
        nodoActual++;        
        $$ = expMenIg;         
    }
    | Expr '>' Expr
    {
        listaNodos.push($1);
        let opMay = new NodoGraphviz("node_"+nodoActual , '[label="'+$2+'"];\n', [] );
        nodoActual++;
        listaNodos.push(opMay);
        listaNodos.push($3);
        let expMay = new NodoGraphviz("node_"+nodoActual , '[label="Expr"];\n', [$1.id , opMay.id , $3.id]);
        nodoActual++;        
        $$ = expMay;         
    }
    | Expr '>=' Expr
    {
        listaNodos.push($1);
        let opMayIg = new NodoGraphviz("node_"+nodoActual , '[label="'+$2+'"];\n', [] );
        nodoActual++;
        listaNodos.push(opMayIg);
        listaNodos.push($3);
        let expMayIg = new NodoGraphviz("node_"+nodoActual , '[label="Expr"];\n', [$1.id , opMayIg.id , $3.id]);
        nodoActual++;        
        $$ = expMayIg;        
    }
    | Expr '==' Expr
    {
        listaNodos.push($1);
        let opIgIg = new NodoGraphviz("node_"+nodoActual , '[label="'+$2+'"];\n', [] );
        nodoActual++;
        listaNodos.push(opIgIg);
        listaNodos.push($3);
        let expIgIg = new NodoGraphviz("node_"+nodoActual , '[label="Expr"];\n', [$1.id , opIgIg.id , $3.id]);
        nodoActual++;        
        $$ = expIgIg;        
    }
    | Expr '!=' Expr
    {
        listaNodos.push($1);
        let opDif = new NodoGraphviz("node_"+nodoActual , '[label="'+$2+'"];\n', [] );
        nodoActual++;
        listaNodos.push(opDif);
        listaNodos.push($3);
        let expDif = new NodoGraphviz("node_"+nodoActual , '[label="Expr"];\n', [$1.id , opDif.id , $3.id]);
        nodoActual++;        
        $$ = expDif;        
    }
    | Expr '&&' Expr
    {
        listaNodos.push($1);
        let opAnd = new NodoGraphviz("node_"+nodoActual , '[label="'+$2+'"];\n', [] );
        nodoActual++;
        listaNodos.push(opAnd);
        listaNodos.push($3);
        let expAnd = new NodoGraphviz("node_"+nodoActual , '[label="Expr"];\n', [$1.id , opAnd.id , $3.id]);
        nodoActual++;        
        $$ = expAnd;        
    }
    | Expr '||' Expr
    {
        listaNodos.push($1);
        let opOr = new NodoGraphviz("node_"+nodoActual , '[label="'+$2+'"];\n', [] );
        nodoActual++;
        listaNodos.push(opOr);
        listaNodos.push($3);
        let expOr = new NodoGraphviz("node_"+nodoActual , '[label="Expr"];\n', [$1.id , opOr.id , $3.id]);
        nodoActual++;        
        $$ = expOr;        
    }
    | '!' Expr
    {
        let opNot = new NodoGraphviz("node_"+nodoActual , '[label="'+$1+'"];\n', [] );
        nodoActual++;
        listaNodos.push(opNot);
        listaNodos.push($2);
        let expNot = new NodoGraphviz("node_"+nodoActual , '[label="Expr"];\n', [opNot.id , $2.id]);
        nodoActual++;        
        $$ = expNot;          
    }
    | F
    { 
        let f= new NodoGraphviz("node_"+nodoActual , '[label="F"];\n', [$1.id] );
        nodoActual++;
        listaNodos.push(f);
        let fExpr = new NodoGraphviz("node_"+nodoActual , '[label="Expr"];\n', [f.id] );
        nodoActual++;                
        $$ = fExpr;
    }
;


F   : '(' Expr ')'
    {
        let ptrparamsParExp = [];
        let fparIzq = new NodoGraphviz("node_"+nodoActual , '[label="("];\n', [] );
        ptrparamsParExp.push(fparIzq.id);
        listaNodos.push(fparIzq);
        nodoActual++;
        ptrparamsParExp.push($2.id);
        listaNodos.push($2);
        let fparder = new NodoGraphviz("node_"+nodoActual , '[label=")"];\n', [] );        
        ptrparamsParExp.push(fparder.id);
        nodoActual++;
        listaNodos.push(fparder);        
        let fParenExp = new NodoGraphviz("node_"+nodoActual , '[label="Exp"];\n', ptrparamsParExp );
        listaNodos.push(fParenExp);
        nodoActual++;        
        $$ = fParenExp;        
    }
    | 'DECIMAL'
    {
        let fDecimal = new NodoGraphviz("node_"+nodoActual , '[label="'+$1+'"];\n', [] );
        listaNodos.push(fDecimal);
        nodoActual++;        
        $$ = fDecimal;
    }
    | 'ENTERO'
    {
        let fEntero = new NodoGraphviz("node_"+nodoActual , '[label="'+$1+'"];\n', [] );
        listaNodos.push(fEntero);
        nodoActual++;        
        $$ = fEntero;
    }
    | 'CADENA'
    {
        let fCadena = new NodoGraphviz("node_"+nodoActual , '[label="'+$1+'"];\n', [] );
        listaNodos.push(fCadena);
        nodoActual++;        
        $$ = fCadena;

    }
    | 'CADENASIM'
    {
        let fCadenaSim = new NodoGraphviz("node_"+nodoActual , '[label="'+$1+'"];\n', [] );
        listaNodos.push(fCadenaSim);
        nodoActual++;        
        $$ = fCadenaSim;
    }
    | 'TRUE'
    {
        let fTrue = new NodoGraphviz("node_"+nodoActual , '[label="'+$1+'"];\n', [] );
        listaNodos.push(fTrue);
        nodoActual++;        
        $$ = fTrue;        
    }
    | 'FALSE'
    {
        let fFalse = new NodoGraphviz("node_"+nodoActual , '[label="'+$1+'"];\n', [] );
        listaNodos.push(fFalse);
        nodoActual++;        
        $$ = fFalse;
    }
    | 'NULL'
    {
        let fNull = new NodoGraphviz("node_"+nodoActual , '[label="'+$1+'"];\n', [] );
        listaNodos.push(fNull);
        nodoActual++;        
        $$ = fNull;
    }
    | Length     
    | llamadaFuncion    
    | 'ID' accesos
    {
        let fidAcs = new NodoGraphviz("node_"+nodoActual , '[label="'+$1+'"];\n', [] );
        nodoActual++;
        listaNodos.push(fidAcs);
        let resfAcs = new NodoGraphviz("node_"+nodoActual , '[label="accesos"];\n', [fidAcs.id, $2.id]);
        nodoActual++;
        listaNodos.push(resfAcs);
        listaNodos.push($2);
        $$ = resfAcs;        

    }
    | 'ID' '++'
    {
        let increExp = new NodoGraphviz("node_"+nodoActual , '[label="'+$1+'"];\n', [] );
        listaNodos.push(increExp);
        nodoActual++;
        let masmasExp = new NodoGraphviz("node_"+nodoActual , '[label="++"];\n', [] );
        listaNodos.push(masmasExp);
        nodoActual++;        
        let incrementoExp = new NodoGraphviz("node_"+nodoActual , '[label="Incremento"];\n', [increExp.id, masmasExp.id] );
        listaNodos.push(incrementoExp);
        nodoActual++;        
        $$ = incrementoExp;        
    }
    | 'ID' '--'
    {
        let decrExp = new NodoGraphviz("node_"+nodoActual , '[label="'+$1+'"];\n', [] );
        listaNodos.push(decrExp);
        nodoActual++;        
        let menmenExp = new NodoGraphviz("node_"+nodoActual , '[label="--"];\n', [] );
        listaNodos.push(menmenExp);
        nodoActual++;        
        let decrementoExp = new NodoGraphviz("node_"+nodoActual , '[label="Decremento"];\n', [decrExp.id , menmenExp.id] );
        listaNodos.push(decrementoExp);
        nodoActual++;        
        $$ = decrementoExp;
    }
    | '[' paramsExp ']'
    {
        let ptrparamsExp = [];
        let fcorIzq = new NodoGraphviz("node_"+nodoActual , '[label="["];\n', [] );
        ptrparamsExp.push(fcorIzq.id);
        listaNodos.push(fcorIzq);
        nodoActual++;
        for(let i = 0; i < $2.length; i++){
            ptrparamsExp.push($2[i].id);
            listaNodos.push($2[i]);
        }
        let fcorder = new NodoGraphviz("node_"+nodoActual , '[label="]"];\n', [] );        
        ptrparamsExp.push(fcorder.id);
        nodoActual++;
        listaNodos.push(fcorder);        
        let fParamExp = new NodoGraphviz("node_"+nodoActual , '[label="arreglo"];\n', ptrparamsExp );
        listaNodos.push(fParamExp);
        nodoActual++;        
        $$ = fParamExp;
    }
    | 'ID'
    { 
        let fID = new NodoGraphviz("node_"+nodoActual , '[label="'+$1+'"];\n', [] );
        listaNodos.push(fID);
        nodoActual++;        
        $$ = fID;
    }
;

accesos
    : accesos acceso
    {
        let Acc = new NodoGraphviz("node_"+nodoActual , '[label="accesos"];\n', [$1.id]);
        nodoActual++;                
        let Acc2 = new NodoGraphviz("node_"+nodoActual , '[label="acceso"];\n', [$2.id]);
        nodoActual++;                        
        let resAccesos = new NodoGraphviz("node_"+nodoActual , '[label="accesos"];\n', [Acc.id , Acc2.id]);
        nodoActual++;                        
        listaNodos.push(Acc);
        listaNodos.push($1);
        listaNodos.push(Acc2);
        listaNodos.push($2);
        $$ = resAccesos;
    }
    | acceso
;

acceso
    : '.' 'ID'
    {
        let ptAc = new NodoGraphviz("node_"+nodoActual , '[label="."];\n', [] );
        nodoActual++;
        let idAc = new NodoGraphviz("node_"+nodoActual , '[label="'+$2+'"];\n', [] );
        nodoActual++;
        let resAc2 = new NodoGraphviz("node_"+nodoActual , '[label="acceso"];\n', [ptAc.id , idAc.id] );
        nodoActual++;
        listaNodos.push(ptAc);
        listaNodos.push(idAc);
        $$ = resAc2;        
    }
    | '[' Expr ']'
    {
        let corchAc = new NodoGraphviz("node_"+nodoActual , '[label="["];\n', [] );
        nodoActual++;
        let corchAc2 = new NodoGraphviz("node_"+nodoActual , '[label="]"];\n', [] );
        nodoActual++;
        let resAc = new NodoGraphviz("node_"+nodoActual , '[label="acceso"];\n', [corchAc.id , $2.id , corchAc2.id] );
        nodoActual++;
        listaNodos.push(corchAc);
        listaNodos.push($2);
        listaNodos.push(corchAc2);
        $$ = resAc;        
    }
;

llamadaFuncion
    : 'ID' '(' paramsExp ')' 
    {
        let ptrsLLamada = [];        
        let idLlam = new NodoGraphviz("node_"+nodoActual , '[label="'+$1+'"];\n', [] );
        nodoActual++;
        ptrsLLamada.push(idLlam.id);
        listaNodos.push(idLlam);
        let paraLlam = new NodoGraphviz("node_"+nodoActual , '[label="("];\n', [] );
        nodoActual++;
        listaNodos.push(paraLlam);
        ptrsLLamada.push(paraLlam.id);
        for(let i = 0; i < $3.length; i++){
            ptrsLLamada.push($3[i].id);
            listaNodos.push($3[i]);
        }
        let parcLlam = new NodoGraphviz("node_"+nodoActual , '[label=")"];\n', [] );        
        ptrsLLamada.push(parcLlam.id);
        listaNodos.push(parcLlam);
        nodoActual++;        
        let resLLam = new NodoGraphviz("node_"+nodoActual , '[label="LlamadaFuncion"];\n', ptrsLLamada );
        listaNodos.push(resLLam);
        nodoActual++;        
        $$ = resLLam;        
    }    
    | 'ID' '('  ')' 
    {        
        let idLlam2 = new NodoGraphviz("node_"+nodoActual , '[label="'+$1+'"];\n', [] );
        nodoActual++;        
        let paraLlam2 = new NodoGraphviz("node_"+nodoActual , '[label="("];\n', [] );
        nodoActual++;
        let parcLlam2 = new NodoGraphviz("node_"+nodoActual , '[label=")"];\n', [] );        
        nodoActual++;        
        let resLLam2 = new NodoGraphviz("node_"+nodoActual , '[label="LlamadaFuncion"];\n', [idLlam2.id , paraLlam2.id , parcLlam2.id] );
        nodoActual++; 

        listaNodos.push(idLlam2);
        listaNodos.push(paraLlam2);
        listaNodos.push(parcLlam2);
        listaNodos.push(resLLam2);       
        $$ = resLLam2;                
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


/*=====================================================================================================*/
/*=====================================================================================================*/
/*=====================================================================================================*/
/*----------------------------------------- TYPES -----------------------------------------------------*/
/*=====================================================================================================*/
/*=====================================================================================================*/
/*=====================================================================================================*/

Type
    : 'TYPE' 'ID' '=' '{' decla_atr_type '}'
    {
        let instType = new NodoGraphviz("node_"+nodoActual , '[label="type"];\n', []);
        nodoActual++;                
        let idType = new NodoGraphviz("node_"+nodoActual , '[label="'+$2+'"];\n', []);
        nodoActual++;                        
        let igType = new NodoGraphviz("node_"+nodoActual , '[label="="];\n', []);
        nodoActual++;                        
        let llaveaType = new NodoGraphviz("node_"+nodoActual , '[label="{"];\n', []);
        nodoActual++;                                
        let llavecType = new NodoGraphviz("node_"+nodoActual , '[label="}"];\n', []);
        nodoActual++;
        let aptrType = [instType.id , idType.id , igType.id, llaveaType.id, $5.id, llavecType.id];
        let resType = new NodoGraphviz("node_"+nodoActual , '[label="Type"];\n', aptrType);
        nodoActual++;                                                        
        listaNodos.push(instType);
        listaNodos.push(idType);
        listaNodos.push(igType);
        listaNodos.push(llaveaType);
        listaNodos.push($5);
        listaNodos.push(llavecType);
        $$ = resType;        
    }
;


decla_atr_type
    : decla_atr_type ',' atr_type
    {
        let AccT = new NodoGraphviz("node_"+nodoActual , '[label="AtributosType"];\n', [$1.id]);
        nodoActual++;                                      
        let resAtribType = new NodoGraphviz("node_"+nodoActual , '[label="AtributosType"];\n', [AccT.id , $3.id]);
        nodoActual++;                        
        listaNodos.push(AccT);
        listaNodos.push($1);
//        listaNodos.push(AccT2);
        listaNodos.push($3);
        $$ = resAtribType;        
    }
    | atr_type
;

atr_type
    : 'ID' ':' tipo
    {
        let idAtrType = new NodoGraphviz("node_"+nodoActual , '[label="'+$1+'"];\n', [] );
        nodoActual++;        
        let dsptsAtrType = new NodoGraphviz("node_"+nodoActual , '[label=":"];\n', [] );
        nodoActual++;        
        let tipoAtrType = new NodoGraphviz("node_"+nodoActual , '[label="tipo"];\n', [$3.id] );
        nodoActual++;
        let resAtrType = new NodoGraphviz("node_"+nodoActual , '[label="Atr_Type"];\n', [idAtrType.id , dsptsAtrType.id , tipoAtrType.id] );
        nodoActual++;
        listaNodos.push(idAtrType);
        listaNodos.push(dsptsAtrType);
        listaNodos.push(tipoAtrType);
        $$ = resAtrType;                
    }
;


atributosType
    : atributosType ',' atribType
    {
        let AccT2 = new NodoGraphviz("node_"+nodoActual , '[label="AtributosType"];\n', [$1.id]);
        nodoActual++;                                      
        let resAtribType2 = new NodoGraphviz("node_"+nodoActual , '[label="AtributosType"];\n', [AccT2.id , $3.id]);
        nodoActual++;                        
        listaNodos.push(AccT2);
        listaNodos.push($1);
//        listaNodos.push(AccT2);
        listaNodos.push($3);
        $$ = resAtribType2;           
    }
    | atribType
;

atribType
    : 'ID' ':' Expr
    {
        let idAtribType = new NodoGraphviz("node_"+nodoActual , '[label="'+$1+'"];\n', [] );
        nodoActual++;        
        let dsptsAtribType = new NodoGraphviz("node_"+nodoActual , '[label=":"];\n', [] );
        nodoActual++;        
        let resAtribbType = new NodoGraphviz("node_"+nodoActual , '[label="Atr_Type"];\n', [idAtribType.id , dsptsAtribType.id , $3.id] );
        nodoActual++;
        listaNodos.push(idAtribType);
        listaNodos.push(dsptsAtribType);
        listaNodos.push($3);
        $$ = resAtribbType;        
    }
;



ternario
    :  Expr '?' Expr ':' Expr
    {
        let simbTer = new NodoGraphviz("node_"+nodoActual , '[label="?"];\n', [] );
        nodoActual++;         
        let dosptsTer = new NodoGraphviz("node_"+nodoActual , '[label=":"];\n', [] );
        nodoActual++;                 
        let ptrsTernario = [$1.id, simbTer.id, $3.id, dosptsTer.id, $5.id];
        let resTer = new NodoGraphviz("node_"+nodoActual , '[label="ternario"];\n', ptrsTernario );
        nodoActual++;                         
        listaNodos.push($1);
        listaNodos.push(simbTer);
        listaNodos.push($3);
        listaNodos.push(dosptsTer);
        listaNodos.push($5);
        $$ = resTer;     
    }
;


//TODO fors
//TODO push, pop
