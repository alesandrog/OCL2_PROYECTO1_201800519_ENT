import { Entorno } from "../TablaSimbolos/Entorno";
import { Retorno } from "../Util/Retorno";

export abstract class Expresion{
    trueLabel : string;
    falseLabel : string;
    line: number;
    column : number;

    constructor(line: number, column: number){
        this.trueLabel = this.falseLabel = '';
        this.line = line;
        this.column = column;
    }

    public abstract compile(env: Entorno) : Retorno;
}