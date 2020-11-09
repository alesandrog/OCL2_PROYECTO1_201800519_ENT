import { Instruccion } from "../../Abstract/Instruccion";
import { Tipo, Tipos } from "../../Util/Tipo";
import { Expresion } from "../../Abstract/Expresion";
import { Entorno } from "../../TablaSimbolos/Entorno";
import { Generator } from "../../Generator/Generator";
import { Error_ } from "../../Util/Error_";

export class DeclaracionFor extends Instruccion {
    public id: string;
    public value: Expresion;

    constructor(id: string, value: Expresion, line: number, column: number) {
        super(line, column);
        this.id = id;
        this.value = value;
    }

    compile(env: Entorno): void {
        const generator = Generator.getInstance();
        const value = this.value.compile(env);

        const newVar = env.addVar(this.id, value.type, false,false);
            if(!newVar) throw new Error_(this.line,this.column,'Semantico',`La variable: ${this.id} ya existe en este ambito`);
        
        if(newVar.isGlobal){
            generator.addSetStack(newVar.position,value.getValue());
        }
        else{
            const temp = generator.newTemporal(); 
            generator.freeTemp(temp);
            generator.addExpression(temp,'p',newVar.position,'+');
            generator.addSetStack(temp,value.getValue());
        }

    }

}
