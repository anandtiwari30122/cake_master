import FrontController from '../../core/control/FrontController';
import StartGameCommand from './command/StartGameCommand';
import AdjustBetCommand from './command/AdjustBetCommand';
import AdjustGameSpeedCommand from './command/AdjustGameSpeedCommand';
import { UIEvent } from './event/UIEvent';
import { SlotGameEvent } from './event/SlotGameEvent';
import { ApplicationEvent } from '../../core/control/event/ApplicationEvent';
import AdjustAutoSpinCommand from './command/AdjustAutoSpinCommand';
import ConfirmReelsStartedCommand from './command/ConfirmReelsStartedCommand';
import ConfirmSpinTimeLapsedCommand from './command/ConfirmSpinTimeLapsedCommand';
import SpinStopCommand from './command/SpinStopCommand';
import ConfirmMultiWinCommand from './command/ConfirmMultiWinCommand';
import CompleteRoundCommand from './command/CompleteRoundCommand';
import ProcessSpinResultCommand from './command/ProcessSpinResultCommand';
import ConfirmBigWinCommand from './command/ConfirmBigWinCommand';
import InitializeCommand from './command/InitializeCommand';
import SpinStartCommand from './command/SpinStartCommand';
import InstantSpinStopCommand from './command/InstantSpinStopCommand';
import ConfirmScatterWinCommand from './command/ConfirmScatterWinCommand';
import ConfirmFreespinsWinCommand from './command/ConfirmFreespinsWinCommand';
import ConfirmFreeSpinsRoundStartedCommand from './command/ConfirmFreeSpinsRoundStartedCommand';
import ConfirmFreeSpinsRoundCompleteCommand from './command/ConfirmFreeSpinsRoundCompleteCommand';
import ConfirmBonusWinCommand from './command/ConfirmBonusWinCommand';
import ConfirmBonusGameCompleteCommand from './command/ConfirmBonusGameCompleteCommand';
import FreeSpinStartCommand from './command/FreeSpinStartCommand';
import AdjustCoinValueCommand from './command/AdjustCoinValueCommand';

export default class SlotGameFrontController extends FrontController {
    constructor() {
        super();

        this.addCommand(ApplicationEvent.INIT, InitializeCommand);
        this.addCommand(ApplicationEvent.LOADING_COMPLETE, StartGameCommand);

        this.addCommand(UIEvent.COIN_VALUE_UP, AdjustCoinValueCommand);
        this.addCommand(UIEvent.COIN_VALUE_DOWN, AdjustCoinValueCommand);
        this.addCommand(UIEvent.COIN_VALUE_MAX, AdjustCoinValueCommand);

        this.addCommand(UIEvent.BET_UP, AdjustBetCommand);
        this.addCommand(UIEvent.BET_DOWN, AdjustBetCommand);
        this.addCommand(UIEvent.BET_SELECT, AdjustBetCommand);
        this.addCommand(UIEvent.GAME_SPEED_LEVEL_UP, AdjustGameSpeedCommand);
        this.addCommand(UIEvent.GAME_SPEED_LEVEL_DOWN, AdjustGameSpeedCommand);
        this.addCommand(UIEvent.AUTO_SPIN, AdjustAutoSpinCommand);

        this.addCommand(SlotGameEvent.SPIN_START, SpinStartCommand);
        this.addCommand(SlotGameEvent.REELS_STARTED, ConfirmReelsStartedCommand);
        this.addCommand(SlotGameEvent.SPIN_TIME_LAPSED, ConfirmSpinTimeLapsedCommand);
        this.addCommand(SlotGameEvent.SPIN_STOP, SpinStopCommand);
        this.addCommand(SlotGameEvent.STOP_REQUESTED, InstantSpinStopCommand);
        this.addCommand(SlotGameEvent.REELS_STOPPED, ProcessSpinResultCommand);
        this.addCommand(SlotGameEvent.MULTI_WIN_SHOWN, ConfirmMultiWinCommand);
        this.addCommand(SlotGameEvent.SCATTER_WIN_SHOWN, ConfirmScatterWinCommand);
        this.addCommand(SlotGameEvent.CASCADE_WIN_SHOWN, ProcessSpinResultCommand);

        this.addCommand(SlotGameEvent.BONUS_GAME_WIN_SHOWN, ConfirmBonusWinCommand);
        this.addCommand(SlotGameEvent.BONUS_GAME_COMPLETE, ConfirmBonusGameCompleteCommand);

        this.addCommand(SlotGameEvent.FREE_SPIN_WIN_SHOWN, ConfirmFreespinsWinCommand);
        this.addCommand(SlotGameEvent.FREE_SPIN_ROUND_STARTED, ConfirmFreeSpinsRoundStartedCommand);
        this.addCommand(SlotGameEvent.FREE_SPIN_START, FreeSpinStartCommand);
        this.addCommand(SlotGameEvent.FREE_SPIN_ROUND_COMPLETE, ConfirmFreeSpinsRoundCompleteCommand);
        this.addCommand(SlotGameEvent.BIG_WIN_SHOWN, ConfirmBigWinCommand);
        this.addCommand(SlotGameEvent.SPIN_RESULT_READY, ProcessSpinResultCommand);
        this.addCommand(SlotGameEvent.ROUND_COMPLETE, CompleteRoundCommand);
    }
}
