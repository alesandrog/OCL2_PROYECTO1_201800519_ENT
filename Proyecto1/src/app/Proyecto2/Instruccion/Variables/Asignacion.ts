import { Instruccion } from "../../Abstract/Instruccion";
import { Tipo, Tipos } from "../../Util/Tipo";
import { Expresion } from "../../Abstract/Expresion";
import { Entorno } from "../../TablaSimbolos/Entorno";
import { Generator } from "../../Generator/Generator";
//import { Error } from "../../Utils/Error";

export class Asignacion extends Instruccion {
    private id: Expresion;
    private value: Expresion;

    constructor( id: Expresion, value: Expresion, line: number, column: number) {
        super(line, column);
        this.id = id;
        this.value = value;
    }

    compile(env: Entorno): void {

        const val = this.value.compile(env);
        const id = this.id.compile(env);

        const generator = Generator.getInstance();
        const symbol = id.symbol;
        
        if (!this.sameType(id.type, val.type)) {
//            throw new Error(this.line,this.column,'Semantico','Tipos de dato diferentes');
        }
        
        if(symbol.isGlobal){
            if(id.type.type == Tipos.BOOLEAN){
                const templabel = generator.newLabel();                
                generator.addLabel(val.trueLabel);
                generator.addSetStack(symbol.position, '1');
                generator.addGoto(templabel);
                generator.addLabel(val.falseLabel);
                generator.addSetStack(symbol.position, '0');
                generator.addLabel(templabel);
            }else{
                generator.addSetStack(symbol.position, val.getValue());                
            }
        }

    }

    private validateType(env: Entorno){
     /*   if(this.type.type == Tipos.STRUCT){
            const struct = enviorement.searchStruct(this.type.typeId);
            if(!struct)
                throw new Error(this.line,this.column,'Semantico',`No existe el struct ${this.type.typeId}`);
            this.type.struct = struct;
        }*/
    }
}
