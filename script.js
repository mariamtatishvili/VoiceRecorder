
URL = window.URL || window.webkitURL;

var gumStream;                     
var rec;                            
var input;       

//var leftchannel = [];
//var rightchannel = [];
//var recorder = null;
//var recordingLength = 0;
//var volume = null;
//var mediaStream = null;
//var sampleRate = 44100;
//var context = null;
//var blob = null;

var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext;

var recordButton = document.getElementById("recordButton");
var stopButton = document.getElementById("stopButton");
var pauseButton = document.getElementById("pauseButton");


recordButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", stopRecording);
pauseButton.addEventListener("click", pauseRecording);

function startRecording() {
    console.log("RECORDING");
    
    var constraints = { 
        audio: true, 
        video:false 
    }

   
    recordButton.disabled = true;
    stopButton.disabled = false;
    pauseButton.disabled = false


    navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
        console.log("getUserMedia() done");

        audioContext = new AudioContext();
      
        gumStream = stream;
        
        input = audioContext.createMediaStreamSource(stream);

        rec = new Recorder(input,{numChannels:1})
        
        rec.record()

        console.log("RECORDING");


    }).catch(function(err) {
    
        recordButton.disabled = false;
        stopButton.disabled = true;
        pauseButton.disabled = true
    });
}


function pauseRecording(){
    console.log(rec.recording );
    if (rec.recording){
       
        rec.stop();
        pauseButton.innerHTML="RESUME";
    }
    else {
       
        rec.record()
        pauseButton.innerHTML="PAUSE";

    }
}


function stopRecording() {
    console.log("STOP");

   
    stopButton.disabled = true;
    recordButton.disabled = false;
    pauseButton.disabled = true;

    
    pauseButton.innerHTML="PAUSE";
    
   
    rec.stop();

   
    gumStream.getAudioTracks()[0].stop();

   
    rec.exportWAV(createDownloadLink);
}


function createDownloadLink(blob) {
    
    var url = URL.createObjectURL(blob);
    var au = document.createElement('audio');
    var li = document.createElement('li');
    var link = document.createElement('a');

    
    var filename = new Date().toISOString();

  
    au.controls = true;
    au.src = url;
    
    link.href = url;
    link.download = filename+".wav"; 
    link.innerHTML = "Save to disk";

    
    li.appendChild(au);
    
   
    li.appendChild(document.createTextNode(filename+".wav "))

   
    li.appendChild(link);
    
 
    var upload = document.createElement('a');
    upload.href="#";
    upload.innerHTML = "UPLOAD";
    upload.addEventListener("click", function(event){
          var xhr=new XMLHttpRequest();
          xhr.onload=function(e) {
              if(this.readyState === 4) {
                  console.log(e.target.responseText);
              }
          };
          var fd=new FormData();
          fd.append("files",blob, filename);
          xhr.open("POST","audios.php",true);
          xhr.send(fd);
    })


    li.appendChild(document.createTextNode (" "))
    li.appendChild(upload)

    
    recordingsList.appendChild(li);
}