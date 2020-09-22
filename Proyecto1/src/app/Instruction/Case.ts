import { Instruction } from "../Abstract/Instruccion";
import { Entorno } from "../Symbol/Entorno";
import { Expresion } from "../Abstract/Expresion";
import { errores } from "../Error/Errores";
import { Break } from "./Break";
import { Continue } from "./Continue";
import { Return } from "./Return";
import { Error_ } from "../Error/Error";

export class Case extends Instruction {
  public condicion: Expresion;
  private code: Instruction[];

  constructor(
    condicion: Expresion,
    code: Instruction[],
    linea: number,
    columna: number
  ) {
    super(linea, columna);
    this.condicion = condicion;
    this.code = code;
  }

  public execute(entorno: Entorno) {
    const newEnv = new Entorno(entorno);
    newEnv.cantidadCiclos = entorno.cantidadCiclos;
    newEnv.cantidadCiclos++;
    newEnv.cantidadFunciones = entorno.cantidadFunciones;
    for (const instr of this.code) {
      const exec = instr.execute(newEnv);
      if (exec instanceof Break) {
        break;
      } else if (exec instanceof Continue) continue;
      if (exec instanceof Return) return exec;
    }
    newEnv.cantidadCiclos--;
  }
}
