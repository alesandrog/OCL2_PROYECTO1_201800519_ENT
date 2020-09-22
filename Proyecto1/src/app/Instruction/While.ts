import { Instruction } from "../Abstract/Instruccion";
import { Expresion } from "../Abstract/Expresion";
import { Entorno } from "../Symbol/Entorno";
import { Tipo } from "../Abstract/Retorno";
import { Error_ } from "../Error/Error";
import { BloqueInstrucciones } from "./BloqueInstrucciones";
import { Break } from "./Break";
import { Continue } from "./Continue";

export class While extends Instruction {
  constructor(
    private condicion: Expresion,
    private code: BloqueInstrucciones,
    linea: number,
    columna: number
  ) {
    super(linea, columna);
  }

  public execute(entorno: Entorno) {
    let condition = this.condicion.execute(entorno);
    if (condition.tipo != Tipo.BOOLEAN) {
      throw new Error_(
        this.linea,
        this.columna,
        "Semantico",
        "La condicion no es booleana " + " > " + Tipo[condition.tipo]
      );
    }
    while (condition.value == true) {
      entorno.cantidadCiclos++;
      const exec = this.code.execute(entorno);
      entorno.cantidadCiclos--;
      if (exec instanceof Break) {
        break;
      }
      else if( exec instanceof Continue)
        continue;
      condition = this.condicion.execute(entorno);
      if (condition.tipo != Tipo.BOOLEAN) {
        throw new Error_(
          this.linea,
          this.columna,
          "Semantico",
          "La condicion no es booleana " + " > " + Tipo[condition.tipo]
        );
      }
    }
  }
}
