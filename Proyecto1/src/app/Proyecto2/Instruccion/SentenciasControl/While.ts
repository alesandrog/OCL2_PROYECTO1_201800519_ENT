import { Instruccion } from "../../Abstract/Instruccion";
import { Tipo, Tipos } from "../../Util/Tipo";
import { Expresion } from "../../Abstract/Expresion";
import { Entorno } from "../../TablaSimbolos/Entorno";
import { Generator } from "../../Generator/Generator";
import { Error_ } from "../../Util/Error_";

export class While extends Instruccion {
    private condicion: Expresion;
    private instrucciones: Array<Instruccion> = new Array<Instruccion>();

    constructor( condicion: Expresion, instrucciones: Array<Instruccion>, line: number, column: number) {
        super(line, column);
        this.condicion = condicion;
        this.instrucciones = instrucciones;
    }

    compile(env: Entorno): void {
        //TODO break y continue  
        const generator = Generator.getInstance();
        const newLbl = generator.newLabel();
        // Imprimir etiqueta sobre la que se hara el loop 
        generator.addLabel(newLbl);
        // Al ejecutar la condicion se generan ifs, etiquetas verdaderas y falsas
        const condicion = this.condicion.compile(env);
        // Imprimir etiqueta verdadera con las instrucciones del if
        generator.addLabel(condicion.trueLabel);        
        if (condicion.type.type!= Tipos.BOOLEAN)
            throw new Error_(this.line,this.column,'Semantico','Condicion no booleana');
        const newEnv = new Entorno(env);
        for(let i = 0; i < this.instrucciones.length; i++){
            this.instrucciones[i].compile(newEnv);
        }
        // Salto incondicional al inicio
        generator.addGoto(newLbl);
        // Etiqueta falsa para salir del loop
        generator.addLabel(condicion.falseLabel);

    }
}
