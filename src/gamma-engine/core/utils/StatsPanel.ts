import { Application, Ticker, UPDATE_PRIORITY } from 'pixi.js';
import { addStats, StatsJSAdapter } from 'pixi-stats';
export default class StatsPanel {
    public static create(application: Application): void {
        const stats: StatsJSAdapter = addStats(document, application);
        const ticker: Ticker = Ticker.shared;

        stats.stats.domElement.setAttribute('style', 'position: fixed;\n' +
            'top: 0;\n' +
            'left: 0;\n' +
            'z-index: 500;\n' +
            'width: max(100px, 5vw, 5vh);\n' +
            'height: max(60px, 3vh, 3vw);\n' +
            'opacity: 0.8;\n' +
            'user-select: none;');

        Array.from(stats.stats.domElement.children)
             .forEach((el: HTMLElement) => {
                 el.style.width = '100%';
                 el.style.height = '100%';
             });


        ticker.add(stats.update, stats, UPDATE_PRIORITY.UTILITY);
    }
}
