import { Transformation } from '../../model/Transformation';

export interface IAnimationStrategy<T, D = Transformation> {
    animate(target: T, time: number, delay: number, data: D, times?:number): Promise<void>;
}
