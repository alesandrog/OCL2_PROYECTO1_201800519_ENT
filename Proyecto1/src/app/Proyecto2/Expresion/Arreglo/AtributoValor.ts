import { Instruccion } from "../../Abstract/Instruccion";
import { Tipo, Tipos } from "../../Util/Tipo";
import { Expresion } from "../../Abstract/Expresion";
import { Entorno } from "../../TablaSimbolos/Entorno";
import { Generator } from "../../Generator/Generator";
import { Error_ } from "../../Util/Error_";
import { Retorno } from '../../Util/Retorno';


export class AtributoValor{
    
    public id : string;
    public valor : Expresion;

    constructor( id : string , valor : Expresion, public linea : number , public columna: number){

        this.id = id;
        this.valor = valor;

    }
}