import { InstruccionT } from "../Abstract/Instruccion";
import { EntornoT } from "../Symbol/Entorno";
import { ExpresionT } from "../Abstract/Expresion";
import { env } from "process";

import { AccesoT } from "../Expresion/Acceso";
import { SimboloT } from "../Symbol/Simbolo";
import { IdAccesoT } from "./IdAcceso";

export class AsignacionArrayT extends InstruccionT{

    private value : ExpresionT;
    private accesos : IdAccesoT;
    public ptComa = "";

    constructor(accesos : IdAccesoT, value : ExpresionT){
        super();
        this.value = value;
        this.accesos = accesos;
    }

    public traducir(entorno : EntornoT): string {
        console.log("======================= EN ASIG ARRAY");
        let val = this.value.traducir(entorno);
        const acceso = this.accesos.traducir(entorno);
        return `${acceso} = ${val};`;   
    }
}