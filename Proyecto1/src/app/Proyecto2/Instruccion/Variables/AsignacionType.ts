import { Instruccion } from "../../Abstract/Instruccion";
import { Tipo, Tipos } from "../../Util/Tipo";
import { Expresion } from "../../Abstract/Expresion";
import { Entorno } from "../../TablaSimbolos/Entorno";
import { Generator } from "../../Generator/Generator";
import { Error_ } from "../../Util/Error_";
import { Retorno } from '../../Util/Retorno';
import { SimboloType } from '../../TablaSimbolos/SimboloType';
import { Parametro } from '../Funciones/Parametro';
import { AtributoValor } from '../../Expresion/Arreglo/AtributoValor';


export class AsignacionType extends Instruccion {
    private id:string;
    private atributos: AtributoValor[];
    private tipo:Tipo;
    constructor( id:string, atributos:AtributoValor[], line: number, column: number) {
        super(line, column);
        this.id = id;
        this.atributos = atributos;

    }

     public  compile(env: Entorno): void {
        const symbol = env.getVar(this.id);
        console.log(this);
        console.log(symbol);
        if (symbol == null) 
            throw new Error_(this.line, this.column, 'Semantico', `No existe la variable ${this.id}`);

        this.tipo = symbol.type;

        // Verificar si ya esta definido
        const type = env.buscarType(this.tipo.subTipo);
        if(type == null || type == undefined)
            throw new Error_(this.line,this.column,'Semantico',`Type: ${this.tipo.subTipo} no definido en este ambito`);        
        // Validar tipos de los atributos
        if(!this.validarAtributos(type))
            throw new Error_(this.line,this.column,'Semantico',`Definicion de Type incorrecta`);        
        
        /* GENERACION DE CODIGO */
        const generator = Generator.getInstance();

        // Guardar en un temporal la primera posicion del heap
        const temp = generator.newTemporal();
        generator.addExpression(temp, 'h');

        // Generar un temporal para utilizar como puntero a heap
        const puntero = generator.newTemporal();
        generator.addExpression(puntero, 'h');

        // Puntero h simulado
        const tempH = generator.newTemporal();
        generator.addExpression(tempH, 'h', 1, '+');

        // Reservar el espacio en heap (valores y tamanio del arreglo)
        generator.addExpression('h', 'h', this.atributos.length + 1, '+');

        // Almacenar en heap el tamanio del arreglo
        generator.addSetHeap(temp, this.atributos.length);

        // Ejecutar todos los valores que van dentro y guardarlos en heap
        this.atributos.forEach((val)=>{
            // Compilar el valor
            const valor = val.valor.compile(env);
            // Buscar a que indice del type corresponde
            const matchAtributo = type.atributos.get(val.id);           
            // Mover el puntero a la posicion relativa
            generator.addExpression(puntero, tempH, matchAtributo.indice , '+');
            generator.addSetHeap(puntero, valor.getValue());
        });
        // Liberar temporal puntero
        generator.freeTemp(puntero);
        generator.freeTemp(tempH);
        // Retornar el puntero a la primera casilla
//        return new Retorno(temp,true, this.tipo); 
        if (symbol?.isGlobal) {
            generator.addSetStack(symbol.position, temp);
        }else{
            const tempo = generator.newTemporal();
            generator.addExpression(tempo, 'p', symbol.position, '+');
            generator.addSetStack(tempo, temp);        
        }

    }


    public validarAtributos(type:SimboloType):boolean{
        if(this.atributos.length != type.atributos.size)
            return false;
        // Verificar que contenga todos los atributos y del tipo correcto
    /*    this.atributos.forEach((atrib)=>{
            if(!type.atributos.has(atrib.id))
                return false;
            const atributo = type.atributos.get(atrib.id);
            if(atrib.tipo != atributo.tipo)
                return false;
        });   */    
        return true;
    }
}
