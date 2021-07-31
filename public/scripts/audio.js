// set up basic variables for app
const record = document.querySelector('.record');
const stop = document.querySelector('.stop');
const soundClips = document.querySelector('.sound-clips');
const canvas = document.querySelector('.visualizer');
const mainSection = document.querySelector('.main-controls');

var blob = new Blob();

// audio flag
var liveaudio = false;
var localaudio = false;

// fetch id from url
var url = window.location.href;
var urlarr = url.split('/');
var id = urlarr[urlarr.length - 1];


// toggle localaudio flag
document.getElementById('file_upload').onchange = function() {
  localaudio = !localaudio;
};

// disable stop button while not recording
stop.disabled = true;

// visualiser setup - create web audio api context and canvas
let audioCtx;
const canvasCtx = canvas.getContext("2d");

//main block for doing the audio recording
if (navigator.mediaDevices.getUserMedia) {

    const constraints = { audio: true };
    let chunks = [];

    let onSuccess = function(stream) {
        const mediaRecorder = new MediaRecorder(stream);
        visualize(stream);

        record.onclick = function(){    
            mediaRecorder.start();
            console.log(mediaRecorder.state);
            console.log("recorder started");
            record.style.background = "red";

            stop.disabled = false;
            record.disabled = true;
        }


        stop.onclick = function(){
            mediaRecorder.stop();
            console.log(mediaRecorder.state);
            console.log("recorder stopped");
            record.style.background = "";
            record.style.color = "";

            stop.disabled = true;
            record.disabled = false;

        }

        mediaRecorder.onstop = function(e) {
            console.log("data available after MediaRecorder.stop() called.");
            liveaudio = true;

            const clipName = prompt('Enter a name for your sound clip?','My-Audio');

            const clipContainer = document.createElement('article');
            const clipLabel = document.createElement('p');
            const audio = document.createElement('audio');
            const deleteButton = document.createElement('button');

            clipContainer.classList.add('clip');
            audio.setAttribute('controls', '');
            deleteButton.textContent = 'Delete';
            deleteButton.className = 'delete';
      
            if(clipName === null) {
                clipLabel.textContent = 'My-Audio';
            } else {
                clipLabel.textContent = clipName;
            }

            clipContainer.appendChild(audio);
            clipContainer.appendChild(clipLabel);
            clipContainer.appendChild(deleteButton);

            while (soundClips.firstChild) {
                soundClips.removeChild(soundClips.firstChild);
            }

            soundClips.appendChild(clipContainer);

            audio.controls = true;
            blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
            chunks = [];
            const audioURL = window.URL.createObjectURL(blob);
            audio.src = audioURL;
            console.log("recorder stopped");


            deleteButton.onclick = function(e) {
                let evtTgt = e.target;
                evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
                liveaudio = false;
            }

            clipLabel.onclick = function() {
                const existingName = clipLabel.textContent;
                const newClipName = prompt('Enter a new name for your sound clip?', existingName);
                if(newClipName === null) {
                  clipLabel.textContent = existingName;
                } else {
                  clipLabel.textContent = newClipName;
                }
            }
        }

        mediaRecorder.ondataavailable = function(e) {
            chunks.push(e.data);
        }
    }

    let onError = function(err) {
        alert("Please Upload Audio, Live recording couldn't work due to "+ err);
    }   

    navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);

} else {
   alert('Live Recording is not supported on your browser! Please try latest browser Chrome/Mozilla');
}

function visualize(stream) {
    if(!audioCtx) {
      audioCtx = new AudioContext();
    }
  
    const source = audioCtx.createMediaStreamSource(stream);
  
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
  
    source.connect(analyser);
    //analyser.connect(audioCtx.destination);
  
    draw()
  
    function draw() {
      const WIDTH = canvas.width
      const HEIGHT = canvas.height;
  
      requestAnimationFrame(draw);
  
      analyser.getByteTimeDomainData(dataArray);
  
      canvasCtx.fillStyle = 'rgb(200, 200, 200)';
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
  
      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
  
      canvasCtx.beginPath();
  
      let sliceWidth = WIDTH * 1.0 / bufferLength;
      let x = 0;
  
  
      for(let i = 0; i < bufferLength; i++) {
  
        let v = dataArray[i] / 128.0;
        let y = v * HEIGHT/2;
  
        if(i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }
  
        x += sliceWidth;
      }
  
      canvasCtx.lineTo(canvas.width, canvas.height/2);
      canvasCtx.stroke();
  
    }
}


function setID(){
  document.getElementById("userid").value = id;
}

async function upload(formData){
    let response = await fetch('/upload', {
      method: 'POST',
      body: formData
      });
      let result = await response.json();
      // alert(result.message);
      if(response.status == 200){
        window.close();
      }
}


function validate(){
  var size=5242880;
  if(document.getElementById('file_upload').files[0] === undefined) return false;
  var file_size=document.getElementById('file_upload').files[0].size;
  if(file_size>size){
        return false;
  }
  return true;
}

function uploadAudio(){
  if(liveaudio){
    if(blob.size < 5242880){
      var formData = new FormData();
      formData.append('file_upload',blob,document.getElementsByTagName('p')[0].textContent+'.wav');
      formData.append('userid',id);
      upload(formData);
    }else{
      alert('Please Record Audio less than 5mb');
    }

    
  }else if(localaudio){
    if (validate()){
      setID();
      var formData = new FormData(document.getElementById('formElem'));
      upload(formData);
    }
    else{
      alert('Please Upload Audio less than 5mb');
    }
  }else{
    alert('Please Upload or Record Audio');
  }
}


window.onresize = function() {
  canvas.width = mainSection.offsetWidth;
}

window.onresize();