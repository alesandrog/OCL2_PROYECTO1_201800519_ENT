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
    private def: Instruccion[] | null;
    private lbl_list : Array<string> = new Array<string>();

    constructor( condicion: Expresion, case_array: Array<Case>, def: Instruccion[] | null, line: number, column: number) {
        super(line, column);
        this.condicion = condicion;
        this.case_array = case_array;
        this.def = def;
    }

    compile(env: Entorno): void {
        const generator = Generator.getInstance();
        // Ejecutar expresion recibida en switch
        const leftOp = this.condicion.compile(env);
        // Generar etiquetas para cada Case
        this.case_array.forEach((instr)=>{
            const exp = instr.condicion.compile(env);
            const caseLbl = generator.newLabel();
            this.lbl_list.push(caseLbl);           
            generator.addIf(leftOp.getValue() , exp.getValue(), "==", caseLbl );
        });
        const newEnv = new Entorno(env);
        const exitLbl = generator.newLabel(); 
        newEnv.break = exitLbl;       
        const defLabel = generator.newLabel();
        generator.addGoto(defLabel);     
        for(let i = 0; i < this.case_array.length; i++){
            generator.addLabel(this.lbl_list[i]);
            this.case_array[i].compile(newEnv);
        }                   
        generator.addLabel(defLabel);
        if(this.def !=null){
            const defLbl = generator.newLabel();
            generator.addLabel(defLbl);

            this.def.forEach((instr)=>{
                instr.compile(newEnv);
            });
        }                
        generator.addLabel(exitLbl);
    }
}
