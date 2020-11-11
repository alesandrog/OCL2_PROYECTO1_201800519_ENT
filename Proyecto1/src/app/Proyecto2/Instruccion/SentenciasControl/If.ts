import { Instruccion } from "../../Abstract/Instruccion";
import { Tipo, Tipos } from "../../Util/Tipo";
import { Expresion } from "../../Abstract/Expresion";
import { Entorno } from "../../TablaSimbolos/Entorno";
import { Generator } from "../../Generator/Generator";
import { Error_ } from "../../Util/Error_";

export class If extends Instruccion {
    private condicion: Expresion;
    private instrucciones: Array<Instruccion> = new Array<Instruccion>();
    private elseSt: If | Array<Instruccion> | null;

    constructor( condicion: Expresion, instrucciones: Array<Instruccion>, elseSt: If | Array<Instruccion> | null, line: number, column: number) {
        super(line, column);
        this.condicion = condicion;
        this.instrucciones = instrucciones;
        this.elseSt = elseSt;
    }

    compile(env: Entorno): void {
  
        const generator = Generator.getInstance();
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

        // Verificar si hay else If o else
        if(this.elseSt == null){
            // Imprimir etiqueta falsa
            generator.addLabel(condicion.falseLabel);
        }else if(this.elseSt instanceof If){
            // Generar salto incondicional
            const newLbl = generator.newLabel();
            generator.addGoto(newLbl);
            // Imprimir etiqueta falsa del If
            generator.addLabel(condicion.falseLabel);
            //Ejecutar el If anidado
            this.elseSt.compile(env);
            // Imprimir etiqueta del salto incondicional
            generator.addLabel(newLbl);
        }else{
            // Generar salto incondicional           
            const newLbl = generator.newLabel();
            generator.addGoto(newLbl);
            // Imprimir etiqueta falsa del If
            generator.addLabel(condicion.falseLabel);             
            //Ejecutar instrucciones del else 
            const newEnv2 = new Entorno(env);
            for(let i = 0; i < this.elseSt.length; i++)
                this.elseSt[i].compile(newEnv2);    
            // Imprimir etiqueta de salida
            generator.addLabel(newLbl);
        }
    }
}
