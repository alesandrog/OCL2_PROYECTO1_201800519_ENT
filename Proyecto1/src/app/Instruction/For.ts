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
import { Incremento } from "./Incremento";

export class For extends Instruction {

  private iterador : string;

  constructor(
    private declaracion : Declaration | Asignacion,
    private condicion: Expresion,
    private actualizacion : Asignacion | Expresion,
    private code: BloqueInstrucciones,
    linea: number,
    columna: number
  ) {
    super(linea, columna);
    this.iterador = "";
  }

  public execute(entorno: Entorno) {

    let env : Entorno;    
    //Guardar la variable que va a ser iterada
    if(this.declaracion instanceof Declaration){
      env = new Entorno(entorno);
  
    }else{
      env = entorno;
    }

    this.iterador = this.declaracion.id;
    this.declaracion.execute(env);

    //Verificar que la condicion sea booleana
    let condicion = this.condicion.execute(env);
    if(condicion.tipo != Tipo.BOOLEAN)
      throw new Error_(this.linea, this.columna, 'Semantico', 'La condicion no es booleana ' + Tipo[condicion.tipo] );   


      while (condicion.value == true) {
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
          
        if(this.actualizacion instanceof Asignacion){
          this.actualizacion.execute(env);
        }else{
          const v = env.getVariable(this.iterador);
          const act = this.actualizacion.execute(env);
          if(act.tipo != Tipo.NUMBER)
            throw new Error_(this.linea, this.columna, 'Semantico', 'Expresion invalida ' + Tipo[act.tipo] );          
          env.actualizarVariable(this.iterador , act.value, act.tipo, true);
        }

        condicion = this.condicion.execute(env);
        if (condicion.tipo != Tipo.BOOLEAN) {
          throw new Error_(this.linea, this.columna, 'Semantico', 'La condicion no es booleana ' + Tipo[condicion.tipo] );   
        }
      }
    
  }
}

/*

    | 'ID' '++'
    {
        var v1 = new Access($1, @1.first_line, @1.first_column);
        var v2 =  new Literal(1, @1.first_line, @1.first_column, Tipo.NUMBER);
        $$ = new ExpresionAritmetica(v1, v2, OperacionesAritmeticas.SUMA, @1.first_line,@1.first_column);
    }

*/