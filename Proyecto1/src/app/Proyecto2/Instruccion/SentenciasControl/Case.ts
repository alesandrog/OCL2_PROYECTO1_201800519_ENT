import { Instruccion } from "../../Abstract/Instruccion";
import { Tipo, Tipos } from "../../Util/Tipo";
import { Expresion } from "../../Abstract/Expresion";
import { Entorno } from "../../TablaSimbolos/Entorno";
import { Generator } from "../../Generator/Generator";
import { Error_ } from "../../Util/Error_";

export class Case extends Instruccion {
    public condicion: Expresion;
    public instrucciones: Array<Instruccion> = new Array<Instruccion>();

    constructor( condicion: Expresion, instrucciones: Array<Instruccion>, line: number, column: number) {
        super(line, column);
        this.condicion = condicion;
        this.instrucciones = instrucciones;
    }

    compile(env: Entorno): void {
        this.instrucciones.forEach((instr)=>{
            instr.compile(env);
        });
    }
}
