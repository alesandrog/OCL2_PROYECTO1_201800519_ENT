import { Expresion } from "../Abstract/Expresion";
import { Retorno, Tipo } from "../Abstract/Retorno";
import { Entorno  } from "../Symbol/Entorno";
import { Error_ } from "../Error/Error";

export enum OperacionUnaria{
    NOT
}

export class ExpresionUnaria extends Expresion{

    constructor(private izq: Expresion, private tipo : OperacionUnaria, linea: number, columna: number){
        super(linea,columna);
    }

    public execute(entorno : Entorno) : Retorno{
        const izq = this.izq.execute(entorno);
        let result : Retorno;
        const tipoDominante = izq.tipo;
        
        if(this.tipo == OperacionUnaria.NOT){
            if(tipoDominante == Tipo.BOOLEAN)
                result = {value : (Boolean( !izq.value )), tipo : Tipo.BOOLEAN};
            else
                throw new Error_(this.linea, this.columna, 'Semantico', 'No se puede operar: ' + ' !' +  Tipo[izq.tipo]);            
        }                       
        return result!;
    }
}