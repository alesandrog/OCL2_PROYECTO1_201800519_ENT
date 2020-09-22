import { Expresion } from "../Abstract/Expresion";
import { Entorno } from "../Symbol/Entorno";
import { Instruction } from "../Abstract/Instruccion";
import { Simbolo } from "../Symbol/Simbolo";
import { AtrType } from "./AtrType";

export class DeclaracionType extends Instruction{
    
    private atributos : Array<AtrType>;
    public linea : number;
    public columna : number;
    private id : string;

    //TODO validar caso en que no se inicializen los atributos y deba buscarse el tipo en declaracion normal

    constructor(id: string ,valor : Array<AtrType> , linea : number, columna: number){
        super(linea, columna);
        this.id = id;
        this.atributos = valor;
        this.linea = linea;
        this.columna = columna;
    }

    //Almacenar el tipo en el map
    public execute(entorno : Entorno){
        entorno.typeTemporal = this.id;
        for(const val of this.atributos){
            val.execute(entorno);
        }
        entorno.guardarTipo(this.id , this.atributos, false);
    }    
}