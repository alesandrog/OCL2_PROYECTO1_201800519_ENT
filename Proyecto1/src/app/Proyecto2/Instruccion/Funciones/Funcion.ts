import { Instruccion } from "../../Abstract/Instruccion";
import { Tipo, Tipos } from "../../Util/Tipo";
import { Expresion } from "../../Abstract/Expresion";
import { Entorno } from "../../TablaSimbolos/Entorno";
import { Generator } from "../../Generator/Generator";
import { Parametro } from "./Parametro";
import { Error_ } from "../../Util/Error_";

export class Funcion extends Instruccion {
    private banderaPasada : boolean = false;
    public id: string;
    public instrucciones : Instruccion[];
    public parametros : Parametro[];
    public retorno : Tipo;


    constructor( id: string, parametros: Parametro[], instrucciones: Instruccion[], retorno: Tipo, line: number, column: number) {
        super(line, column);
        this.id = id;
        this.parametros = parametros;
        this.instrucciones = instrucciones;
        this.retorno = retorno;
    }

    compile(env: Entorno): void {

        if(this.banderaPasada == false){
            // Guardar parametros en el entorno
            this.guardarParametros(env);
            // Almacenar la funcion en el entorno
            if(!env.guardarFuncion(this, this.id))
                throw new Error_(this.line,this.column,'Semantico',`Ya existe una funcion con el id: ${this.id}`);
            this.banderaPasada = true;                
            return;            
        }
        const funcion = env.getFuncion(this.id);
        if(funcion == null || funcion == undefined)
            throw new Error_(this.line,this.column,'Semantico',` Metadata no definida para ${this.id} `);        
        const generator = Generator.getInstance();
        // Definir nuevo entorno
        const newEnv = new Entorno(env);
        // Definir etiqueta de salida para la funcion
        const ret = generator.newLabel();
        // Almacenar temporales
        const tempStorage = generator.getTempStorage();

        // Almacenar metadata de la funcion
        newEnv.guardarMetadata(this.id, this, ret);

        this.parametros.forEach((param)=>{
            if(param.tipo.type == Tipos.ARRAY || param.tipo.type == Tipos.TYPE || param.tipo.type == Tipos.STRING){
                newEnv.addVar(param.id,param.tipo,false,true);                
            }else{
                newEnv.addVar(param.id,param.tipo,false,false);
            }
        });

        generator.clearTempStorage();
        generator.inicioMetodo();
        generator.nombreMetodo(this.id);

        this.instrucciones.forEach((instr)=>{
            instr.compile(newEnv);
        });

        generator.addLabel(ret);
        generator.returnMetodo();
        generator.finMetodo();
        generator.setTempStorage(tempStorage);
    }

    private guardarParametros(env:Entorno){
        const set = new Set<string>();
        this.parametros.forEach((param)=>{
            if(set.has(param.id.toLowerCase()))
                throw new Error_(this.line,this.column,'Semantico',`Ya existe un parametro con el id ${param.id}`);
            set.add(param.id.toLowerCase());
        });        
    }

}
