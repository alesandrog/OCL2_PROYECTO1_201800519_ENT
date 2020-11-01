import { Instruccion } from "../../Abstract/Instruccion";
import { Tipo, Tipos } from "../../Util/Tipo";
import { Expresion } from "../../Abstract/Expresion";
import { Entorno } from "../../TablaSimbolos/Entorno";
import { Generator } from "../../Generator/Generator";
import { Error_ } from "../../Util/Error_";
import { Retorno } from '../../Util/Retorno';
import { FuncionesNativas } from '../../Generator/FuncionesNativas';


export class LowerString extends Instruccion {
    private id: string ;

    constructor( id: string,  line: number, column: number) {
        super(line, column);
        this.id = id;
    }

    compile(env: Entorno): void {
        const generator = Generator.getInstance();
        // Buscar variable en la tabla de simbolos        
        const symbol = env.getVar(this.id);
        if (symbol == null) 
            throw new Error_(this.line, this.column, 'Semantico', `No existe la variable ${this.id}`);
        const temporalAcceso = generator.newTemporal();
        // Obtener inicio del string y guardarlo en stack
        generator.addGetStack(temporalAcceso, symbol.position);
        generator.addNextEnv(1);
        // Temporal para almacenar el nuevo valor de p
        const pTemp = generator.newTemporal();  
        generator.addExpression(pTemp, 'p');      
        // Almacenar en el stack el inicio del string
        generator.addSetStack(pTemp, temporalAcceso);
        // Llamar a funcion upper
        generator.llamadaFuncion('ToLowerCase');
        // Devolver el puntero p a su valor original
        generator.addAntEnv(1);

        const nativa = new FuncionesNativas();
        nativa.toUpper();        
    }

    private validateType(env: Entorno){
     /*   if(this.type.type == Tipos.STRUCT){
            const struct = enviorement.searchStruct(this.type.typeId);
            if(!struct)
                throw new Error(this.line,this.column,'Semantico',`No existe el struct ${this.type.typeId}`);
            this.type.struct = struct;
        }*/
    }
}
