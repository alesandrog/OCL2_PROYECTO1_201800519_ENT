import { Instruccion } from "../../Abstract/Instruccion";
import { Tipo, Tipos } from "../../Util/Tipo";
import { Expresion } from "../../Abstract/Expresion";
import { Entorno } from "../../TablaSimbolos/Entorno";
import { Generator } from "../../Generator/Generator";
//import { Error } from "../../Utils/Error";

export class Declaracion extends Instruccion {
    private type: Tipo;
    private idList: string;
    private value: Expresion;

    constructor(type: Tipo, idList: string, value: Expresion, line: number, column: number) {
        super(line, column);
        this.type = type;
        this.idList = idList;
        this.value = value;
    }

    compile(env: Entorno): void {
        const generator = Generator.getInstance();
        const value = this.value.compile(env);
        if(!this.sameType(this.type,value.type)){
           // throw new Error(this.line,this.column,'Semantico',`Tipos de datos diferentes ${this.type.type}, ${value.type.type}`);
        }
        //this.validateType(env);
        const newVar = env.addVar(this.idList,value.type.type == Tipos.NULL ? this.type : value.type,false,false);
            //if(!newVar) throw new Error(this.line,this.column,'Semantico',`La variable: ${id} ya existe en este ambito;`);
        
            if(newVar.isGlobal){
                if(this.type.type == Tipos.BOOLEAN){
                    const templabel = generator.newLabel();
                    generator.addLabel(value.trueLabel);
                    generator.addSetStack(newVar.position,'1');
                    generator.addGoto(templabel);
                    generator.addLabel(value.falseLabel);
                    generator.addSetStack(newVar.position,'0');
                    generator.addLabel(templabel);
                }
                else{
                    generator.addSetStack(newVar.position,value.getValue());
                }
            }
            else{
                const temp = generator.newTemporal(); generator.freeTemp(temp);
                generator.addExpression(temp,'p',newVar.position,'+');
                if(this.type.type == Tipos.BOOLEAN){
                    const templabel = generator.newLabel();
                    generator.addLabel(value.trueLabel);
                    generator.addSetStack(temp,'1');
                    generator.addGoto(templabel);
                    generator.addLabel(value.falseLabel);
                    generator.addSetStack(temp,'0');
                    generator.addLabel(templabel);
                }
                else{
                    generator.addSetStack(temp,value.getValue());
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
