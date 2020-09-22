import { Instruction } from "../Abstract/Instruccion";
import { Entorno } from "../Symbol/Entorno";
import { Error_ } from "../Error/Error";
import { Retorno, Tipo } from "../Abstract/Retorno";
import { Expresion } from "../Abstract/Expresion";

export class Return extends Instruction{

    private line : number;
    private column : number;
    private exp : Expresion | null;
    public result : Retorno | null;
    public retType : Tipo | null;

    constructor(exp : Expresion  | null, line : number, column : number){
        super(line, column);
        this.line = line;
        this.column = column;
        this.exp = exp;
        this.result = null;
        this.retType = null;
    }

    public execute(environment : Entorno) : Return | null {
        if(environment.cantidadFunciones > 0){
            //Return con expresion
            if(this.exp != null && this.exp != undefined){
                const val = this.exp.execute(environment);
                this.result = { value : val.value , tipo: val.tipo };
                return this;
            }else{
                this.result = { value : "" , tipo: Tipo.VOID };
                return this;
             }
        }else{
            throw new Error_(this.line, this.column, 'Sintactico', 'Return fuera de funcion ' );
        } 
    }
}