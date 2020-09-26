import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

/* imports ejecucion ------------------------------------------ */
import { Entorno } from "../Symbol/Entorno";
import { errores } from '../Error/Errores';
import { Error_ } from "../Error/Error";
import { Funcion } from "../Instruction/Funcion";
import { Instruction } from "../Abstract/Instruccion";
import { listaSalida } from "../Abstract/ListaSalida";

import * as ace from 'ace-builds';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-github';
import { Simbolo } from '../Symbol/Simbolo';
import { Graficar } from '../Instruction/Graficar';
import { salidaSimbolos } from '../Symbol/SalidaTablas';


/* imports traduccion -------------------------------------------- */
import { FuncionT } from "../Traduccion/Instruccion/Funcion";
//import { MapAccesos, MapEntornos, MapTraducidos } from "./MapsGlobales";
import { EntornoT } from "../Traduccion/Symbol/Entorno";
import { MapAccesos, MapTraducidos } from '../Traduccion/MapsGlobales';


const THEME = 'ace/theme/github'; 
const LANG = 'ace/mode/javascript';


@Component({
  selector: 'app-matriosh',
  templateUrl: './matriosh.component.html',
  styleUrls: ['./matriosh.component.css']
})
export class MatrioshComponent implements OnInit {

  @ViewChild('inputEditor',{static: true}) inputEditorElmRef: ElementRef;
  @ViewChild('outputEditor',{static: true}) outputEditorElmRef: ElementRef;
  @ViewChild('consola',{static: true}) consolaEditorElmRef: ElementRef;
  private inputEditor: ace.Ace.Editor;
  private outputEditor: ace.Ace.Editor;
  private consolaEditor: ace.Ace.Editor;
  public salidaErrores : Error_[];
  public tablaSimbolos : Simbolo[];

  constructor() { }

  ngOnInit () {
      const element = this.inputEditorElmRef.nativeElement;
      const element2 = this.outputEditorElmRef.nativeElement;
      const element3 = this.consolaEditorElmRef.nativeElement;
      this.salidaErrores = [];
      const editorOptions: Partial<ace.Ace.EditorOptions> = {
          highlightActiveLine: true,
          minLines: 15,
          maxLines: 20,
      };

      this.inputEditor = ace.edit(element, editorOptions);
      this.inputEditor.setTheme(THEME);
      this.inputEditor.getSession().setMode(LANG);
      this.inputEditor.setShowFoldWidgets(true); // for the scope fold feature

      this.outputEditor = ace.edit(element2, editorOptions);
      this.outputEditor.setTheme(THEME);
      this.outputEditor.getSession().setMode(LANG);
      this.outputEditor.setShowFoldWidgets(true); // for the scope fold feature

      this.consolaEditor = ace.edit(element3, editorOptions);
      this.consolaEditor.setTheme(THEME);
      this.consolaEditor.getSession().setMode(LANG);
      this.consolaEditor.setShowFoldWidgets(true); // for the scope fold feature

    }

      //TODO while a un arreglo se buggeo
      ejecutar(){
        
        while(errores.length > 0){
          errores.pop();
        }

        while(listaSalida.length > 0){
          listaSalida.pop();
        }

      try{
        const parser = require('../Grammar/Grammar');
       // const fs = require('fs');
        const entrada = this.inputEditor.getValue();      
//        const entrada = fs.readFileSync('./entrada.ts');
        const ast = parser.parse(entrada.toString());
        const env = new Entorno(null);
        env.idEntorno = "global";
    
        //primera pasada
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
            const entrada = this.inputEditor.getValue();      
            const ast = parser.parse(entrada.toString());
            const env = new EntornoT(null);
    
    
            for(const instr of ast){
                console.log(instr);
                if(instr instanceof FuncionT){
                    instr.llenarMapas(env);
                }else{
                    continue;
                }
            }
            let salida = "";
            for(const instr of ast){
                //console.log(instr);
                salida += instr.traducir(env) + "\n";
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
        const entrada = this.inputEditor.getValue();
 //       const entrada = "let a = a; let b = b;";
        const ast = parser.parse(entrada.toString());
       // console.log(ast);
    };
    
}