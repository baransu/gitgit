import { getUserRepos } from './api';
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
  chrome.storage.sync.get("access-token", ls => {
    const token = ls["access-token"];
    const url = window.location.href;
    const user = window.location.href.split('/')[3];
    const pageUser = document.querySelector('.p-nickname.vcard-username.d-block');
    let commentUser = document.querySelector(
      '.avatar-parent-child.timeline-comment-avatar'
    );
    if (pageUser) {
      getUserRepos(user, token)
        .then(data => {
          const repos = data.data;
          const level = getLevels(repos);
          pageUser.innerHTML += '</br>' + level;
        });
    }
    if (commentUser) {
      commentUser.innerHTML += "<div class='ribbon'></div>";
    }
  });
}

function getExpForLevel(level) {
  return Math.pow(10, Math.floor(level/10));
}
function getExpTotalForLevel(level){
  let total = 0;
  while(level-- > 0) total += getExpForLevel(level);
  return total;
}

function getLevel(exp) {
  let leftExp = exp;
  let level = 0;
  while(++level && leftExp > 0) {
    leftExp -= getExpForLevel(level);
  }
  return level - 1;
}

function levelPrompt(exp) {
  const lvl = getLevel(exp);
  const baseExp = exp - getExpTotalForLevel(lvl);
  const toNext = getExpForLevel(lvl + 1);

  return `${lvl} (${baseExp}/${toNext})`;
}

///////////////////////////
// ------- main -------- //
///////////////////////////


document.addEventListener('pjax:end', run);
run();
