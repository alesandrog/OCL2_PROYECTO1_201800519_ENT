import { Instruction } from "../Abstract/Instruccion";
import { Entorno } from "../Symbol/Entorno";
import { Error_ } from "../Error/Error";
import { Retorno, Tipo } from "../Abstract/Retorno";
import { Expresion } from "../Abstract/Expresion";
import { AccesoIndice } from "../Expression/AccesoIndice";

export class Pop extends Instruction{

    private id : string;
    public accesos : AccesoIndice | null;

    constructor(id : string , accesos : AccesoIndice | null  , line : number, column : number){
        super(line, column);
        this.id = id;
        this.accesos = accesos;
    }

    public execute(environment : Entorno) : Retorno | null  {
        
        return null;
    }
}