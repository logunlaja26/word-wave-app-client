const record = document.getElementById("record");
const transcribeBtn = document.getElementById("transcribe-btn");
const spinner = document.getElementById("spinner");
const audio = document.getElementById("audio");

let can_record = false;
let isRecording = false;
let recorder = false;

let chunks = [];

function setupAudio() {
  console.log("setupAudio...");
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(SetupStream)
      .catch((err) => {
        console.log(err);
      });
  }
}

function SetupStream(stream) {
  recorder = new MediaRecorder(stream);
  recorder.ondataavailable = (e) => {
    chunks.push(e.data);
  };

  recorder.onstop = () => {
    //const audioBlob = new Blob(chunks, { type: "audio/mp3" }); - not working when downloaded to local
    const audioBlob = new File(
      chunks,
      `my-file.${recorder.mimeType.match(/\/([\w\d]+);?/)[1]}`,
      { type: recorder.mimeType }
    );
    const audioUrl = URL.createObjectURL(audioBlob);
    audio.src = audioUrl;
    //audio.play();
  };
  can_record = true;
}

setupAudio();

function startRecording() {
  isRecording = true;
  recorder.start();
  console.log("recording has started....");
  record.classList.replace("fa-microphone", "fa-stop-circle");
  transcribeBtn.classList.add("button-disabled");
  transcribeBtn.disabled = true; // Disable the button for interactions
  spinner.style.display = "block";
}

function stopRecording() {
  isRecording = false;
  recorder.stop();
  console.log("recording has stopped.....");
  record.classList.replace("fa-stop-circle", "fa-microphone");
  transcribeBtn.classList.remove("button-disabled");
  transcribeBtn.disabled = false; // Enable the button for interactions
  spinner.style.display = "none";
}

function toggleRecording() {
  if (!can_record) return;
  isRecording = !isRecording;
  if (isRecording) {
    startRecording();
  } else {
    stopRecording();
  }
}

record.addEventListener("click", toggleRecording);
//audio.addEventListener("click", toggleRecording);
audio.addEventListener("ended", () => {
  console.log("audio has ended");
});
