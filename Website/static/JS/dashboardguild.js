
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
}

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

if (!getCookieValue("adminMode")) {
    document.cookie = `adminMode=on; expires=Thu, 18 Dec 2025 12:00:00 UTC; path=/`
    location.reload()
}

function lighttheme() {
    try{Array.from(document.getElementsByTagName("*")).forEach(element => element.classList.add('notransition'))}catch{}

    document.body.style.backgroundColor = 'white'
    document.getElementById('myImage').style.opacity = '20%'
    try{Array.from(document.getElementsByClassName("members")).forEach(element => element.style.backgroundColor = '#a9acb0')}catch{}
    try{Array.from(document.getElementsByClassName("text")).forEach(element => element.style.backgroundColor = '#c4c7cc')}catch{}
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

function logout() {
    document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    document.cookie = "name=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    document.cookie = "id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    document.cookie = "avatar=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    window.open('/', "_self");
}

function change() {
    document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    document.cookie = "name=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    document.cookie = "id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    document.cookie = "avatar=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    window.open('/loginswitch', "_self");
}
var windw = this;

$.fn.followTo = function (pos) {
    var $this = this,
        $window = $(window);

    $window.scroll(function (e) {
        if ($window.scrollTop() > pos) {
            $this.css({
                position: 'absolute',
                top: pos
            });
        } else {
            $this.css({
                position: 'fixed',
                top: 0
            });
        }
    });
};

$('#topcorner').followTo(215);