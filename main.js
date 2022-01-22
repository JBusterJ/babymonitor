var img = "";
var status = "";
var objects = [];
var audio = new Audio('iPhone Alarm Radar Sound Effect.mp3');
audio.pause();
// function preload() {
//     img = loadImage("extremelycrowded.jpg");
// }

function setup() {
    canvas = createCanvas(380, 380);
    canvas.center();
    video = createCapture(VIDEO);
    video.size(380, 380);
    video.hide();
    objectDetector = ml5.objectDetector('cocossd', modelLoaded);
    document.getElementById("status").innerHTML = "Status: Detecting Objects";
}

function modelLoaded() {
    console.log("Model Loaded");
    status = true;
    objectDetector.detect(video, gotResults);
}

function gotResults(e, results) {
    if (e) {
        console.error(e);
    } else {
        console.log(results);
        objects = results;
    }
}

function draw() {
    image(video, 0, 0, 380, 380);

    // fill("#FF0000");
    // text("Dog", 45, 75);
    // noFill();
    // stroke("#FF0000");
    // rect(30, 60, 450, 350);
    // fill("#FF0000");
    // text("Cat", 320, 120);
    // noFill();
    // stroke("#FF0000");
    // rect(300, 90, 270, 320);
    var personFound = false;
    var allPeople = 0;
    for (let i = 0; i < objects.length; i++) {
        if (objects[i].label == "person") {
            personFound = true;
            audio.pause();
            audio.currentTime = 0;
        }

        if (allPeople == objects.length && personFound == false) {
            personFound = false;
        }

        if (allPeople >= objects.length) {
            allPeople = 0;
        } else {
            allPeople++;
        }

    }
    if (!personFound && status != "") {
        console.log("Panic persons gone");
        audio.play();
    }
    if (status != "") {
        r = random(255);
        g = random(255);
        b = random(255);
        objectDetector.detect(video, gotResults);
        for (i = 0; i < objects.length; i++) {
            document.getElementById("status").innerHTML = "Status: Objects detected";
            document.getElementById("number_of_objects").innerHTML = "Number of objects are: " + objects.length;
            fill(r, g, b);
            percent = floor(objects[i].confidence * 100);
            text(objects[i].label + " " + percent + "%", (objects[i].x / 2) + 15, (objects[i].y / 2) + 15);
            noFill();
            stroke(r, g, b);
            rect(objects[i].x / 2, objects[i].y / 2, objects[i].width, objects[i].height);
        }
    }
}
