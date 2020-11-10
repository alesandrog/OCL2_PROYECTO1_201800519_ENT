import { Expresion } from "../../Abstract/Expresion";
import { Entorno } from "../../TablaSimbolos/Entorno";
import { Retorno } from "../../Util/Retorno";
import { Generator } from "../../Generator/Generator";
import { Tipos, Tipo } from "../../Util/Tipo";
import { Error_ } from "../../Util/Error_";

export class NegUnario extends Expresion {
    private left: Expresion;
    private right: Expresion;

    constructor(left: Expresion, line: number, column: number) {
        super(line, column);
        this.left = left;
 
    }

    public compile(env: Entorno): Retorno {
        const left = this.left.compile(env);
        const generator = Generator.getInstance();
        // Temporal para el resultado
        const temp = generator.newTemporal();
        if(left.type.type == Tipos.NUMBER){
            generator.addExpression(temp, 0, left.getValue(), '-');
            return new Retorno(temp, true, new Tipo(Tipos.NUMBER));            
        }        
        throw new Error_(this.line, this.column, 'Semantico', ` Negativo en tipo no numerico`);
    }
}
