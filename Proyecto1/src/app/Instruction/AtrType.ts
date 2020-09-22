import { Expresion } from "../Abstract/Expresion";
import { Retorno, Tipo } from "../Abstract/Retorno";
import { Entorno } from "../Symbol/Entorno";
import { Simbolo } from "../Symbol/Simbolo";
import { AccesoTipoType } from "../Expression/AccesoTipoType";
import { timeStamp } from "console";
import { Instruction } from "../Abstract/Instruccion";

export class AtrType extends Instruction{

    public id : string;
    public tipo : Tipo | AccesoTipoType ;
    
    constructor(id : string , tipo : Tipo | AccesoTipoType, linea : number, columna: number){
        super(linea, columna);
        this.id = id;
        this.tipo = tipo;
    }

    public execute(entorno : Entorno) {
        if(this.tipo instanceof AccesoTipoType){
            const t = this.tipo.execute(entorno);
            this.tipo = t.tipo;
        }
    }
}