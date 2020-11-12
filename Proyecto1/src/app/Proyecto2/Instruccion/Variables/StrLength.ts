import { Instruccion } from "../../Abstract/Instruccion";
import { Tipo, Tipos } from "../../Util/Tipo";
import { Expresion } from "../../Abstract/Expresion";
import { Entorno } from "../../TablaSimbolos/Entorno";
import { Generator } from "../../Generator/Generator";
import { Error_ } from "../../Util/Error_";
import { Retorno } from '../../Util/Retorno';
import { FuncionesNativas } from '../../Generator/FuncionesNativas';
import { AccesoArreglo } from '../../Expresion/Acceso/AccesoArreglo';
import { AccesoType } from '../../Expresion/Acceso/AccesoType';
import { Acceso } from '../../Expresion/Acceso/Acceso';



export class StrLength extends Expresion {
    private id: Acceso | AccesoArreglo | AccesoType;

    constructor( id: Acceso | AccesoArreglo | AccesoType, accesos:AccesoArreglo | AccesoType | null,  line: number, column: number) {
        super(line, column);
        this.id = id;
    }

    compile(env: Entorno): Retorno {
        const generator = Generator.getInstance();
        const temporalAcceso = this.id.compile(env);
        if(temporalAcceso == null || temporalAcceso == undefined)
            throw new Error_(this.line, this.column, 'Semantico', ` Error al acceder`);
        if(this.id instanceof Acceso){
            if(temporalAcceso.type.type == Tipos.STRING){
                // Obtener inicio del string y guardarlo en stack
                generator.addNextEnv(env.size + 1);
                // Temporal para almacenar el nuevo valor de p
                const pTemp = generator.newTemporal();  
                generator.addExpression(pTemp, 'p',1,'+');      
                // Almacenar en el stack el inicio del string
                generator.addSetStack(pTemp, temporalAcceso.getValue());
                // Llamar a funcion upper
                generator.llamadaFuncion('Length');
                // Devolver el puntero p a su valor original
                const ret = generator.newTemporal();
                generator.addExpression(ret, 'p');
                const valor = generator.newTemporal();
                generator.addGetStack(valor, ret);
                generator.addAntEnv(env.size + 1);                      
                return new Retorno(valor,true, new Tipo(Tipos.NUMBER));                
            }else{
                // Accesos retornan referencia a stack o referencia indirecta a heap
                const ptrHeap = generator.newTemporal();
                generator.addGetHeap(ptrHeap, temporalAcceso.getValue());
                return new Retorno(ptrHeap,true, new Tipo(Tipos.NUMBER));                  
            }
        }else{
                const ptrHeap = generator.newTemporal();
                generator.addGetHeap(ptrHeap, temporalAcceso.getValue());
                return new Retorno(ptrHeap,true, new Tipo(Tipos.NUMBER));
        }

    }

}
