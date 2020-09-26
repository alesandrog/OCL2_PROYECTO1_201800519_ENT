import { InstruccionT } from "../Abstract/Instruccion";
import { EntornoT } from "../Symbol/Entorno";

export class BloqueInstruccionesT extends InstruccionT{

    constructor(private code : InstruccionT[]){
        super();
    }

    public traducir(entorno : EntornoT) : string {
        const newEnv = new EntornoT(entorno);
        let res = "";
        for(const instr of this.code){
            res += instr.traducir(newEnv) + "\n";
        }
        return res;
    }
}