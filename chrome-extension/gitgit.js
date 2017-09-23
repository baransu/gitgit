// We want to match both lowercase strings and their capitalized versions in pages

// the text to use as content--the inner html of the page
// document.body.innerHTML = replaceBoringPhrases(document.body.innerHTML);

console.log("HA");
console.log(chrome);

const getUser = memoize(10000, function getUser (user, f){
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "https://api.github.com/users/" + user + "/repos", true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      // JSON.parse does not evaluate the attacker's scripts.
      var resp = JSON.parse(xhr.responseText);
      f(resp);
    }
  };
  xhr.send();
});

var groupBy = function(xs, key) {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

function getLevels(repos){
  langs = groupBy(repos, "language");
  return Object
    .keys(langs)
    .map((key) => ({key: key, level: langs[key].reduce((acc, a) => acc + a.stargazers_count, 0)}))
    .sort((a, b) => b.level - a.level)
    .reduce((acc, {key, level}) => {
      console.log(level);
      if(level) return acc + "</br>" + level + " Lvl - " + getClass(key);
      else return acc;
    }, "");
};

function getClass(language) {
  let c = {
    null: "Ambassador",
    Elixir: "Alchemist",
    Elm: "Druid",
    JavaScript: "Ninja",
    CoffeeScript: "Brewer",
    Bash: "Blacksmith",
    C: "Tinkerer",
    Java: "Garbage",
    Scala: "Wizzard",
    Erlang: "Necromancer",
    CSS: "Bard",
    HTML: "Architect",
    Rust: "Scrap Constructor",
    "C#": "Librarian",
    Ruby: "Jeweler"
  }[language];
  if(c) return c + " ("+ language + ")";
  else return language;
}

function memoize(t, f){
  return function() {
    let name = arguments.callee.name + JSON.stringify(arguments);
    chrome.storage.sync.get(name), (res) => {
      let now = Date.now();
      let v = JSON.parse(res);
      if(!v || now - v.time > t) {
        console.log("memoizing");
        v = {time: now, value: f.apply(arguments)};
        chrome.storage.sync.set({[name]: JSON.stringify(v)}, () => ({}));
      }
      console.log("memoized");
      return v.value;
    };
  };
}

let run = function() {
  var url = window.location.href;
  let user = window.location.href.split("/")[3];
  let pageUser = document.querySelector(".p-nickname.vcard-username.d-block");
  let commentUser = document.querySelector(".avatar-parent-child.timeline-comment-avatar");
  if(pageUser){
    getUser(user, (repos) => {
      level = getLevels(repos);
      console.log(level);
      pageUser.innerHTML += "</br>" + level;
    });
  }
  if(commentUser){
    commentUser.innerHTML += "<div class='ribbon'></div>";
  }
};

document.addEventListener("pjax:end", run);
run();
