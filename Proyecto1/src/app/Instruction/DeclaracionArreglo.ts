import { Instruction } from "../Abstract/Instruccion";
import { Entorno } from "../Symbol/Entorno";
import { Expresion } from "../Abstract/Expresion";
import { env } from "process";
import { Tipo } from "../Abstract/Retorno";
import { Error_ } from "../Error/Error";
import { Arreglo } from "../Expression/Arreglo";

export class DeclaracionArreglo extends Instruction{

    private id : string;
    private value : Expresion | null;
    private variable : boolean;
    private tipo : Tipo;
    private dimension : number;
    private tipoExp : Tipo;

    constructor(id: string, value : Expresion | null,  variable : boolean ,tipo : Tipo, dimension:number, tipoExp : Tipo , linea : number, columna: number){
        super(linea, columna);
        this.id = id;
        this.value = value;
        this.variable = variable;
        this.tipo = tipo;
        this.dimension = dimension;
        this.tipoExp = tipoExp;
    }

    public execute(entorno : Entorno) {

            //TODO Validar que los valores tengan la dimension indicada
            //TODO validar que los terminales sean de tipo valido

        if(this.value != null){
            const val = this.value.execute(entorno);
            //Tiene expresion y tipo declarado
            if(this.tipo != Tipo.NULL){
                if(this.tipo == val.tipo){
                    entorno.guardarArreglo(this.id, val.value, val.tipo, this.variable, this.dimension, this.tipoExp);
                }else{
                    throw new Error_(this.linea, this.columna, 'Semantico', 'Tipos incompatibles ' + Tipo[val.tipo] + ' no asignable a ' +  Tipo[this.tipo]);
                }
            }else{
                //Tiene expresion pero no tiene tipo explicito
                entorno.guardarArreglo(this.id, val.value, val.tipo, this.variable, this.dimension, Tipo.NULL);
            }
        }else{
            //No tiene valor explicito pero si tipo
            if(this.tipo != Tipo.NULL){
                entorno.guardarArreglo(this.id, null, Tipo.ARRAY, this.variable, this.dimension, this.tipoExp);
            }else{
                //No tiene tipo ni valor declarado
                entorno.guardarArreglo(this.id, null, Tipo.ARRAY, this.variable, this.dimension, Tipo.NULL);
            }
        }        
    }
}