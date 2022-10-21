import { getTranslation, getMessages } from '../services/ServerlessService';

// default language to initialize plugin
export const defaultLanguage = 'en-US';

const defaultTranslation = require(`../translations/${defaultLanguage}/flexUI.json`);
const defaultMessages = require(`../translations/${defaultLanguage}/messages.json`);

const enINTranslation = require(`../translations/en-IN/flexUI.json`);
const enINMessages = require(`../translations/en-IN/messages.json`);

const esCLTranslation = require(`../translations/es-CL/flexUI.json`);
const esCLMessages = require(`../translations/es-CL/messages.json`);

const esCOTranslation = require(`../translations/es-CO/flexUI.json`);
const esCOMessages = require(`../translations/es-CO/messages.json`);

const esESTranslation = require(`../translations/es-ES/flexUI.json`);
const esESMessages = require(`../translations/es-ES/messages.json`);

const huHUTranslation = require(`../translations/hu-HU/flexUI.json`);
const huHUMessages = require(`../translations/hu-HU/messages.json`);

const ptBRTranslation = require(`../translations/pt-BR/flexUI.json`);
const ptBRMessages = require(`../translations/pt-BR/messages.json`);

const thTHTranslation = require(`../translations/th-TH/flexUI.json`);
const thTHMessages = require(`../translations/th-TH/messages.json`);

const plPLTranslation = require(`../translations/pl-PL/flexUI.json`);
const plPLMessages = require(`../translations/pl-PL/messages.json`);

const bundledTranslations = {
  [defaultLanguage]: defaultTranslation,
  'en-IN': enINTranslation,
  'es-CL': esCLTranslation,
  'es-CO': esCOTranslation,
  'es-ES': esESTranslation,
  'hu-HU': huHUTranslation,
  'pt-BR': ptBRTranslation,
  'th-TH': thTHTranslation,
  'pl-PL': plPLTranslation,
};

const bundledMessages = {
  [defaultLanguage]: defaultMessages,
  'en-IN': enINMessages,
  'es-CL': esCLMessages,
  'es-CO': esCOMessages,
  'es-ES': esESMessages,
  'hu-HU': huHUMessages,
  'pt-BR': ptBRMessages,
  'pl-PL': plPLMessages,
};

const translationErrorMsg = 'Could not translate, using default';

/**
 * Given localization config object, returns a function that receives a language and fetches the UI translation
 * @returns {(language: string) => Promise<void>}
 */
export const initTranslateUI = localizationConfig => async language => {
  const { twilioStrings, setNewStrings, afterNewStrings } = localizationConfig;
  try {
    if (language in bundledTranslations) {
      const translation = bundledTranslations[language];
      setNewStrings({ ...twilioStrings, ...translation });
    } else {
      const body = { language };
      const translationJSON = await getTranslation(body);
      const translation = await (typeof translationJSON === 'string'
        ? JSON.parse(translationJSON)
        : Promise.resolve(translationJSON));
      setNewStrings(translation);
    }
    afterNewStrings(language);
  } catch (err) {
    window.alert(translationErrorMsg);
    console.error(translationErrorMsg, err);
  }
};

/**
 * Function that receives a language and a message key and fetches the appropriate message from serverless translations
 * @param {string} messageKey
 * @returns {(language: string) => Promise<string>}
 */
export const getMessage = messageKey => async language => {
  try {
    if (!language) return defaultMessages[messageKey];

    if (language in bundledMessages) return bundledMessages[language][messageKey];

    // If no translation for this language, try to fetch it
    const body = { language };
    const messagesJSON = await getMessages(body);
    const messages = await (typeof messagesJSON === 'string'
      ? JSON.parse(messagesJSON)
      : Promise.resolve(messagesJSON));
    if (messages[messageKey]) return messages[messageKey];

    return defaultMessages[messageKey];
  } catch (err) {
    window.alert(translationErrorMsg);
    console.error(translationErrorMsg, err);
    return defaultMessages[messageKey];
  }
};

/**
 * WARNING: the way this is done right now is "hacky", as it changes an object reference (setNewStrings) and then forces a re-render (afterNewStrings). The safe way of doing this would be 1) async init method 2) having access to a function that updates the ContextProvider state that wraps the entire app. A fallback is to move translations within the code (avoiding the asynchronous operation).
 *
 * Receives localization config object and initial language. Based on this, translates the UI
 * to match the counselor's preferences (if needed).
 * Returns the functions used for further localization, attaching to them the localization config object
 * @param {{ twilioStrings: any; setNewStrings: (newStrings: any) => void; afterNewStrings: (language: string) => void; }} localizationConfig
 * @param {string} initialLanguage
 */
export const initLocalization = (localizationConfig, initialLanguage) => {
  const translateUI = initTranslateUI(localizationConfig);

  const { setNewStrings } = localizationConfig;

  setNewStrings(defaultTranslation);
  if (initialLanguage && initialLanguage !== defaultLanguage) translateUI(initialLanguage);

  return {
    translateUI,
    getMessage,
  };
};
