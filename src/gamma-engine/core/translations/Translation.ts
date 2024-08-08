// TODO: create a proper translation system based on one of the existing libraries instead of this stopgap solution
import Logger from '../utils/Logger';

type TranslationEntry =
    string
    | TranslationBundle;

interface TranslationBundle {
    [key: string]: TranslationEntry;
}

export default class Translation {
    private static languagesData: Map<string, Map<string, string>> = new Map();
    private static currentLanguage: string = 'en';

    public static addLanguageData(languageId: string, data: unknown) {
        if (Translation.languagesData.has(languageId)) {
            Logger.warning(`Language with id '${languageId}' already exists`);
            return;
        }

        const map: Map<string, string> = new Map();
        Translation.processBundle(map, data as TranslationBundle);
        Translation.languagesData.set(languageId, map);
    }

    private static processBundle(map: Map<string, string>, data: TranslationBundle, prefix: string = '') {
        for (const key in data) {
            const entry = data[key];
            if (typeof entry === 'string') {
                // console.log(`${prefix}${key}`, entry);
                map.set(`${prefix}${key}`, entry)
            } else {
                Translation.processBundle(map, entry, `${prefix}${key}.`);
            }
        }
    }

    public static setCurrentLanguage(languageId: string) {
        Translation.currentLanguage = languageId;
    }

    public static t(key: string): string {
        if (!Translation.languagesData.has(Translation.currentLanguage)) {
            Logger.warning(`No language data for current language '${Translation.currentLanguage}' defined`);
        }

        const data = Translation.languagesData.get(Translation.currentLanguage);

        // return original key string if the translation is not found
        return data.get(key) ?? key;
    }
}
