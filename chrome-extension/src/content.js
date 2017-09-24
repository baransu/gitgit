import { h, render } from 'preact';

import UserProfile from './components/UserProfile';
import { getUserRepos, cachedGet } from './api';
import './style.scss';

function run() {
  // PROFILE PAGE
  const pageUser = document.querySelector('.p-nickname.vcard-username.d-block');
  if (pageUser) {
    const div = document.createElement('div');
    render(<UserProfile />, div);
    pageUser.appendChild(div);
  }

  // ISSUE/PULL REQUEST PAGE
  let commentUser = document.querySelector(
    '.avatar-parent-child.timeline-comment-avatar'
  );
  if (commentUser) {
    commentUser.innerHTML += "<div class='ribbon'></div>";
  }
}

// function getExpForLevel(level) {
//   return Math.pow(10, Math.floor(level / 10));
// }
//
// function getExpTotalForLevel(level) {
//   let total = 0;
//   while (level-- > 0) total += getExpForLevel(level);
//   return total;
// }
//
// function getLevel(exp) {
//   let leftExp = exp;
//   let level = 0;
//   while (++level && leftExp > 0) {
//     leftExp -= getExpForLevel(level);
//   }
//   return level - 1;
// }
//
// function levelPrompt(exp) {
//   const lvl = getLevel(exp);
//   const baseExp = exp - getExpTotalForLevel(lvl);
//   const toNext = getExpForLevel(lvl + 1);
//   return `${lvl} (${baseExp}/${toNext})`;
// }

document.addEventListener('pjax:end', run);
run();
