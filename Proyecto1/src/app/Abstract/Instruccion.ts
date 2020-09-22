import { Entorno } from "../Symbol/Entorno";

export abstract class Instruction {

    public linea: number;
    public columna: number;

    constructor(linea: number, columna: number) {
        this.linea = linea;
        this.columna = columna;
    }

    public abstract execute(entorno:Entorno) : any;
}