import { Instruccion } from "../../Abstract/Instruccion";
import { Tipo, Tipos } from "../../Util/Tipo";
import { Expresion } from "../../Abstract/Expresion";
import { Entorno } from "../../TablaSimbolos/Entorno";
import { Generator } from "../../Generator/Generator";
import { Error_ } from "../../Util/Error_";
import { Retorno } from '../../Util/Retorno';


export class NewArray extends Expresion {
    private size: Expresion;

    constructor( size: Expresion, line: number, column: number) {
        super(line, column);
        this.size = size;
    }

     public  compile(env: Entorno): Retorno {
        const generator = Generator.getInstance();
        // Compilar expresion para tamanio del arreglo
        const value = this.size.compile(env);
        
        
        // Generar un temporal para almacenar la posicion de h
        const temp = generator.newTemporal();
        generator.addExpression(temp, 'h');

        // Llenar de -1 heap para reservar el espacio de memoria
        
        // Guardar tamanio del arreglo
        generator.addSetHeap('h', value.getValue());
        generator.nextHeap();

        // Etiqueta ciclo
        const loopLbl = generator.newLabel();
        // Etiqueta de salida
        const exitLbl = generator.newLabel();
        // Iterador
        const iterador = generator.newTemporal();
        generator.addExpression(iterador, '0');
        generator.addLabel(loopLbl);
        // Comparar si ya se lleno el tamanio del arreglo
        generator.addIf(iterador, value.getValue(), '==', exitLbl);
        // Setear -1 a heap
        generator.addSetHeap('h', -1);
        generator.nextHeap();      
        generator.addExpression(iterador, iterador, 1 , '+');  
        generator.addGoto(loopLbl);
        generator.addLabel(exitLbl);
        return new Retorno(temp,true, new Tipo(Tipos.ARRAY));        

    }
}
