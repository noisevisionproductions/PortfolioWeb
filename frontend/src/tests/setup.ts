import {expect, afterEach, vi} from 'vitest';
import {cleanup} from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import '@testing-library/jest-dom';
import {initReactI18next} from "react-i18next";
import i18nTranslation from "../utils/translations/i18nTranslation";

expect.extend(matchers as any);

afterEach(() => {
    cleanup();
});

const localStorageMock = {
    getItem: vi.fn().mockImplementation(() => null),
    setItem: vi.fn().mockImplementation(() => {
    }),
    removeItem: vi.fn().mockImplementation(() => {
    }),
    clear: vi.fn().mockImplementation(() => {
    })
};

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true
});

i18nTranslation.use(initReactI18next).init({
    lng: 'pl',
    fallbackLng: 'pl',
    ns: ['translations'],
    defaultNS: 'translations',
    resources: {
        pl: {
            translations: {}
        }
    },
    react: {
        useSuspense: false
    }
}).catch(console.error);

export {localStorageMock};