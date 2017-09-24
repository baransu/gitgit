import { h, Component } from 'preact';

import { getUserRepos } from '../api';
import { getLevels, getClass, getUsername } from '../utils';

class UserProfile extends Component {
  state = { levels: [], loading: true };

  componentDidMount() {
    const { delay } = this.props;
    const { user } = this.props.params;
    const start = Date.now();

    window.chrome.storage.sync.get('access-token', storage => {
      const token = storage['access-token'];
      getUserRepos(user, token).then(({ data }) => {
        console.log('REPOS', data);
        const diff = Date.now() - start;
        if (diff < delay) {
          setTimeout(
            () => this.setState({ loading: false, levels: getLevels(data) }),
            delay - diff
          );
        }
      });
    });
  }

  render() {
    return (
      <div>
        {this.state.loading && <span>Processing your githubiness...</span>}
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
