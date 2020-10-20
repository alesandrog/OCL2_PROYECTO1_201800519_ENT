import { Expresion } from "../../Abstract/Expresion";
import { Entorno } from "../../TablaSimbolos/Entorno";
import { Retorno } from "../../Util/Retorno";
import { Generator } from "../../Generator/Generator";
import { Tipos, Tipo } from "../../Util/Tipo";
//import { Error } from "../../Utils/Error";

export class Mayor extends Expresion{
    private left: Expresion;
    private right: Expresion;
    private isGrtEqual: boolean;

    constructor(isGrtEqual: boolean, left: Expresion, right: Expresion, line: number, column: number) {
        super(line, column);
        this.left = left;
        this.right = right;
        this.isGrtEqual = isGrtEqual; 
    }

    compile(env: Entorno): Retorno {
        const left = this.left.compile(env);
        const right = this.right.compile(env);

        const lefType = left.type.type;
        const rightType = right.type.type;

        if (lefType == Tipos.NUMBER && rightType == Tipos.NUMBER) {
            const generator = Generator.getInstance();
            this.trueLabel = this.trueLabel == '' ? generator.newLabel() : this.trueLabel;
            this.falseLabel = this.falseLabel == '' ? generator.newLabel() : this.falseLabel;
            if(this.isGrtEqual){
                generator.addIf(left.getValue(),right.getValue(),'>=',this.trueLabel);
            }
            else{
                generator.addIf(left.getValue(),right.getValue(),'>',this.trueLabel);
            }
            generator.addGoto(this.falseLabel);
            const retorno = new Retorno('',false,new Tipo(Tipos.BOOLEAN));
            retorno.trueLabel = this.trueLabel;
            retorno.falseLabel = this.falseLabel;
            return retorno;
        }
//        throw new Error(this.line, this.column, 'Semantico', `No se puede ${lefType} > ${rightType}`);
    }
}