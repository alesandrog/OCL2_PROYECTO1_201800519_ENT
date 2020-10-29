import { Instruccion } from "../../Abstract/Instruccion";
import { Tipo, Tipos } from "../../Util/Tipo";
import { Expresion } from "../../Abstract/Expresion";
import { Entorno } from "../../TablaSimbolos/Entorno";
import { Generator } from "../../Generator/Generator";
import { Error_ } from "../../Util/Error_";
import { Case } from './Case';
import { Igual } from '../../Expresion/Relacional/Igual';

export class Switch extends Instruccion {
    private condicion: Expresion;
    private case_array: Array<Case> = new Array<Case>();
    private lbl_list : Array<string> = new Array<string>();

    constructor( condicion: Expresion, case_array: Array<Case>, line: number, column: number) {
        super(line, column);
        this.condicion = condicion;
        this.case_array = case_array;
    }

    compile(env: Entorno): void {
        //TODO break y continue  
        const generator = Generator.getInstance();
        // Ejecutar expresion recibida en switch
        const leftOp = this.condicion.compile(env);
        this.case_array.forEach((instr)=>{
            const exp = instr.condicion.compile(env);
            const caseLbl = generator.newLabel();
            this.lbl_list.push(caseLbl);           
            generator.addIf(leftOp.getValue() , exp.getValue(), "==", caseLbl );
        });
        const exitLbl = generator.newLabel();        
        for(let i = 0; i < this.case_array.length; i++){
            generator.addLabel(this.lbl_list[i]);
            this.case_array[i].compile(env);
        }
        generator.addLabel(exitLbl);
    }
}
