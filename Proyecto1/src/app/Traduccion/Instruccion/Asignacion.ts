import { EntornoT } from "../Symbol/Entorno";
import { ExpresionT } from "../Abstract/Expresion";
import { InstruccionT } from "../Abstract/Instruccion"
import { env } from "process";


export class AsignacionT extends InstruccionT{

    public id : string;
    public expresion : ExpresionT | null;
    public operador : string;
    public ptComa : string = "";

    constructor(id: string,  expresion:ExpresionT | null, operador : string ){
        super();
        this.id = id;
        this.expresion = expresion;
        this.operador = operador;
    }

    public traducir(entorno : EntornoT):string{  
        const exp = this.expresion.traducir(entorno);
        return `${this.id} ${this.operador} ${exp}${this.ptComa}`;
    }
}