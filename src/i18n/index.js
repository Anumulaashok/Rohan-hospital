export const LANGS = ['en', 'te'];

export function getLang(url) {
  return /^\/te(\/|$)/.test(url.pathname) ? 'te' : 'en';
}

// Path without the /te prefix, used to find the same page in the other language.
export function basePath(pathname) {
  return pathname.replace(/^\/te(?=\/|$)/, '') || '/';
}

export function localize(path, lang) {
  return lang === 'te' ? `/te${path}` : path;
}

export function useLang(url) {
  const lang = getLang(url);
  const other = lang === 'te' ? 'en' : 'te';
  return {
    lang,
    other,
    tr: (en, te) => (lang === 'te' ? te : en),
    link: (path) => localize(path, lang),
    altPath: localize(basePath(url.pathname), other),
  };
}
