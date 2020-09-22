import { Instruction } from "../Abstract/Instruccion";
import { Entorno } from "../Symbol/Entorno";
import { errores } from "../Error/Errores";
import { Error_ } from "../Error/Error";

export class BloqueInstrucciones extends Instruction{

    constructor(private code : Instruction[], linea : number, columna : number){
        super(linea, columna);
    }

    public execute(entorno : Entorno) {
        const newEnv = new Entorno(entorno);
        newEnv.cantidadCiclos = entorno.cantidadCiclos;
        newEnv.cantidadFunciones = entorno.cantidadFunciones;
        for(const instr of this.code){
            try {
                if(instr instanceof Instruction){
                    const element = instr.execute(newEnv);
                    if(element != undefined || element != null)
                        return element;
                }else{
                    //errores.push(new Error_(this.linea, this.columna, 'Sintactico', 'Caracter inesperado: ' + instr));
                    throw new Error_(this.linea, this.columna, 'Sintactico', 'Caracter inesperado: ' + instr);
                }                
            } catch (error) {
                errores.push(error);
            }
        }
    }
}