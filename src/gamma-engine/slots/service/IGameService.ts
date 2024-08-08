import Wallet from '../model/Wallet';
import SlotMachine from '../model/SlotMachine';
import { RoundResult } from '../model/RoundResult';
import { SettingsType } from '../model/SettingsType';

export default interface IGameService {
    initialize(): Promise<[Wallet, SlotMachine]>;
    spin(betValue: number, numLines: number): Promise<RoundResult>;
    buyFeature(): Promise<RoundResult>;
    lobby(): void;
    saveSettings(): void;
    get settings(): SettingsType;
}
