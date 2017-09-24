import { h, render, Component } from 'preact';
import range from 'lodash/fp/range';

import { get } from './api';

class Popup extends Component {
  state = {
    hasToken: false,
    token: '',
    error: null,
    saving: false,
    message: null
  };

  componentDidMount() {
    window.chrome.storage.sync.get('access-token', storage =>
      this.setState({ hasToken: !!storage['access-token'] })
    );
  }

  handleChange = e =>
    this.setState({ error: null, message: null, token: e.target.value });

  handleSave = () => {
    const { token } = this.state;
    this.setState({ saving: true, message: null, error: null }, () => {
      get(`/rate_limit?access_token=${token}`)
        .then(() => {
          window.chrome.storage.sync.set({ 'access-token': token });
          this.setState({ saving: false, message: 'Saved token' });
        })
        .catch(() =>
          this.setState({
            saving: false,
            error: `Entered access token may be invalid`
          })
        );
    });
  };

  render() {
    return (
      <div style={{ padding: '10px' }}>
        <h3 style={{ textAlign: 'center' }}>Git git gamification</h3>
        <div>
          <p style={{ textAlign: 'center' }}>
            Provide your GitHub access token
          </p>
          {this.state.hasToken && (
            <p style={{ textAlign: 'center', color: 'green' }}>
              You've already provided your token
            </p>
          )}
          <div>
            <input
              style={{ width: 'calc(100% - 20px)', padding: '5px' }}
              placeholder={
                this.state.hasToken
                  ? 'Enter new access token'
                  : 'Enter your access token'
              }
              value={this.state.token}
              onChange={this.handleChange}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={this.handleSave}
              style={{
                padding: '5px 20px',
                textAlign: 'center',
                margin: '10px auto 5px'
              }}
            >
              {this.state.saving ? 'Saving...' : 'Save your token'}
            </button>
          </div>
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
