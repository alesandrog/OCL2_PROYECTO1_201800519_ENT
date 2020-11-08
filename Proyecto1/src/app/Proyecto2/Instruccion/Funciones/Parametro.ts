import { Instruccion } from "../../Abstract/Instruccion";
import { Tipo, Tipos } from "../../Util/Tipo";
import { Expresion } from "../../Abstract/Expresion";
import { Entorno } from "../../TablaSimbolos/Entorno";
import { Generator } from "../../Generator/Generator";
import { Error_ } from "../../Util/Error_";

export class Parametro extends Instruccion{
    
    public id : string;
    public tipo : Tipo;

    constructor( id : string , tipo : Tipo, public linea : number , public columna: number){
        super(linea , columna);
        this.id = id;
        this.tipo = tipo;
    }

    public compile(entorno : Entorno){
        //no ejecutar
    }
}