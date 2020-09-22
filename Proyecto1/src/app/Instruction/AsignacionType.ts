import { Instruction } from "../Abstract/Instruccion";
import { Entorno } from "../Symbol/Entorno";
import { env } from "process";
import { Error_ } from "../Error/Error";
import { Retorno, Tipo } from "../Abstract/Retorno";
import { AtributoType } from "../Expression/AtributoType";

export class AsignacionType extends Instruction{

    public res : Map<string, Retorno> | null | any = new Map<string, Retorno>();    
    private id : string;
    private value : Array<AtributoType>;

    constructor(id:string , value : Array<AtributoType>,  linea : number, columna: number){
        super(linea, columna);
        this.id = id;
        this.value = value;
    }

    public execute(entorno : Entorno) {
            
        //Ejecutar los atributos recibidos y agregarlos al Map
        for(const instr of this.value){
            const exe = instr.execute(entorno);
            this.res.set(instr.id , exe);
        }

        //Convertir map en array para verificar valores
        let arr = [];
        this.res.forEach(( id : string, ret : Retorno) => {
            let resu = [];
            resu.push(ret);            
            resu.push(id);
            arr.push(resu);
        });
        console.log("================= en asig");
        console.log(arr);
        
/*        for(const val of this.res){
                arr.push(val);
            }*/
        

        const val = entorno.getVariable(this.id);
        console.log("===================== A BUSCAR TIPO ");
        const tipo = entorno.buscarTipo(val?.tipo!);
        console.log("===================== ASIGNACION TYPE");
        console.log(val);
        console.log(tipo);
        if(tipo == null || tipo == undefined)
            throw new Error_(this.linea, this.columna, 'Semantico', 'Type no definido');

        //Comparar atributos recibidos con atributos definidos en el type
        for(let i = 0; i < tipo.valor.length; i++){
            if(tipo.valor[i].id != arr[i][0] ){ //verificar que el parametro sea igual
                throw new Error_(this.linea, this.columna, 'Semantico', 'Atributos no coinciden con los definidos en ' + tipo.id + " 2");
            }
            if(tipo.valor[i].tipo != arr[i][1].tipo){ //verificar que el tipo sea igual
                if((tipo.valor[i].tipo > 7) && (arr[i][1].tipo == Tipo.NULL)){ //es una variable type y puede inicializarse en null
                    arr[i][1].tipo = tipo.valor[i].tipo;
                }else{
                    throw new Error_(this.linea, this.columna, 'Semantico', 'Atributos no coinciden con los definidos en ' + tipo.id + " 2");
                }
            }
           } 

        //Ejecutar los atributos recibidos y agregarlos al Map
/*        for(const instr of this.value){
            const exe = instr.execute(entorno);
            if(exe.tipo == Tipo.NULL){
                const type = entorno.getTipo(instr.id);
                //TODO verificar que retorne algo
                exe.tipo = type?.tipo!;
            }
            this.res.set(instr.id , exe);
        }
*/
        entorno.actualizarVariable(this.id, this.res, val?.tipo!, true);
    }
}