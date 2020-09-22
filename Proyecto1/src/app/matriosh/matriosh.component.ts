import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Entorno } from "../Symbol/Entorno";
import { errores } from '../Error/Errores';
import { Error_ } from "../Error/Error";
import { Funcion } from "../Instruction/Funcion";
import { Instruction } from "../Abstract/Instruccion";
import { listaSalida } from "../Abstract/ListaSalida";
//import { LlamadaFuncion } from "../../archivos/Instruction/LLamadaFuncion";

import * as ace from 'ace-builds';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-github';


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

  constructor() { }

  ngOnInit () {
      const element = this.inputEditorElmRef.nativeElement;
      const element2 = this.outputEditorElmRef.nativeElement;
      const element3 = this.consolaEditorElmRef.nativeElement;

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


      ejecutar(){
      try{
        const parser = require('../Grammar/Grammar');
       // const fs = require('fs');
        const entrada = `console.log("piola");`;      
//        const entrada = fs.readFileSync('./entrada.ts');
        const ast = parser.parse(entrada.toString());
        const env = new Entorno(null);
    
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
                    const actual = instr.execute(env);
                    if(actual != null || actual != undefined){
                        errores.push(new Error_(actual.line, actual.column, 'Semantico', actual.type + ' fuera de un ciclo'));
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
    }
}