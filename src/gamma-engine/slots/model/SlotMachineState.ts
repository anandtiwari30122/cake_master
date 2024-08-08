
export enum SlotMachineState {
    NOT_INITIALIZED = 'NotInitialized',
    IDLE = 'Idle',
    SPINNING = 'Spinning',
    SPIN_END = 'SpinEnd',

    SPIN_RESULT_MULTI_WIN = 'SpinResultMultiWin',
    SPIN_RESULT_SCATTER = 'SpinResultScatter',
    SPIN_RESULT_CASCADE = 'SpinResultCascade',
    SPIN_RESULT_BONUS_GAME = 'SpinResultBonusGame',
    SPIN_RESULT_FREE_SPINS = 'SpinResultFreeSpins',

    BONUS_GAME = 'BonusGame',

    FREE_SPINS_ROUND_START = 'FreeSpinsRoundStart',
    FREE_SPINS = 'FreeSpins',
    FREE_SPINS_ROUND_END = 'FreeSpinsRoundEnd',

    BIG_WIN = 'BigWin',

    COMMUNICATION_ERROR = 'CommunicationError'
}
