import { Expresion } from "../../Abstract/Expresion";
import { Entorno } from "../../TablaSimbolos/Entorno";
import { Retorno } from "../../Util/Retorno";
import { Generator } from "../../Generator/Generator";
import { Tipos, Tipo } from "../../Util/Tipo";
import { Error_ } from "../../Util/Error_";

export class ValoresArreglo extends Expresion {
    private valores: Expresion[];

    constructor(valores: Expresion[], line: number, column: number) {
        super(line, column);
        this.valores = valores;
    }

    public compile(env: Entorno): Retorno {
        
        const generator = Generator.getInstance();
        console.log(this);

        // Guardar en un temporal la primera posicion del arreglo
        const temp = generator.newTemporal();
        generator.addExpression(temp, 'h');

        // Generar un temporal para utilizar como puntero a heap
        const puntero = generator.newTemporal();
        generator.addExpression(puntero, 'h');

        // Reservar el espacio en heap (valores y tamanio del arreglo)
        generator.addExpression('h', 'h', this.valores.length + 1, '+');

        // Almacenar en heap el tamanio del arreglo
        generator.addSetHeap(puntero, this.valores.length);
        generator.addExpression(puntero, puntero, '1' , '+');

        // Ejecutar todos los valores que van dentro y guardarlos en heap
        this.valores.forEach((val)=>{
            console.log(val);
            const valor = val.compile(env);
            generator.addSetHeap(puntero, valor.getValue());
            generator.addExpression(puntero, puntero, '1' , '+');
        });
        // Liberar temporal puntero
        generator.freeTemp(puntero);
        // Retornar el puntero a la primera casilla
        const tipo = new Tipo(Tipos.ARRAY);
        return new Retorno(temp,true, tipo);        
    }
}