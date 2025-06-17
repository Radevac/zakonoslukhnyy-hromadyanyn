// import i18next from 'i18next';
// import { initReactI18next } from 'react-i18next';
// import * as Localization from 'expo-localization';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { languages } from '../i18n/locales/index';
//
// const config = {
//     SUPPORTED_LANGUAGES: Object.keys(languages),
//     DEFAULT_LANGUAGE: 'en',
//     APP_LANGUAGE: 'APP_LANGUAGE',
// };
//
// const getDeviceLanguage = () => {
//     const locales = Localization.getLocales();
//     return locales?.[0]?.languageCode || config.DEFAULT_LANGUAGE;
// };
//
// const initialLang = config.SUPPORTED_LANGUAGES.includes(getDeviceLanguage())
//     ? getDeviceLanguage()
//     : config.DEFAULT_LANGUAGE;
//
// i18next
//     .use(initReactI18next)
//     .init({
//         resources: languages,
//         lng: initialLang,
//         fallbackLng: config.DEFAULT_LANGUAGE,
//         interpolation: {
//             escapeValue: false,
//         },
//     });
//
// export const changeLanguage = async (lang) => {
//     try {
//         const selected = config.SUPPORTED_LANGUAGES.includes(lang)
//             ? lang
//             : config.DEFAULT_LANGUAGE;
//         await i18next.changeLanguage(selected);
//         await AsyncStorage.setItem(config.APP_LANGUAGE, selected);
//         if (__DEV__) console.log(`Language changed to: ${selected}`);
//     } catch (err) {
//         console.error('Failed to change language', err);
//     }
// };
//
// export const loadLanguage = async () => {
//     try {
//         const saved = await AsyncStorage.getItem(config.APP_LANGUAGE);
//         if (saved && config.SUPPORTED_LANGUAGES.includes(saved)) {
//             await i18next.changeLanguage(saved);
//             if (__DEV__) console.log(`Loaded saved language: ${saved}`);
//         } else {
//             const fallback = getDeviceLanguage();
//             const lang = config.SUPPORTED_LANGUAGES.includes(fallback)
//                 ? fallback
//                 : config.DEFAULT_LANGUAGE;
//             await i18next.changeLanguage(lang);
//             if (__DEV__) console.log(`Loaded default language: ${lang}`);
//         }
//     } catch (err) {
//         console.error('Failed to load language:', err);
//         await i18next.changeLanguage(config.DEFAULT_LANGUAGE);
//     }
// };
