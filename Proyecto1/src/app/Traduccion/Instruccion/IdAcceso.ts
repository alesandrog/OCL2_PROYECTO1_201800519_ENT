import { InstruccionT } from "../Abstract/Instruccion";
import { AccesoT } from "../Expresion/Acceso";
import { EntornoT } from "../Symbol/Entorno";

export class IdAccesoT extends InstruccionT{

    constructor(private id : string , private accesos : AccesoT[]){
        super();
    }

    public traducir(entorno : EntornoT) : string {
        console.log("======================= EN ID ACCESOS");
        let cod = "";
        for(const instr of this.accesos){
            cod += `${instr.traducir(entorno)}`;
        }
        return `${this.id}${cod}`;
    }
}