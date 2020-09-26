import { ExpresionT } from "../Abstract/Expresion";
import { EntornoT } from "../Symbol/Entorno";


export class ExpresionBinariaT extends ExpresionT  {

    private izq: ExpresionT;
    private der: ExpresionT;
    private operador: string;

    constructor( izq : ExpresionT, der : ExpresionT, operador:string  ) {
      super();
      this.izq = izq;
      this.der = der;
      this.operador = operador;
  }

  public traducir(entorno : EntornoT) :string{
    const vizq = this.izq.traducir(entorno);
    const vder = this.der.traducir(entorno);
    return `${vizq}${this.operador}${vder}`;
  }
}