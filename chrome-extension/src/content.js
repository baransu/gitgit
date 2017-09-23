import { getUserRepos, cachedGet } from './api';
import './style.scss';
import _ from 'lodash';
const { flow } = _;

const groupBy = function(xs, key) {
  return xs.reduce((acc, x) => {
    return { ...acc, [x[key]]: (acc[x[key]] || []).concat(x) };
  }, {});
};

function getLevels(repos) {
  const langs = groupBy(repos, 'language');
  return Object.keys(langs)
    .map(key => ({
      key: key,
      level: langs[key].reduce((acc, a) => acc + a.stargazers_count, 0)
    }))
    .sort((a, b) => b.level - a.level)
    .reduce((acc, { key, level }) => {
      if (level) return acc + '</br>' + level + ' Lvl - ' + getClass(key);
      else return acc;
    }, '');
}

function getClass(language) {
  const c = {
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
  }[language];
  return c ? `${c} (${language})` : language;
}

function run() {
  const url = window.location.href;
  const user = window.location.href.split('/')[3];
  const pageUser = document.querySelector('.p-nickname.vcard-username.d-block');
  let commentUser = document.querySelector(
    '.avatar-parent-child.timeline-comment-avatar'
  );
  if (pageUser) {
    getUserRepos(user)
      .then(data => {
        const repos = data.data;
        console.log("REPOS" + repos.toString);
        const level = getLevels(repos);
        pageUser.innerHTML += '</br>' + level;
      });
  }
  if (commentUser) {
    commentUser.innerHTML += "<div class='ribbon'></div>";
  }
}

///////////////////////////
// ------- main -------- //
///////////////////////////

document.addEventListener('pjax:end', run);
run();
