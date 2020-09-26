import { ExpresionT } from "../Abstract/Expresion";
import { EntornoT } from "../Symbol/Entorno";


export class ExpresionUnariaT extends ExpresionT  {

    private izq: ExpresionT;
    private operador: string;

    constructor( izq : ExpresionT, operador:string  ) {
      super();
      this.izq = izq;
      this.operador = operador;
  }

  public traducir(entorno : EntornoT) :string{
    const vizq = this.izq.traducir(entorno);
    if(this.operador == '++'){
        return `${vizq}${this.operador}`;
    }else if(this.operador == '--'){
        return `${vizq}${this.operador}`;
    }else if(this.operador == '!'){
        return `${this.operador}${vizq}`;
    }else if(this.operador == '('){
      return `(${vizq})`;
    }else if(this.operador == '-'){
      return `-${vizq}`;
    }
    return "";
  }
}