import { networkInterfaces } from 'os';
import { Entorno } from "../TablaSimbolos/Entorno";
import { Generator } from "./Generator";

export class FuncionesNativas{

    public constructor(){

    }

    public toUpper(){
        const generator = Generator.getInstance();
        // Generar etiqueta para simular for 
        const lblCiclo = generator.newLabel();
        // Etiqueta para hacer cambio a mayusculas
        const lblOperacion = generator.newLabel();
        // Etiqueta para incrementar puntero y simular ciclo
        const lblIncremento = generator.newLabel();
        // Etiqueta de salida
        const lblExit = generator.newLabel();
        // Temporal para acceder al parametro
        const param = generator.newTemporal();
        // Generar temporal para obtener la posicion de heap
        const punteroHeap = generator.newTemporal();
        // Generar temporal para guardar el acceso a heap
        const accesoHeap = generator.newTemporal();

        // Acceder al 'parametro' ( string a afectar )
        generator.addExpression(param, 'p', 0, '+');
        // Acceder a la posicion inicial del string
        generator.addGetStack(punteroHeap, param);
        // Imprimir etiqueta inicial
        generator.addLabel(lblCiclo);
        // Obtener el valor de heap
        generator.addGetHeap(accesoHeap, punteroHeap);
        // Comparar si es fin de cadena
        generator.addIf(accesoHeap, '-1', '==', lblExit);
        // Comparar si es letra
        generator.addIf(accesoHeap, '97', '<', lblIncremento);
        generator.addIf(accesoHeap, '122', '>', lblIncremento);
        // Imprimir sentencias TO UPPER
        generator.addLabel(lblOperacion);
        // Restar 32 para obtener ascii de la mayuscula
        generator.addExpression(accesoHeap, accesoHeap, '32', '-');
        // Asignar a heap su nuevo valor
        generator.addSetHeap(punteroHeap, accesoHeap);
        // Imprimir etiqueta incremento
        generator.addLabel(lblIncremento);
        // Aumentar puntero a heap y repetir ciclo
        generator.addExpression(punteroHeap, punteroHeap, '1', '+');
        generator.addGoto(lblCiclo);
        // Imprimir salida
        generator.addLabel(lblExit);
    }


    public toLower(){
        const generator = Generator.getInstance();
        // Generar etiqueta para simular for 
        const lblCiclo = generator.newLabel();
        // Etiqueta para hacer cambio a mayusculas
        const lblOperacion = generator.newLabel();
        // Etiqueta para incrementar puntero y simular ciclo
        const lblIncremento = generator.newLabel();
        // Etiqueta de salida
        const lblExit = generator.newLabel();
        // Temporal para acceder al parametro
        const param = generator.newTemporal();
        // Generar temporal para obtener la posicion de heap
        const punteroHeap = generator.newTemporal();
        // Generar temporal para guardar el acceso a heap
        const accesoHeap = generator.newTemporal();

        // Acceder al 'parametro' ( string a afectar )
        generator.addExpression(param, 'p', 0, '+');
        // Acceder a la posicion inicial del string
        generator.addGetStack(punteroHeap, param);
        // Imprimir etiqueta inicial
        generator.addLabel(lblCiclo);
        // Obtener el valor de heap
        generator.addGetHeap(accesoHeap, punteroHeap);
        // Comparar si es fin de cadena
        generator.addIf(accesoHeap, '-1', '==', lblExit);
        // Comparar si es letra
        generator.addIf(accesoHeap, '65', '<', lblIncremento);
        generator.addIf(accesoHeap, '90', '>', lblIncremento);
        // Imprimir sentencias TO UPPER
        generator.addLabel(lblOperacion);
        // Restar 32 para obtener ascii de la mayuscula
        generator.addExpression(accesoHeap, accesoHeap, '32', '+');
        // Asignar a heap su nuevo valor
        generator.addSetHeap(punteroHeap, accesoHeap);
        // Imprimir etiqueta incremento
        generator.addLabel(lblIncremento);
        // Aumentar puntero a heap y repetir ciclo
        generator.addExpression(punteroHeap, punteroHeap, '1', '+');
        generator.addGoto(lblCiclo);
        // Imprimir salida
        generator.addLabel(lblExit);
    }
    
    
    public getChar(){
        const generator = Generator.getInstance();


        generator.inicioMetodo();   
        generator.nombreMetodo("charAt");     


        // Temporal para acceder al primer parametro (pos. inicial string)
        const param1 = generator.newTemporal();
        generator.addExpression(param1, 'p', '0', '+');
        // Acceder y guardar el valor
        const punteroHeap = generator.newTemporal();
        generator.addGetStack(punteroHeap, param1);

        // Temporal para almacenar indice al que se quiere acceder
        const param2 = generator.newTemporal();
        generator.addExpression(param2, 'p', '1', '+');
        // Acceder y guardar el valor
        const charIndex = generator.newTemporal();
        generator.addGetStack(charIndex, param2);
        
        // Temporal para controlar iteraciones
        const iterator = generator.newTemporal();
        generator.addExpression(iterator, '1');

        // Generar etiqueta para simular for 
        const lblCiclo = generator.newLabel();
        generator.addLabel(lblCiclo);

        // Generar temporal para guardar el acceso a heap
        const accesoHeap = generator.newTemporal();
        // Obtener el valor de heap
        generator.addGetHeap(accesoHeap, punteroHeap);

        // Etiqueta para retornar el char deseado
        const lblOperacion = generator.newLabel();
        // Etiqueta para incrementar puntero y simular ciclo
        const lblIncremento = generator.newLabel();
        // Etiqueta de salida
        const lblExit = generator.newLabel();

        // Comparar si es fin de cadena
        generator.addIf(accesoHeap, '-1', '==', lblExit);
        // Comparar si el indice es el buscado
        generator.addIf(iterator, charIndex, '==', lblOperacion);
        // Saltar a incremento de iterador
        generator.addGoto(lblIncremento);
        // Retornar el char
        generator.addLabel(lblOperacion);
        // Generar temporal para acceder a posicion de return
        const tempRet = generator.newTemporal();
        generator.addExpression(tempRet, 'p', '2', '+');
        generator.addSetStack(tempRet, accesoHeap);
        generator.addGoto(lblExit);

        // Etiqueta Incremento
        generator.addLabel(lblIncremento);
        generator.addExpression(punteroHeap, punteroHeap, '1', '+');
        generator.addExpression(iterator, iterator, '1', '+');
        generator.addGoto(lblCiclo);
        // Imprimir salida
        generator.addLabel(lblExit);  
        
        generator.returnMetodo();        
        generator.finMetodo();        
        
    }

    public strLength(){
        const generator = Generator.getInstance();
        // Temporal para acceder al primer parametro (pos. inicial string)
        const param1 = generator.newTemporal();
        generator.addExpression(param1, 'p', '0', '+');
        // Acceder y guardar el valor
        const punteroHeap = generator.newTemporal();
        generator.addGetStack(punteroHeap, param1);
       
        // Temporal para controlar iteraciones
        const iterator = generator.newTemporal();
        generator.addExpression(iterator, '1');

        // Generar etiqueta para simular for 
        const lblCiclo = generator.newLabel();
        generator.addLabel(lblCiclo);

        // Generar temporal para guardar el acceso a heap
        const accesoHeap = generator.newTemporal();
        // Obtener el valor de heap
        generator.addGetHeap(accesoHeap, punteroHeap);

        // Etiqueta para retornar el char deseado
        const lblOperacion = generator.newLabel();
        // Etiqueta para incrementar puntero y simular ciclo
        const lblIncremento = generator.newLabel();
        // Etiqueta de salida
        const lblExit = generator.newLabel();

        // Comparar si es fin de cadena
        generator.addIf(accesoHeap, '-1', '==', lblOperacion);
        // Saltar a incremento de iterador
        generator.addGoto(lblIncremento);
        // Retornar el tamanio
        generator.addLabel(lblOperacion);
        // Generar temporal para acceder a posicion de return
        const tempRet = generator.newTemporal();
        generator.addExpression(tempRet, 'p', '2', '+');
        generator.addSetStack(tempRet, iterator);
        generator.addGoto(lblExit);

        // Etiqueta Incremento
        generator.addLabel(lblIncremento);
        generator.addExpression(punteroHeap, punteroHeap, '1', '+');
        generator.addExpression(iterator, iterator, '1', '+');
        generator.addGoto(lblCiclo);
        // Imprimir salida
        generator.addLabel(lblExit);  
    }

    public concat(){
        const generator = Generator.getInstance();

        generator.inicioMetodo();   
        generator.nombreMetodo("concat_str_str");     

        // Temporal para acceder al primer parametro (pos. inicial string)
        const param1 = generator.newTemporal();
        generator.addExpression(param1, 'p', '0', '+');
        // Acceder y guardar el valor
        const punteroHeap = generator.newTemporal();
        generator.addGetStack(punteroHeap, param1);

        // Posicion inicial del segundo string
        const param2 = generator.newTemporal();
        generator.addExpression(param2, 'p', '1', '+');
        // Acceder y guardar el valor
        const punteroHeap2 = generator.newTemporal();
        generator.addGetStack(punteroHeap2, param2);
        // Almacenar el puntero a heap antes de inicial
        const heapActual = generator.newTemporal();
        generator.addExpression(heapActual, 'h');
    
/*
        // Generar etiqueta para simular for 
        const lblCiclo = generator.newLabel();
        generator.addLabel(lblCiclo);
*/
        // Generar temporal para guardar el acceso a heap para primer string
        const accesoHeap = generator.newTemporal();
        // Generar temporal para guardar el acceso a heap para segundo string
        const accesoHeap2 = generator.newTemporal();        

        // Etiqueta para escribir primer string
        const lblStr1 = generator.newLabel();
        // Etiqueta para escribir segundo string
        const lblStr2 = generator.newLabel();        
        // Etiqueta de salida
        const lblExit = generator.newLabel();

        // Primera comparacion
        generator.addLabel(lblStr1);
        // Obtener el valor de heap
        generator.addGetHeap(accesoHeap, punteroHeap);        
        // Comparar si es fin de cadena
        generator.addIf(accesoHeap, '-1', '==', lblStr2);
        // Ejecutar loop 1
        generator.addSetHeap('h', accesoHeap);
        generator.nextHeap();
        generator.addExpression(punteroHeap, punteroHeap, '1', '+');
        generator.addGoto(lblStr1);

        // Segunda Comparacion
        generator.addLabel(lblStr2);
        // Obtener el valor de heap2
        generator.addGetHeap(accesoHeap2, punteroHeap2);

        // Comparar si es fin de cadena
        generator.addIf(accesoHeap2, '-1', '==', lblExit);
        // Ejecutar loop 2
        generator.addSetHeap('h', accesoHeap2);
        generator.nextHeap();
        generator.addExpression(punteroHeap2, punteroHeap2, '1', '+');
        generator.addGoto(lblStr2);

        // Imprimir salida        
        generator.addLabel(lblExit);          

        // Guardar retorno
        generator.addSetHeap('h', -1);
        generator.nextHeap();
        const tempRet = generator.newTemporal();
        generator.addExpression(tempRet, 'p', '2', '+');
        generator.addSetStack(tempRet, heapActual);


        generator.returnMetodo();        
        generator.finMetodo();                
    }



    public concat_str_int(){
        const generator = Generator.getInstance();

        generator.inicioMetodo();   
        generator.nombreMetodo("concat_str_number");     


        // Temporal para acceder al primer parametro (pos. inicial string)
        const param1 = generator.newTemporal();
        generator.addExpression(param1, 'p', '0', '+');
        // Acceder y guardar el valor
        const punteroHeap = generator.newTemporal();
        generator.addGetStack(punteroHeap, param1);

        // Posicion inicial del entero
        const param2 = generator.newTemporal();
        generator.addExpression(param2, 'p', '1', '+');
        // Acceder y guardar el valor
        const valorEntero = generator.newTemporal();
        generator.addGetStack(valorEntero, param2);
        // Almacenar el puntero a heap antes de inicial
        const heapActual = generator.newTemporal();
        generator.addExpression(heapActual, 'h');
    
        // Generar temporal para guardar el acceso a heap para primer string
        const accesoHeap = generator.newTemporal();


        // Etiqueta para escribir primer string
        const lblStr1 = generator.newLabel();
        // Etiqueta de salida
        const lblExit = generator.newLabel();

        // Primera comparacion
        generator.addLabel(lblStr1);
        // Obtener el valor de heap
        generator.addGetHeap(accesoHeap, punteroHeap);        
        // Comparar si es fin de cadena
        generator.addIf(accesoHeap, '-1', '==', lblExit);
        // Ejecutar loop 1
        generator.addSetHeap('h', accesoHeap);
        generator.nextHeap();
        generator.addExpression(punteroHeap, punteroHeap, '1', '+');
        generator.addGoto(lblStr1);

        // Imprimir salida        
        generator.addLabel(lblExit);          
 //       generator.addExpression(valorEntero, valorEntero, '48', '+');
        // Guardar retorno

        // Cambio de ambito
        generator.addNextEnv(3);
        const tempParam = generator.newTemporal();
        // Pasar como parametro el numero a concatenar
        generator.addExpression(tempParam , 'p');
        generator.addSetStack(tempParam, valorEntero);
        generator.llamadaFuncion("number_to_string");
//        generator.addSetHeap('h', valorEntero);
//        generator.nextHeap();
        generator.addAntEnv(3);
        generator.addSetHeap('h', -1);
        generator.nextHeap();
        const tempRet = generator.newTemporal();
        generator.addExpression(tempRet, 'p', '2', '+');
        generator.addSetStack(tempRet, heapActual);

        generator.returnMetodo();        
        generator.finMetodo();        
    }


    public number_to_string() : string{

        let conversion = `
void number_to_string(){
int param1 = p + 0;    
int iterador = 0;
int asciiNumero = 0;    
char ascii;
int bandera = 0;        
double numero = Stack[param1];
double copia = numero;
int copia2 = (int)copia;
double verificacion = numero - copia2;
double vdecimales = 0;
if(verificacion == 0 ) goto CONTINUAR2;
if(copia < 0) goto NEGAR;
vdecimales = verificacion;
goto CONTINUAR;
NEGAR:
vdecimales = 0 -  verificacion;
CONTINUAR:
vdecimales = vdecimales * 100000;
CONTINUAR2:
        
if(numero > 0) goto CONVERTIR_ENTERO;
bandera = 1;
numero = 0 - numero;
        
CONVERTIR_ENTERO:
if(numero < 1) goto FIN;
asciiNumero = fmod(numero , 10);
asciiNumero = asciiNumero + '0';
numero = numero / 10;    
enteros[iterador] = asciiNumero;    
iterador= iterador + 1;
goto CONVERTIR_ENTERO;
        
FIN:
iterador = iterador - 1;
if(bandera == 0) goto CICLOPRINT;
iterador = iterador + 1;
enteros[iterador] = '-';
iterador = iterador + 1;
    
      
CICLOPRINT:
if(iterador < 0) goto DECIMAL;
ascii = enteros[iterador];
Heap[h] = ascii;
h = h + 1;
iterador = iterador - 1;
goto CICLOPRINT;
      
DECIMAL:
iterador = 0;
if(vdecimales == 0) goto SALIR;
CONVERTIR_DECIMAL:
if(vdecimales < 1) goto FIN2;
asciiNumero = fmod(vdecimales , 10);
asciiNumero = asciiNumero + '0';
vdecimales = vdecimales / 10;    
decimales[iterador] = asciiNumero;    
iterador= iterador + 1;
goto CONVERTIR_DECIMAL;
        
FIN2:
decimales[iterador] = '.';
iterador = iterador + 1;
iterador = iterador - 1;
        
      
CICLOPRINT2:
if(iterador < 0) goto SALIR;
ascii = decimales[iterador];
Heap[h] = ascii;
h = h + 1;
iterador = iterador - 1;
goto CICLOPRINT2;    
        
SALIR:
return;
}`;

        return conversion;
    }

    public concat_str_bool(){
        const generator = Generator.getInstance();

        generator.inicioMetodo();   
        generator.nombreMetodo("concat_str_bool");     

        // Temporal para acceder al primer parametro (pos. inicial string)
        const param1 = generator.newTemporal();
        generator.addExpression(param1, 'p', '0', '+');
        // Acceder y guardar el valor
        const punteroHeap = generator.newTemporal();
        generator.addGetStack(punteroHeap, param1);

        // Posicion inicial del segundo string
        const param2 = generator.newTemporal();
        generator.addExpression(param2, 'p', '1', '+');
        // Acceder y guardar el valor
        const valorBool = generator.newTemporal();
        generator.addGetStack(valorBool, param2);
        // Almacenar el puntero a heap antes de inicial
        const heapActual = generator.newTemporal();
        generator.addExpression(heapActual, 'h');

        // Generar temporal para guardar el acceso a heap para primer string
        const accesoHeap = generator.newTemporal();

        // Etiqueta para escribir primer string
        const lblStr1 = generator.newLabel();
        // Etiqueta para escribir segundo string
        const lblTrue = generator.newLabel();
        // Etiqueta para escribir segundo string
        const lblFalse = generator.newLabel();                
        // Etiqueta de salida
        const lblExit = generator.newLabel();

        // Primera comparacion
        generator.addLabel(lblStr1);
        // Obtener el valor de heap
        generator.addGetHeap(accesoHeap, punteroHeap);        
        // Comparar si es fin de cadena
        generator.addIf(accesoHeap, '-1', '==', lblTrue);
        // Ejecutar loop 1
        generator.addSetHeap('h', accesoHeap);
        generator.nextHeap();
        generator.addExpression(punteroHeap, punteroHeap, '1', '+');
        generator.addGoto(lblStr1);

        // Segunda Comparacion
        generator.addLabel(lblTrue);

        generator.addIf(valorBool, '0', '==', lblFalse);
        // Comparar si es fin de cadena
        generator.addSetHeap('h', 116); // t
        generator.nextHeap();
        generator.addSetHeap('h', 114); // r
        generator.nextHeap();
        generator.addSetHeap('h', 117); // u
        generator.nextHeap();
        generator.addSetHeap('h', 101); // e
        generator.nextHeap();
        generator.addGoto(lblExit);


        generator.addLabel(lblFalse);

        // Comparar si es fin de cadena
        generator.addSetHeap('h', 102); // f
        generator.nextHeap();
        generator.addSetHeap('h', 97); // a
        generator.nextHeap();
        generator.addSetHeap('h', 108); // l
        generator.nextHeap();
        generator.addSetHeap('h', 115); // s
        generator.nextHeap();
        generator.addSetHeap('h', 101); // e
        generator.nextHeap();        

        // Imprimir salida        
        generator.addLabel(lblExit);          

        // Guardar retorno
        generator.addSetHeap('h', -1);
        generator.nextHeap();
        const tempRet = generator.newTemporal();
        generator.addExpression(tempRet, 'p', '2', '+');
        generator.addSetStack(tempRet, heapActual);

        generator.returnMetodo();        
        generator.finMetodo();     
    }

    public concat_int_str(){
        const generator = Generator.getInstance();

        generator.inicioMetodo();   
        generator.nombreMetodo("concat_number_str");     


        // Temporal para acceder al primer parametro (pos. inicial string)
        const param1 = generator.newTemporal();
        generator.addExpression(param1, 'p', '0', '+');
        // Acceder y guardar el valor
        const valorEntero = generator.newTemporal();
        generator.addGetStack(valorEntero, param1);
        
        // Posicion inicial del entero
        const param2 = generator.newTemporal();
        generator.addExpression(param2, 'p', '1', '+');
        // Acceder y guardar el valor
        const punteroHeap = generator.newTemporal();
        generator.addGetStack(punteroHeap, param2);


        // Almacenar el puntero a heap antes de inicial
        const heapActual = generator.newTemporal();
        generator.addExpression(heapActual, 'h');
    
        // Generar temporal para guardar el acceso a heap para primer string
        const accesoHeap = generator.newTemporal();

    
        // Etiqueta para escribir primer string
        const lblStr1 = generator.newLabel();
        // Etiqueta de salida
        const lblExit = generator.newLabel();

        /* Conversion de numero a string */
        // Cambio de ambito
        generator.addNextEnv(3);
        const tempParam = generator.newTemporal();
        // Pasar como parametro el numero a concatenar
        generator.addExpression(tempParam , 'p');
        generator.addSetStack(tempParam, valorEntero);
        generator.llamadaFuncion("number_to_string");
//        generator.addSetHeap('h', valorEntero);
//        generator.nextHeap();
        generator.addAntEnv(3);



        // Primera comparacion
        generator.addLabel(lblStr1);
        // Obtener el valor de heap
        generator.addGetHeap(accesoHeap, punteroHeap);        
        // Comparar si es fin de cadena
        generator.addIf(accesoHeap, '-1', '==', lblExit);
        // Ejecutar loop 1
        generator.addSetHeap('h', accesoHeap);
        generator.nextHeap();
        generator.addExpression(punteroHeap, punteroHeap, '1', '+');
        generator.addGoto(lblStr1);

        // Imprimir salida        
        generator.addLabel(lblExit);
        generator.addSetHeap('h', -1);
        generator.nextHeap();

        const tempRet = generator.newTemporal();
        generator.addExpression(tempRet, 'p', '2', '+');
        generator.addSetStack(tempRet, heapActual);

        generator.returnMetodo();        
        generator.finMetodo();         
    }


    public concat_bool_str(){
        const generator = Generator.getInstance();

        generator.inicioMetodo();   
        generator.nombreMetodo("concat_str_bool");     

        // Temporal para acceder al primer parametro (valor booleano)
        const param1 = generator.newTemporal();
        generator.addExpression(param1, 'p', '0', '+');
        // Acceder y guardar el valor
        const valorBool = generator.newTemporal();
        generator.addGetStack(valorBool, param1);

        // Posicion inicial del segundo string
        const param2 = generator.newTemporal();
        generator.addExpression(param2, 'p', '1', '+');
        // Acceder y guardar el valor
        const punteroHeap = generator.newTemporal();
        generator.addGetStack(punteroHeap, param2);



        // Almacenar el puntero a heap antes de inicial
        const heapActual = generator.newTemporal();
        generator.addExpression(heapActual, 'h');

        // Generar temporal para guardar el acceso a heap para primer string
        const accesoHeap = generator.newTemporal();

        // Etiqueta para escribir primer string
        const lblStr1 = generator.newLabel();
        // Etiqueta para escribir segundo string
        const lblTrue = generator.newLabel();
        // Etiqueta para escribir segundo string
        const lblFalse = generator.newLabel();                
        // Etiqueta de salida
        const lblExit = generator.newLabel();


        // Escribir booleano 
        generator.addLabel(lblTrue);

        generator.addIf(valorBool, '0', '==', lblFalse);
        // Comparar si es fin de cadena
        generator.addSetHeap('h', 116); // t
        generator.nextHeap();
        generator.addSetHeap('h', 114); // r
        generator.nextHeap();
        generator.addSetHeap('h', 117); // u
        generator.nextHeap();
        generator.addSetHeap('h', 101); // e
        generator.nextHeap();
        generator.addGoto(lblExit);


        generator.addLabel(lblFalse);

        // Comparar si es fin de cadena
        generator.addSetHeap('h', 102); // f
        generator.nextHeap();
        generator.addSetHeap('h', 97); // a
        generator.nextHeap();
        generator.addSetHeap('h', 108); // l
        generator.nextHeap();
        generator.addSetHeap('h', 115); // s
        generator.nextHeap();
        generator.addSetHeap('h', 101); // e
        generator.nextHeap();        



        // Primera comparacion
        generator.addLabel(lblStr1);
        // Obtener el valor de heap
        generator.addGetHeap(accesoHeap, punteroHeap);        
        // Comparar si es fin de cadena
        generator.addIf(accesoHeap, '-1', '==', lblExit);
        // Ejecutar loop 1
        generator.addSetHeap('h', accesoHeap);
        generator.nextHeap();
        generator.addExpression(punteroHeap, punteroHeap, '1', '+');
        generator.addGoto(lblStr1);


        // Imprimir salida        
        generator.addLabel(lblExit);          

        // Guardar retorno
        generator.addSetHeap('h', -1);
        generator.nextHeap();
        const tempRet = generator.newTemporal();
        generator.addExpression(tempRet, 'p', '2', '+');
        generator.addSetStack(tempRet, heapActual);

        generator.returnMetodo();        
        generator.finMetodo();            
    }

}




















/*

// Acceder al valor inicial del string
    t2 = Stack[(int)T0];
// Buscar el valor en heap
    L0:
    t1 = Heap[(int)t2];
    if(t1 == -1) goto L3;
    if(t1<97) goto L2;
    if(t1>122) goto L2;
    
    L1:
    t1 = t1 -32;
    L2:
    printf("%c",(int)t1);
    t2 = t2 + 1;
    
    goto L0;
    L3:
    return 0;
    

*/