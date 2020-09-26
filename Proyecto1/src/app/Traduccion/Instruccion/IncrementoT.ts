import { InstruccionT } from "../Abstract/Instruccion";
import { EntornoT } from "../Symbol/Entorno";


export class IncrementoT extends InstruccionT  {

    private valor : string;
    private operador : string;
    public ptComa : string;
    constructor( valor : string , operador:string, ptComa : string ) {
      super();
      this.valor = valor;
      this.ptComa = ptComa;
      this.operador = operador;
  }

  public traducir(entorno : EntornoT) :string{
    return `${this.valor}${this.operador}${this.ptComa}`;
  }
}