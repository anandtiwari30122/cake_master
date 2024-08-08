import SoundList from '../../gamma-engine/common/sound/SoundList';

export default class SoundListExtended extends SoundList{
    public static BASEGAME_BACKGROUND:string = 'basegame_loop';
    public static FREEGAME_BACKGROUND:string = 'freegame_loop';

    public static REEL_ANTICIPATION:string  = 'reel_anticipation';
    public static WIN_FRAME:string  = 'win_frame';

    public static SYMBOL_LOW_PAYOUT_1:string  = 'symbol_lp1_win';
    public static SYMBOL_LOW_PAYOUT_2:string  = 'symbol_lp2_win';
    public static SYMBOL_LOW_PAYOUT_3:string  = 'symbol_lp3_win';
    public static SYMBOL_LOW_PAYOUT_4:string  = 'symbol_lp4_win';
    public static SYMBOL_LOW_PAYOUT_5:string  = 'symbol_lp5_win';

    public static SYMBOL_HIGH_PAYOUT_1:string  = 'symbol_hp1_win';
    public static SYMBOL_HIGH_PAYOUT_2:string  = 'symbol_hp2_win';
    public static SYMBOL_HIGH_PAYOUT_3:string  = 'symbol_hp3_win';
    public static SYMBOL_HIGH_PAYOUT_4:string  = 'symbol_hp4_win';
    public static MULTIPLIER:string  = 'multiplier';

    public static SYMBOL_WILD:string  = 'symbol_wild_win';
    public static SYMBOL_WILD_LAND:string  = 'symbol_wild_land';
    public static SYMBOL_SCATTER:string  = 'symbol_scatter_win';
    public static SYMBOL_SCATTER_LAND:string  = 'symbol_scatter_land';
    public static SYMBOL_BONUS:string  = 'symbol_bonus_win';
}
