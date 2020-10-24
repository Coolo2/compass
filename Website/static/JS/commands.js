function getCookieValue(a) {
  var b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
  return b ? b.pop() : '';
}

if (!getCookieValue("theme")) {
  document.cookie = `theme=dark; expires=Thu, 18 Dec 2025 12:00:00 UTC; path=/`
}

if (getCookieValue("theme") == "light") {
  lighttheme()
}

function lighttheme() {
  try{Array.from(document.getElementsByTagName("*")).forEach(element => element.classList.add('notransition'))}catch{}

  document.body.style.backgroundColor = 'white'
  document.getElementById('myImage').style.opacity = '20%'
  try{Array.from(document.getElementsByClassName("members")).forEach(element => element.style.backgroundColor = '#a9acb0')}catch{}
  try{Array.from(document.getElementsByClassName("text")).forEach(element => element.style.backgroundColor = '#c4c7cc')}catch{}
  try{Array.from(document.getElementsByClassName("readability")).forEach(element => element.style.backgroundColor = '#D4D7DC')}catch{}
  try{Array.from(document.getElementsByClassName("beginning")).forEach(element => element.style.backgroundColor = '#c4c7cc')}catch{}
  try{Array.from(document.getElementsByClassName("replyoption")).forEach(element => {element.style.backgroundColor = '#a9acb0'})}catch{}
  try{Array.from(document.getElementsByClassName("section")).forEach(element => {element.style.backgroundColor = '#c4c7cc';element.style.border = '2px black solid'})}catch{}
  try{Array.from(document.getElementsByClassName("sectionactive")).forEach(element => {element.style.backgroundColor = '#a9acb0';element.style.border = '2px black solid'})}catch{}
  try{Array.from(document.getElementsByClassName("topcornerdiv")).forEach(element => {element.style.backgroundColor = '#a9acb0';element.style.border = '2px black solid'})}catch{}
  try{Array.from(document.getElementsByClassName("dataSection")).forEach(element => element.style.backgroundColor = '#D4D7DC')}catch{}
  try{Array.from(document.getElementsByClassName("titleBar")).forEach(element => element.style.backgroundColor = '#D4D7DC')}catch{}
  try{Array.from(document.getElementsByClassName("footer-logos")).forEach(element => element.style.backgroundColor = '#D4D7DC')}catch{}
  try{Array.from(document.getElementsByClassName("navbar")).forEach(element => {element.style.backgroundColor = '#D4D7DC';element.style.color = 'black'})}catch{}
  try{Array.from(document.getElementsByTagName('div')).forEach(element => element.style.color = 'black')}catch{}
  try{Array.from(document.getElementsByTagName('p')).forEach(element => element.style.color = 'black')}catch{}
  try{Array.from(document.getElementsByTagName('a')).forEach(element => element.style.color = 'black')}catch{}
  try{Array.from(document.getElementsByTagName('h3')).forEach(element => element.style.color = 'black')}catch{}
  try{Array.from(document.getElementsByTagName('button')).forEach(element => element.style.color = 'black')}catch{}

  setTimeout(function() {try{Array.from(document.getElementsByTagName("*")).forEach(element => element.classList.remove('notransition'))}catch{}}, 10)
}

var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.maxHeight){
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    } 
  });
}
