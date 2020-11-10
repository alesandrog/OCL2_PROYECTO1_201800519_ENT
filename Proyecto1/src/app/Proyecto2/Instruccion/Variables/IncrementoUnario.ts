import { Instruccion } from "../../Abstract/Instruccion";
import { Entorno } from "../../TablaSimbolos/Entorno";
import { Generator } from "../../Generator/Generator";
import { Error_ } from "../../Util/Error_";

export class IncrementoUnario extends Instruccion {
    public id: string ;
    private signo : string;
    constructor( id: string, signo:string, line: number, column: number) {
        super(line, column);
        this.id = id;
        this.signo = signo;

    }

    compile(env: Entorno): void {
        const generator = Generator.getInstance();
        const symbol = env.getVar(this.id);
        if (symbol == null) 
            throw new Error_(this.line, this.column, 'Semantico', `No existe la variable ${this.id}`);
    

        if (symbol?.isGlobal) {
            const value = generator.newTemporal();
            generator.freeTemp(value);
            generator.addGetStack(value, symbol.position);
            generator.addExpression(value, value,1 , this.signo);   
            generator.addSetStack(symbol.position, value);
        }
        else {
            const temp = generator.newTemporal();
            generator.addExpression(temp, 'p', symbol.position, '+');                                
            const value = generator.newTemporal();
            generator.freeTemp(value);
            generator.addGetStack(value, temp);
            generator.addExpression(value, value,1 , this.signo);   
            generator.addSetStack(temp, value);
        }

    }
}
