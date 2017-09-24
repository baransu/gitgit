import { h, render } from 'preact';
import pathToRegexp from 'path-to-regexp';

import UserProfile from './components/UserProfile';
import UserComment from './components/UserComment';
import { getUserRepos, cachedGet } from './api';
import { getUsername } from './utils';
import './style.scss';

function on(path, callback) {
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

function run() {
  // PROFILE PAGE
  on('/:user', params => {
    const selector = '.p-nickname.vcard-username.d-block';
    const pageUser = document.querySelector(selector);
    if (pageUser) {
      const div = document.createElement('div');
      render(<UserProfile params={params} delay={300} />, div);
      pageUser.appendChild(div);
    }
  });

  // ISSUE/PULL REQUEST PAGE
  on('/:user/:repo/issues/:id', params => {
    const selector = '.avatar-parent-child.timeline-comment-avatar';
    const commentAuthor = document.querySelector(selector);
    if (commentAuthor) {
      const [img] = commentAuthor.getElementsByTagName('img');
      const div = document.createElement('div');
      render(
        <UserComment
          avatar={img.src}
          user={img.alt.replace('@', '')}
          params={params}
          className="avatar-parent-child timeline-comment-avatar"
        />,
        div
      );
      commentAuthor.replaceWith(div);
    }
  });
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
