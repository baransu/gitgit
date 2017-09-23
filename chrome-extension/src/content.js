// import React from 'react';
// import { render } from 'react-dom';

import { get } from './api';
import './style.scss';

// We want to match both lowercase strings and their capitalized versions in pages

// the text to use as content--the inner html of the page
// document.body.innerHTML = replaceBoringPhrases(document.body.innerHTML);

// console.log('HA');
// console.log(chrome);

document.addEventListener('pjax:end', run);
run();

function run() {
  // run code/call function
  // const users = {
  //   wende: "Elixir Alchemist Lvl 10 </br> Elm Druid Lvl 4",
  //   Baransu: "JS Ninja Lvl 10 </br> Elm Druid Lvl 4"
  // };

  // chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
  const url = window.location.href;
  //for(user in users){
  //if(url.indexOf(user) !== -1){
  const user = window.location.path.split('/')[3];
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

function getUser(user, cb) {
  get(`/users/${user}/repos`)
    .then(res => cb(res.data))
    .catch(console.error);
}

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
