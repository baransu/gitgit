import { h, render } from 'preact';

import UserProfile from './components/UserProfile';
import { getUserRepos, cachedGet } from './api';
import './style.scss';

function run() {
  const pageUser = document.querySelector('.p-nickname.vcard-username.d-block');
  let commentUser = document.querySelector(
    '.avatar-parent-child.timeline-comment-avatar'
  );
  if (pageUser) {
    const div = document.createElement('div');
    render(<UserProfile />, div);
    pageUser.appendChild(div);
  }
  if (commentUser) {
    commentUser.innerHTML += "<div class='ribbon'></div>";
  }
}

document.addEventListener('pjax:end', run);
run();
