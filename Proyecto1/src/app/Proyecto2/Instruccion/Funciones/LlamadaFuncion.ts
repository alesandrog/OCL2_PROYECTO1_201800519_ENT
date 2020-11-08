import { Instruccion } from "../../Abstract/Instruccion";
import { Tipo, Tipos } from "../../Util/Tipo";
import { Expresion } from "../../Abstract/Expresion";
import { Entorno } from "../../TablaSimbolos/Entorno";
import { Generator } from "../../Generator/Generator";
import { Parametro } from "./Parametro";
import { Error_ } from "../../Util/Error_";
import { Retorno } from '../../Util/Retorno';

export class LlamadaFuncion extends Expresion{
    private id: string;
    private anterior: Expresion | null;
    private parametros: Expresion[];

    constructor(id: string, parametros: Expresion[], line : number, column: number){
        super(line,column);
        this.id = id;
        this.parametros = parametros;
    }
    compile(env: Entorno):Retorno{
    const funcion = env.buscarFuncion(this.id);
        if(funcion == null)
            throw new Error_(this.line,this.column,'Semantico',`No se encontro la funcion: ${this.id}`);
        const parametrosCompilados = new Array<Retorno>();
        const generator = Generator.getInstance();
        const size = generator.saveTemps(env); 
        this.parametros.forEach((param)=>{
            parametrosCompilados.push(param.compile(env));
        });
        const temp = generator.newTemporal(); 
        generator.freeTemp(temp);
        if(parametrosCompilados.length != 0){
            generator.addExpression(temp,'p',env.size + 1,'+');
            parametrosCompilados.forEach((value,index)=>{
                generator.addSetStack(temp,value.getValue());
                if(index != parametrosCompilados.length - 1)
                    generator.addExpression(temp,temp,'1','+');
            });    
        }
        generator.addNextEnv(env.size);
        generator.llamadaFuncion(funcion.id);
        generator.addGetStack(temp,'p');
        generator.addAntEnv(env.size);
        generator.recoverTemps(env,size);
        generator.addTemp(temp);

        if (funcion.retorno.type != Tipos.BOOLEAN) 
            return new Retorno(temp,true,funcion.retorno);           
    }
    
}