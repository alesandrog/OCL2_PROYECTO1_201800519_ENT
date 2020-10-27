import { Expresion } from "../../Abstract/Expresion";
import { Entorno } from "../../TablaSimbolos/Entorno";
import { Retorno } from "../../Util/Retorno";
import { Generator } from "../../Generator/Generator";
import { Tipos, Tipo } from "../../Util/Tipo";
import { Error_ } from "../../Util/Error_";

export class Igual extends Expresion{
    private left: Expresion;
    private right: Expresion;


    constructor(left: Expresion, right: Expresion, line: number, column: number) {
        super(line, column);
        this.left = left;
        this.right = right;
    }

    compile(env: Entorno): Retorno {
        // Llamar a instancia del generador
        const generator = Generator.getInstance();

        // Ejecutar operador izquierdo
        const left = this.left.compile(env);
        let right : Retorno | null = null;

        switch (left.type.type) {
            case Tipos.NUMBER:
                right = this.right.compile(env);
                switch (right.type.type) {
                    case Tipos.NUMBER:
                        // Generar etiquetas verdaderas y falsas
                        this.trueLabel = this.trueLabel == '' ? generator.newLabel() : this.trueLabel;
                        this.falseLabel = this.falseLabel == '' ? generator.newLabel() : this.falseLabel;
                        // Salto condicional a etiqueta verdadera
                        generator.addIf(left.getValue(), right.getValue(), '==', this.trueLabel);
                        // Salto incondicional a etiqueta falsa 
                        generator.addGoto(this.falseLabel);
                        // Retornar objeto booleano
                        const retorno = new Retorno('', false, new Tipo(Tipos.BOOLEAN));
                        // Setear etiquetas verdaderas y falsas
                        retorno.trueLabel = this.trueLabel;
                        retorno.falseLabel = this.falseLabel;
                        return retorno;
                    default:
                        break;
                }
            case Tipos.BOOLEAN:
                // Generar etiquetas verdaderas y falsas
                const trueLabel = generator.newLabel();
                const falseLabel = generator.newLabel();
                // Imprimir etiqueta verdadera op izquierdo
                generator.addLabel(left.trueLabel);
                this.right.trueLabel = trueLabel;
                this.right.falseLabel = falseLabel;
                // Imprimir salto incondicional y guardar etiquetas del operador derecho
                right = this.right.compile(env);                
                // Imprimir etiqueta falsa operador izquierdo
                generator.addLabel(left.falseLabel);
                // Invertir etiquetas del operador derecho para generar un salto incondicional falso
                this.right.trueLabel = falseLabel;
                this.right.falseLabel = trueLabel;
                right = this.right.compile(env);

                if(right.type.type = Tipos.BOOLEAN){
                    const retorno = new Retorno('',false,left.type);
                    retorno.trueLabel = trueLabel;
                    retorno.falseLabel = falseLabel;
                    return retorno;
                }
                break;
        }
        throw new Error_(this.line, this.column, 'Semantico', `No se puede ${left.type.type} == ${right?.type.type}`);
    
    }
}