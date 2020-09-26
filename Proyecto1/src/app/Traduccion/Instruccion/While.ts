import { InstruccionT } from "../Abstract/Instruccion";
import { ExpresionT } from "../Abstract/Expresion";
import { EntornoT } from "../Symbol/Entorno";
import { BloqueInstruccionesT } from "./BloqueInstrucciones";

export class WhileT extends InstruccionT{

    constructor(private condicion : ExpresionT, private code : BloqueInstruccionesT , private tipo : number){
        super();
    }

    public traducir(entorno : EntornoT ) : string {

        let condicion = this.condicion.traducir(entorno);
        let codigo = this.code.traducir(entorno);

        if(this.tipo == 1){ //while
            return `while(${condicion}){\n${codigo}\n}`;
        }else{
            return `do{\n${codigo}\n}while(${condicion});`;
        }
    }
}