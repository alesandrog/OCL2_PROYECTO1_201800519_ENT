import { Expresion } from "../Abstract/Expresion";
import { Retorno, Tipo } from "../Abstract/Retorno";
import { Entorno } from "../Symbol/Entorno";

export class Arreglo extends Expresion{
    

    constructor(private value : any, linea : number, columna: number){
        super(linea, columna);
    }

    public execute(entorno : Entorno) : Retorno{
        let result = [];
        for(const instr of this.value){
            const valor = instr.execute(entorno);
            result.push(valor);
        }

        return { value : result , tipo : Tipo.ARRAY };
    }

    
}