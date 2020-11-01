import { Instruccion } from "../../Abstract/Instruccion";
import { Tipo, Tipos } from "../../Util/Tipo";
import { Expresion } from "../../Abstract/Expresion";
import { Entorno } from "../../TablaSimbolos/Entorno";
import { Generator } from "../../Generator/Generator";
import { Error_ } from "../../Util/Error_";
import { Retorno } from '../../Util/Retorno';
import { FuncionesNativas } from '../../Generator/FuncionesNativas';


export class Concat extends Instruccion {
    private id: string ;
    private str2 : Expresion;

    constructor( id: string, str2:Expresion,  line: number, column: number) {
        super(line, column);
        this.id = id;
        this.str2 = str2;
    }

    compile(env: Entorno): void {
        const generator = Generator.getInstance();

        // Buscar variable en la tabla de simbolos        
        const symbol = env.getVar(this.id);
        if (symbol == null) 
            throw new Error_(this.line, this.column, 'Semantico', `No existe la variable ${this.id}`);        
        const temporalAcceso = generator.newTemporal();
        // Obtener el puntero al inicio del string ->0 t = stack[temp]
        generator.addGetStack(temporalAcceso, symbol.position);

        // Cambio de ambito
        generator.addNextEnv(env.size);

        //--- PASO DE PRIMER PARAMETRO ---
        // Apuntar a la primera posicion del ambito
        const temporalP1 = generator.newTemporal();
        generator.addExpression(temporalP1, 'p'); 
        // Pasar puntero a inicio como parametro
        generator.addSetStack(temporalP1, temporalAcceso);

        // --- PASO DE SEGUNDO PARAMETRO ---
        const temporalP2 = generator.newTemporal();
        generator.addExpression(temporalP2, 'p', '1', '+');
        // Ejecutar segundo string
        const stringConcat = this.str2.compile(env);
        generator.addSetStack(temporalP2, stringConcat.getValue());

        // Llamar la funcion
        generator.llamadaFuncion('concat');

        const tempret = generator.newTemporal();
        generator.addExpression(tempret, 'p', '2', '+');

        const valret = generator.newTemporal();
        generator.addExpression(valret , tempret);
        // Retornar p a su ambito
        generator.addAntEnv(env.size);


        generator.addComment('Aqui empieza nativa xd');
        const nativa = new FuncionesNativas();
        nativa.concat();        
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
