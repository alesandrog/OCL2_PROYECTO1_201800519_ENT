import { Expresion } from "../../Abstract/Expresion";
import { Entorno } from "../../TablaSimbolos/Entorno";
import { Retorno } from "../../Util/Retorno";
import { Generator } from "../../Generator/Generator";
import { Tipos, Tipo } from "../../Util/Tipo";
import { Error_ } from "../../Util/Error_";

export class Or extends Expresion{
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

        //Si cualquiera se cumple, el or se cumple
        this.left.trueLabel = this.right.trueLabel =  this.trueLabel;
        //Si el primer valor es falso, saltar a una nueva etiqueta
        this.left.falseLabel =  generator.newLabel();
        // Si el segundo no se cumple, el or no se cumple
        // Por lo tanto, sus etiquetas falsas son iguales 
        this.right.falseLabel = this.falseLabel;

        //Generar c3d
        const left = this.left.compile(env);
        generator.addLabel(this.left.falseLabel);
        const right = this.right.compile(env);

        //Validar tipos
        if(left.type.type == Tipos.BOOLEAN && right.type.type == Tipos.BOOLEAN){
            //Retornar el or como un objeto boolean
            const retorno = new Retorno('',false,left.type);
            retorno.trueLabel = this.trueLabel;
            retorno.falseLabel = this.right.falseLabel;
            return retorno;
        }
        throw new Error_(this.line, this.column, 'Semantico', `No se puede operar Or: ${left.type.type} && ${right.type.type}`);
    }
}