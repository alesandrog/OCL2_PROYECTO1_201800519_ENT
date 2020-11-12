import { Expresion } from "../../Abstract/Expresion";
import { Tipo, Tipos } from "../../Util/Tipo";
import { Entorno } from "../../TablaSimbolos/Entorno";
import { Retorno } from "../../Util/Retorno";
import { Generator } from "../../Generator/Generator";
import { Error_ } from "../../Util/Error_";

export class Primitivo extends Expresion {
    private type: Tipos;
    private value: any;

    constructor(type: Tipos, value: any, line: number, column: number) {
        super(line, column);
        this.type = type;
        this.value = value;
    }

    public compile(env: Entorno): Retorno {
        const generator = Generator.getInstance();
        switch (this.type) {
            case Tipos.NUMBER:
                return new Retorno(this.value,false,new Tipo(this.type));                
            case Tipos.BOOLEAN:
                // Llamar al generador
                //Crear objeto retorno tipo boolean
                const retorno = new Retorno('',false,new Tipo(this.type));
                //Generar etiqueta verdadera, si no tiene
                this.trueLabel = this.trueLabel == '' ? generator.newLabel() : this.trueLabel;
                //Generar etiqueta falsa, si no tiene
                this.falseLabel = this.falseLabel == '' ? generator.newLabel() : this.falseLabel;
                this.value ? generator.addGoto(this.trueLabel) : generator.addGoto(this.falseLabel);
                //Guardar en el retorno las etiquetas verdaderas y falsas
                retorno.trueLabel = this.trueLabel;
                retorno.falseLabel = this.falseLabel;
                return retorno;
            case Tipos.STRING:  // No es primitivo pero por conveniencia lo meto aqui 
                // Temporal para almacenar el puntero inical a heap
                const temp = generator.newTemporal();
                // Guardar la posicion actual de heap
                generator.addExpression(temp, 'h');
                for (let i = 0; i < this.value.length; i++) {
                    // Guardar en heap el string, caracter por caracter
                    generator.addSetHeap('h', this.value.charCodeAt(i));
                    // Aumentar puntero
                    generator.nextHeap();
                }
                // Establecer el fin de cadena
                generator.addSetHeap('h', '-1');
                // Actualizar puntero h
                generator.nextHeap();
                // Retornar el temporal
                return new Retorno(temp, true, new Tipo(this.type, 'String'));
            case Tipos.NULL:
                return new Retorno('-1',false,new Tipo(this.type));
            default:
                throw new Error_(this.line,this.column,'Semantico','Tipo de dato no reconocido');
        }
    }
}