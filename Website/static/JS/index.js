console.log("Stop spying on the cosnole bro ")

elements = document.getElementsByClassName('mainimage');

for (element of elements) {
    element.addEventListener("mouseover",function(){
        this.style.boxShadow = "10px 10px 15px #00000065"
    });
    element.addEventListener("mouseout",function(){
        this.style.boxShadow = "5px 5px 15px #00000050"
    });
}

try {
    if (!getCookieValue("notVersion") ) {}
else if (document.getElementById("version").innerHTML == getCookieValue("notVersion")) {document.getElementById("versionButton").setAttribute("hidden", "hidden")}
else {
    document.getElementById("versionButton").setAttribute("hidden", "hidden")
    document.cookie = `notVersion=${document.getElementById("version").innerHTML}; expires=Thu, 18 Dec 2025 12:00:00 UTC; path=/`
    var notification = new Notification(`New version (${document.getElementById("version").innerHTML})`, {
        icon: 'https://cdn.discordapp.com/attachments/769464671731449876/770241900266782730/compass-0.png',
        body: `Version ${document.getElementById("version").innerHTML} was released! Click the notification for more info`,
    });
    notification.onclick = function() {
        window.open('/changelogs');
    };
}

if (Notification.permission !== 'granted') {
    document.getElementById("versionButton").removeAttribute("hidden")
    document.cookie = `notVersion=${document.getElementById("version").innerHTML}; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}
} catch{}


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
    document.getElementById('myImage2').style.opacity = '20%'
    Array.from(document.getElementsByClassName("text")).forEach(element => element.style.backgroundColor = '#D4D7DC')
    Array.from(document.getElementsByClassName("navbar")).forEach(element => {element.style.backgroundColor = '#D4D7DC';element.style.color = 'black'})
    Array.from(document.getElementsByClassName("grid-container")).forEach(element => {element.style.backgroundColor = '#c4c7cc';element.style.color = 'black'})
    Array.from(document.getElementsByTagName('div')).forEach(element => element.style.color = 'black')
    Array.from(document.getElementsByTagName('p')).forEach(element => element.style.color = 'black')
    Array.from(document.getElementsByTagName('a')).forEach(element => element.style.color = 'black')
    Array.from(document.getElementsByTagName('button')).forEach(element => element.style.color = 'black')

    setTimeout(function() {try{Array.from(document.getElementsByTagName("*")).forEach(element => element.classList.remove('notransition'))}catch{}}, 10)
}




function notifyMe() {
    if (!Notification) {
        alert('Desktop notifications not available in your browser.');
        return;
    }
    if (Notification.permission !== 'granted') {
        Notification.requestPermission()
            .then(permission => {
                if (permission === 'granted') {
                    document.cookie = `notVersion=${document.getElementById("version").innerHTML}; expires=Thu, 18 Dec 2025 12:00:00 UTC; path=/`
                    document.getElementById("versionButton").setAttribute("hidden", "hidden")
                    var notification = new Notification('Compass releases', {
                        icon: 'https://cdn.discordapp.com/attachments/769464671731449876/770241900266782730/compass-0.png',
                        body: 'You will now be notified for new versions!',
                    });
                }
                
            }) 
    }    
};


var oAuth = "https://discord.com/oauth2/authorize?client_id=732208102652379187&permissions=2147483647&scope=bot%20applications.commands"
function clickfunction() {
    window.open(oAuth);
}
document.getElementById('myImage').setAttribute('draggable', false);

function movedown() {
    window.open('/stats',"_self");
}