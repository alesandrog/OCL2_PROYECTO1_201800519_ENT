import { Expresion } from "../../Abstract/Expresion";
import { Entorno } from "../../TablaSimbolos/Entorno";
import { Retorno } from "../../Util/Retorno";
import { Generator } from "../../Generator/Generator";
import { Tipos, Tipo } from "../../Util/Tipo";
import { Error_ } from "../../Util/Error_";

export class Potencia extends Expresion {
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
        // Temporal para el resultado
        const temp = generator.newTemporal();
        if(left.type.type == Tipos.NUMBER && right.type.type == Tipos.NUMBER){
            // Temporal para iterar
            const iterador = generator.newTemporal();
            // Loop
            const loopLbl = generator.newLabel();
            // Etiqueta de salida 
            const exitLbl = generator.newLabel();

            // iniciar el iterador en uno y el resultado en el valor izquierdo
            generator.addExpression(iterador, 1);
            generator.addExpression(temp, left.getValue());
            generator.addLabel(loopLbl);
            generator.addIf(iterador, right.getValue(), '==', exitLbl);
            // Operar potencia iterativa
            generator.addExpression(temp, temp, left.getValue(), '*');
            generator.addExpression(iterador, iterador, 1 , '+');
            generator.addGoto(loopLbl);
            generator.addLabel(exitLbl);
            return new Retorno(temp, true, new Tipo(Tipos.NUMBER));            
        }        
        throw new Error_(this.line, this.column, 'Semantico', ` Tipos no numericos en potencia`);
    }
}

/*
    double n1;
    double n2;
    double it;
    double res;
    
    n1 = 8;
    n2 = 5;
    it = 1;
    res = n1;
    L0:
    if(it == n2) goto L1;
    res = res * n1;
    it = it + 1;
    goto L0;
    L1:
    printf("%d",(int)res);
    return 0;

*/