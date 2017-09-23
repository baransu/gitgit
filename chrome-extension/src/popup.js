import { h, render, Component } from 'preact';

import { get } from './api';

class Popup extends Component {
  state = { token: '', error: null, saving: false, message: null };

  handleChange = e =>
    this.setState({ error: null, message: null, token: e.target.value });

  handleSave = () => {
    const { token } = this.state;
    this.setState({ saving: true, message: null, error: null }, () => {
      get(`/rate_limit?access_token=${token}`)
        .then(() => {
          chrome.storage.sync.set({ 'access-token': token });
          this.setState({ saving: false, message: 'Saved token' });
        })
        .catch(() =>
          this.setState({
            saving: false,
            error: `Your access token may be inavlid`
          })
        );
    });
  };

  render() {
    return (
      <div>
        <h3>Git git gamification</h3>
        <div>
          <div>Provide your GitHub access token</div>
          <div>
            <input
              placeholder="Enter your access token"
              value={this.state.token}
              onChange={this.handleChange}
            />
          </div>
          <button onClick={this.handleSave}>
            {this.state.saving ? 'Saving...' : 'Save your token'}
          </button>
          {this.state.error && (
            <div style={{ color: 'red', textAlign: 'center' }}>
              {this.state.error}
            </div>
          )}
          {this.state.message && (
            <div style={{ color: 'green', textAlign: 'center' }}>
              {this.state.message}
            </div>
          )}
        </div>
      </div>
    );
  }
}

render(<Popup />, document.getElementById('root'));
