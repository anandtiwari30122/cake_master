import { Text } from 'pixi.js';

export const degToRad = function (degrees: number): number {
    return degrees * Math.PI / 180;
}

export const radToDeg = function radToDeg(radians: number): number {
    return radians * 180 / Math.PI;
}

export const getConfigValue = function (configObject: any, parameterName: string, defaultValue: any = undefined): any {
    if (parameterName.indexOf('.') != -1) {
        const firstItem: string = parameterName.substring(0, parameterName.indexOf('.'));
        const restItem: string = parameterName.substring(parameterName.indexOf('.') + 1);
        const firstObj: any = this.getConfigValue(configObject, firstItem);
        if (firstObj) {
            return this.getConfigValue(firstObj, restItem, defaultValue);
        }
    } else if (configObject.hasOwnProperty(parameterName) && configObject[parameterName] != '') {
        return configObject[parameterName];
    }

    return defaultValue;
}

export const removeArrayElement = function <T>(array: Array<T>, element: any): Array<T> {
    if (array.indexOf(element) != -1) {
        array.splice(array.indexOf(element), 1);
    }
    return array;
}

export const arrayFill = function <T>(array: Array<T>, value: any): Array<T> {
    const O: Array<T> = array;
    const len = O.length;
    const start = arguments[1];
    const relativeStart = parseInt(start, 10) || 0;
    let k = relativeStart < 0 ? Math.max(len + relativeStart, 0) : Math.min(relativeStart, len);
    const end = arguments[2];
    const relativeEnd = end === undefined ? len : (parseInt(end) || 0);
    const final = relativeEnd < 0 ? Math.max(len + relativeEnd, 0) : Math.min(relativeEnd, len);
    for (; k < final; k++) {
        O[k] = value;
    }
    return O;
}

export const arrayUnique = function <T>(array: Array<T>): Array<T> {
    return array.filter((value, index, array) => {
        return array.indexOf(value) === index;
    });
}

export const randomRange = function (min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

/**
 * Returns random integer within range <min, max>, both values inclusive
 * @param min
 * @param max
 */
export const randomInt = function (min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const randomArrayElement = function <T>(arr: T[]): T {
    if (arr && arr.length) {
        return arr[Math.floor(Math.random() * arr.length)];
    }
    return null;
}

export const arrayShuffle = function <T>(array: Array<T>): Array<T> {
    const inputArray: any[] = array;
    for (let i: number = inputArray.length - 1; i >= 0; i--) {
        const randomIndex: number = Math.floor(Math.random() * (i + 1));
        const itemAtIndex: number = inputArray[randomIndex];

        inputArray[randomIndex] = inputArray[i];
        inputArray[i] = itemAtIndex;
    }
    return inputArray;
}
