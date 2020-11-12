import { Instruccion } from "../../Abstract/Instruccion";
import { Tipo, Tipos } from "../../Util/Tipo";
import { Expresion } from "../../Abstract/Expresion";
import { Entorno } from "../../TablaSimbolos/Entorno";
import { Generator } from "../../Generator/Generator";
import { Error_ } from "../../Util/Error_";
import { Retorno } from '../../Util/Retorno';


export class Return extends Instruccion {
    private value: Expresion | null;

    constructor(value: Expresion | null, line: number, column: number) {
        super(line, column);
        this.value = value;
    }

    compile(env: Entorno): void {
        const value = this.value?.compile(env) || new Retorno('0', false, new Tipo(Tipos.VOID));
        const funcion = env.actualFunc;
        const generator = Generator.getInstance();

        if (funcion == null)
            throw new Error_(this.line, this.column, 'Semantico', 'Return fuera de una funcion');

        if (!this.sameType(funcion.retorno, value.type))
            throw new Error_(this.line, this.column, 'Semantico', ` Tipos no compatibles: ${value.type.type} no asignable a ${funcion.retorno.type} `);

        if(funcion.retorno.type == Tipos.BOOLEAN){
            const templabel = generator.newLabel();
            generator.addLabel(value.trueLabel);
            generator.addSetStack('p', '1');
            generator.addGoto(templabel);
            generator.addLabel(value.falseLabel);
            generator.addSetStack('p', '0');
            generator.addLabel(templabel);
        } 
        else if (funcion.retorno.type != Tipos.VOID)
            generator.addSetStack('p', value.getValue());

        generator.addGoto(env.return || '');
    }
}