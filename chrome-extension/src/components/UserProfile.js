import { h, Component } from 'preact';

import { getUserRepos } from '../api';
import { getLevels, getClass, getUsername } from '../utils';

class UserProfile extends Component {
  state = { levels: [], loading: true };

  componentDidMount() {
    const username = getUsername();
    getUserRepos(username).then(({ data }) => {
      console.log('REPOS', data);
      this.setState({ loading: true, levels: getLevels(data) });
    });
  }

  render() {
    return (
      <div>
        {this.state.loading && <span>Loading...</span>}
        {this.state.levels.map(({ key, level }) => (
          <span>
            {level} {getClass(key)} <br />
          </span>
        ))}
      </div>
    );
  }
}

export default UserProfile;
