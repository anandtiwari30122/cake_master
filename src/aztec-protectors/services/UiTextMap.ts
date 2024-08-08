export type UiTextMap = {
    buyFreeSpin:string,
    doubleBet:string,
    doubleBetChance:string,
    paytbale:PaytableTextMap[],
}
export type PaytableTextMap={
    number:number,
    page:PaytablePageText[],
}
export type PaytablePageText={
    header:string,
    content:string[],
}
export const uiTextMap:UiTextMap = {
    buyFreeSpin: 'BUY FREESPINS',
    doubleBet: 'BET',
    doubleBetChance: 'DOUBLE CHANCE TO WIN FEATURE',
    paytbale:[
        {
            number:1,
            page:[
                {
                    header:'SYMBOL PAYOUTS',
                    content:['text1',
                        'text2'
                    ]
                }
            ]
        },
        {
            number:2,
            page:[
                {
                    header: 'TUMBLE FEATURE',
                    content: ['The TUMBLE FEATURE means that after every spin, winning combinations are paid and all winning symbols\n' +
                    'disappear. The remaining symbols fall to the bottom of the screen and the empty positions are replaced\n' +
                    'with symbols coming from above.',
                    'Tumbling will continue until no more winning combinations appear as a result of a tumble. There\'s no limit to the\n' +
                    'number of possible tumbles.',
                    'All wins are added to the player\'s balance after all of the tumbles resulted from a base spin have been played.\n',
                    'These are the multiplier symbols. They are present on all reels and can hit randomly during\n' +
                    'spins and tumbles in both base game and FREE SPINS.',
                        'Whenever a MULTIPLIER symbol hits, it takes a random multiplier value of 2x, 3x, 4x, 5x, 6x, 8x, 10x, 12x, 15x, 20x,\n' +
                        '25x, 50x, 100x, 250x or 500x.',
                        'When the tumbling sequence ends, the values of all MULTIPLIER symbols on the screen are added\n' +
                        'together and the total win of the sequence is multiplied by the final value.'
                    ]
                }
            ]
        }
    ]
}