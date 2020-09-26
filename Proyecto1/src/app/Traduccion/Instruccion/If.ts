import { InstruccionT } from "../Abstract/Instruccion";
import { ExpresionT } from "../Abstract/Expresion";
import { EntornoT } from "../Symbol/Entorno";
import { BloqueInstruccionesT } from "./BloqueInstrucciones";

export class IfT extends InstruccionT{

    constructor(private condicion : ExpresionT, private code : BloqueInstruccionesT , private elsSt : any){
        super();
    }

    public traducir(entorno : EntornoT ) : string {

        let condicion = this.condicion.traducir(entorno);
        let codigo = this.code.traducir(entorno);

        let traduccion = `if(${condicion}){\n${codigo}\n}`;
        
        if(this.elsSt != null){
            traduccion += `else{\n${this.elsSt.traducir(entorno)}\n}`;            
            return traduccion;
        }
        return traduccion;
    }
}