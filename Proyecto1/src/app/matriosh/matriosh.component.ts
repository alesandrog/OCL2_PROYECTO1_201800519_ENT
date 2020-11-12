import { Component,AfterViewInit, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Network, DataSet } from 'vis';
/* imports ejecucion ------------------------------------------ */


//import { Entorno } from "../Symbol/Entorno";
/*import { errores } from '../Error/Errores';

import { Funcion } from "../Instruction/Funcion";
import { Instruction } from "../Abstract/Instruccion";
import { listaSalida } from "../Abstract/ListaSalida";

import { Graficar } from '../Instruction/Graficar';
import { salidaSimbolos } from '../Symbol/SalidaTablas';
*/
import { Error_ } from "../Proyecto2/Util/Error_";
import { errores } from "../Proyecto2/Util/Errores_";
import { Simbolo } from '../Symbol/Simbolo';
import * as ace from 'ace-builds';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-github';


/* imports traduccion -------------------------------------------- */
import { FuncionT } from "../Traduccion/Instruccion/Funcion";
//import { MapAccesos, MapEntornos, MapTraducidos } from "./MapsGlobales";
import { EntornoT } from "../Traduccion/Symbol/Entorno";
import { MapAccesos, MapTraducidos } from '../Traduccion/MapsGlobales';
import { DeclaracionType } from '../Instruction/DeclaracionType';
import { Tipo } from '../Abstract/Retorno';


/* importsC3D traduccion -------------------------------------------- */
import { Entorno } from "../Proyecto2/TablaSimbolos/Entorno";
import { Generator } from "../Proyecto2/Generator/Generator";

import 'ace-builds/src-noconflict/theme-twilight';
import { FuncionesNativas } from '../Proyecto2/Generator/FuncionesNativas';
import { Funcion } from '../Proyecto2/Instruccion/Funciones/Funcion';
//import { errores } from '../Error/Errores';

const THEME = 'ace/theme/twilight'; 
const LANG = 'ace/mode/javascript';
const LANG2 = 'ace/mode/c_cpp';


@Component({
  selector: 'app-matriosh',
  templateUrl: './matriosh.component.html',
  styleUrls: ['./matriosh.component.css']
})
export class MatrioshComponent implements OnInit {

  @ViewChild('inputEditor',{static: true}) inputEditorElmRef: ElementRef;
 // @ViewChild('outputEditor',{static: true}) outputEditorElmRef: ElementRef;
  @ViewChild('consola',{static: true}) consolaEditorElmRef: ElementRef;
  @ViewChild('network') el: ElementRef;
  private inputEditor: ace.Ace.Editor;
  private outputEditor: ace.Ace.Editor;
  private consolaEditor: ace.Ace.Editor;
  public salidaErrores : Error_[];
  public tablaSimbolos : Simbolo[];
  private networkInstance: any;

  constructor() { }

  ngOnInit () {
      const element = this.inputEditorElmRef.nativeElement;
      const element3 = this.consolaEditorElmRef.nativeElement;
      this.salidaErrores = [];
      const editorOptions: Partial<ace.Ace.EditorOptions> = {
          highlightActiveLine: true,
          minLines: 34,
          maxLines: 34      
        };

      

      this.inputEditor = ace.edit(element, editorOptions);
      this.inputEditor.setTheme(THEME);
      this.inputEditor.getSession().setMode(LANG);
      this.inputEditor.setShowFoldWidgets(true); // for the scope fold feature
/*
      this.outputEditor = ace.edit(element2, editorOptions);
      this.outputEditor.setTheme(THEME);
      this.outputEditor.getSession().setMode(LANG);
      this.outputEditor.setShowFoldWidgets(true); // for the scope fold feature
*/
      this.consolaEditor = ace.edit(element3, editorOptions);
      this.consolaEditor.setTheme(THEME);
      this.consolaEditor.getSession().setMode(LANG2);
      this.consolaEditor.setShowFoldWidgets(true); // for the scope fold feature

    }
    ngAfterViewInit() {

   var DOT2 = `
   digraph G{
   node0[label="let"];
   node1[label="a"];
   node2[label="declaracion"];
   node3[label="Instruccion"];
   node4[label="EOF"];
   node5[label="Init"];
   
   node2 -> node0;
   node2 -> node1;
   node3 -> node2;
   node5 -> node3;
   node5 -> node4;}`;
    this.loadGraph(DOT2); 
    };


/*    
      ejecutar(){
        
        while(errores.length > 0){
          errores.pop();
        }

        while(listaSalida.length > 0){
          listaSalida.pop();
        }

        while(salidaSimbolos.length > 0){
            salidaSimbolos.pop();
          }
          this.tablaSimbolos = salidaSimbolos;

      try{
        const parser = require('../Grammar/Grammar');
       // const fs = require('fs');
        let entrada = this.inputEditor.getValue();
        entrada = this.traducirPlantilla(entrada);      
//        const entrada = fs.readFileSync('./entrada.ts');
        const ast = parser.parse(entrada.toString());
        const env = new Entorno(null);
        env.idEntorno = "global";
    
        //primera pasada
        for(const instr of ast){
            if(instr instanceof DeclaracionType){
                try {
                    const actual = instr.execute(env);
    
                } catch (error) {
                    errores.push(error);  
                }            
            }else{
                continue;
            }
    
        }
        //Segunda pasada
        for(const instr of ast){
            if(instr instanceof Funcion){
                try {
                    const actual = instr.execute(env);
    
                } catch (error) {
                    errores.push(error);  
                }            
            }else{
                continue;
            }
    
        }    
    
    
        for(const instr of ast){
            if(instr instanceof Funcion)
                continue;
            try {
                if(instr instanceof Instruction){
                    if(instr instanceof Graficar){
                        const actual = instr.execute(env);
                        this.tablaSimbolos = salidaSimbolos;
                        console.log(salidaSimbolos);
//                        salidaSimbolos.clear;
                    }else{
                        const actual = instr.execute(env);
                        if(actual != null || actual != undefined){
                            errores.push(new Error_(actual.line, actual.column, 'Semantico', actual.type + ' fuera de un ciclo'));
                        }
                    }
                }else{
                    errores.push(instr);
                }
    
            } catch (error) {
                errores.push(error);  
            }
        }
        let envi = env;
        while(envi != null){
            envi.variables.forEach( (val : Simbolo , key : string) => {
                val.idEntorno = envi.idEntorno;
                if(val.tipo < 7){
                    val.tipoReporte = Tipo[val.tipo] + "";
                }else{
                    val.tipoReporte = env.buscarTipo(val.tipo).id;
                }
                salidaSimbolos.push(val);
            });
            envi.funciones.forEach((val : Funcion , key : string ) => {
                let smb = new Simbolo("" , val.id , val.tipoRep, true);
                smb.idEntorno = envi.idEntorno;
                if(val.tipo < 7){
                    smb.tipoReporte = Tipo[smb.tipo] + "";
                }else{
                    smb.tipoReporte = env.buscarTipo(smb.tipo).id;
                }
                salidaSimbolos.push(smb);
            });            
            envi = envi.anterior;
        }
        this.tablaSimbolos = salidaSimbolos;
    }catch(error){
        errores.push(error);
    }
    
    
    console.log(errores);
    console.log(listaSalida);
    let out = "";
    this.consolaEditor.setValue(" " , 0);
    for(const val of listaSalida){
      out += val + "\n";
    } 
    this.consolaEditor.setValue(out , 0);
    this.salidaErrores = errores;
    };


    traducir(){
        while(errores.length > 0){
            errores.pop();
          }
  
          while(listaSalida.length > 0){
            listaSalida.pop();
          }        
        try{
            const parser = require('../Traduccion/Grammar/Grammar');
            let entrada = this.inputEditor.getValue();
            entrada = this.traducirPlantilla(entrada);      
            const ast = parser.parse(entrada.toString());
            const env = new EntornoT(null);
    
    
            for(const instr of ast){
                try{
                    if(instr instanceof FuncionT){
                        instr.llenarMapas(env);
                    }else{
                        continue;
                    }
                }catch(error){errores.push(error);}
            }
            let salida = "";
            for(const instr of ast){
                try{
                    salida += instr.traducir(env) + "\n";
                }catch(error){errores.push(error);}
            }
            

            
            console.log(MapAccesos);
            console.log(MapTraducidos); 
            this.outputEditor.setValue("");
            this.outputEditor.setValue(salida);
            this.salidaErrores = errores;    
            console.log(errores); 
        }catch(error){ errores.push(error)};
          
    };

    limpiar(){
        this.inputEditor.setValue("");
        this.outputEditor.setValue("");
        this.consolaEditor.setValue("");
    };

    generarAst(){
        const parser = require('../AST/Grammar');
        let entrada = this.inputEditor.getValue();
        entrada = this.traducirPlantilla(entrada);
        let ast : string = parser.parse(entrada.toString());
        let piola = ast.toString();
        console.log("=============================== AST GENERADO");
        console.log(piola);
       let res = piola.split("_").join("");
       console.log(res);
       let resast = `digraph G{${res}}`;
       this.loadGraph(resast);
    };

    astTraduccion(){
        const parser = require('../AST/AstTraduccion/AstTraduccion');
        let entrada = this.inputEditor.getValue();
        entrada = this.traducirPlantilla(entrada);
        let ast : string = parser.parse(entrada.toString());
        let piola = ast.toString();
        console.log("=============================== AST GENERADO");
        console.log(piola);
       let res = piola.split("_").join("");
       console.log(res);
       let resast = `digraph G{${res}}`;
       this.loadGraph(resast);
    };
*/
    cargarTxt(){
        var DOTstring = 'digraph G {node[label="F"];}';
        this.loadGraph(DOTstring);        
    };

    loadGraph(text: string){
        const container = this.el.nativeElement;   
        // @ts-ignore
        let parsedData = vis.parseDOTNetwork(text);
        
        let data = {
            nodes: parsedData.nodes,
            edges: parsedData.edges
        };
        
        let options = parsedData.options;
        
        options.layout = {
            hierarchical: {
            sortMethod: 'directed', 
            shakeTowards: 'roots',  
            direction: 'UD'   
            }
        };
        
        // @ts-ignore
        let network = new vis.Network(container, data, options);
        };

        traducirPlantilla(txt : string): string{
            let aux = "";
            let aux2 = "";
            for(let i = 0; i < txt.length; i++){
                if(txt[i] == '`'){

                    aux += '\"';
                    aux2 += txt[i];
                    i++;                    
                    while(txt[i] != '`' && i < txt.length-1){
                        if(txt[i] == '$' && txt[i+1] == '{'){
                            aux2 += "${"
                            aux += '"+(';
                            i = i +2;
                        }else if(txt[i] == '}'){
                            aux2 += "}"
                            aux += ')+"'
                            i++;
                        }else{
                            aux2 += txt[i];
                            aux += txt[i];
                            i++;
                        }                        
                    }
                    aux2 += txt[i]; 
                    aux += '"';   
                    txt = txt.split(aux2).join(aux);
                    aux = "";
                    aux2 = "";            
 
                }
            }
      
            return txt;
        };

         c3d(){
            try{

                while(errores.length > 0){
                    errores.pop();
                  }
                                  
                const parser = require('../Proyecto2/Grammar/Grammar');
                let entrada = this.inputEditor.getValue();
                entrada = this.traducirPlantilla(entrada);      
                const ast = parser.parse(entrada.toString());
                console.log(ast);
                const env = new Entorno(null);
                for(const er of errores){
                    console.log(er);
                }
                // primera pasada
                for(const instr of ast){
                    try{
                        if(instr instanceof Funcion){
                            if(instr instanceof Error_){
                                console.log(instr);
                            }else{
                                instr.compile(env);    
                            }
                        }
                    }catch(error){console.log(error);}
                }

                for(const instr of ast){
                    try{
                        if(instr instanceof Error_){
                            console.log(instr);
                        }else{
                            instr.compile(env);    
                        }
                    }catch(error){console.log(error);}
                }
                const generator = Generator.getInstance();
                generator.generarNativas();
                /*let a : string = "ip"; */                
                let salida = generator.header();
                salida += generator.printMain();
                this.consolaEditor.setValue(salida);
                this.salidaErrores = errores;
            }catch(error){ console.log(error);};
            
        };

        traducir(){};
        ejecutar(){};
        generarAst(){};
        limpiar(){
            const generator = Generator.getInstance();
            generator.clearCode();
            this.inputEditor.setValue("");
            this.consolaEditor.setValue("");        
        };
    
}