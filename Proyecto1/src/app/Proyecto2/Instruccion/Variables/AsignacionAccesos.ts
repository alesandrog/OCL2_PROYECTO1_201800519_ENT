import { Instruccion } from "../../Abstract/Instruccion";
import { Tipo, Tipos } from "../../Util/Tipo";
import { Expresion } from "../../Abstract/Expresion";
import { Entorno } from "../../TablaSimbolos/Entorno";
import { Generator } from "../../Generator/Generator";
import { Error_ } from "../../Util/Error_";
import { AccesoArreglo } from '../../Expresion/Acceso/AccesoArreglo';

export class AsignacionAccesos extends Instruccion {
    private accesos : AccesoArreglo;
    private value: Expresion;
    private id : string;

    constructor( id:string, accesos:AccesoArreglo, value: Expresion, line: number, column: number) {
        super(line, column);
        this.accesos = accesos;
        this.value = value;
        this.id = id;
    }

    compile(env: Entorno): void {
        const generator = Generator.getInstance();
        // Buscar variable en la tabla de simbolos        
        const symbol = env.getVar(this.id);
        if (symbol == null) 
            throw new Error_(this.line, this.column, 'Semantico', `No existe la variable ${this.id}`);        
    
        const variable = this.accesos.compile(env);
        const value = this.value.compile(env);
        if (!this.sameType(variable.type, value.type))
            throw new Error_(this.line,this.column,'Semantico',' Tipos de dato diferentes');
        

        if (symbol.type.type == Tipos.BOOLEAN) {
            const templabel = generator.newLabel();
            generator.addLabel(value.trueLabel);
            generator.addSetHeap(variable.getValue(), '1');
            generator.addGoto(templabel);
            generator.addLabel(value.falseLabel);
            generator.addSetHeap(variable.getValue(), '0');
            generator.addLabel(templabel);
        }
        else {
            generator.addSetHeap(variable.getValue(), value.getValue());
        }
    }
}
