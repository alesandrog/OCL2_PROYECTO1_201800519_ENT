import { Instruction } from "../Abstract/Instruccion";
import { Entorno } from "../Symbol/Entorno";
import { Error_ } from "../Error/Error";

export class Break extends Instruction{

    private line : number;
    private column : number;

    constructor(line : number, column : number){
        super(line, column);
        this.line = line;
        this.column = column;
    }

    public execute(environment : Entorno):Break {
        if(environment.cantidadCiclos > 0){
            return this;
        }else{
            throw new Error_(this.line, this.column, 'Sintactico', 'Break fuera de ciclo ' );
        }                    
    }
}