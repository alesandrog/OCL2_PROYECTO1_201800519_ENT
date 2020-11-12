import { Instruccion } from "../../Abstract/Instruccion";
import { Tipo, Tipos } from "../../Util/Tipo";
import { Expresion } from "../../Abstract/Expresion";
import { Entorno } from "../../TablaSimbolos/Entorno";
import { Generator } from "../../Generator/Generator";
import { Error_ } from "../../Util/Error_";
export class Asignacion extends Instruccion {
    private id: string ;
    private value: Expresion;

    constructor( id: string, value: Expresion, line: number, column: number) {
        super(line, column);
        this.id = id;
        this.value = value;
    }

    compile(env: Entorno): void {
        const generator = Generator.getInstance();
        // Buscar variable en la tabla de simbolos        
        const symbol = env.getVar(this.id);
        if (symbol == null) 
            throw new Error_(this.line, this.column, 'Semantico', ` Variable ${this.id} no definida en el ambito`);

        const value = this.value.compile(env);

        if (!this.sameType(symbol.type, value.type)) {
            throw new Error_(this.line,this.column,'Semantico',` Tipos de dato incompatibles: ${value.type.type} no asignable a ${symbol.type.type} `);
        }
        if (symbol?.isGlobal) {
            if (symbol.type.type == Tipos.BOOLEAN) {
                const templabel = generator.newLabel();
                generator.addLabel(value.trueLabel);
                generator.addSetStack(symbol.position, '1');
                generator.addGoto(templabel);
                generator.addLabel(value.falseLabel);
                generator.addSetStack(symbol.position, '0');
                generator.addLabel(templabel);
            }
            else {
                generator.addSetStack(symbol.position, value.getValue());
            }
        }
        else if (symbol?.isHeap) {
            if (symbol.type.type == Tipos.BOOLEAN) {
                const templabel = generator.newLabel();
                generator.addLabel(value.trueLabel);
                generator.addSetHeap(symbol.position, '1');
                generator.addGoto(templabel);
                generator.addLabel(value.falseLabel);
                generator.addSetHeap(symbol.position, '0');
                generator.addLabel(templabel);
            }
            else {
                const temp = generator.newTemporal();
                generator.addExpression(temp, 'p', symbol.position, '+');                
                const accesoReferencia = generator.newTemporal();
                generator.addGetStack(accesoReferencia, temp);
                generator.addSetStack(accesoReferencia, value.getValue());
            }
        }
        else {
            if (symbol.type.type == Tipos.BOOLEAN) {
                const templabel = generator.newLabel();
                const temp = generator.newTemporal();
                generator.addExpression(temp, 'p', symbol.position, '+');                                
                generator.addLabel(value.trueLabel);
                generator.addSetStack(temp, '1');
                generator.addGoto(templabel);
                generator.addLabel(value.falseLabel);
                generator.addSetStack(temp, '0');
                generator.addLabel(templabel);
            }
            else {
                const temp = generator.newTemporal();
                generator.addExpression(temp, 'p', symbol.position, '+');                                
                generator.addSetStack(temp, value.getValue());
            }
        }

    }
}
