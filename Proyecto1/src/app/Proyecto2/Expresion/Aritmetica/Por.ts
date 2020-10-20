import { Expresion } from "../../Abstract/Expresion";
import { Entorno } from "../../TablaSimbolos/Entorno";
import { Retorno } from "../../Util/Retorno";
import { Generator } from "../../Generator/Generator";
import { Tipos, Tipo } from "../../Util/Tipo";
//import { Error } from "../../Utils/Error";

export class Por extends Expresion {
    private left: Expresion;
    private right: Expresion;

    constructor(left: Expresion, right: Expresion, line: number, column: number) {
        super(line, column);
        this.left = left;
        this.right = right;
    }

    public compile(env: Entorno): Retorno {
        const left = this.left.compile(env);
        const right = this.right.compile(env);
        const generator = Generator.getInstance();
        const temp = generator.newTemporal();
        if(left.type.type == Tipos.NUMBER && right.type.type){
            generator.addExpression(temp, left.getValue(), right.getValue(), '*');
            return new Retorno(temp, true, new Tipo(Tipos.NUMBER));            
        }        
 //       throw new Error(this.line, this.column, 'Semantico', `No se puede sumar ${left.type.type} + ${right.type.type}`);
    }
}