import { Instruccion } from "../../Abstract/Instruccion";
import { Tipo, Tipos } from "../../Util/Tipo";
import { Entorno } from "../../TablaSimbolos/Entorno";


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