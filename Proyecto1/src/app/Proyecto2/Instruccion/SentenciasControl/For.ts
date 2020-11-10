import { Instruccion } from "../../Abstract/Instruccion";
import { Tipo, Tipos } from "../../Util/Tipo";
import { Expresion } from "../../Abstract/Expresion";
import { Entorno } from "../../TablaSimbolos/Entorno";
import { Generator } from "../../Generator/Generator";
import { Error_ } from "../../Util/Error_";
import { DeclaracionFor } from '../Variables/DeclaracionFor';
import { IncrementoUnario } from '../Variables/IncrementoUnario';
import { Acceso } from '../../Expresion/Acceso/Acceso';

export class For extends Instruccion {
    public declaracion : DeclaracionFor;
    public iterador : Acceso;
    public operador : string;
    public limite : Expresion;
    public incremento : IncrementoUnario;    
    private instrucciones: Array<Instruccion> = new Array<Instruccion>();

    constructor( declaracion: DeclaracionFor, idIterador:Acceso, operador:string, limite:Expresion, incremento:IncrementoUnario, instrucciones: Array<Instruccion>, line: number, column: number) {
        super(line, column);
        this.declaracion = declaracion;
        this.iterador = idIterador;
        this.operador = operador;
        this.limite = limite;
        this.incremento = incremento;
        this.instrucciones = instrucciones;
    }

    compile(env: Entorno): void {
        const generator = Generator.getInstance();
        const newEnv = new Entorno(env);

        // Ejecutar declaracion
        this.declaracion.compile(newEnv);
        // Ejecutar valor limite
        const limite = this.limite.compile(env);
        // Generar etiqueta para LOOP
        const loopLbl = generator.newLabel();
        generator.addLabel(loopLbl);
        // Generar etiqueta de salida
        const exitLbl = generator.newLabel();
        // Obtener el valor del iterador
        const iterador = this.iterador.compile(newEnv);
        // Comparar condicion de salida
        let op = "";
        switch(this.operador){
            case '<':
                op = '>=';
                break;
            case '<=':
                op = '>';
                break;
            case '>':
                op = '<=';
                break;
            case '>=':
                op = '<';
                break;           
        }
        generator.addIf(iterador.getValue(), limite.getValue(), op, exitLbl);
        // Compilar instrucciones
        newEnv.break = exitLbl;
        newEnv.continue = loopLbl;
        this.instrucciones.forEach((instr)=>{
            instr.compile(newEnv);
        });
        // Actualizar el valor del iterador
        this.incremento.compile(newEnv);
        // Goto para simular ciclo
        generator.addGoto(loopLbl);
        // Imprimir etiqueta de salida
        generator.addLabel(exitLbl);
    }
}
