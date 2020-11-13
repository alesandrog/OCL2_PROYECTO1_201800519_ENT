import { Instruccion } from "../../Abstract/Instruccion";
import { Tipo, Tipos } from "../../Util/Tipo";
import { Expresion } from "../../Abstract/Expresion";
import { Entorno } from "../../TablaSimbolos/Entorno";
import { Generator } from "../../Generator/Generator";
import { Error_ } from "../../Util/Error_";
import { tablaSimbolos } from "../../TablaSimbolos/TablaSimbolos";
import { SimboloReporte } from "../../TablaSimbolos/SimboloReporte";
export class Declaracion extends Instruccion {
    private type: Tipo;
    private id: string;
    private value: Expresion | null;
    public dimension: number = 0;

    constructor(type: Tipo, id: string, value: Expresion, line: number, column: number) {
        super(line, column);
        this.type = type;
        this.id = id;
        this.value = value;
    }

    compile(env: Entorno): void {
        const generator = Generator.getInstance();
        if(this.value == null){
            const newVar = env.addVar(this.id, this.type, false,false);
            let ref = false;
            if(this.type.type == Tipos.ARRAY || this.type.type == Tipos.TYPE || this.type.type == Tipos.STRING)
                ref = true;            
            const reporte = new SimboloReporte(this.id, Tipos[this.type.type], newVar.position, this.dimension, Tipos[this.type.subTipo], env.prop, ref);
            tablaSimbolos.push(reporte);
            if(!newVar) throw new Error_(this.line,this.column,'Semantico',`La variable: ${this.id} ya existe en este ambito`);
        

            if(newVar.isGlobal){
                if(this.type.type == Tipos.BOOLEAN || this.type.type == Tipos.NUMBER){
                    // Asignar 0 a stack para falso
                    generator.addSetStack(newVar.position,'0');
                }
                else{
                    // Asignar valor a stack
                    generator.addSetStack(newVar.position,'-1');
                }
            }
            else{
                const temp = generator.newTemporal(); 
                generator.freeTemp(temp);
                generator.addExpression(temp,'p',newVar.position,'+');
                if(this.type.type == Tipos.BOOLEAN || this.type.type == Tipos.NUMBER){
                    // Asignar 0 a stack para falso
                    generator.addSetStack(temp,'0');
                }
                else{
                    // Asignar valor a stack
                    generator.addSetStack(temp,'-1');
                }
            }            
            return;
        }
        const value = this.value.compile(env);
        if(!this.sameType(this.type,value.type)){
            throw new Error_(this.line,this.column,'Semantico',`Tipos de datos incompatibles ${this.type.type}, ${value.type.type}`);
        }
        this.validateType(env);

        // Si no esta inicializada, guardar el tipo con el que fue declarada
        // Retorna false si ya existe la variable en el entorno

        const newVar = env.addVar(this.id, this.type, false,false);
            if(!newVar) throw new Error_(this.line,this.column,'Semantico',`La variable: ${this.id} ya existe en este ambito`);
        
        let ref = false;
        if(this.type.type == Tipos.ARRAY || this.type.type == Tipos.TYPE || this.type.type == Tipos.STRING)
            ref = true;            
        const reporte = new SimboloReporte(this.id, this.type.type, newVar.position, this.dimension, this.type.subTipo, env.prop, ref);
        tablaSimbolos.push(reporte);            

            if(newVar.isGlobal){
                if(this.type.type == Tipos.BOOLEAN){
                    const templabel = generator.newLabel();
                    // Imprimir la etiqueta verdadera del valor
                    generator.addLabel(value.trueLabel);
                    // Asignar 1 a stack para verdadero
                    generator.addSetStack(newVar.position,'1');
                    // Salto incondicional
                    generator.addGoto(templabel);
                    // Imprimir la etiqueta falsa del valor
                    generator.addLabel(value.falseLabel);
                    // Asignar 0 a stack para falso
                    generator.addSetStack(newVar.position,'0');
                    // Imprimir etiqueta generada para continuar
                    generator.addLabel(templabel);
                }
                else{
                    // Asignar valor a stack
                    generator.addSetStack(newVar.position,value.getValue());
                }
            }
            else{
                const temp = generator.newTemporal(); 
                generator.freeTemp(temp);                
                if(this.type.type == Tipos.BOOLEAN){
                    const templabel = generator.newLabel();
                    generator.addLabel(value.trueLabel);
                    generator.addExpression(temp,'p',newVar.position,'+');                    
                    generator.addSetStack(temp,'1');
                    generator.addGoto(templabel);
                    generator.addLabel(value.falseLabel);
                    generator.addExpression(temp,'p',newVar.position,'+');                    
                    generator.addSetStack(temp,'0');
                    generator.addLabel(templabel);
                }
                else{
                    generator.addExpression(temp,'p',newVar.position,'+');                      
                    generator.addSetStack(temp,value.getValue());
                }
            }

    }

    private validateType(env: Entorno){
        if(this.type.type == Tipos.TYPE){
            const type = env.buscarType(this.type.subTipo);
            if(!type)
                throw new Error_(this.line,this.column,'Semantico',` Type ${this.type.typeId} no definido`);
        }
    }
}
