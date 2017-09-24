import { h, Component } from 'preact';

const UserComment = props => {
  return (
    <div className={props.className}>
      <a href={`/${props.user}`}>
        <img
          className="avatar rounded-1"
          src={props.avatar}
          alt={`@${props.user}`}
          height="44"
          width="44"
        />
      </a>
      <div className="ribbon" />
    </div>
  );
};

export default UserComment;
