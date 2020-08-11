console.log("Stop spying on the cosnole bro ")
function sizeimage() {
    document.getElementById('image1').classList.toggle("modal");
    document.getElementById('image1').classList.toggle("imgs");
    document.getElementById('thebody').classList.toggle("noscroll")
    if (document.getElementById('topper').style.display === "none") {document.getElementById('topper').style.display = "block";} 
    else {document.getElementById('topper').style.display = "none";}
    
}
function sizeimage2() {
    document.getElementById('image2').classList.toggle("modal");
    document.getElementById('image2').classList.toggle("imgs2");
    document.getElementById('thebody').classList.toggle("noscroll")
    if (document.getElementById('topper').style.display === "none") {document.getElementById('topper').style.display = "block";} 
    else {document.getElementById('topper').style.display = "none";}
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
    //On pc, on hover animation
    document.getElementsByClassName("grid-container")[0].addEventListener("mouseover", function (e) {
        document.getElementById("stats").classList.add("grid-hover");
    });


    document.getElementsByClassName("grid-container")[0].addEventListener("mouseout", function (e) {
        document.getElementById("stats").classList.remove("grid-hover");
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
    window.open('#botlinks',"_self");
}