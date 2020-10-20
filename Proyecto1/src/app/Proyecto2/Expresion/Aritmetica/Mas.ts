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
        const right = this.right.compile(env);
        const generator = Generator.getInstance();
        const temp = generator.newTemporal();
        switch (left.type.type) {
            case Tipos.NUMBER:
                switch (right.type.type) {
                    case Tipos.NUMBER:
                        generator.addExpression(temp, left.getValue(), right.getValue(), '+');
                        return new Retorno(temp, true, right.type.type == Tipos.NUMBER ? right.type : left.type);
                    case Tipos.STRING:
                        const tempAux = generator.newTemporal(); generator.freeTemp(tempAux);
                        generator.addExpression(tempAux,'p',env.size + 1, '+');
                        generator.addSetStack(tempAux,left.getValue());
                        generator.addExpression(tempAux,tempAux,'1','+');
                        generator.addSetStack(tempAux,right.getValue());
                        generator.addNextEnv(env.size);
                        generator.addCall('native_concat_int_str');
                        generator.addGetStack(temp,'p');
                        generator.addAntEnv(env.size);
                        return new Retorno(temp, true, new Tipo(Tipos.STRING));
                    default:
                        break;
                }

            case Tipos.STRING:
                const tempAux = generator.newTemporal(); generator.freeTemp(tempAux);
                switch (right.type.type) {
                    case Tipos.NUMBER:
                        generator.addExpression(tempAux,'p',env.size + 1, '+');
                        generator.addSetStack(tempAux,left.getValue());
                        generator.addExpression(tempAux,tempAux,'1','+');
                        generator.addSetStack(tempAux,right.getValue());
                        generator.addNextEnv(env.size);
                        generator.addCall('native_concat_str_int');
                        generator.addGetStack(temp,'p');
                        generator.addAntEnv(env.size);
                        return new Retorno(temp, true, new Tipo(Tipos.STRING));
                    case Tipos.STRING:
                        generator.addExpression(tempAux,'p',env.size + 1, '+');
                        generator.addSetStack(tempAux,left.getValue());
                        generator.addExpression(tempAux,tempAux,'1','+');
                        generator.addSetStack(tempAux,right.getValue());
                        generator.addNextEnv(env.size);
                        generator.addCall('native_concat_str_str');
                        generator.addGetStack(temp,'p');
                        generator.addAntEnv(env.size);
                        return new Retorno(temp, true, new Tipo(Tipos.STRING));
                    case Tipos.BOOLEAN:
                        const lblTemp = generator.newLabel();
                        generator.addExpression(tempAux,'p',env.size + 1, '+');
                        generator.addSetStack(tempAux,left.getValue());
                        generator.addExpression(tempAux,tempAux,'1','+');

                        generator.addLabel(right.trueLabel);
                        generator.addSetStack(tempAux,'1');
                        generator.addGoto(lblTemp);

                        generator.addLabel(right.falseLabel);
                        generator.addSetStack(tempAux,'0');
                        generator.addLabel(lblTemp);

                        generator.addNextEnv(env.size);
                        generator.addCall('native_concat_str_bol');
                        generator.addGetStack(temp,'p');
                        generator.addAntEnv(env.size);
                        return new Retorno(temp, true, new Tipo(Tipos.STRING));

                    default:
                        break;
                }
            case Tipos.BOOLEAN:
                switch (right.type.type) {
                    case Tipos.STRING:
                        const tempAux = generator.newTemporal(); generator.freeTemp(tempAux);
                        const lblTemp = generator.newLabel();
                        generator.addExpression(tempAux,'p',env.size + 1, '+');
                        generator.addLabel(left.trueLabel);
                        generator.addSetStack(tempAux,'1');
                        generator.addGoto(lblTemp);
                        generator.addLabel(left.falseLabel);
                        generator.addSetStack(tempAux,'0');
                        generator.addLabel(lblTemp);
                        generator.addExpression(tempAux,tempAux,'1','+');
                        generator.addSetStack(tempAux,right.getValue());
                        generator.addNextEnv(env.size);
                        generator.addCall('native_concat_bol_str');
                        generator.addGetStack(temp,'p');
                        generator.addAntEnv(env.size);
                        return new Retorno(temp, true, new Tipo(Tipos.STRING));
                    default:
                        break;
                }
        }
 //       throw new Error(this.line, this.column, 'Semantico', `No se puede sumar ${left.type.type} + ${right.type.type}`);
    }
}