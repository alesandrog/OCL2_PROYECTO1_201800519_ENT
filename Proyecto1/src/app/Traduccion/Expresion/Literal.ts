import { ExpresionT } from "../Abstract/Expresion";
import { EntornoT } from "../Symbol/Entorno";


export class LiteralT extends ExpresionT  {

    private valor : string;
    constructor( valor : string ) {
      super();
      this.valor = valor;
  }

  public traducir(entorno : EntornoT) :string{
    return this.valor;
  }
}