import { Expresion } from "../Abstract/Expresion";
import { Retorno, Tipo } from "../Abstract/Retorno";
import { Entorno } from "../Symbol/Entorno";
import { AtributoType } from "../Expression/AtributoType";
import { Instruction } from "../Abstract/Instruccion";
import { AccesoTipoType } from "../Expression/AccesoTipoType";
import { strict } from "assert";
import { Error_ } from "../Error/Error";

export class Type extends Instruction{
    
    public value : Map<string, Retorno> | null | any = new Map<string, Retorno>();
    private atributos : Array<AtributoType>;
    public linea : number;
    public columna : number;
    private id : string;
    private tipo : AccesoTipoType

    constructor(id: string ,valor : Array<AtributoType> , tipo : AccesoTipoType, linea : number, columna: number){
        super(linea, columna);
        this.id = id;
        this.atributos = valor;
        this.tipo = tipo;
        this.linea = linea;
        this.columna = columna;
    }

    public execute(entorno : Entorno){
        //TODO validar que se encuentre el type

        //Verificar que no se recibe algo diferente a un ID
        if((this.tipo instanceof AccesoTipoType) == false)
            throw new Error_(this.linea, this.columna, 'Semantico', this.tipo + ' No asignable a Type');
        
        //Ejecutar los atributos recibidos y agregarlos al Map
        for(const instr of this.atributos){
            const exe = instr.execute(entorno);
            this.value.set(instr.id , exe);
        }

        //Convertir map en array para verificar valores
        let arr = [];    
/*        for(const val of this.value){
                arr.push(val);
            }*/
        this.value.forEach(( id : string, ret : Retorno) => {
            let res = [];
            res.push(ret);
            res.push(id);
            arr.push(res);
        });
        
        console.log(arr);

        //Buscar el tipo en el Map
        const tipo = this.tipo.execute(entorno);
        console.log("===================== ACCESO");
        console.log(tipo);
        //Validar que el tipo existe
        if(tipo == null || tipo == undefined)
            throw new Error_(this.linea, this.columna, 'Semantico', 'Type no definido');

        
        //Verificar que la cantidad de atributos recibidos sea igual a la cantidad esperada

        if(arr.length != tipo.valor.length)
            throw new Error_(this.linea, this.columna, 'Semantico', 'Atributos no coinciden con los definidos en ' + tipo.id + " 1");

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
        entorno.guardarVariable(this.id, this.value, tipo.tipo, true);
    }    
}