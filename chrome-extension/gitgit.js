// We want to match both lowercase strings and their capitalized versions in pages

// the text to use as content--the inner html of the page
// document.body.innerHTML = replaceBoringPhrases(document.body.innerHTML);

console.log("HA");
let run = function() {
  // run code/call function
  const users = {
    wende: "Elixir Alchemist Lvl 10 </br> Elm Druid Lvl 4",
    Baransu: "JS Ninja Lvl 10 </br> Elm Druid Lvl 4"
  };

  // chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
  var url = window.location.href;
  for(user in users){
    if(url.indexOf(user) !== -1){
      let pageUser = document.querySelector(".p-nickname.vcard-username.d-block");
      let commentUser = document.querySelector(".avatar-parent-child.timeline-comment-avatar");
      if(pageUser){
        pageUser.innerHTML += "</br>" + users[user];
      }
      if(commentUser){
        commentUser.innerHTML += "<div class='ribbon'></div>";
      }
    }
  }
};

document.addEventListener("pjax:end", run);
run();
