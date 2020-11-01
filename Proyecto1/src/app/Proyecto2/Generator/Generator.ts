import { Entorno } from "../TablaSimbolos/Entorno";
import { FuncionesNativas } from './FuncionesNativas';

export class Generator{
    private static generator: Generator;
    private temporal : number; //Contador de temporales
    private label : number;    //Contador de etiquetas
    private code : string[];
    private funciones : string[];
    private declaracionesMetodos : string[];
    private tempStorage : Set<string>; //Temporales no utilizaods
    isFunc = '';

    private constructor(){
        this.temporal = this.label = 0;
        this.code = new Array();
        this.funciones = new Array();
        this.declaracionesMetodos = new Array();
        this.tempStorage = new Set();
    }



    public static getInstance(){
        return this.generator || (this.generator = new this());
    }


    public header() : string{
        return `#include <stdio.h>\ndouble Heap[16384];\ndouble Stack[16394];\nint p;\nint h;\n\n\n`;
    }

    public printMain() : string{
        let mainOut = this.printTemporales();
        mainOut += this.declaracionesMetodos.join('\n')+"\n\n";
         mainOut += `void main(){\n`;
        for(let i = 0; i < this.code.length; i++){
            if(this.code[i] != "INICIO METODO"){
                mainOut += this.code[i] + '\n';
            }else{
                i++;
                while(this.code[i]!="FIN METODO"){
                    this.funciones.push(this.code[i]);
                    i++;
                }
            }
        }
        mainOut += '}\n\n\n';

        mainOut += '\n' + this.funciones.join('\n');
        return mainOut;
    }

    public printTemporales() : string{
        let res = "double ";
        for(let i = 0; i < this.temporal-1; i++){
            res += `T${i},`;
        }
        res += `T${this.temporal-1};\n`;
        return res;
    }

    public inicioMetodo(){
        this.code.push("INICIO METODO");
    }

    public finMetodo(){
        this.code.push("FIN METODO");
    }

    public nombreMetodo(id:string){
        this.code.push(`void ${id}(){`);
        this.declaracionesMetodos.push(`void ${id}();`);
    }

    public returnMetodo(){
        this.code.push("return;\n}");
    }

    public getTempStorage(){
        return this.tempStorage;
    }

    public clearTempStorage(){
        this.tempStorage.clear();
    }

    public setTempStorage(tempStorage : Set<string>){
        this.tempStorage = tempStorage;
    }

    public clearCode(){
        this.temporal = this.label = 0;
        this.code = new Array();
        this.tempStorage = new Set();
    }

    public addCode(code : string){
        this.code.push(this.isFunc + code);
    }

    public getCode() : string{
        return this.code.join('\n');
    }

    public newTemporal() : string{
        const temp = 'T' + this.temporal++
        this.tempStorage.add(temp);
        return temp;
    }

    public llamadaFuncion(id:string){
        this.code.push(`${id}();`);        
    }

    public newLabel() : string{
        return 'L' + this.label++;
    }

    public addLabel(label : string){
        this.code.push(`${this.isFunc}${label}:`);
    }

    public addExpression(target : string, left: any, right: any = '', operator: string = ''){
        this.code.push(`${this.isFunc}${target} = ${left} ${operator} ${right};`);
    }

    public addGoto(label : string){
        this.code.push(`${this.isFunc}goto ${label};`);
    }

    public addIf(left: any, right: any, operator: string, label : string){
        this.code.push(`${this.isFunc}if (${left} ${operator} ${right}) goto ${label};`);
    }

    public nextHeap(){
        this.code.push(this.isFunc + 'h = h + 1;');
    }

    public addGetHeap(target : any, index: any){
        this.code.push(`${this.isFunc}${target} = Heap[(int)${index}];`);
    }

    public addSetHeap(index: any, value : any){
        this.code.push(`${this.isFunc}Heap[(int)${index}] = ${value};`);
    }
    
    public addGetStack(target : any, index: any){
        this.code.push(`${this.isFunc}${target} = Stack[(int)${index}];`);
    }

    public addSetStack(index: any, value : any){
        this.code.push(`${this.isFunc}Stack[(int)${index}] = ${value};`);
    }

    public addNextEnv(size: number){
        this.code.push(`${this.isFunc}p = p + ${size};`);
    }

    public addAntEnv(size: number){
        this.code.push(`${this.isFunc}p = p - ${size};`);
    }


    public addPrint(format: string, value: any){
        this.code.push(`${this.isFunc}print("%${format}",${value});`);
    }

    public addPrintTrue(){
        this.addPrint('c','t'.charCodeAt(0));
        this.addPrint('c','r'.charCodeAt(0));
        this.addPrint('c','u'.charCodeAt(0));
        this.addPrint('c','e'.charCodeAt(0));
    }

    public addPrintFalse(){
        this.addPrint('c','f'.charCodeAt(0));
        this.addPrint('c','a'.charCodeAt(0));
        this.addPrint('c','l'.charCodeAt(0));
        this.addPrint('c','s'.charCodeAt(0));
        this.addPrint('c','e'.charCodeAt(0));
    }

    public addPrintNull(){
        this.addPrint('c','n'.charCodeAt(0));
        this.addPrint('c','u'.charCodeAt(0));
        this.addPrint('c','l'.charCodeAt(0));
        this.addPrint('c','l'.charCodeAt(0));
    }

    public addComment(comment: string){
        this.code.push(`${this.isFunc}/***** ${comment} *****/`);
    }

    public freeTemp(temp: string){
        if(this.tempStorage.has(temp)){
            this.tempStorage.delete(temp);
        }
    }

    public addTemp(temp: string){
        if(!this.tempStorage.has(temp))
            this.tempStorage.add(temp);
    }

    public saveTemps(env: Entorno) : number{
        if(this.tempStorage.size > 0){
            const temp = this.newTemporal(); this.freeTemp(temp);
            let size = 0;

            this.addComment('Inicia guardado de temporales');
            this.addExpression(temp,'p',env.size,'+');
            this.tempStorage.forEach((value)=>{
                size++;
                this.addSetStack(temp,value);
                if(size !=  this.tempStorage.size)
                    this.addExpression(temp,temp,'1','+');
            });
            this.addComment('Fin guardado de temporales');
        }
        let ptr = env.size;
        env.size = ptr + this.tempStorage.size;
        return ptr;
    }

    public recoverTemps(env: Entorno, pos: number){
        if(this.tempStorage.size > 0){
            const temp = this.newTemporal(); this.freeTemp(temp);
            let size = 0;

            this.addComment('Inicia recuperado de temporales');
            this.addExpression(temp,'p',pos,'+');
            this.tempStorage.forEach((value)=>{
                size++;
                this.addGetStack(value,temp);
                if(size !=  this.tempStorage.size)
                    this.addExpression(temp,temp,'1','+');
            });
            this.addComment('Finaliza recuperado de temporales');
            env.size = pos;
        }
    }
}