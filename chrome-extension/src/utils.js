// @flow

import pathToRegexp from 'path-to-regexp';

export function getUsername(): string {
  const [_a, username] = window.location.pathname.split('/');
  return username;
}

const LANGUAGES = {
  null: 'Ambassador',
  Elixir: 'Alchemist',
  Elm: 'Druid',
  JavaScript: 'Ninja',
  CoffeeScript: 'Brewer',
  Bash: 'Blacksmith',
  C: 'Tinkerer',
  Java: 'Garbage',
  Scala: 'Wizzard',
  Erlang: 'Necromancer',
  CSS: 'Bard',
  HTML: 'Architect',
  Rust: 'Scrap Constructor',
  'C#': 'Librarian',
  Ruby: 'Jeweler'
};

function groupBy(xs: Array<*>, key: string): { [key: string]: Array<*> } {
  return xs.reduce((acc, x) => {
    return { ...acc, [x[key]]: (acc[x[key]] || []).concat(x) };
  }, {});
}

export function getClass(lang: string): string {
  const prefix = LANGUAGES[lang];
  return prefix ? `${prefix} (${lang})` : lang;
}

export function getLevels(
  repos: Array<{ language: string, stargazers_count: number }>
) {
  const langs = groupBy(repos, 'language');
  return Object.keys(langs)
    .map(key => ({
      key: key,
      level: langs[key].reduce((acc, a) => acc + a.stargazers_count, 0)
    }))
    .filter(a => a.level > 0)
    .sort((a, b) => b.level - a.level);
}

export function on(path: string, callback: (params: mixed) => void) {
  let keys = [];
  const regexp = pathToRegexp(path, keys);
  const exec = regexp.exec(window.location.pathname);
  if (exec) {
    const [url, ...values] = exec;
    const params = keys.reduce(
      (acc, key, index) => ({
        ...acc,
        [key.name]: values[index]
      }),
      {}
    );
    if (typeof callback === 'function') {
      callback(params);
    }
  }
}
