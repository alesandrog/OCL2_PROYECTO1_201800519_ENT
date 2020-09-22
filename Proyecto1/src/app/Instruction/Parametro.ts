import { Tipo } from "../Abstract/Retorno";
import { Instruction } from "../Abstract/Instruccion";
import { Entorno } from "../Symbol/Entorno";

export class Parametro extends Instruction{
    
    public id : string;
    public tipo : Tipo;

    constructor( id : string , tipo : Tipo, public linea : number , public columna: number){
        super(linea , columna);
        this.id = id;
        this.tipo = tipo;
    }

    public execute(entorno : Entorno){
        //no ejecutar
    }
}