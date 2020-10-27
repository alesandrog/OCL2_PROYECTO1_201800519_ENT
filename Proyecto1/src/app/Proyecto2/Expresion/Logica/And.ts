import { Expresion } from "../../Abstract/Expresion";
import { Entorno } from "../../TablaSimbolos/Entorno";
import { Retorno } from "../../Util/Retorno";
import { Generator } from "../../Generator/Generator";
import { Tipos, Tipo } from "../../Util/Tipo";
import { Error_ } from "../../Util/Error_";

export class And extends Expresion{
    private left: Expresion;
    private right: Expresion;


    constructor(left: Expresion, right: Expresion, line: number, column: number) {
        super(line, column);
        this.left = left;
        this.right = right;
    }

    compile(env: Entorno): Retorno {

        const generator = Generator.getInstance();
        //Generar etiquetas verdaderas y falsas
        this.trueLabel = this.trueLabel == '' ? generator.newLabel() : this.trueLabel;
        this.falseLabel = this.falseLabel == '' ? generator.newLabel() : this.falseLabel;

        //Agregar nueva etiqueta verdadera a valor izquierda
        this.left.trueLabel = generator.newLabel();
        //Cuando el segundo valor es verdadero, se cumple el and
        //La etiqueta verdadera del segundo sera la etiqueta verdadera del and
        this.right.trueLabel = this.trueLabel;
        //Para izquierda y derecha, la etiqueta falsa es la etiqueta falsa del and
        this.left.falseLabel = this.right.falseLabel = this.falseLabel;

        //Generar c3d
        const left = this.left.compile(env);
        generator.addLabel(this.left.trueLabel);
        const right = this.right.compile(env);

        //Validar tipos
        if(left.type.type == Tipos.BOOLEAN && right.type.type == Tipos.BOOLEAN){
            //Retornar el and como un objeto boolean
            const retorno = new Retorno('',false,left.type);
            retorno.trueLabel = this.trueLabel;
            retorno.falseLabel = this.right.falseLabel;
            return retorno;
        }
        throw new Error_(this.line, this.column, 'Semantico', `No se puede And: ${left.type.type} && ${right.type.type}`);
    }
}