  
import { Instruction } from "../Abstract/Instruccion";
import { Entorno } from "../Symbol/Entorno";
import { BloqueInstrucciones } from "../Instruction/BloqueInstrucciones";
import { Parametro } from "./Parametro";
import { Tipo } from "../Abstract/Retorno";
import { AccesoTipoType } from "../Expression/AccesoTipoType";

export class Funcion extends Instruction{
    public tipoRep : number;

    constructor(public id: string, public code: Instruction[], public parametros : Parametro[] | null, public tipo :Tipo | AccesoTipoType,  line : number, column : number){
        super(line, column);
    }

    public execute(entorno : Entorno) {
        if(this.tipo instanceof AccesoTipoType){

        }else{
            this.tipoRep = this.tipo;
        }
        entorno.guardarFuncion(this.id, this);
    }
}
