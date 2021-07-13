import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
// import { Localization } from 'expo';
import * as Localization from "expo-localization"
import HomepageTranslations from './Homepage';
import QRCodeTranslations from './QRCodeScreen';
import GlobalTranslations from './Global';
import CodeScreenTranslations from './CodeScreen';
import CodeErrorsTranslations from './CodeErrors';
import ThankYouScreenTranslations from './ThankYouScreen';
import NoQRCodeTranslations from './NoQRCode';

// creating a language detection plugin using expo
// http://i18next.com/docs/ownplugin/#languagedetector
const languageDetector = {
    type: 'languageDetector',
    async: true, // flags below detection to be async
    detect: (callback) => {
        return callback(Localization.locale);
        /*return /!*'en'; *!/ DangerZone.Localization.getCurrentLocaleAsync().then(lng => {
            callback(lng.replace('_', '-'));
        })*/
    },
    init: () => {},
    cacheUserLanguage: () => {}
};

i18next
    .use(languageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',
        // the translations
        // realworld load that via xhr or bundle those using webpack
        resources: {
            en: {
                home: HomepageTranslations.en,
                qrCodeScreen: QRCodeTranslations.en,
                codeScreen: CodeScreenTranslations.en,
                thankYouScreen: ThankYouScreenTranslations.en,
                NoQRCodeScreen: NoQRCodeTranslations.en,
                codeErrors: CodeErrorsTranslations.en,
                global: GlobalTranslations.en
            },
            fr: {
                home: HomepageTranslations.fr,
                qrCodeScreen: QRCodeTranslations.fr,
                codeScreen: CodeScreenTranslations.fr,
                thankYouScreen: ThankYouScreenTranslations.fr,
                NoQRCodeScreen: NoQRCodeTranslations.fr,
                codeErrors: CodeErrorsTranslations.fr,
                global: GlobalTranslations.fr
            },
            nl: {
                home: HomepageTranslations.nl,
                qrCodeScreen: QRCodeTranslations.nl,
                codeScreen: CodeScreenTranslations.nl,
                thankYouScreen: ThankYouScreenTranslations.nl,
                NoQRCodeScreen: NoQRCodeTranslations.nl,
                codeErrors: CodeErrorsTranslations.nl,
                global: GlobalTranslations.nl
            },
            // have a initial namespace
            ns: ['translation'],
            defaultNS: 'translation',
            interpolation: {
                escapeValue: false // not needed for react
            }
        }
    });

export default i18next;