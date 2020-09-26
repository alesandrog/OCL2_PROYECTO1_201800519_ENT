import { ExpresionT } from "../Abstract/Expresion";
import { EntornoT } from "../Symbol/Entorno";

export class Arreglo2T extends ExpresionT{
    
    public value : Array<ExpresionT> | null | any;

    constructor(valor : Array<ExpresionT> | null){
        super();
        this.value = valor;
    }

    public traducir(entorno : EntornoT):string{
        let res = "";
        res += "[";
        if(this.value != null){
            for(let i = 0; i < this.value.length; i++){
                const exe = this.value[i].traducir(entorno);
                if(i < this.value.length -1){
                    res += exe + ",";
                }else{
                    res += exe;
                }
            }
            res += "]";
            return res;
        }
        return "[]";
    }   
}