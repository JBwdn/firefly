function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(30);
    if (/Mobi/.test(navigator.userAgent)) {
        fireflys = new Swarm(75);
    } else {
        fireflys = new Swarm(300)
    }

}

function mousePressed() {
    let fs = fullscreen();
    console.log(fs)
    fullscreen(!fs);
    resizeCanvas(displayWidth, displayHeight);
}

function draw() {
    background(25)
    fireflys.swarm()
}