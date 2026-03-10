import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import middleware from 'i18next-http-middleware';
import path from 'path';

i18next
    .use(Backend)
    .use(middleware.LanguageDetector)
    .init({
        // debug: true,
        fallbackLng: 'en',
        defaultNS: 'translation',
        preload: ['en'],

        backend: {
            loadPath: path.join(__dirname, '../locales/{{lng}}/{{lng}}.json')
        },
        detection: {
            order: ['querystring', 'cookie', 'header'],
            // caches: ['cookie'],
            lookupHeader: 'accept-language',
            cookieMinutes: 10080,
            lookupQuerystring: 'lng',
            lookupFromPathIndex: 0,
        }
    });

export { i18next, middleware };