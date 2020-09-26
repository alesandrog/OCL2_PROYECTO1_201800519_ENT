import { InstruccionT } from "../Abstract/Instruccion";
import { EntornoT } from "../Symbol/Entorno";
import { ExpresionT } from "../Abstract/Expresion";
import { env } from "process";

import { AccesoT } from "../Expresion/Acceso";
import { IdAccesoT } from "./IdAcceso";


export class NativaArregloT extends ExpresionT{

    private funcion : number;
    private accesos : AccesoT | string;
    public puntoC : string = "";
    private exprPush : ExpresionT | null;

    constructor(accesos : AccesoT | string, funcion : number , exprPush : ExpresionT | null ){
        super();
        this.funcion = funcion;
        this.accesos = accesos;
        this.exprPush = exprPush;
    }

    public traducir(entorno : EntornoT): string {
        let acceso = "";
        if(this.accesos instanceof IdAccesoT){
            acceso = this.accesos.traducir(entorno);
        }else{
            acceso = this.accesos.toString();
        }
        if(this.funcion == 0){
            return `${acceso}.length${this.puntoC}`;   
        }else{
            const exp = this.exprPush.traducir(entorno);
            return `${acceso}.push(${exp})${this.puntoC}`;               
        }

    }
}