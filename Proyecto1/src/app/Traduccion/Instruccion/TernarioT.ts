import { ExpresionT } from "../Abstract/Expresion";
import { EntornoT } from "../Symbol/Entorno";


export class TernarioT extends ExpresionT  {

    private condicion : ExpresionT;
    private v1 : ExpresionT;
    private v2 : ExpresionT;

    constructor( condicion : ExpresionT , v1 : ExpresionT , v2: ExpresionT) {
      super();
      this.condicion = condicion;
      this.v1 = v1;
      this.v2 = v2;
  }

  public traducir(entorno : EntornoT) :string{
    const cond  = this.condicion.traducir(entorno);
    const val1 = this.v1.traducir(entorno);
    const val2 = this.v2.traducir(entorno);
    return `${cond} ? ${val1} : ${val2}`
  }
}