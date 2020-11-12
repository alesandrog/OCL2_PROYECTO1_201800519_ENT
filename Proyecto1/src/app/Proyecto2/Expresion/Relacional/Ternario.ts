import { Instruccion } from "../../Abstract/Instruccion";
import { Tipo, Tipos } from "../../Util/Tipo";
import { Expresion } from "../../Abstract/Expresion";
import { Entorno } from "../../TablaSimbolos/Entorno";
import { Generator } from "../../Generator/Generator";
import { Error_ } from "../../Util/Error_";
import { Retorno } from '../../Util/Retorno';

export class Ternario extends Expresion {
    private condicion: Expresion;
    private retLft : Expresion;
    private retRight: Expresion;

    constructor( condicion: Expresion, retLeft : Expresion, retRight:Expresion, line: number, column: number) {
        super(line, column);
        this.condicion = condicion;
        this.retLft = retLeft;
        this.retRight = retRight;
    }

    compile(env: Entorno): Retorno {
  
        const generator = Generator.getInstance();
        // Al ejecutar la condicion se generan ifs, etiquetas verdaderas y falsas
        const condicion = this.condicion.compile(env);
        // Generar etiqueta para salir
        const exitLbl = generator.newLabel();
        // Imprimir etiqueta verdadera con las instrucciones del if
        if (condicion.type.type!= Tipos.BOOLEAN)
            throw new Error_(this.line,this.column,'Semantico','Condicion no booleana');        
        generator.addLabel(condicion.trueLabel);        
        // Generar temporal para retornar valor
        const retorno = generator.newTemporal(); generator.freeTemp(retorno);
        // Compilar primera expresion
        const lft = this.retLft.compile(env);
        generator.addExpression(retorno, lft.getValue());
        generator.addGoto(exitLbl);
        // Compilar la segunda expresion
        generator.addLabel(condicion.falseLabel);
        const rgt = this.retRight.compile(env);
        if (lft.type.type != rgt.type.type)
            throw new Error_(this.line,this.column,'Semantico',' Resultados de ternario deben ser del mismo tipo');        
        generator.addExpression(retorno, rgt.getValue());
        generator.addLabel(exitLbl);

        return new Retorno(retorno,true, lft.type);         

    }
}
