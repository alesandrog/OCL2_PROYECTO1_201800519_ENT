import { ExpresionT } from "../Abstract/Expresion";
import { InstruccionT } from "../Abstract/Instruccion";
import { EntornoT } from "../Symbol/Entorno";

export class SwitchT extends InstruccionT{

    constructor(private exp : ExpresionT , private code : InstruccionT[], private def : InstruccionT[] | null){
        super();
    }

    public traducir(entorno : EntornoT) : string {
        const newEnv = new EntornoT(entorno);
        let cod = "";
        for(const instr of this.code){
            cod += `${instr.traducir(newEnv)}\n`;
        }
        let cod_def = "";
        if(this.def != null){
            for(const instr of this.def){
                cod_def += `${instr.traducir(newEnv)}\n`;
            }
            cod += `default : \n${cod_def}\n`;
        }
        let condicion = this.exp.traducir(entorno);
        return `switch(${condicion}){\n${cod}}`;
    }
}