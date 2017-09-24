import { h, Component } from 'preact';

import { getUsername } from '../utils';

const UserComment = props => {
  const username = getUsername();
  return (
    <a href={`/${username}`}>
      <img
        className="avatar rounded-1"
        src={props.avatar}
        alt={`@${username}`}
        height="44"
        width="44"
      />
    </a>
  );
};

export default UserComment;
