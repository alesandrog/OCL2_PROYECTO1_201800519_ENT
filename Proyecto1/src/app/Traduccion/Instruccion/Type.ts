import { InstruccionT } from "../Abstract/Instruccion";
import { EntornoT } from "../Symbol/Entorno";


export class TypeT extends InstruccionT  {

    constructor(private id : string, private atributos :  InstruccionT[] ) {
      super();
  }

  public traducir(entorno : EntornoT) :string{
    let atrib = "";
    for(let i = 0; i < this.atributos.length; i++){
      if( i < this.atributos.length -1){
          atrib += this.atributos[i].traducir(entorno) + ",\n";
      }else{
          atrib += this.atributos[i].traducir(entorno) ;
      }
  }
    return `type ${this.id} = {\n${atrib}\n};`;
  }
}