export default class MobileBrowserLog {
    private container: HTMLDivElement;
    private btn: HTMLDivElement;

    private isOpen: boolean = false;

    constructor() {
        this.container = document.createElement('div');
        document.body.append(this.container);
        this.container.style.zIndex = '100';

        const ta: HTMLTextAreaElement = document.createElement('textarea');
        this.container.append(ta);
        ta.id = 'log';

        [this.container, ta].forEach(el => {
                el.style.position = 'absolute';
                el.style.width = '100%';
                el.style.height = '100%';
            });

        console.log = (...args) => {
            ta.value += `\n${args}`;
        }

        const btn: HTMLDivElement = document.createElement('div');
        document.body.append(btn);
        btn.style.width = '50px';
        btn.style.height = '50px';
        btn.style.position = 'absolute';
        btn.style.bottom = '0';
        btn.style.right = '0';
        btn.style.backgroundColor = '#FF0000';
        btn.style.zIndex = '101';
        btn.onclick = () => {
            if(this.isOpen) {
                this.close();
            } else {
                this.open();
            }
        }

        this.close();
    }

    private open(): void {
        this.container.style.visibility = 'visible';
        this.isOpen = true;
    }

    private close(): void {
        this.container.style.visibility = 'hidden';
        this.isOpen = false;
    }
}
