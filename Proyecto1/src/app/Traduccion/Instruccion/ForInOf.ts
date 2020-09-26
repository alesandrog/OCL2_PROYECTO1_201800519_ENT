import { InstruccionT } from "../Abstract/Instruccion";
import { ExpresionT } from "../Abstract/Expresion";
import { EntornoT } from "../Symbol/Entorno";

import { BloqueInstruccionesT } from "./BloqueInstrucciones";
import { AsignacionT } from "./Asignacion";
import { DeclaracionT } from "./Declaracion";

export class ForInOf extends InstruccionT {
 
    private declaracion : DeclaracionT;
    private arreglo: ExpresionT;
    private incremento : InstruccionT | null;
    private code: BloqueInstruccionesT;
    public tipo : number;

  constructor( declaracion : DeclaracionT , arreglo : ExpresionT, incremento :  InstruccionT | null, code : BloqueInstruccionesT, tipo : number) {
    super();
    this.declaracion = declaracion;
    this.arreglo = arreglo;
    this.code = code;
    this.incremento = incremento;
    this.tipo = tipo;
  }

  public traducir(entorno: EntornoT): string  {
      console.log(this);
        const decla = this.declaracion.traducir(entorno);
        const iterador = this.arreglo.traducir(entorno);
        const codigo = this.code.traducir(entorno);

        if(this.tipo == 0){ // For normal
            if(this.incremento != null){
                const incr = this.incremento.traducir(entorno);
                return `for(${decla} ${iterador}; ${incr}){\n${codigo}\n}`;
            }
        }else if( this.tipo == 1){ //For of
            return `for{${decla} of ${iterador}}{\n${codigo}\n}`;
        }else{
            return `for{${decla} in ${iterador}}{\n${codigo}\n}`;
        }
  }
}