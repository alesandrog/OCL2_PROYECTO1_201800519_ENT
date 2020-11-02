import { Expresion } from "../../Abstract/Expresion";
import { Entorno } from "../../TablaSimbolos/Entorno";
import { Retorno } from "../../Util/Retorno";
import { Generator } from "../../Generator/Generator";
import { Tipos, Tipo } from "../../Util/Tipo";
//import { Error } from "../../Utils/Error";

export class Mas extends Expresion {
    private left: Expresion;
    private right: Expresion;

    constructor(left: Expresion, right: Expresion, line: number, column: number) {
        super(line, column);
        this.left = left;
        this.right = right;
    }

    public compile(env: Entorno): Retorno {
        const left = this.left.compile(env);
        const generator = Generator.getInstance();
        const right = this.right.compile(env);
        const temp = generator.newTemporal();         
        switch (left.type.type) {
            case Tipos.NUMBER:
               
                switch (right.type.type) {
                    case Tipos.NUMBER:
                        generator.addExpression(temp, left.getValue(), right.getValue(), '+');
                        return new Retorno(temp, true, right.type.type == Tipos.NUMBER ? right.type : left.type);
                    case Tipos.STRING:
                        const tempAux = generator.newTemporal(); 
                        generator.freeTemp(tempAux);
                        // Paso de parametro operador izquierdo
                        generator.addExpression(tempAux,'p',env.size + 1, '+');
                        generator.addSetStack(tempAux,left.getValue());
                        // Paso de parametro operador derecho
                        generator.addExpression(tempAux,tempAux,'1','+');
                        generator.addSetStack(tempAux,right.getValue());
                        // Cambio de ambito                        
                        generator.addNextEnv(env.size + 1);
                        generator.llamadaFuncion('concat_number_str');
                        // Obtener retorno
                        const retorno_str_number = generator.newTemporal();
                        generator.addExpression(retorno_str_number, 'p', '2', '+');
                        generator.addGetStack(temp,retorno_str_number);
                        generator.addAntEnv(env.size+1);
                        return new Retorno(temp, true, new Tipo(Tipos.STRING));
                    default:
                        break;
                }

            case Tipos.STRING:
                const tempAux = generator.newTemporal(); 
                generator.freeTemp(tempAux);
                switch (right.type.type) {
                    case Tipos.NUMBER:
                        // Paso de parametro operador izquierdo
                        generator.addExpression(tempAux,'p',env.size + 1, '+');
                        generator.addSetStack(tempAux,left.getValue());
                        // Paso de parametro operador derecho
                        generator.addExpression(tempAux,tempAux,'1','+');
                        generator.addSetStack(tempAux,right.getValue());
                        // Cambio de ambito                        
                        generator.addNextEnv(env.size + 1);
                        generator.llamadaFuncion('concat_str_number');
                        // Obtener retorno
                        const retorno_str_number = generator.newTemporal();
                        generator.addExpression(retorno_str_number, 'p', '2', '+');
                        generator.addGetStack(temp,retorno_str_number);
                        generator.addAntEnv(env.size+1);
                        return new Retorno(temp, true, new Tipo(Tipos.STRING));
                    case Tipos.STRING:
                        // Paso de operador izquierdo
                        generator.addExpression(tempAux,'p',env.size + 1 , '+');
                        generator.addSetStack(tempAux,left.getValue());
                        // Paso de operador derecho
                        generator.addExpression(tempAux,tempAux,'1','+');
                        generator.addSetStack(tempAux,right.getValue());
                        // Cambio de ambito
                        generator.addNextEnv(env.size+1);
                        generator.llamadaFuncion('concat_str_str');
                        // Obtener retorno
                        const tempRet = generator.newTemporal();
                        generator.addExpression(tempRet, 'p', '2', '+');
                        generator.addGetStack(temp,tempRet);
                        generator.addAntEnv(env.size+1);
                        return new Retorno(temp, true, new Tipo(Tipos.STRING));
                    case Tipos.BOOLEAN:
                        const lblTemp = generator.newLabel();


                        generator.addLabel(right.trueLabel);
                        generator.addExpression(tempAux,'p',env.size + 1, '+');
                        generator.addSetStack(tempAux,left.getValue());
                        generator.addExpression(tempAux,tempAux,'1','+');                        
                        generator.addSetStack(tempAux,'1');
                        generator.addGoto(lblTemp);

                        generator.addLabel(right.falseLabel);
                        generator.addExpression(tempAux,'p',env.size + 1, '+');
                        generator.addSetStack(tempAux,left.getValue());
                        generator.addExpression(tempAux,tempAux,'1','+');                        
                        generator.addSetStack(tempAux,'0');
                        generator.addLabel(lblTemp);

                        generator.addNextEnv(env.size + 1);
                        generator.llamadaFuncion('concat_str_bool');
                        const tempRetBool = generator.newTemporal();                        
                        generator.addExpression(tempRetBool, 'p', '2', '+');
                        generator.addGetStack(temp,tempRetBool);
                        generator.addAntEnv(env.size + 1);
                        return new Retorno(temp, true, new Tipo(Tipos.STRING));

                    default:
                        break;
                }
            case Tipos.BOOLEAN:                            
                switch (right.type.type) {
                    case Tipos.STRING:
                        const tempAux = generator.newTemporal(); 
                        generator.freeTemp(tempAux);
                        const lblTemp = generator.newLabel();


                        generator.addLabel(left.trueLabel);
                        generator.addExpression(tempAux,'p',env.size + 1, '+');
                        generator.addSetStack(tempAux,'1');                        
                        generator.addExpression(tempAux,tempAux,'1','+');                        
                        generator.addSetStack(tempAux,right.getValue());
                        generator.addGoto(lblTemp);

                        generator.addLabel(left.falseLabel);
                        generator.addExpression(tempAux,'p',env.size + 1, '+');
                        generator.addSetStack(tempAux,'0');
                        generator.addExpression(tempAux,tempAux,'1','+');                        
                        generator.addSetStack(tempAux,right.getValue());

                        generator.addLabel(lblTemp);

                        generator.addNextEnv(env.size + 1);
                        generator.llamadaFuncion('concat_bool_str');
                        const tempRetBool = generator.newTemporal();                        
                        generator.addExpression(tempRetBool, 'p', '2', '+');
                        generator.addGetStack(temp,tempRetBool);
                        generator.addAntEnv(env.size + 1);
                        return new Retorno(temp, true, new Tipo(Tipos.STRING));
                    default:
                        break;
                }
        }
 //       throw new Error(this.line, this.column, 'Semantico', `No se puede sumar ${left.type.type} + ${right.type.type}`);
    }
}