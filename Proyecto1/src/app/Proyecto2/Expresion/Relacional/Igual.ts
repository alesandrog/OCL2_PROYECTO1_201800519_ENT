import { Expresion } from "../../Abstract/Expresion";
import { Entorno } from "../../TablaSimbolos/Entorno";
import { Retorno } from "../../Util/Retorno";
import { Generator } from "../../Generator/Generator";
import { Tipos, Tipo } from "../../Util/Tipo";
import { Error_ } from "../../Util/Error_";
import { sequence } from '@angular/animations';

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
        right = this.right.compile(env);
        switch (left.type.type) {
            case Tipos.NUMBER:
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
                        // ERROR
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
            case Tipos.STRING:
                        switch(right.type.type){
                            case Tipos.STRING:
                                // Generar etiquetas verdaderas y falsas
                                this.trueLabel = this.trueLabel == '' ? generator.newLabel() : this.trueLabel;
                                this.falseLabel = this.falseLabel == '' ? generator.newLabel() : this.falseLabel;

                                // Generar etiqueta para simular loop
                                const loopLbl = generator.newLabel();
                                generator.addLabel(loopLbl);
                                // Generar temporales para acceder a los valores en heap
                                const heapLft = generator.newTemporal();
                                const heapRgt = generator.newTemporal();
                                // Etiqueta para ejecutar iteracion y salir de iteracion
                                const itLbl = generator.newLabel();
                                // Acceder a heap
                                generator.addGetHeap(heapLft, left.getValue());
                                generator.addGetHeap(heapRgt, right.getValue());                                
                                // Salto condicional a etiqueta verdadera
                                generator.addIf(heapLft, heapRgt, '==', itLbl);
                                // Salto incondicional a etiqueta falsa 
                                generator.addGoto(this.falseLabel);
                                // Ejecutar iteracion
                                generator.addLabel(itLbl);
                                generator.addIf(heapLft, '-1', '==', this.trueLabel);
                                generator.addExpression(left.getValue(), left.getValue(), 1,'+');
                                generator.addExpression(right.getValue(), right.getValue(), 1,'+');                                
                                generator.addGoto(loopLbl);

                                
                                // Retornar objeto booleano
                                const retorno = new Retorno('', false, new Tipo(Tipos.BOOLEAN));
                                // Setear etiquetas verdaderas y falsas
                                retorno.trueLabel = this.trueLabel;
                                retorno.falseLabel = this.falseLabel;
                                return retorno;
                            case Tipos.NULL:
                                // Generar etiquetas verdaderas y falsas
                                this.trueLabel = this.trueLabel == '' ? generator.newLabel() : this.trueLabel;
                                this.falseLabel = this.falseLabel == '' ? generator.newLabel() : this.falseLabel;
                                // Salto condicional a etiqueta verdadera
                                generator.addIf(left.getValue(), right.getValue(), '==', this.trueLabel);
                                // Salto incondicional a etiqueta falsa 
                                generator.addGoto(this.falseLabel);
                                // Retornar objeto booleano
                                const retorno2 = new Retorno('', false, new Tipo(Tipos.BOOLEAN));
                                // Setear etiquetas verdaderas y falsas
                                retorno.trueLabel = this.trueLabel;
                                retorno.falseLabel = this.falseLabel;
                                return retorno2;                                
                        }

                break;
                case Tipos.ARRAY:
                    switch(right.type.type){
                        case Tipos.ARRAY:
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
                        case Tipos.NULL:       
                                // Generar etiquetas verdaderas y falsas
                                this.trueLabel = this.trueLabel == '' ? generator.newLabel() : this.trueLabel;
                                this.falseLabel = this.falseLabel == '' ? generator.newLabel() : this.falseLabel;
                                // Salto condicional a etiqueta verdadera
                                generator.addIf(left.getValue(), right.getValue(), '==', this.trueLabel);
                                // Salto incondicional a etiqueta falsa 
                                generator.addGoto(this.falseLabel);
                                // Retornar objeto booleano
                                const retorno2 = new Retorno('', false, new Tipo(Tipos.BOOLEAN));
                                // Setear etiquetas verdaderas y falsas
                                retorno2.trueLabel = this.trueLabel;
                                retorno2.falseLabel = this.falseLabel;
                                return retorno2;

                    }
                break;
                case Tipos.TYPE:
                    switch(right.type.type){
                        case Tipos.TYPE:
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
                        case Tipos.NULL:       
                                // Generar etiquetas verdaderas y falsas
                                this.trueLabel = this.trueLabel == '' ? generator.newLabel() : this.trueLabel;
                                this.falseLabel = this.falseLabel == '' ? generator.newLabel() : this.falseLabel;
/*                                // Accesar a heap
                                const accesoHeap = generator.newTemporal();
                                generator.addGetHeap(accesoHeap, left.getValue());*/
                                // Salto condicional a etiqueta verdadera
                                generator.addIf(left.getValue(), right.getValue(), '==', this.trueLabel);
                                // Salto incondicional a etiqueta falsa 
                                generator.addGoto(this.falseLabel);
                                // Retornar objeto booleano
                                const retorno2 = new Retorno('', false, new Tipo(Tipos.BOOLEAN));
                                // Setear etiquetas verdaderas y falsas
                                retorno2.trueLabel = this.trueLabel;
                                retorno2.falseLabel = this.falseLabel;
                                return retorno2;
                    }
                    break;
                case Tipos.NULL:
                    if(right.type.type == Tipos.NULL){
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
                    }
                    break;
        }
        throw new Error_(this.line, this.column, 'Semantico', `No se puede ${left.type.type} == ${right?.type.type}`);
    
    }
}