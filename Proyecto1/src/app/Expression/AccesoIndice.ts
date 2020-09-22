import { Expresion } from "../Abstract/Expresion";
import { Entorno } from "../Symbol/Entorno";
import { Retorno } from "../Abstract/Retorno";
import { Error_ } from "../Error/Error";
import { Arreglo2 } from "../Instruction/Arreglo2";
import { AccesoType } from "./AccesoType";

export class AccesoIndice extends Expresion{

    public id : string;
    public anterior : Expresion | AccesoIndice | null;
    public indice : Expresion;
    public final : boolean;
    public tipoAcc : string;

    constructor(id: string,  anterior : Expresion | AccesoIndice | null, indice : Expresion, final : boolean , tipoAcc : string , linea : number, columna: number){
        super(linea, columna);
        this.id = id;
        this.anterior = anterior;
        this.indice = indice;
        this.final = final;
        this.tipoAcc = tipoAcc;
    }

    //TODO validar null y undefined, mensajes de error

    public execute(entorno : Entorno): any {
        let valor : any;
        if(this.anterior != null){
            if(this.anterior instanceof AccesoIndice || this.anterior instanceof AccesoType){
                this.anterior.id = this.id;
                valor = this.anterior.execute(entorno);
                const index = this.indice.execute(entorno);
                if(this.tipoAcc == "asig"){
                let result = valor.value[index.value];
                if(result == undefined && this.final == true){
                    return { value : valor.value , tipo : "PUSH ARRAY"};
                }
                valor = valor.value;
                return valor[index.value]; 
                }else{
                    //TODO if undefined thwrow error
                    valor = valor.value;
                    return valor[index.value];                       
                }                     
            }
        }else{
            let arreglo : any;
            arreglo = entorno.getVariable(this.id)?.valor;
            const index = this.indice.execute(entorno );
            let result = arreglo[index.value];
            if(this.tipoAcc == "asig"){ //Cuando haga asignaciones
                if(result == undefined && this.final == true){
                return { value : arreglo , tipo : "PUSH ARRAY"};
            }
            return arreglo[index.value];
            }else{
                //if undefined throw error
                return arreglo[index.value];
            }


        }
    }
}