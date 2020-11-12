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


export class charAt extends Expresion {
    private id: Acceso | AccesoArreglo | AccesoType;
    private index : Expresion;

    constructor( id:Acceso | AccesoArreglo | AccesoType, index:Expresion,  line: number, column: number) {
        super(line, column);
        this.id = id;
        this.index = index;
    }

    compile(env: Entorno): Retorno {
        const generator = Generator.getInstance();
        const temporalAcceso = this.id.compile(env);
        if(temporalAcceso == null || temporalAcceso == undefined)
            throw new Error_(this.line, this.column, 'Semantico', ` Error al acceder`);
        if(temporalAcceso.type.type != Tipos.STRING)
           throw new Error_(this.line, this.column, 'Semantico', ` charAt no operable con ${temporalAcceso.type.type}`);
        generator.addNextEnv(env.size + 1);

        //--- PASO DE PRIMER PARAMETRO ---
        // Temporal para almacenar el nuevo valor de p
        const pTemp = generator.newTemporal();  
        generator.addExpression(pTemp, 'p',1,'+');      
        // Almacenar en el stack el inicio del string
        generator.addSetStack(pTemp, temporalAcceso.getValue());

        // --- PASO DE SEGUNDO PARAMETRO ---
        generator.addExpression(pTemp, pTemp, '1', '+');
        // Ejecutar indice
        const indice = this.index.compile(env);
        if(indice.type.type != Tipos.NUMBER)
           throw new Error_(this.line, this.column, 'Semantico', ` charAt no operable con ${indice.type.type}`);        
        generator.addSetStack(pTemp, indice.getValue());

        // Llamar la funcion
        generator.llamadaFuncion('charAt');
        // Devolver el puntero p a su valor original
        const ret = generator.newTemporal();
        generator.addExpression(ret, 'p');
        const valor = generator.newTemporal();
        generator.addGetStack(valor, ret);
        generator.addAntEnv(env.size + 1);                      
        return new Retorno(valor,true, new Tipo(Tipos.STRING));

    }

}
