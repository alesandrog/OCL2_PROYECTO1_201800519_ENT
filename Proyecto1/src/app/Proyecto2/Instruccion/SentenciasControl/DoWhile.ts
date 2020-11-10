import { Instruccion } from "../../Abstract/Instruccion";
import { Tipo, Tipos } from "../../Util/Tipo";
import { Expresion } from "../../Abstract/Expresion";
import { Entorno } from "../../TablaSimbolos/Entorno";
import { Generator } from "../../Generator/Generator";
import { Error_ } from "../../Util/Error_";

export class DoWhile extends Instruccion {
    private condicion: Expresion;
    private instrucciones: Array<Instruccion> = new Array<Instruccion>();

    constructor( condicion: Expresion, instrucciones: Array<Instruccion>, line: number, column: number) {
        super(line, column);
        this.condicion = condicion;
        this.instrucciones = instrucciones;
    }

    compile(env: Entorno): void {
        const generator = Generator.getInstance();
        const trueLbl = generator.newLabel();
        const falseLbl = generator.newLabel();
        // Imprimir etiqueta sobre la que se hara el loop 
        generator.addLabel(trueLbl);
        const newEnv = new Entorno(env);
        newEnv.break = falseLbl;
        newEnv.continue = trueLbl;
        for(let i = 0; i < this.instrucciones.length; i++){
            this.instrucciones[i].compile(newEnv);
        }        
        // Al ejecutar la condicion se generan ifs, etiquetas verdaderas y falsas
        this.condicion.trueLabel = trueLbl;
        this.condicion.falseLabel = falseLbl;
        const condicion = this.condicion.compile(env);
        if (condicion.type.type!= Tipos.BOOLEAN)
            throw new Error_(this.line,this.column,'Semantico','Condicion no booleana');        
        // Imprimir etiqueta verdadera con las instrucciones del if
        generator.addLabel(falseLbl);        

    }
}
