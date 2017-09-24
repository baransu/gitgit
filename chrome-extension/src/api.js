import isEmpty from 'lodash/isEmpty';

const API = 'https://api.github.com';
const PER_PAGE = 100;
const MEMOIZATION_EXPIRES = 10000;

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

export function cachedGet(path, t, selector = a => a.data) {
  const name = `GET:${path}`;
  return new Promise((resolve, reject) => {
    window.chrome.storage.sync.get(name, res => {
      const now = Date.now();
      if (isEmpty(res) || now - res.time > t) {
        console.log(`Memoizing ${name}`);
        get(path).then(res => {
          const value = selector(res);
          chrome.storage.sync.set({ [name]: { time: now, value } });
          resolve(value);
        });
      } else {
        resolve(res[name].value);
      }
    });
  });
}

export function getUserRepos(user, token, page = 1) {
  const selector = ({ data }) => ({
    data: data.map(({ stargazers_count, language }) => ({
      stargazers_count,
      language
    }))
  });

  const tokenArg = token ? `&access_token=${token}` : '';
  return cachedGet(
    `/users/${user}/repos?per_page=${PER_PAGE}&type=all&page=${page}${tokenArg}`,
    MEMOIZATION_EXPIRES,
    selector
  )
    .then(res => {
      if (res.data.length < PER_PAGE) return Promise.resolve(res);
      return getUserRepos(user, token, page + 1).then(nextRes => ({
        data: [...res.data, ...nextRes.data]
      }));
    })
    .catch(console.error);
}

export function getOrgs(user) {
  cachedGet(`/users/${user}/repos`, MEMOIZATION_EXPIRES)
    .then(res => res.data)
    .catch(console.error);
}
