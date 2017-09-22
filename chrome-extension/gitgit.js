// We want to match both lowercase strings and their capitalized versions in pages

// the text to use as content--the inner html of the page
// document.body.innerHTML = replaceBoringPhrases(document.body.innerHTML);

console.log("HA");
console.log(chrome);
let run = function() {
  // run code/call function
  // const users = {
  //   wende: "Elixir Alchemist Lvl 10 </br> Elm Druid Lvl 4",
  //   Baransu: "JS Ninja Lvl 10 </br> Elm Druid Lvl 4"
  // };

  // chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
  var url = window.location.href;
  //for(user in users){
  //if(url.indexOf(user) !== -1){
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
    //}
  //}
};

document.addEventListener("pjax:end", run);
run();

function getUser(user, f){
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
}

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
