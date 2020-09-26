import { ExpresionT } from "../Abstract/Expresion";
import { InstruccionT } from "../Abstract/Instruccion";
import { EntornoT } from "../Symbol/Entorno";


export class AtrTypeT extends InstruccionT  {

    constructor(private id : string, private exp :  ExpresionT | string  ) {
      super();
  }

  public traducir(entorno : EntornoT) :string{

    if(this.exp instanceof ExpresionT){
        return `${this.id} : ${this.exp.traducir(entorno)}`; 
    }
    return `${this.id} : ${this.exp}`; 
  }
}