import { Expresion } from "../../Abstract/Expresion";
import { Entorno } from "../../TablaSimbolos/Entorno";
import { Retorno } from "../../Util/Retorno";
import { Generator } from "../../Generator/Generator";
import { Tipos, Tipo } from "../../Util/Tipo";
import { Error_ } from "../../Util/Error_";

export class AccesoArreglo extends Expresion {

    public id : string;
    public anterior : Expresion | null;
    public indice : Expresion;
    public final : boolean;
    public tipoAcc : string;
    linea : number;
    columna : number;


    constructor(id: string,  anterior : Expresion |  null, indice : Expresion, final : boolean , tipoAcc : string , linea : number, columna: number){
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
            if(this.anterior instanceof AccesoArreglo){
                this.anterior.id = this.id;
                // Operar el acceso anterior (devuelve puntero a inicio del siguiente arreglo)
                const resAnterior = this.anterior.compile(env);
                if(resAnterior == null || resAnterior == undefined)
                    throw new Error_(this.linea, this.columna, 'Semantico', `Acceso Indefinido `);                 
                // Compilar el indice
                const indice = this.indice.compile(env);
                // Generar temporal para operar el indice de acceso
                const puntero = generator.newTemporal();
                // Guardar en el puntero el valor devuelto por el acceso anterior
                generator.addExpression(puntero, resAnterior.getValue(), '1', '+');
                // Sumar el indice deseado
                generator.addExpression(puntero, puntero, indice.getValue(), '+');

                // Verificar si se esta buscando un puntero para asignacion
                if(this.tipoAcc == "asig" && this.final == true)
                    return new Retorno(puntero,true, resAnterior.type);                    

                // Generar temporal para acceder a Heap y retornar valor
                const retorno = generator.newTemporal();
                generator.addGetHeap(retorno, puntero);
                // Retornar puntero accedido
                return new Retorno(retorno,true, resAnterior.type);            
            }

        }else{
            // Buscar el arreglo en la tabla de simbolos
            const arreglo = env.getVar(this.id);
            if(arreglo == null || arreglo == undefined)
                throw new Error_(this.linea, this.columna, 'Semantico', `Acceso Indefinido: Arreglo ${this.id} no definido`); 
                // Compilar indice de acceso
            const indice = this.indice.compile(env);
            // Generar temporal para obtener el arreglo de stack
            const ptrStack = generator.newTemporal();            
            if(arreglo.isHeap){
                // Generar temporal para acceder a la referencia
                const accesoReferencia = generator.newTemporal();
                if (arreglo.isGlobal){
                    generator.addGetStack(ptrStack, arreglo.position);                    
                }else{
                    const tempAux = generator.newTemporal(); generator.freeTemp(tempAux);
                    generator.addExpression(tempAux, 'p', arreglo.position, '+');                    
                    generator.addGetStack(ptrStack, tempAux);
                }                
                generator.addGetStack(accesoReferencia, ptrStack);
                // Incrementar el ptrStack para posicionarse sobre los valors
                generator.addExpression(accesoReferencia, accesoReferencia, 1, '+');
                // Mover el puntero al indice deseado
                generator.addExpression(accesoReferencia, accesoReferencia, indice.getValue(), '+');
                // Verificar si se esta buscando un puntero para asignacion
                if(this.tipoAcc == "asig" && this.final == true)
                    return new Retorno(accesoReferencia,true, new Tipo(arreglo.type.subTipo));                    
                // Acceder al valor
                const valorHeap = generator.newTemporal();
                generator.addGetHeap(valorHeap, accesoReferencia);
                // Liberar temporal
                generator.freeTemp(accesoReferencia);
                // Retornar puntero accedido
                return new Retorno(valorHeap,true, new Tipo(arreglo.type.subTipo));                                 
            }else{
            // Incrementar el ptrStack para posicionarse sobre los valors
            if (arreglo.isGlobal){
                generator.addGetStack(ptrStack, arreglo.position);                    
            }else{
                const tempAux = generator.newTemporal(); generator.freeTemp(tempAux);
                generator.addExpression(tempAux, 'p', arreglo.position, '+');                    
                generator.addGetStack(ptrStack, tempAux);
            }            
            generator.addExpression(ptrStack, ptrStack, 1, '+');
            // Mover el puntero al indice deseado
            generator.addExpression(ptrStack, ptrStack, indice.getValue(), '+');
            // Verificar si se esta buscando un puntero para asignacion
            if(this.tipoAcc == "asig" && this.final == true)
              return new Retorno(ptrStack,true, new Tipo(arreglo.type.subTipo));                    
            // Acceder al valor
            const valorHeap = generator.newTemporal();
            generator.addGetHeap(valorHeap, ptrStack);
            // Liberar temporal
            generator.freeTemp(ptrStack);
            // Retornar puntero accedido
            return new Retorno(valorHeap,true, new Tipo(arreglo.type.subTipo)); 
            }           
        }
    }
}