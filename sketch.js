// audiovisual experience based on Autechre's elseq 1–5, AE_LIVE and NTS Sessions 1–4 visual language, originally designed by tDR (https://www.thedesignersrepublic.com/ae-vs-tdr).
/* tracks:
   1) Autechre Live at Flex on 1996-02-15 (https://archive.org/details/Autechre1996-02-15)
   2) Autechre - 1999-07-05 Peel Session - 2 Blifil (https://archive.org/details/Autechre1999-07-06)
   3) Autechre - 2000-XX-XX Germany-Berlin - 16 (https://archive.org/details/Autechre2000-00-00.Autechre2000-00-00)
   4) Autechre Live at BBC Radio 3 on 2003-03-30 (https://archive.org/details/Autechre2003-03-30)
*/

// theme selector (255 = light, 0 = dark)
var currentTheme = 255;
var flashingImages = 1;

// subdivision values for the grid system
const subd1 = 12;
const subd2 = 24;
// const subd3 = 36; (unused)

// audio
var soundFile, amplitude, fft;

// noise
const octaves = 8;
const falloff = 0.5;

// assets
var imageFile = new Array();
var imageList;
var imageShow;
var trackList = new Array();

// audio control
var trackState = "pause";
var trackCurrentlyPlaying = 0;
var trackNo = 0;

// var alphaEff = 1; (unused)

function preload() {
  imageList = loadJSON("images.json");
  trackList = loadJSON("tracks.json");
}

function setup() {
  // canvas initialisation
  createCanvas(windowWidth, windowHeight).parent("container");
  angleMode(DEGREES);
  rectMode(CENTER);
  fill(10);
  noStroke();

  // load images inside an array
  for (let i = 0; i < imageList.images.length; i++) {
    imageFile[i] = loadImage("./assets/images/" + imageList.images[i]);
  }

  console.log("track no. " + trackNo + " (" + trackList.tracks[trackNo] + ")");

  // select a random image insie the array to show before starting
  randomImage();

  // audio setup
  fft = new p5.FFT();
  peakDetect = new p5.PeakDetect(5200, 14000, 0.5);
  soundFile = document.getElementById("soundFile");
  let context = getAudioContext();
  // wire all media elements up to the p5.sound AudioContext
  for (let elem of selectAll("audio").concat(selectAll("video"))) {
    let mediaSource = context.createMediaElementSource(elem.elt);
    mediaSource.connect(p5.soundOut);
  }

  // noise setup
  noiseDetail(octaves, falloff);
}

function draw() {
  background(currentTheme);

  // audio analysis
  fft.analyze();
  peakDetect.update(fft);

  // frequencies to analyse
  var bass = fft.getEnergy(20, 400);
  var mid = fft.getEnergy(400, 2600);
  // var high = fft.getEnergy(2600, 5200);
  // var treble = fft.getEnergy(5200, 14000);

  var i1 = 0;
  var i2 = 0;
  // var i3 = 0; (unused)

  // image manipulation
  if (flashingImages == 1) {
    push();
    if (mid > 127 && mid < 255) {
      // raster effect: disabled most of it because it can cause extreme lag if a device isn't pretty powerful.
      if (currentTheme === 255) {
        //filter(INVERT);
        blendMode(DIFFERENCE);
      } else if (currentTheme === 0) {
        //blendMode(DIFFERENCE);
      }
      image(imageFile[imageShow], 0, 0, windowWidth, windowHeight);
    }
    if (peakDetect.isDetected) {
      randomImage();
    }
    pop();
  }
  // subdivision #1
  var varDim1 = map(
    bass,
    0,
    255,
    (width / subd1) * 0.005,
    (width / subd1) * 1.25
  );
  if (width < height) {
    for (var x1 = 0 + width / subd1 / 2; x1 < width; x1 += width / subd1) {
      i1 = 0;
      for (
        var y1 = 0 + width / subd1 / 2;
        y1 < windowHeight - (width / subd1) * 4; // vertical screens
        y1 += width / subd1
      ) {
        i1++;
        push();
        let noiseColor1 = noise(
          frameCount / 2500 + x1 / 250,
          frameCount / 2500 + y1 / 250
        );
        if (noiseColor1 * 10 > 2.625 && noiseColor1 * 10 < 5.625) {
          if (noiseColor1 * 10 > 5 && noiseColor1 * 10 < 5.625) {
            rect(x1, y1, varDim1, varDim1);
          } else {
            ellipse(x1, y1, varDim1);
          }
        } else {
        }
        pop();
      }
    }
  } else {
    for (var x1 = 0 + width / subd1 / 2; x1 < width; x1 += width / subd1) {
      i1 = 0;
      for (
        var y1 = 0 + width / subd1 / 2;
        y1 < windowHeight - (width / subd1) * 2; // horizontal screens
        y1 += width / subd1
      ) {
        i1++;
        push();
        let noiseColor1 = noise(
          frameCount / 2500 + x1 / 250,
          frameCount / 2500 + y1 / 250
        );
        if (noiseColor1 * 10 > 2.625 && noiseColor1 * 10 < 5.625) {
          if (noiseColor1 * 10 > 5 && noiseColor1 * 10 < 5.625) {
            rect(x1, y1, varDim1, varDim1);
          } else {
            ellipse(x1, y1, varDim1);
          }
        } else {
        }
        pop();
      }
    }
  }

  //subdivision #2
  var varDim2 = map(
    mid,
    0,
    255,
    (width / subd2) * 0.005,
    width / subd2 - windowWidth / 1000
  );
  for (var x2 = 0 + width / subd2 / 2; x2 < width; x2 += width / subd2) {
    i2 = 0;
    for (var y2 = 0 + width / subd2 / 2; i2 < i1 * 2; y2 += width / subd2) {
      i2++;
      push();
      let noiseColor2 = noise(
        frameCount / 2500 + x2 / 250,
        frameCount / 2500 + y2 / 250
      );
      if (noiseColor2 * 10 > 5 && noiseColor2 * 10 < 6.9375) {
        if (noiseColor2 * 10 > 6.3125 && noiseColor2 * 10 < 6.9375) {
          rect(x2, y2, varDim2);
        } else {
          ellipse(x2, y2, varDim2);
        }
      } else {
      }
      pop();
    }
  }

  // subdivision #3 (unused)
  /*
  var varDim3 = map(
    high,
    0,
    255,
    (width / subd3) * 0.05,
    width / subd3 - windowWidth / 1000
  );
  for (var x3 = 0 + width / subd3 / 2; x3 < width; x3 += width / subd3) {
    i3 = 0;
    for (var y3 = 0 + width / subd3 / 2; i3 < i1 * 3; y3 += width / subd3) {
      i3++;
      push();
      let noiseColor3 = noise(
        frameCount / 2500 + x3 / 250,
        frameCount / 2500 + y3 / 250
      );
      if (noiseColor3 * 10 > 7.5 && noiseColor3 * 10 < 10) {
        ellipse(x3, y3, varDim3);
      } else {
      }
      pop();
    }
  }
  */
}

// generate a random integer from range, inclusive
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomImage() {
  imageShow = getRandomInt(0, imageFile.length - 1);
  console.log("image no. " + getRandomInt(0, imageFile.length - 1));
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function toggleP5Theme() {
  if (currentTheme === 255) {
    currentTheme = 0;
    fill(255);
  } else if (currentTheme === 0) {
    currentTheme = 255;
    fill(10);
  }
}

function togglePlay() {
  if (soundFile.paused) {
    soundFile.play();
    loop();
    trackState = "play";
  } else {
    soundFile.pause();
    noLoop();
    trackState = "pause";
  }
}

function saveScreenshot() {
  saveCanvas("myCanvas", "png");
}

function toggleImages() {
  if (flashingImages === 1) {
    flashingImages = 0;
  } else if (flashingImages === 0) {
    flashingImages = 1;
  }
}

function toggleAudio() {
  var track = document.getElementById("track");
  trackNo++;
  if (trackNo == trackList.tracks.length) {
    trackNo = 0;
  }
  console.log("track no. " + trackNo + " (" + trackList.tracks[trackNo] + ")");
  track.src = "./assets/tracks/" + trackList.tracks[trackNo];
  document.getElementById("soundFile").load();
  if (trackState == "play") {
    soundFile.play();
    loop();
  } else {
    soundFile.pause();
    noLoop();
  }
}

function touchStarted() {
  if (getAudioContext().trackState !== "running") {
    getAudioContext().resume();
  }
}
