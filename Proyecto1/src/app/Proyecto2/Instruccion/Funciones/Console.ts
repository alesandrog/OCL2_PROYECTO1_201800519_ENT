import { Instruccion } from "../../Abstract/Instruccion";
import { Tipo, Tipos } from "../../Util/Tipo";
import { Expresion } from "../../Abstract/Expresion";
import { Entorno } from "../../TablaSimbolos/Entorno";
import { Generator } from "../../Generator/Generator";
import { Error_ } from "../../Util/Error_";

export class Console extends Instruccion {
    private value: Expresion[];

    constructor( value: Expresion[], line: number, column: number) {
        super(line, column);
        this.value = value;
    }

    compile(env: Entorno): void {
        const generator = Generator.getInstance();
 
        const value = this.value[0].compile(env);

        if(value.type.type == Tipos.NUMBER){
            generator.addPrint('f', 'float',value.getValue());
            generator.addPrint('c', 'int',10);            
        }else if(value.type.type == Tipos.BOOLEAN){
            const templabel = generator.newLabel();
            generator.addLabel(value.trueLabel);
            generator.addPrintTrue();
            generator.addGoto(templabel);
            generator.addLabel(value.falseLabel);
            generator.addPrintFalse();
            generator.addLabel(templabel);            
        }else if(value.type.type == Tipos.STRING){ // string
            const tempIterador = generator.newTemporal();
            generator.addExpression(tempIterador, value.getValue());
            // Generar etiqueta para simular LOOP
            const printLbl = generator.newLabel();
            generator.addLabel(printLbl);
            const exitLbl = generator.newLabel();
            const tempLetra = generator.newTemporal();
            generator.addGetHeap(tempLetra, tempIterador);
            generator.addIf(tempLetra, '-1', '==', exitLbl);
            generator.addPrint('c','int', tempLetra);
            generator.addExpression(tempIterador, tempIterador, '1', '+');
            generator.addGoto(printLbl);
            generator.addLabel(exitLbl);
            generator.addPrint('c', 'int',10); 
        }else{
            throw new Error_(this.line, this.column, 'Semantico', ` Tipo ${value.type.type} no imprimible`);
        }
    }

}
