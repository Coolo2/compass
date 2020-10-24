console.log("Stop spying on the cosnole bro ")

try {
    if (!getCookieValue("notVersion") ) {}
else if (document.getElementById("version").innerHTML == getCookieValue("notVersion")) {document.getElementById("versionButton").setAttribute("hidden", "hidden")}
else {
    document.getElementById("versionButton").setAttribute("hidden", "hidden")
    document.cookie = `notVersion=${document.getElementById("version").innerHTML}; expires=Thu, 18 Dec 2025 12:00:00 UTC; path=/`
    var notification = new Notification(`New version (${document.getElementById("version").innerHTML})`, {
        icon: 'https://cdn.discordapp.com/attachments/769464671731449876/769464697359302676/compass.png',
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
                        icon: 'https://cdn.discordapp.com/attachments/769464671731449876/769464697359302676/compass.png',
                        body: 'You will now be notified for new versions!',
                    });
                }
                
            }) 
    }    
};



function sizeimage() {
    document.getElementById('image2').classList.remove("modal");
    document.getElementById('image2').classList.add("imgs2");
    if (document.getElementById('image1').classList.value.includes("modal")) {
        document.getElementById('topper').style.display = "block";
        document.getElementById('image1').classList.remove("modal");
        document.getElementById('image1').classList.add("imgs");
        document.getElementById('thebody').classList.remove("noscroll")
    } else {
        if (document.getElementById('image1').classList.value.includes("imgs")) {
            document.getElementById('topper').style.display = "none";
            document.getElementById('image1').classList.add("modal");
            document.getElementById('image1').classList.remove("imgs");
            document.getElementById('thebody').classList.add("noscroll")    
        }
    }
    
    
}
function sizeimage2() {
    document.getElementById('image1').classList.remove("modal");
    document.getElementById('image1').classList.add("imgs");
    if (document.getElementById('image2').classList[1] == "modal") {
        document.getElementById('topper').style.display = "block";
        document.getElementById('image2').classList.remove("modal");
        document.getElementById('image2').classList.add("imgs2");
        document.getElementById('thebody').classList.remove("noscroll")
    } else {
        document.getElementById('topper').style.display = "none";
        document.getElementById('image2').classList.add("modal");
        document.getElementById('image2').classList.remove("imgs2");
        document.getElementById('thebody').classList.add("noscroll")    
    }
}
//On open start the type effect
window.onload = function () {
    document.getElementById('info').classList.add("textanimate");
    setTimeout(function() {
        document.getElementById('circles').classList.add("movecontainer");
    }, 1500)
    setTimeout(function() {
        document.getElementById('image1').classList.toggle("imgmove");
    }, 2000)
    setTimeout(function () {
        document.getElementById('info').classList.add("textmove");
    }, 5000);
};
//If window is small change how the *invite me* animation runs
if (window.innerWidth < 960) {
    //document.getElementById("centered").classList.add("hover");
    document.getElementById("centerbutton").classList.add("appearmobile");
    setTimeout(function () {
        document.getElementById("invitetext").textContent = " >";
        document.getElementById("centerbutton").classList.add("bigger");
    }, 500);
    
} else {
    document.getElementsByClassName("grid-container")[0].addEventListener("mouseover", function (e) {
        if (getCookieValue("theme") == "light") {
            document.getElementById("stats").classList.add("grid-hover-light");
        } else {
            document.getElementById("stats").classList.add("grid-hover");
        }
    });
    document.getElementsByClassName("grid-container")[0].addEventListener("mouseout", function (e) {
        if (getCookieValue("theme") == "light") {
            document.getElementById("stats").classList.remove("grid-hover-light");
        } else {
            document.getElementById("stats").classList.remove("grid-hover");
        }
    });

    document.getElementsByClassName("centered")[0].addEventListener("mouseover", function (e) {
        
        e.target.classList.add("hover");
        document.getElementById("centerbutton").classList.add("appear");
        setTimeout(function () {
            document.getElementById("invitetext").textContent = " >";
            document.getElementById("centerbutton").classList.add("bigger");
        }, 500);
    });


    document.getElementsByClassName("centered")[0].addEventListener("mouseout", function (e) {
        e.target.classList.remove("hover");
        document.getElementById("centerbutton").classList.remove("appear");
        document.getElementById("centerbutton").classList.remove("bigger");
        setTimeout(function () {
            document.getElementById("invitetext").textContent = "";
        }, 500);
    });
    
    
    
}
var oAuth = "https://discord.com/api/oauth2/authorize?client_id=732208102652379187&permissions=8&scope=bot"
function clickfunction() {
    window.open(oAuth);
}
document.getElementById('myImage').setAttribute('draggable', false);

function movedown() {
    window.open('/stats',"_self");
}