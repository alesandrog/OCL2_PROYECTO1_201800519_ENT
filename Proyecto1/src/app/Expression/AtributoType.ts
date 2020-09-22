import { Expresion } from "../Abstract/Expresion";
import { Retorno, Tipo } from "../Abstract/Retorno";
import { Entorno } from "../Symbol/Entorno";

export class AtributoType extends Expresion{

    public id : string;
    public value : Expresion;
    
    constructor(id : string , value : Expresion, linea : number, columna: number, private tipo : number){
        super(linea, columna);
        this.id = id;
        this.value = value;
    }

    public execute(entorno : Entorno) : Retorno{
        const val = this.value.execute(entorno);
        return { value: val.value , tipo : val.tipo};
    }
}