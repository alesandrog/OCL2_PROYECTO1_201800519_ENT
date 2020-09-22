import { Instruction } from "../Abstract/Instruccion";
import { Entorno } from "../Symbol/Entorno";
import { Expresion } from "../Abstract/Expresion";
import { env } from "process";
import { Error_ } from "../Error/Error";
import { Retorno, Tipo } from "../Abstract/Retorno";
import { AccesoIndice } from "../Expression/AccesoIndice";
import { Simbolo } from "../Symbol/Simbolo";

export class AsignacionArray extends Instruction{

    private value : Expresion;
    private accesos : AccesoIndice;

    constructor(accesos : AccesoIndice, value : Expresion,  linea : number, columna: number){
        super(linea, columna);
        this.value = value;
        this.accesos = accesos;
    }

    public execute(entorno : Entorno) {
        let val : any = this.value.execute(entorno);
        if(val.tipo == Tipo.ARRAY){
            val = this.ejecutar(entorno, val);
        }

        const acceso = this.accesos.execute(entorno);
        if(acceso != null && acceso != undefined){
                 if(acceso.tipo == val.tipo){
                    acceso.value = val.value;
                }else{
                    if(val.tipo instanceof Simbolo){
                    
                        if(acceso.tipo == val.tipo.tipo){
                            if(val.value instanceof Map){
                                let newMap = new Map<string , Retorno>();
/*                                for(const instr of val.value){
                                    let iden = instr[0];
                                    let smbl : Retorno = { value : instr[1].value , tipo : instr[1].tipo};
                                    newMap.set(iden , smbl);
                                }*/
                                val.value.forEach(( retorno : Retorno , identificador : string) => {
                                    let iden = identificador;
                                    let smbl : Retorno = { value: retorno.value , tipo: retorno.tipo};
                                    newMap.set(iden , smbl);
                                });
                                acceso.value = newMap;
                                return;
                            }
                            acceso.value = val.value;
                            return;
                        }
                    }else if( acceso.tipo == "PUSH ARRAY"){
                        const indice = this.accesos.indice.execute(entorno);
                        let arreglo = acceso;
                        if(val.tipo == Tipo.ARRAY){
                            arreglo.value[indice.value] = val;
                            arreglo.tipo = Tipo.ARRAY;
                            return;
                        }else{
                            arreglo.value[indice.value] = val;   
                            return;
                        }
                    }
                    throw new Error_(this.linea, this.columna, 'Semantico', 'Tipos incompatibles ' + val.tipo + ' no asignable a ' +  acceso.tipo);
                }
        }else{
            throw new Error_(this.linea, this.columna, 'Semantico','Acceso Indefinido ');
        }           
    }

    public ejecutar(entorno : Entorno, arreglo : Retorno): Retorno {
        let res = [];
        for(const instr of arreglo.value){
            if(instr.tipo == Tipo.ARRAY){
                res.push(this.ejecutar(entorno, instr));
            }else{
                let val = instr.value;
                let tip = instr.tipo;
                res.push({ value : val , tipo : tip });
            }
        }
        return { value : res, tipo : Tipo.ARRAY };
    }

}