import { Instruction } from "../Abstract/Instruccion";
import { Entorno } from "../Symbol/Entorno";
import { Expresion } from "../Abstract/Expresion";
import { Case } from "./Case";
import { errores } from "../Error/Errores";
import { Return } from "./Return";
import { Break } from "./Break";
import { Continue } from "./Continue";


export class Switch extends Instruction{
    
    public condicion : Expresion;
    private cases : Case[];
    private def : Instruction[] | null;

    constructor(condicion : Expresion, cases : Case[] , def : Instruction[] | null, linea :number , columna : number){
        super(linea , columna);
        this.condicion = condicion;
        this.cases = cases;
        this.def = def;
    }
    //TODO validar errores
    public execute(entorno:Entorno) {
        const switchVal = this.condicion.execute(entorno);
        for(const instr of this.cases){
            let caseVal = instr.condicion.execute(entorno);
            if(switchVal.value == caseVal.value){
                const exec = instr.execute(entorno);
                if (exec instanceof Break) {
                    break;
                  } else if (exec instanceof Continue) continue;
                  if (exec instanceof Return) return exec;
                return;
            }
         }
         if(this.def != null){
             entorno.cantidadCiclos++;            
             for(const instr of this.def){
                const exec = instr.execute(entorno);
                if (exec instanceof Break) {
                    break;
                  } else if (exec instanceof Continue) continue;
                  if (exec instanceof Return) return exec;
            }
            entorno.cantidadCiclos--;
         }
    }
}