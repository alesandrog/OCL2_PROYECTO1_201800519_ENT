import { Expresion } from "../../Abstract/Expresion";
import { Entorno } from "../../TablaSimbolos/Entorno";
import { Retorno } from "../../Util/Retorno";
import { Generator } from "../../Generator/Generator";
import { Tipos, Tipo } from "../../Util/Tipo";
import { Error_ } from "../../Util/Error_";
import { AccesoArreglo } from './AccesoArreglo';

export class AccesoType extends Expresion {

    public id : string;
    public anterior : Expresion | null;
    public indice : string;
    public final : boolean;
    public tipoAcc : string;
    linea : number;
    columna : number;


    constructor(id: string,  anterior : Expresion |  null, indice : string, final : boolean , tipoAcc : string , linea : number, columna: number){
        super(linea, columna);
        this.id = id;
        this.anterior = anterior;
        this.indice = indice;
        this.final = final;
        this.tipoAcc = tipoAcc;
        this.linea = linea;
        this.columna = this.column;
    }



    public compile(env: Entorno): Retorno {
        const generator = Generator.getInstance();
        let valor : any;
        if(this.anterior != null){
            if(this.anterior instanceof AccesoArreglo || this.anterior instanceof AccesoType){
                this.anterior.id = this.id;
                // Operar el acceso anterior (devuelve puntero a inicio del siguiente type)
                const resAnterior = this.anterior.compile(env);
                console.log(" EN ACCESO TYPE");
                console.log(this);
                console.log(resAnterior);
                // Buscar el type que corresponde
                const type = env.buscarType(resAnterior.type.subTipo);
                if(type == null || type == undefined)
                    throw new Error_(this.linea, this.columna, 'Semantico', 'Acceso Indefinido ');                
                // Generar temporal para obtener posicion en heap
//                const ptrStack = generator.newTemporal();
//                generator.addGetHeap(ptrStack, resAnterior.getValue());
                // Obtener el indice del atributo
                const atributo = type.atributos.get(this.indice);
                // Incrementar el ptrStack para posicionarse sobre los valors
                generator.addExpression(resAnterior.getValue(), resAnterior.getValue(), 1, '+');
                // Mover el puntero al indice deseado
                generator.addExpression(resAnterior.getValue(), resAnterior.getValue(), atributo.indice, '+');
                // Verificar si se esta buscando un puntero para asignacion
                if(this.tipoAcc == "asig" && this.final == true)
                    return new Retorno(resAnterior.getValue(),true, atributo.tipo);                    
                // Acceder al valor
                const valorHeap = generator.newTemporal();
                generator.addGetHeap(valorHeap, resAnterior.getValue());
                // Liberar temporal
                generator.freeTemp(resAnterior.getValue());
                // Retornar puntero accedido
                return new Retorno(valorHeap,true, atributo.tipo);       
            }

        }else{
            // Buscar el arreglo en la tabla de simbolos
            const variable = env.getVar(this.id);
            if(variable == null || variable == undefined)
                throw new Error_(this.linea, this.columna, 'Semantico', 'Acceso Indefinido '); 
            // Buscar el type que corresponde
            const type = env.buscarType(variable.type.subTipo);
            if(type == null || type == undefined)
                throw new Error_(this.linea, this.columna, 'Semantico', 'Acceso Indefinido ');             
            // Generar temporal para obtener el arreglo de stack
            const ptrStack = generator.newTemporal();
            generator.addGetStack(ptrStack, variable.position);
            // Obtener el indice del atributo
            const atributo = type.atributos.get(this.indice);
            // Incrementar el ptrStack para posicionarse sobre los valors
            generator.addExpression(ptrStack, ptrStack, 1, '+');
            // Mover el puntero al indice deseado
            generator.addExpression(ptrStack, ptrStack, atributo.indice, '+');
            // Verificar si se esta buscando un puntero para asignacion
            if(this.tipoAcc == "asig" && this.final == true)
              return new Retorno(ptrStack,true, atributo.tipo);                    
            // Acceder al valor
            const valorHeap = generator.newTemporal();
            generator.addGetHeap(valorHeap, ptrStack);
            // Liberar temporal
            generator.freeTemp(ptrStack);
            // Retornar puntero accedido
            return new Retorno(valorHeap,true, atributo.tipo);            
        }
    }
}