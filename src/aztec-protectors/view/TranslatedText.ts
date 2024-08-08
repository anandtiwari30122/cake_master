import { Text } from 'pixi.js';

export class TranslatedText extends Text{

    constructor() {
        super();


    }

    // private async fitTextToPanels():Promise<void>{
    //     // fetch json file
    //     const response:Response = await fetch(jsonAdress.paytableMobile);
    //     const data = await response.json();
    //
    //     // hardcoded values
    //     const maxTfInPayTable:number = 8
    //     const maxPartsInText:number = 3;
    //
    //     // iterate each page
    //     this.pages.forEach((p: Container,index:number):void => {
    //         // set each tf in each page
    //         for (let i:number = 0; i < maxTfInPayTable ; i++) {
    //             if(p['title']){
    //                 const d = p['title'] as Text
    //                 p['title'].text = data[`page${index+1}`][`title`]
    //                 p['title'].style.align ='center'
    //             }
    //             if(p[`tf${i}`]){
    //                 p[`tf${i}`].text = data[`page${index+1}`][`tf${i}`]
    //                 p[`tf${i}`].style.align ='center'
    //             }
    //             // if there is combined text set each part of the text
    //             if(p[`textCombined${i}`]){
    //                 for (let j:number = 1; j <maxPartsInText +1 ; j++) {
    //                     if(p[`textCombined${i}`][`content`][`part${j}`]){
    //                         p[`textCombined${i}`][`content`][`part${j}`].text = data[`page${index+1}`][`textCombined${i}`][`part${j}`]
    //                     }
    //                 }
    //                 // then set positions of each part and icon
    //                 this.combineTextSprite(p,i)
    //
    //             }
    //
    //         }
    //     });
    // }

}