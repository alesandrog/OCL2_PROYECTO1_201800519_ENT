import { InstruccionT } from "../Abstract/Instruccion";
import { ExpresionT } from "../Abstract/Expresion";
import { EntornoT } from "../Symbol/Entorno";
export class ConsoleT extends InstruccionT{

    constructor(private value : ExpresionT[]){
        super();
    }

    public traducir(entorno : EntornoT) : string {
        let result : string = "";
        for(let i = 0; i < this.value.length; i++){
            if(i < this.value.length -1){
                result += this.value[i].traducir(entorno) + ",";
            }else{
                result += this.value[i].traducir(entorno) ;
            }
        }
        return `console.log(${result});`;
    }
}