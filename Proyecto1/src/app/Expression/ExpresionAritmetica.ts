import { Expresion } from "../Abstract/Expresion";
import { Retorno, Tipo } from "../Abstract/Retorno";
import { Entorno } from "../Symbol/Entorno";
import { Error_ } from "../Error/Error";

export enum OperacionesAritmeticas {
  SUMA,
  RESTA,
  MULTIPLICACION,
  DIVISION,
  POTENCIA,
  MODULO
}

export class ExpresionAritmetica extends Expresion {
  constructor(
    private izq: Expresion,
    private der: Expresion,
    private tipo: OperacionesAritmeticas,
    linea: number,
    columna: number
  ) {
    super(linea, columna);
  }

  public execute(entorno: Entorno): Retorno {
    let izq = this.izq.execute(entorno);
    let der = this.der.execute(entorno);
    if(izq.tipo == Tipo.ARRAY){
      izq = this.ejecutar(entorno, izq);
    }
    if(der.tipo == Tipo.ARRAY){
      der = this.ejecutar(entorno, izq);
    }
    let result: Retorno;
    const tipoDominante = this.tipoDominante(izq.tipo, der.tipo);

    if (this.tipo == OperacionesAritmeticas.SUMA) {
      if (tipoDominante == Tipo.STRING){
        let texto = izq.value.toString() + der.value.toString();
        texto = texto.replace(/\\t/g, "\t");
        texto = texto.replace(/\\n/g, "\n");
        texto = texto.replace(/\\r/g, "\n");
        texto = texto.replace(/\\"/g, "\"");
        texto = texto.replace(/\\\\/g, "\\");                
        result = {
            value: texto,
            tipo: Tipo.STRING,
          };
      }
      else if (tipoDominante == Tipo.NUMBER)
        result = { value: izq.value + der.value, tipo: Tipo.NUMBER };
      else
        throw new Error_(
          this.linea,
          this.columna,
          "Semantico",
          "No se puede operar: " + Tipo[izq.tipo] + " + " + Tipo[der.tipo]
        );
    } else if (this.tipo == OperacionesAritmeticas.RESTA) {
      if (tipoDominante != Tipo.NUMBER)
        throw new Error_(
          this.linea,
          this.columna,
          "Semantico",
          "No se puede operar: " + Tipo[izq.tipo] + " - " + Tipo[der.tipo]
        );
      result = { value: izq.value - der.value, tipo: Tipo.NUMBER };
    } else if (this.tipo == OperacionesAritmeticas.MULTIPLICACION) {
      if (tipoDominante != Tipo.NUMBER)
        throw new Error_(
          this.linea,
          this.columna,
          "Semantico",
          "No se puede operar: " + Tipo[izq.tipo] + " * " + Tipo[der.tipo]
        );
      result = { value: izq.value * der.value, tipo: Tipo.NUMBER };
    } else if (this.tipo == OperacionesAritmeticas.POTENCIA) {
      if (tipoDominante != Tipo.NUMBER)
        throw new Error_(
          this.linea,
          this.columna,
          "Semantico",
          "No se puede operar: " + Tipo[izq.tipo] + " * " + Tipo[der.tipo]
        );
      result = { value: izq.value ** der.value, tipo: Tipo.NUMBER };
    }else if (this.tipo == OperacionesAritmeticas.MODULO) {
      if (tipoDominante != Tipo.NUMBER)
        throw new Error_(
          this.linea,
          this.columna,
          "Semantico",
          "No se puede operar: " + Tipo[izq.tipo] + " * " + Tipo[der.tipo]
        );
      result = { value: izq.value % der.value, tipo: Tipo.NUMBER };
    }
     else {
      if (der.value == 0) {
        throw new Error_(
          this.linea,
          this.columna,
          "Semantico",
          "No se puede operar: " + Tipo[izq.tipo] + " / 0"
        );
      }
      if (tipoDominante != Tipo.NUMBER)
        throw new Error_(
          this.linea,
          this.columna,
          "Semantico",
          "No se puede operar: " + Tipo[izq.tipo] + " / " + Tipo[der.tipo]
        );
      result = { value: izq.value / der.value, tipo: Tipo.NUMBER };
    }
    return result!;
  }


  public ejecutar(entorno : Entorno, arreglo : Retorno): Retorno {
    let res = [];
    for(const instr of arreglo.value){
        if(instr.tipo == Tipo.ARRAY){
            res.push(this.ejecutar(entorno, instr).value);
        }else{
            res.push(instr.value);
        }
    }
    return { value : res, tipo : Tipo.ARRAY };
}
}
