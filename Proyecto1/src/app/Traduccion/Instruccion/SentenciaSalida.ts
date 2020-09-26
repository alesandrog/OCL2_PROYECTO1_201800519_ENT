import { InstruccionT } from "../Abstract/Instruccion";
import { ExpresionT } from "../Abstract/Expresion";
import { EntornoT } from "../Symbol/Entorno";

export class SentenciaSalidaT extends InstruccionT{

    constructor(private tipo : number, private code : ExpresionT | null ){
        super();
    }

    public traducir(entorno : EntornoT ) : string {

        if(this.tipo == 1){ //return
            if(this.code != null){
                let exp = this.code.traducir(entorno);
                return `return ${exp};`;
            }else{
                return `return;`;
            }
        }else if(this.tipo == 2){ //break
            return `break;`;
        }else { //continue
            return `continue;`;
        }
    }
}