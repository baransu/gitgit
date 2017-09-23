const API = 'https://api.github.com';

function fetch(path: string, args: Object) {
  return window.fetch(`${API}${path}`, args).then(res => {
    if (res.status === 200 || res.status === 201) {
      return res
        .json()
        .then(data => Promise.resolve({ status: res.status, data }));
    } else {
      return res
        .text()
        .then(message => Promise.reject({ status: res.status, message }));
    }
  });
}

export function get(path: string) {
  return fetch(path, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  });
}
