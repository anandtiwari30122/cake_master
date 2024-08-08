import IGameService from '../../slots/service/IGameService';
import { SettingsType } from '../model/SettingsType';

export default interface ICommonGameService extends IGameService {
    get featureBuyConfig(): {
        RoundType: number,
        Rate: number,
        Total: number
    }
    get doubleUpChance(): boolean;
    set doubleUpChance(value: boolean);
    get settings(): SettingsType;
}