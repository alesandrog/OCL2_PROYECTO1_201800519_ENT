import { ExpresionT } from "../Abstract/Expresion";
import { InstruccionT } from "../Abstract/Instruccion";
import { EntornoT } from "../Symbol/Entorno";

export class CaseT extends InstruccionT{

    constructor(private exp : ExpresionT , private code : InstruccionT[]){
        super();
    }

    public traducir(entorno : EntornoT) : string {
        const newEnv = new EntornoT(entorno);
        let cod = "";
        for(const instr of this.code){
            cod += `${instr.traducir(newEnv)}\n`;
        }
        let condicion = this.exp.traducir(entorno);
        return `case ${condicion}:\n${cod}`;
    }
}