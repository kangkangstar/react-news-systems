import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import Backend from "i18next-xhr-backend"
import LanguageDetector from "i18next-browser-languagedetector"

// 需要切换的语言类型
const Languages = ["en", "de"]

// 配置i18n
export default i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: "en",
        debug: true,
        whitelist: Languages,
        interpolation: {
            escapeValue: false,
        }
    })