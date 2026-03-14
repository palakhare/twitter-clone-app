import i18n from "i18next"
import { initReactI18next } from "react-i18next"

const resources = {
  en: {
    translation: {
      home: "Home",
      post: "Post",
      more: "More"
    }
  },
  fr: {
    translation: {
      home: "Accueil",
      post: "Publier",
      more: "Plus"
    }
  },
  hi: {
    translation: {
      home: "होम",
      post: "पोस्ट",
      more: "अधिक"
    }
  },
  es: {
    translation: {
      home: "Inicio",
      post: "Publicar",
      more: "Más"
    }
  },
  pt: {
    translation: {
      home: "Início",
      post: "Postar",
      more: "Mais"
    }
  },
  zh: {
    translation: {
      home: "主页",
      post: "发布",
      more: "更多"
    }
  }
}

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  interpolation: {
    escapeValue: false
  }
})

export default i18n