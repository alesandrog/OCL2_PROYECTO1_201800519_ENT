import { Instruction } from "../Abstract/Instruccion";
import { Entorno } from "../Symbol/Entorno";
import { Error_ } from "../Error/Error";
import { Retorno, Tipo } from "../Abstract/Retorno";
import { Expresion } from "../Abstract/Expresion";

export class Graficar extends Instruction{

    private line : number;
    private column : number;

    constructor( line : number, column : number){
        super(line, column);
        this.line = line;
        this.column = column;
    }

    public execute(environment : Entorno){
        console.log(environment.variables); 
    }
}