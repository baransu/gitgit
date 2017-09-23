// import { get } from './api';
import './style.scss';

console.log('GitGit initialized');

const getUser = memoize(10000, function getUser (user, f){
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "https://api.github.com/users/" + user + "/repos", true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      // JSON.parse does not evaluate the attacker's scripts.
      var resp = JSON.parse(xhr.responseText);
      f(resp);
    }
  };
  xhr.send();
});

// const getUser = memoize(10000, function getUser(user, cb) {
//   get(`/users/${user}/repos`)
//     .then(res => cb(res.data))
//     .catch(console.error);
// });

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


function memoize(t, name, f){
  return function(...args) {
    let name = name + JSON.stringify(args);
    chrome.storage.sync.get(name, (res) => {
      let now = Date.now();
      console.log(res)
      let v = (res == {}) ? {} : JSON.parse(res);
      if(!v || now - v.time > t) {
        console.log("memoizing");
        v = {time: now, value: f.apply(args)};
        chrome.storage.sync.set({[name]: JSON.stringify(v)}, () => ({}));
      }
      console.log("memoized");
      return v.value;
    });
  };
}

function run() {
  const url = window.location.href;
  const user = window.location.href.split('/')[3];
  const pageUser = document.querySelector('.p-nickname.vcard-username.d-block');
  let commentUser = document.querySelector(
    '.avatar-parent-child.timeline-comment-avatar'
  );
  if (pageUser) {
    getUser(user, repos => {
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
