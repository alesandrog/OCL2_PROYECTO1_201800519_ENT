import { Expresion } from "../../Abstract/Expresion";
import { Tipo, Tipos } from "../../Util/Tipo";
import { Entorno } from "../../TablaSimbolos/Entorno";
import { Retorno } from "../../Util/Retorno";
import { Generator } from "../../Generator/Generator";
//import { Error } from "../../Utils/Error";

export class Primitivo extends Expresion {
    private type: Tipos;
    private value: any;

    constructor(type: Tipos, value: any, line: number, column: number) {
        super(line, column);
        this.type = type;
        this.value = value;
    }

    public compile(env: Entorno): Retorno {
        switch (this.type) {
            case Tipos.NUMBER:
                return new Retorno(this.value,false,new Tipo(this.type));                
            case Tipos.BOOLEAN:
                const generator = Generator.getInstance();
                const retorno = new Retorno('',false,new Tipo(this.type));
                this.trueLabel = this.trueLabel == '' ? generator.newLabel() : this.trueLabel;
                this.falseLabel = this.falseLabel == '' ? generator.newLabel() : this.falseLabel;
                this.value ? generator.addGoto(this.trueLabel) : generator.addGoto(this.falseLabel);
                retorno.trueLabel = this.trueLabel;
                retorno.falseLabel = this.falseLabel;
                return retorno;
            case Tipos.NULL:
                return new Retorno('-1',false,new Tipo(this.type));
            default:
               // throw new Error(this.line,this.column,'Semantico','Tipo de dato no reconocido');
        }
    }
}