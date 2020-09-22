import { Instruction } from "../Abstract/Instruccion";
import { Expresion } from "../Abstract/Expresion";
import { Entorno } from "../Symbol/Entorno";
import { Tipo } from "../Abstract/Retorno";
import { Error_ } from "../Error/Error";
import { BloqueInstrucciones } from "./BloqueInstrucciones";
import { Break } from "./Break";
import { Continue } from "./Continue";
import { Asignacion } from "./Asignacion";
import { Declaration } from "./Declaracion";
import { Return } from "./Return";

export class ForOf extends Instruction {
 
  private declaracion : Declaration;
  private arreglo: Expresion;
  private limite : number;
  private code: BloqueInstrucciones;

constructor( declaracion : Declaration , arreglo : Expresion, code : BloqueInstrucciones, linea: number, columna: number) {
  super(linea, columna);
  this.declaracion = declaracion;
  this.arreglo = arreglo;
  this.code = code;
  this.limite = 0;
}

//TODO validaciones de errores

public execute(entorno: Entorno) {
  
  //Declarar la variable en un nuevo entorno
  let env = new Entorno(entorno);

  const iterador = this.arreglo.execute(env);

  if(iterador.tipo != Tipo.ARRAY)
    throw new Error_(this.linea, this.columna, 'Semantico', 'Valor no iterable' + Tipo[iterador.tipo]);

  //establecer limite del for
  this.limite = iterador.value.length;
  
  for(let i = 0; i < this.limite; i++){
      let element = iterador.value[i];
      env.guardarVariable(this.declaracion.id, element.value, element.tipo, this.declaracion.variable);
      env.cantidadCiclos++;
      env.cantidadFunciones = entorno.cantidadFunciones;
      const exec = this.code.execute(env);
      env.cantidadCiclos--;    
      if (exec instanceof Break) {
        break;
      }
      else if( exec instanceof Continue)
        continue;

      if(exec instanceof Return)
        return exec;
        
  }
  
}
}