import { Expresion } from "../../Abstract/Expresion";
import { Entorno } from "../../TablaSimbolos/Entorno";
import { Retorno } from "../../Util/Retorno";
import { Generator } from "../../Generator/Generator";
//import { Error } from "../../Utils/Error";
import { Tipos, Tipo } from "../../Util/Tipo";
import { Simbolo } from "../../TablaSimbolos/Simbolo";

export class Acceso extends Expresion {
    private id: string;
    private anterior: Expresion | null;

    constructor(id: string, line: number, column: number) {
        super(line, column);
        this.id = id;
//        this.anterior = anterior;
    }

    compile(env: Entorno): Retorno {
        const generator = Generator.getInstance();
            let symbol = env.getVar(this.id);
            if (symbol == null) {
            //    throw new Error(this.line, this.column, 'Semantico', `No existe la variable: ${this.id}`);
            }
            const temp = generator.newTemporal();
            if (symbol.isGlobal) {
                generator.addGetStack(temp, symbol.position);
                if (symbol.type.type != Tipos.BOOLEAN) return new Retorno(temp, true, symbol.type, symbol);

                const retorno = new Retorno('', false, symbol.type,symbol);
                this.trueLabel = this.trueLabel == '' ? generator.newLabel() : this.trueLabel;
                this.falseLabel = this.falseLabel == '' ? generator.newLabel() : this.falseLabel;
                generator.addIf(temp, '1', '==', this.trueLabel);
                generator.addGoto(this.falseLabel);
                retorno.trueLabel = this.trueLabel;
                retorno.falseLabel = this.falseLabel;
                return retorno;
            }
            else {
                const tempAux = generator.newTemporal(); generator.freeTemp(tempAux);
                generator.addExpression(tempAux, 'p', symbol.position, '+');
                generator.addGetStack(temp, tempAux);
                if (symbol.type.type != Tipos.BOOLEAN) return new Retorno(temp, true, symbol.type, symbol);

                const retorno = new Retorno('', false, symbol.type);
                this.trueLabel = this.trueLabel == '' ? generator.newLabel() : this.trueLabel;
                this.falseLabel = this.falseLabel == '' ? generator.newLabel() : this.falseLabel;
                generator.addIf(temp, '1', '==', this.trueLabel);
                generator.addGoto(this.falseLabel);
                retorno.trueLabel = this.trueLabel;
                retorno.falseLabel = this.falseLabel;
                return retorno;
            }
  
    }
}