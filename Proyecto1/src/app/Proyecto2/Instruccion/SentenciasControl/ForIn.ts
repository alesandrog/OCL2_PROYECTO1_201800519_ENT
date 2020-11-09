import { Instruccion } from "../../Abstract/Instruccion";
import { Tipo, Tipos } from "../../Util/Tipo";
import { Expresion } from "../../Abstract/Expresion";
import { Entorno } from "../../TablaSimbolos/Entorno";
import { Generator } from "../../Generator/Generator";
import { Error_ } from "../../Util/Error_";
import { DeclaracionFor } from '../Variables/DeclaracionFor';
import { IncrementoUnario } from '../Variables/IncrementoUnario';
import { Acceso } from '../../Expresion/Acceso/Acceso';
import { Primitivo } from '../../Expresion/Literal/Primitivo';
import { variable } from '@angular/compiler/src/output/output_ast';

export class ForIn extends Instruccion {
    public id:string;
    public arreglo : Expresion;    
    private instrucciones: Array<Instruccion> = new Array<Instruccion>();

    constructor( id:string, arreglo:Expresion, instrucciones: Array<Instruccion>, line: number, column: number) {
        super(line, column);
        this.id = id;
        this.arreglo = arreglo;
        this.instrucciones = instrucciones;
    }

    compile(env: Entorno): void {
        const generator = Generator.getInstance();
        const newEnv = new Entorno(env);

        // Compilar arreglo, retorna el puntero a la primera posicion de heap
        const arreglo = this.arreglo.compile(newEnv);
        // Declarar variable para simular recorrido del arreglo
        const newVar = newEnv.addVar(this.id, new Tipo(arreglo.type.subTipo), false,false);        
        // Obtener limite
        const limite = generator.newTemporal();
        generator.addGetHeap(limite, arreglo.getValue());
        // Declarar iterador, iniciarlo en el puntero a heap
        const iterador = generator.newTemporal();
        generator.freeTemp(iterador);
        generator.addExpression(iterador, 0);
        
        // General etiqueta para enciclar
        const loopLbl = generator.newLabel();
        // Generar etiqueta de salida
        const exitLbl = generator.newLabel();
        generator.addLabel(loopLbl);
        // Verificar si sale del ciclo
        generator.addIf(iterador, limite, '==', exitLbl);
        // Actualizar el valor de instr
        const temp = generator.newTemporal();                        
        generator.addExpression(temp, 'p', newVar.position, '+');                
        generator.addSetStack(temp, iterador);
        // Compilar instrucciones
        this.instrucciones.forEach((instr)=>{
            instr.compile(newEnv);
        });
        // Incrementar iterador
        generator.addExpression(iterador, iterador, 1, '+');
        // Goto para simular ciclo
        generator.addGoto(loopLbl);
        // Imprimir etiqueta de salida
        generator.addLabel(exitLbl);            
    
    }
}

/*

ARREGLO = h;
iterador = 0;
limite = Heap[arreglo];
L0:
if(iterador == limite) goto SALIDA
temp = Heap[iterador]
Stack[0] = temp;
...
goto L0
SALIDA


*/