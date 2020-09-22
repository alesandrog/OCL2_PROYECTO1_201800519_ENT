import { Expresion } from "../Abstract/Expresion";
import { Retorno, Tipo } from "../Abstract/Retorno";

export class Literal extends Expresion{
    
    constructor(private value : any, linea : number, columna: number, private tipo : number){
        super(linea, columna);
    }

    public execute() : Retorno{
        if(this.tipo == Tipo.NUMBER)
            return {value : Number(this.value), tipo : Tipo.NUMBER};
        else if(this.tipo == Tipo.BOOLEAN){
            if(this.value == "true"){
                return { value : true, tipo: Tipo.BOOLEAN}
            }else{
                return { value : false, tipo: Tipo.BOOLEAN}

            }
        }else if(this.tipo == Tipo.STRING)
            return {value : this.value , tipo : Tipo.STRING};                
        else
            return { value: null , tipo : Tipo.NULL};
    }
}
