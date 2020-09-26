import { ExpresionT } from "../Abstract/Expresion";
import { EntornoT } from "../Symbol/Entorno";


export class AccesoT extends ExpresionT  {

    constructor(private tipoAcceso : number, private expresion : ExpresionT | string  ) {
      super();

  }

  public traducir(entorno : EntornoT) :string{
    if(this.tipoAcceso == 1){ //acceso a type 
        return `.${this.expresion}`;
    }else if(this.tipoAcceso == 2){ //acceso a array
        if(this.expresion instanceof ExpresionT) 
            return `[${this.expresion.traducir(entorno)}]`;
    }else{
        return "";
    } 
  }
}