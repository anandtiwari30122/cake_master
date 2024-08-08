// import axios, { AxiosInstance, AxiosResponse } from 'axios';
// import jwtDecode from 'jwt-decode';
// import Logger from '../../gamma-engine/core/utils/Logger';
// import { LineDirection, LoginResponse, TransactResponse } from './Responses';
// import { container, singleton } from 'tsyringe';
// import IGameService from '../../gamma-engine/slots/service/IGameService';
// import Wallet from '../../gamma-engine/slots/model/Wallet';
// import SlotMachine from '../../gamma-engine/slots/model/SlotMachine';
// import { PatternType, ReelDescription, RuleDescription, SlotMachineDescription, SlotMachineType } from '../../gamma-engine/slots/model/SlotMachineDescription';
// import {LineWin, RoundResult, ScatterWin} from '../../gamma-engine/slots/model/RoundResult';
// import { v4 as uuidv4 } from 'uuid';
// import EventEmitter from 'eventemitter3';
// import {GameServiceEvent} from './event/GameServiceEvent';
//
// @singleton()
// export default class FakeResponses{
//     private currentResponseId:number = 0;
//
//
//     // private gameResults: Array<RoundResult> = [
//     //     {
//     //         id: uuidv4(),
//     //         lineBetValue: 20,
//     //         betLines: 5,
//     //         totalBet: 5,
//     //         totalWinValue: 5,
//     //         spinIndex: 0,
//     //         spins: [
//     //             {
//     //                 result: this.parseReelsOutput('8211,102,103|104,103,104|101,25,104|25,103,101|101,101,102'),
//     //                 winValue: 50,
//     //                 totalWinMultiplier: 6,
//     //                 currentTotalWinValue: 50,
//     //             }
//     //         ]
//     //     },
//     //     {
//     //         id: uuidv4(),
//     //         lineBetValue: 20,
//     //         betLines: 5,
//     //         totalBet: 5,
//     //         totalWinValue: 5,
//     //         spinIndex: 0,
//     //         spins: [
//     //             {
//     //                 result: this.parseReelsOutput('8201,101,101|25,8201,101|8201,25,101|25,101,101|101,101,101'),
//     //                 winValue: 50,
//     //                 totalWinMultiplier: 6,
//     //                 currentTotalWinValue: 50,
//     //                 freeSpinId: 0,
//     //                 win: {
//     //                     multiWinShown: false,
//     //                     lines: null,
//     //                     scatterWinShown: false,
//     //                     scatters: this.parseScatterWins('25,3,8201', '8201,101,101|25,8201,101|8201,25,101|25,101,101|101,101,101'),
//     //                 },
//     //                 freespins:{
//     //                     freespinWinShown: false,
//     //                     freespinEndShown: false,
//     //                     freespinsCount: 2
//     //                 }
//     //             }
//     //         ]
//     //     },
//     //     {
//     //         id: uuidv4(),
//     //         lineBetValue: 20,
//     //         betLines: 5,
//     //         totalBet: 5,
//     //         totalWinValue: 5,
//     //         spinIndex: 0,
//     //         spins: [
//     //             {
//     //                 result: this.parseReelsOutput('101,101,101|102,101,101|101,102,101|101,101,101|101,101,101'),
//     //                 winValue: 50,
//     //                 totalWinMultiplier: 6,
//     //                 currentTotalWinValue: 50,
//     //                 freeSpinId: 1,
//     //                 freespins:{
//     //                     freespinWinShown: false,
//     //                     freespinEndShown: false,
//     //                     freespinsCount: 2
//     //                 }
//     //             }
//     //         ]
//     //     },
//     //     {
//     //         id: uuidv4(),
//     //         lineBetValue: 20,
//     //         betLines: 5,
//     //         totalBet: 5,
//     //         totalWinValue: 5,
//     //         spinIndex: 0,
//     //         spins: [
//     //             {
//     //                 result: this.parseReelsOutput('101,101,101|101,101,101|101,102,101|102,101,101|101,101,101'),
//     //                 winValue: 50,
//     //                 totalWinMultiplier: 6,
//     //                 currentTotalWinValue: 50,
//     //                 freeSpinId: 2,
//     //                 freespins:{
//     //                     freespinWinShown: false,
//     //                     freespinEndShown: false,
//     //                     freespinsCount: 2
//     //                 }
//     //             }
//     //         ]
//     //     },
//     //
//     // ]
//
//     public getResponse():RoundResult{
//         const id: number = this.currentResponseId;
//         this.currentResponseId++;
//         if(this.currentResponseId>=this.gameResults.length)
//             this.currentResponseId=0;
//
//         if(this.gameResults[id].spins[0].freespins) {
//             this.gameResults[id].spins[0].freespins.freespinWinShown = false;
//             this.gameResults[id].spins[0].freespins.freespinEndShown = false;
//         }
//         if(this.gameResults[id].spins[0].win) {
//             this.gameResults[id].spins[0].win.multiWinShown = false;
//             this.gameResults[id].spins[0].win.scatterWinShown = false;
//         }
//
//         return this.gameResults[id];
//     }
//
//
//     private parseReelsOutput(data: string): number[][] {
//         return data.split('|')
//             .map((value: string): number[] => {
//                 return value.split(',')
//                     .map((value: string): number => {
//                         return parseInt(value);
//                     })
//             });
//     }
//
//     private parseScatterWins(winRoundResult: string, roundResult: string):ScatterWin{
//         const swd: string[] = winRoundResult.split(',');
//         // CoinPayout,Line,TotalSymbolMatched,Symbol
//         const winValue: number = parseFloat(swd[0]) * Wallet.denomination;
//         const symbolId: number = parseInt(swd[2]);
//
//         return {
//             winValue: winValue,
//             symbolId: symbolId,
//             pattern: this.buildScatterPattern(roundResult, symbolId)
//         }
//     }
//
//
//     private buildScatterPattern(data: string, symbolId: number): number[][]{
//         const pattern: number[][] = [];
//
//         data.split('|')
//             .map((reelData: string): void => {
//                 const lwd: string[] = reelData.split(',');
//                 const reel: number[] = [];
//
//                 lwd.forEach((symbol:string)=>{
//                     const id:number = parseInt(symbol);
//                     reel.push(id===symbolId?1:0);
//                 })
//
//                 pattern.push(reel);
//             });
//         return pattern;
//     }
// }
