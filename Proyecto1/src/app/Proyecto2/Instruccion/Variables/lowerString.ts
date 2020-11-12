import { Tipo, Tipos } from "../../Util/Tipo";
import { Expresion } from "../../Abstract/Expresion";
import { Entorno } from "../../TablaSimbolos/Entorno";
import { Generator } from "../../Generator/Generator";
import { Error_ } from "../../Util/Error_";
import { Retorno } from '../../Util/Retorno';
import { AccesoArreglo } from '../../Expresion/Acceso/AccesoArreglo';
import { AccesoType } from '../../Expresion/Acceso/AccesoType';
import { Acceso } from '../../Expresion/Acceso/Acceso';


export class LowerString extends Expresion {
    private id: Acceso | AccesoArreglo | AccesoType;

    constructor( id: Acceso | AccesoArreglo | AccesoType,  line: number, column: number) {
        super(line, column);
        this.id = id;
    }

    compile(env: Entorno): Retorno {
        const generator = Generator.getInstance();
        const temporalAcceso = this.id.compile(env);
        if(temporalAcceso == null || temporalAcceso == undefined)
            throw new Error_(this.line, this.column, 'Semantico', ` Error al acceder`);
        generator.addNextEnv(env.size + 1);
        // Temporal para almacenar el nuevo valor de p
        const pTemp = generator.newTemporal();  
        generator.addExpression(pTemp, 'p', 1 , '+');      
        // Almacenar en el stack el inicio del string
        generator.addSetStack(pTemp, temporalAcceso.getValue());
        // Llamar a funcion upper
        generator.llamadaFuncion('ToLowerCase');
        // Devolver el puntero p a su valor original
        const ret = generator.newTemporal();
        generator.addExpression(ret, 'p');
        const valor = generator.newTemporal();
        generator.addGetStack(valor, ret);
        generator.addAntEnv(env.size + 1);                      
        return new Retorno(valor,true, new Tipo(Tipos.STRING));
    }
}
