import { Instruccion } from "../../Abstract/Instruccion";
import { Entorno } from "../../TablaSimbolos/Entorno";
import { Generator } from "../../Generator/Generator";
import { Error_ } from "../../Util/Error_";


export class Break extends Instruccion{

    constructor(line: number, column: number){
        super(line,column);
    }
    compile(env:Entorno) : void{
        if(env.break == null)
            throw new Error_(this.line,this.column,'Semantico',' Break fuera de ciclo ');
        const generator = Generator.getInstance();
        generator.addGoto(env.break);
    }
}