import { Expresion } from "../../Abstract/Expresion";
import { Entorno } from "../../TablaSimbolos/Entorno";
import { Retorno } from "../../Util/Retorno";
import { Generator } from "../../Generator/Generator";
import { Tipos, Tipo } from "../../Util/Tipo";
import { Error_ } from "../../Util/Error_";

export class Not extends Expresion{
    private left: Expresion;


    constructor(left: Expresion, line: number, column: number) {
        super(line, column);
        this.left = left;
    }

    compile(env: Entorno): Retorno {

        const generator = Generator.getInstance();

        this.trueLabel = this.trueLabel == '' ? generator.newLabel() : this.trueLabel;
        this.falseLabel = this.falseLabel == '' ? generator.newLabel() : this.falseLabel;

        this.left.trueLabel = this.falseLabel;
        this.left.falseLabel = this.trueLabel;
        //Generar c3d
        const left = this.left.compile(env);

        //Validar tipos
        if(left.type.type == Tipos.BOOLEAN){
            //Retornar el or como un objeto boolean
            const retorno = new Retorno('',false,left.type);
            retorno.trueLabel = this.trueLabel;
            retorno.falseLabel = this.falseLabel;
            return retorno;
        }
        throw new Error_(this.line, this.column, 'Semantico', `No se puede operar Not: ${left.type.type}`);
    }
}