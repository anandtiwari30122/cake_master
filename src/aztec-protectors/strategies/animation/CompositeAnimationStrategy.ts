import { IAnimationStrategy } from './IAnimationStrategy';

export class CompositeAnimationStrategy<T, D> implements IAnimationStrategy<T, D> {
    private strategies: IAnimationStrategy<T, D>[] = [];

    constructor(...strategies: IAnimationStrategy<T, D>[]) {
        this.addStrategies(...strategies);
    }

    public addStrategies(...strategies: IAnimationStrategy<T>[]) {
        this.strategies = [...this.strategies, ...strategies];
    }

    public removeStartegies(...strategies: IAnimationStrategy<T>[]) {
        this.strategies = this.strategies.filter((startegy) => !strategies.includes(startegy));
    }

    async animate(target: T, time: number, delay: number, data: D): Promise<void> {
        const promises: Promise<void>[] = this.strategies.reduce(
            (prev, curr) => prev.push(curr.animate(target, time, delay, data)) && prev,
            []
        );

        await Promise.all(promises);
    }
}
