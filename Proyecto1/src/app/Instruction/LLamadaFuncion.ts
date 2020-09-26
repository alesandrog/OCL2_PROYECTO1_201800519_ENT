import { Instruction } from "../Abstract/Instruccion";
import { Expresion } from "../Abstract/Expresion";
import { Entorno } from "../Symbol/Entorno";
import { Error_ } from "../Error/Error";
import { Retorno, Tipo } from "../Abstract/Retorno";
import { Return } from "./Return";
import { AccesoTipoType } from "../Expression/AccesoTipoType";
import { errores } from "../Error/Errores";
import { MapAccesos , MapEntornos } from "../Traduccion/MapsGlobales";
export class LlamadaFuncion extends Instruction {
  constructor(
    private id: string,
    public parametros: Expresion[] | null,
    line: number,
    column: number
  ) {
    super(line, column);
  }

  public execute(entorno: Entorno): Retorno | null {
    //TODO validar tipo y retorno
    try {
      const func = entorno.getFuncion(this.id);
      if (func != undefined) {
        let envGlob = new Entorno(entorno.getGlobal());
        let newEnv : Entorno;
        if(MapAccesos.has(this.id)){ //Si tiene una funcion padre, el anterior sera el entorno padre
          const padre  = MapAccesos.get(this.id);
          newEnv = new Entorno(MapEntornos.get(padre));
          newEnv.anterior.anterior = envGlob;
        }else{ //de lo contrario, el anterior es el entorno global
          newEnv = new Entorno(entorno.getGlobal());
        }
        newEnv.idEntorno = this.id;
        MapEntornos.set(this.id , newEnv);
        //Validar cantidad de parametros
        if (this.parametros != null) {
          if (this.parametros.length != func.parametros!.length) {
            if (this.parametros.length > func.parametros!.length)
              throw new Error_(
                this.linea,
                this.columna,
                "Semantico",
                "Exceso de parametros especificados para la funcion "
              );
            else
              throw new Error_(
                this.linea,
                this.columna,
                "Semantico",
                "Faltan parametros "
              );
          }
          //Validar que los parametros reciban expresiones correctas
          for (let i = 0; i < this.parametros.length; i++) {
            const value = this.parametros[i].execute(entorno);
            let variable: any;
            variable = func.parametros![i];
            if (variable.tipo instanceof AccesoTipoType) {
              let v = variable.tipo.execute(entorno);
              if (value.tipo == v.tipo || value.tipo == Tipo.NULL) {
                newEnv.guardarVariable(
                  func.parametros![i].id,
                  value.value,
                  v.tipo,
                  true
                );
              } else {
                throw new Error_(
                  this.linea,
                  this.columna,
                  "Semantico",
                  "Tipos incompatibles " + " valor no asignable a " + v.id
                );
              }
            } else {
              if (variable.tipo < 8) {
                if (Tipo[value.tipo] == Tipo[variable.tipo]) {
                  newEnv.guardarVariable(
                    func.parametros![i].id,
                    value.value,
                    value.tipo,
                    true
                  );
                } else {
                  throw new Error_( this.linea,this.columna,"Semantico","Tipos incompatibles " +Tipo[value.tipo] +" no asignable a " +Tipo[variable.tipo]);
                }
              } else {
                if (value.tipo == variable.tipo || value.tipo == Tipo.NULL) {
                  newEnv.guardarVariable(
                    func.parametros![i].id,
                    value.value,
                    variable.tipo,
                    true
                  );
                } else {
                  throw new Error_(
                    this.linea,
                    this.columna,
                    "Semantico",
                    "Tipos incompatibles " +
                      Tipo[value.tipo] +
                      " no asignable a " +
                      Tipo[variable.tipo]
                  );
                }
              }
            }
          }
        }
        newEnv.cantidadFunciones++;
        for (const instr of func.code) {
  //          if(instr instanceof Instruction){
                const element = instr.execute(newEnv);
                if(element instanceof Return){
                    if(func.tipo != Tipo.NULL){
                        //Verificar si el retorno y la funcion son del mismo tipo
                        if(element.result?.tipo == func.tipo){
                            return element.result;
                        }else{
                            //Posiblemente la funcion sea de tipo Type
                            //Verificar el tipo de la funcion
                            if(func.tipo instanceof AccesoTipoType){
                                //Ejecutar el acceso al tipo
                                let tipoFunc = func.tipo.execute(entorno);                                
                                //Verificar tipos de nuevo
                                if(tipoFunc.tipo == element.result?.tipo){
                                    return { value : element.result?.value , tipo: tipoFunc };                            
                                }else if(element.result?.tipo == Tipo.NULL){
                                    //Un valor nulo tambien puede ser asignado a un type
                                    return { value : element.result.value , tipo: tipoFunc };                            
                                }else{
                                    throw new Error_(this.linea, this.columna, 'Semantico', 'Tipos incompatibles ' + element.result?.tipo! + ' no asignable a ' +  tipoFunc.tipo);                                    
                                }
                            }                            
                            throw new Error_(this.linea, this.columna, 'Semantico', 'Tipos incompatibles ' + Tipo[element.result?.tipo!] + ' no asignable a ' +  Tipo[func.tipo]);
                        }
                    }else{
                        func.tipo = element.result?.tipo!;
                        return element.result;
                    }
                }
                MapEntornos.set(this.id , newEnv);                
        }
        newEnv.cantidadFunciones--;
        MapEntornos.set(this.id , newEnv);
        }
        //TODO validar que el tipo de retorno se pueda operar
      }catch (error) {
      errores.push(error);
    }
    return null;
  }
}
