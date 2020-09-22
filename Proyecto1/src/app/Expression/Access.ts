import { Expresion } from "../Abstract/Expresion";
import { Entorno } from "../Symbol/Entorno";
import { Retorno } from "../Abstract/Retorno";
import { Error_ } from "../Error/Error";

export class Access extends Expresion{

    constructor(private id: string, linea : number, columna: number){
        super(linea, columna);
    }

    public execute(entorno : Entorno): Retorno {
        const value = entorno.getVariable(this.id);
        if(value == null)
            throw new Error_(this.linea, this.columna, 'Semantico', 'La variable:  ' + this.id +'  no esta declarada en este entorno ');
        return {value : value.valor, tipo : value.tipo};
    }
}