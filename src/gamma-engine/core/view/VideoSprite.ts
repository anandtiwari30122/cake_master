// import { Sprite, Texture, Ticker } from 'pixi.js';
//
// export default class VideoSprite extends Sprite {
//
//     private video: HTMLVideoElement;
//     private ticker: Ticker;
//
//     private _loop: boolean;
//     private _fps: number;
//
//     constructor(video: HTMLVideoElement, fps: number, loop: boolean = false) {
//
//         // TODO: adapt for pixi v7, just errors removed, it is not working and not tested
//
//         // video.loop = loop;
//         // video.autoplay = true;
//         // // iOS 10+ fix for video not going fullscreen on play
//         // video.setAttribute("playsinline", "");
//         // video.muted = true;
//
//         const videoTexture: Texture = Texture.from(video);
//         super(videoTexture);
//
//         // this.video = video;
//         // this._fps = fps;
//         // this._loop = loop;
//         //
//         // this.ticker = new Ticker();
//         // this.ticker.speed = this._fps / 60;
//         //
//         // // this.interactive = true;
//         // // let s:boolean = true;
//         // // this.on("pointerup", () => {
//         // //     if(s) {
//         // //         this.play();
//         // //     } else {
//         // //         this.pause();
//         // //     }
//         // //     s = !s;
//         // //
//         // //     // baseTexture.update();
//         // // });
//         //
//         // this
//         //     .on("added", this.onAddedToStage, this)
//         //     .on("removed", this.onRemovedFromStage, this);
//     }
//
//     // PUBLIC API
//     // public get loop():boolean {
//     //     return this._loop;
//     // }
//     //
//     // public set loop(value:boolean) {
//     //     this._loop = value;
//     //     this.video.loop = value;
//     // }
//     //
//     // public play():void {
//     //     this.video.play();
//     //     this.ticker.start();
//     // }
//     //
//     // public pause():void {
//     //     this.video.pause();
//     //     this.ticker.stop();
//     // }
//     //
//     // public stop():void {
//     //     this.video.pause();
//     //     this.video.currentTime = 0;
//     //     this.ticker.stop();
//     // }
//     //
//     //  // PRIVATE API
//     // protected onAddedToStage(displayObject:DisplayObject):void {
//     //     let baseTexture:VideoBaseTexture = (this.texture.baseTexture as VideoBaseTexture);
//     //     baseTexture.autoUpdate = false;
//     //     this.ticker.add((deltaTime => {
//     //         if(baseTexture.hasLoaded) {
//     //             baseTexture.update();
//     //         }
//     //     }));
//     // }
//     //
//     // protected onRemovedFromStage(displayObject:DisplayObject):void {
//     //
//     // }
// }
