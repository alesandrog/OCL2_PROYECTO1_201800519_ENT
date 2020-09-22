import { Retorno , Tipo } from "./Retorno" 
import { Entorno } from "../Symbol/Entorno"
import { Tipos } from "./TablaTipos"

export abstract class Expresion {

    public linea: number;
    public columna: number;

    constructor(linea: number, columna: number) {
        this.linea = linea;
        this.columna = columna;
    }

    public abstract execute(entorno : Entorno) : Retorno;

    public tipoDominante(tipo1 : Tipo, tipo2 : Tipo) : Tipo{
        const tipo = Tipos[tipo1][tipo2];
        return tipo;
    }

}