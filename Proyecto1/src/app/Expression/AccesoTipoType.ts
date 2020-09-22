import { Expresion } from "../Abstract/Expresion";
import { Entorno } from "../Symbol/Entorno";
import { Retorno, Tipo } from "../Abstract/Retorno";
import { Error_ } from "../Error/Error";
import { Arreglo2 } from "../Instruction/Arreglo2";
import { AccesoIndice } from "./AccesoIndice";
import { Type } from "../Instruction/Types";
import { AccesoArray } from "./AccesoArray";
import { Simbolo } from "../Symbol/Simbolo";

export class AccesoTipoType extends Expresion{

    public id : string;

    constructor(id: string ,linea : number, columna: number){
        super(linea, columna);
        this.id = id;
    }

    //TODO validar null y undefined, mensajes de error

    public execute(entorno : Entorno): any {

        const acceso = entorno.getTipo(this.id);
        if(acceso != null || acceso != undefined)
            return acceso;
        
        if(this.id == entorno.typeTemporal)
            return new Simbolo("", this.id, entorno.indiceTipos, true);
        throw new Error_(this.linea, this.columna, 'Semantico', 'Tipo '+ this.id + ' no esta definido ' );  
    }
}