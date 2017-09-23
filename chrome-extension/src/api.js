const API = 'https://api.github.com';
import get from "lodash/fp/get";

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

export function cachedGet(path, t, selector) {
  const name = `GET:${path}`;
  const promise = new Promise((resolve, reject) => {
    chrome.storage.sync.get(name, res => {
      let now = Date.now();
      if(_.isEqual(res, {}) || now - res.time > t) {
        console.log(`Memoizing ${name}`);
        get(path).then(res => {
          const v = {time: now, value: res};
          chrome.storage.sync.set({[name]: v});
          resolve(v.value);
        });
      }
      else resolve(res[name].value);
    });
  });
  return promise;
}


export function getUserRepos(user, page = 1) {
  return cachedGet(`/users/${user}/repos?type=all&page=${page}&access_token=3922ca8fdfda50f6ca6814f6f0db5fffc479f871`, 10000)
    .then(res => {
      if(res.data.length >= 30){
          return getUserRepos(user, page + 1)
          .then(nextRes => ({data: [...res.data, ...nextRes.data]}));
      } else return Promise.resolve(res);
    })
    .catch(console.error);
}

export function getOrgs(user) {
  cachedGet(`/users/${user}/repos`, 10000)
    .then(res => res.data)
    .catch(console.error);
};
