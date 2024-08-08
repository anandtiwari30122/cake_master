export type PopupAnimationConfig = {
    showPopup: {
        scale?: PopupAnimationParams,
        y?: PopupAnimationParams,
        pivotY?: PopupAnimationParams,
        alpha?: PopupAnimationParams
    },
    showOverlay?: {
        scale?: PopupAnimationParams,
        alpha: PopupAnimationParams
    },
    hidePopup: {
        scale?: PopupAnimationParams,
        y?: PopupAnimationParams,
        pivotY?: PopupAnimationParams,
        alpha?: PopupAnimationParams
    },
    hideOverlay?: {
        scale?: PopupAnimationParams,
        alpha: PopupAnimationParams
    }
}

export type PopupAnimationParams = {
    value?: number,
    time: number,
    transition: string,
}

export function getMaxAnimationTime(popupAnimationConfig: PopupAnimationConfig): number {
    const times = getNestedProperty('time', popupAnimationConfig) as number[];
    return Math.max(...times);
}

function getNestedProperty(keyToFind: string, object: any) {
    let times = []
    for (const key in object) {
        if(key == keyToFind) {
            times.unshift(object[key]);
        }

        const nested = object[key];
        if(typeof nested == 'object') {
            times = [...times, ...getNestedProperty(keyToFind, nested)];
        }
    }

    return times;
}