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
  return Object.keys(langs).reduce( (acc, key) => {
    console.log(langs);
    console.log(key);
    level = langs[key].reduce( (acc, {stargazers_count}) => acc + stargazers_count, 0);
    if(level) return acc + "</br>" + key + " Level " + level;
    else return acc;
  }, "");
};
