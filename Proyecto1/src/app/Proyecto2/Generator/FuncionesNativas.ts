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