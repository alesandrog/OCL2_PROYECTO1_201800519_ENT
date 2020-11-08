import { Instruccion } from "../../Abstract/Instruccion";
import { Tipo, Tipos } from "../../Util/Tipo";
import { Expresion } from "../../Abstract/Expresion";
import { Entorno } from "../../TablaSimbolos/Entorno";
import { Generator } from "../../Generator/Generator";
import { Error_ } from "../../Util/Error_";
import { Parametro } from '../Funciones/Parametro';
import { AtributoType } from 'src/app/Proyecto2/TablaSimbolos/AtributoType';

export class DefinicionType extends Instruccion{
    
    public id : string;
    public valores:AtributoType[];

    constructor( id : string , valores:AtributoType[], public linea : number , public columna: number){
        super(linea , columna);
        this.id = id;
        this.valores = valores;
    }

    public compile(env : Entorno){
        // Verificar si el type ya fue definido
        if(env.hasType(this.id))
            throw new Error_(this.line, this.column, 'Semantico', `El tipo ${this.id} ya esta definido en el entorno`);            

        let mapAtrib = new Map<string, AtributoType>();
        // Asignar un indice a cada atributo
        for(let i = 0; i < this.valores.length; i++){
            this.valores[i].indice = i;
            mapAtrib.set(this.valores[i].id, this.valores[i]);
        }
        // Guardar la metadata en la tabla de simbolos
        env.definirType(this.id, this.valores.length, mapAtrib);
    }
}