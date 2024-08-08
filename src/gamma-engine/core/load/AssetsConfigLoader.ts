import Logger from '../utils/Logger';
import AssetsManager from '../assets/AssetsManager';
import LayoutElementFactory from '../view/model/LayoutElementFactory';
import SoundManager from '../sound/SoundManager';
import { Howl } from 'howler';
import { Assets, BitmapFont, IRenderer, ResolverBundle, Spritesheet } from 'pixi.js';
import EventEmitter from 'eventemitter3';
import { AssetType } from './AssetType';
import {SpineTexture, TextureAtlasPage, TextureAtlasRegion} from '@esotericsoftware/spine-pixi';

export default class AssetsConfigLoader extends EventEmitter {
    public static EVENT_CONFIG_LOADED = 'onConfigLoaded';
    public static EVENT_LOADING_PROGRESS = 'onLoadingProgress';
    public static EVENT_LOADING_COMPLETE = 'onLoadingComplete';

    public childLoaders: AssetsConfigLoader[];
    public childConfigsBeingLoaded = 0;
    public configOnly = false;

    private _itemsToLoad = 0;
    private _itemsLoaded = 0;
    private _pixiLoaderProgress = 0;

    readonly configFileUrl: string;
    readonly baseUrl: string;

    readonly renderer: IRenderer | null;

    private bundle :ResolverBundle['assets'];

    constructor(configFileUrl: string, renderer: IRenderer | null = null, autostart = false) {
        super();

        this.childLoaders = [];

        this.configFileUrl = configFileUrl;
        this.baseUrl = configFileUrl.substring(0, configFileUrl.lastIndexOf('/') + 1);

        this.bundle = {};

        // Adding a renderer here allows us to preload textures into GPU memory after they load
        this.renderer = renderer;

        Assets.add(configFileUrl, configFileUrl);

        if (autostart) {
            this.load();
        }
    }

    // PUBLIC API
    public load(configOnly = false): void {
        this.configOnly = configOnly;
        Assets.load(this.configFileUrl)
              .then((configFile) => {
                  this.onConfigFileLoaded(configFile);
              })
              .catch((reason) => {
                  this.onError(reason);
              });
    }

    public loadAssets(): void {
        Assets.addBundle(this.configFileUrl, this.bundle);
        Assets.loadBundle(this.configFileUrl, (progress) => {
            this._pixiLoaderProgress = progress * 100;

            Logger.debug(`Loaded ${this.getSharedProgress()}%`);
            this.emit(AssetsConfigLoader.EVENT_LOADING_PROGRESS, this.getSharedProgress());
        })
              .then((resources) => {
                  this.onAllAssetsLoaded(resources);
              })
              .catch((reason) => {
                  this.onError(reason);
              });
    }

    public addAsset(id: string, type: AssetType, url: string): void {
        this.bundle[AssetsConfigLoader.assetPrefix(type) + id] = url;
    }

    private static assetPrefix(type: AssetType): string {
        return `${type}-`;
    }

    // public addChildLoader(l: AssetsConfigLoader): void {
    //     l.assetsLoader = this.assetsLoader;
    //     this.childLoaders.push(l);
    // }
    //

    // PRIVATE API
    private onConfigFileLoaded(configObject: any): void {
        Logger.debug(`Assets config file: ${this.configFileUrl} loaded.`);

        if (configObject.textures) {
            for (const textureObject of configObject.textures) {
                this.addAsset(textureObject.name, AssetType.TEXTURE, this.baseUrl + textureObject.url);
            }
        }

        if (configObject.spine) {
            for (const spineObject of configObject.spine) {
                this.addAsset(spineObject.name + '-skeleton', AssetType.SPINE, this.baseUrl + spineObject.url + '.json');
                this.addAsset(spineObject.name + '-atlas', AssetType.SPINE, this.baseUrl + spineObject.url + '.atlas');
            }
        }

        if (configObject.videos) {
            for (const videoObject of configObject.videos) {
                this.addAsset(videoObject.name, AssetType.VIDEO, this.baseUrl + videoObject.url);
            }
        }

        if (configObject.xmls) {
            for (const xmlObject of configObject.xmls) {
                this.addAsset(xmlObject.name, AssetType.XML, this.baseUrl + xmlObject.url);
            }
        }

        if (configObject.layouts) {
            for (const layoutObject of configObject.layouts) {
                this.addAsset(layoutObject.name, AssetType.LAYOUT, this.baseUrl + layoutObject.url);
            }
        }

        if (configObject.scripts) {
            for (const scriptUrl of configObject.scripts) {
                this._itemsToLoad++;
                this.loadScript(this.baseUrl + scriptUrl, () => {
                    this.onScriptLoaded();
                });
            }
        }

        if (configObject.sounds) {
            for (const soundObject of configObject.sounds) {
                const name: string = soundObject.name;
                if(AssetsManager.sounds.get(name)){
                    Logger.warning(`Trying to load sound with name that already exists: ${name}`);
                    continue;
                }

                this._itemsToLoad++;

                for (let i = 0; i < soundObject.url.length; i++) {
                    soundObject.url[i] = this.baseUrl + soundObject.url[i];
                }
                const sound: Howl = new Howl({
                    src: soundObject.url,
                });

                sound.once('load', () => {
                    AssetsManager.sounds.set(name, sound);
                    if (soundObject.channel) {
                        SoundManager.addSoundToChannel(name, sound, soundObject.channel);
                    } else {
                        SoundManager.addSoundToChannel(name, sound);
                    }
                    this._itemsLoaded++;
                    this.emit(AssetsConfigLoader.EVENT_LOADING_PROGRESS, this.getSharedProgress());
                });
            }
        }

        if (configObject.fonts) {
            for (const fontObject of configObject.fonts) {
                if (!fontObject.hasOwnProperty('type')) {
                    fontObject.type = 'web';
                }

                switch (fontObject.type) {
                    case 'bitmap':
                        this.addAsset(fontObject.name, AssetType.BITMAP_FONT, this.baseUrl + fontObject.url);
                        break;
                    case 'web':
                        this.addAsset(fontObject.name, AssetType.WEB_FONT, this.baseUrl + fontObject.url);
                        break;
                    default:
                        Logger.warning(`Unknown font type: ${fontObject.type}`);
                        break;
                }
            }
        }

        let loadingChildConfigs = false;
        for (const cl of this.childLoaders) {
            loadingChildConfigs = true;
            this.childConfigsBeingLoaded++;
            cl.once(AssetsConfigLoader.EVENT_CONFIG_LOADED, () => {
                this.onChildConfigLoaded();
            });
            cl.load(true);
        }

        if (!loadingChildConfigs) {
            this.emit(AssetsConfigLoader.EVENT_CONFIG_LOADED);
            if (!this.configOnly) {
                this.loadAssets();
            }
        }
    }

    private loadScript(url: string, callback: any): void {
        const head = document.getElementsByTagName('head')[0];
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;

        // Then bind the event to the callback function.
        script.onload = callback;

        // Fire the loading
        head.appendChild(script);
    }

    private onScriptLoaded(): void {
        this._itemsLoaded++;

        Logger.debug('Loaded script');
        this.emit(AssetsConfigLoader.EVENT_LOADING_PROGRESS, this.getSharedProgress());
    }

    private onChildConfigLoaded(): void {
        this.childConfigsBeingLoaded--;

        if (!this.childConfigsBeingLoaded) {
            this.emit(AssetsConfigLoader.EVENT_CONFIG_LOADED);
            if (!this.configOnly) {
                this.loadAssets();
            }
        }
    }

    private getSharedProgress(): number {
        return this._itemsToLoad > 0 ? this._pixiLoaderProgress * 0.9 + (this._itemsLoaded / this._itemsToLoad) * 10 : this._pixiLoaderProgress;
    }

    private onAllAssetsLoaded(resources: any): void {
        if (this.getSharedProgress() >= 100) {
            let preloadingTexturesIntoGPUMemory: boolean = false;
            let emptyResources: boolean = true;

            for (const resourceName in resources) {
                const resource = resources[resourceName];
                const assetType: AssetType = resourceName.substring(0, resourceName.indexOf('-')) as AssetType;
                const assetName: string = resourceName.substring(resourceName.indexOf('-') + 1);
                emptyResources = false;

                switch (assetType) {
                    case AssetType.LAYOUT:
                        AssetsManager.layouts.set(assetName, LayoutElementFactory.parseLayoutDescription(resource));
                        // Logger.debug("Loaded layout: " + assetName);
                        break;
                    case AssetType.VIDEO:
                        AssetsManager.videos.set(assetName, resource);
                        break;
                    case AssetType.TEXTURE:
                        if (resource instanceof Spritesheet) {
                            preloadingTexturesIntoGPUMemory = this.checkSpriteSheet(resource as Spritesheet);
                            (resource as Spritesheet).linkedSheets.forEach((spritesheet) => {
                                preloadingTexturesIntoGPUMemory = this.checkSpriteSheet(spritesheet);
                            });
                        } else {
                            AssetsManager.textures.set(assetName, resource);
                            Logger.debug('Loaded texture: ' + assetName);

                            if (this.renderer) {
                                preloadingTexturesIntoGPUMemory = true;
                                this.renderer.prepare.add(resource);
                            }
                        }
                        break;
                    case AssetType.SPINE:
                        const name = assetName.substring(0, assetName.lastIndexOf('-'));

                        if (!AssetsManager.spine.get(name)) {
                            AssetsManager.spine.set(name, {
                                skeletonUrl: '',
                                atlasUrl: ''
                            });
                        }

                        if (assetName.includes('skeleton')) {
                            AssetsManager.spine.get(name).skeletonUrl = resourceName;
                        }
                        if (assetName.includes('atlas')) {
                            AssetsManager.spine.get(name).atlasUrl = resourceName;
                            if (this.renderer) {
                                resource.pages.forEach((page: TextureAtlasPage): void => {
                                    preloadingTexturesIntoGPUMemory = true;
                                    this.renderer.prepare.add((page.texture as SpineTexture).texture);
                                });
                            }
                        }
                        break;
                    case AssetType.XML:
                        const parser: DOMParser = new DOMParser();
                        AssetsManager.xmls.set(assetName, parser.parseFromString(resource, 'text/xml'));
                        break;
                    case AssetType.WEB_FONT:
                        const fontFace: FontFace = resource as FontFace;
                        AssetsManager.webFonts.set(assetName, fontFace);
                        break;
                    case AssetType.BITMAP_FONT:
                        const bitmapFont: BitmapFont = resource as BitmapFont;
                        AssetsManager.bitmapFonts.set(bitmapFont.font, bitmapFont);
                        // Logger.debug(`Loaded bitmap font: ${bitmapFont.font}`);
                        break;
                }
            }

            if (preloadingTexturesIntoGPUMemory && this.renderer.rendererLogId != 'Canvas') {
                if (this.renderer) {
                    this.renderer.prepare.upload()
                        .then(() => {
                            // Assets.reset();
                            this.emit(AssetsConfigLoader.EVENT_LOADING_COMPLETE);
                        });
                    return;
                }
            }
            //Assets.reset();
            if (!emptyResources) Assets.reset();
            this.emit(AssetsConfigLoader.EVENT_LOADING_COMPLETE);
        } else {
            Logger.debug('Waiting for sounds and script assets to load.');
            setTimeout(() => {
                this.onAllAssetsLoaded(resources);
            }, 1000);
        }
    }

    private checkSpriteSheet(spritesheet: Spritesheet): boolean {
        let preloadingTexturesIntoGPUMemory = false;
        for (const assetName in spritesheet.textures) {
            AssetsManager.textures.set(assetName, spritesheet.textures[assetName]);
            Logger.debug('Loaded texture: ' + assetName);

            if (this.renderer) {
                preloadingTexturesIntoGPUMemory = true;
                this.renderer.prepare.add(spritesheet.textures[assetName]);
            }
        }
        return preloadingTexturesIntoGPUMemory;
    }

    private onError(reason: string): void {
        console.log(reason);
    }
}
