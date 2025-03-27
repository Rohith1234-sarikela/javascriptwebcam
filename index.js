let video = document.querySelector('.video');
let recordBtn = document.querySelector('.record-btn');
let timer = document.querySelector('.timer-head');
let captureBtn = document.querySelector('.capture-btn');
let filterLayer = document.querySelector('.filter-layer');
let filters = document.querySelectorAll(".filter");

let recordFlag = false;
let recorder;
let chunks = [];
let timerID;
let counter = 0;

const constraints = {
    video: true,
    audio: true
};

navigator.mediaDevices.getUserMedia(constraints)
    .then((stream) => {
        video.srcObject = stream;
        recorder = new MediaRecorder(stream);

        recorder.addEventListener("start", () => {
            chunks = [];
        });

        recorder.addEventListener("dataavailable", (e) => {
            chunks.push(e.data);
        });

        recorder.addEventListener("stop", () => {
            let blob = new Blob(chunks, { type: "video/mp4" });
            let url = URL.createObjectURL(blob);
            let a = document.createElement("a");
            a.href = url;
            a.download = "recording.mp4";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });

        recordBtn.addEventListener("click", () => {
            recordFlag = !recordFlag;
            if (recordFlag) {
                recorder.start();
                startTimer();
                recordBtn.style.transform = "scale(1.2)";
            } else {
                recorder.stop();
                stopTimer();
                recordBtn.style.transform = "scale(1)";
            }
        });

        captureBtn.addEventListener("click", () => {
            let canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            let ctx = canvas.getContext("2d");

            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            if (filterLayer.style.backgroundColor !== "transparent") {
                ctx.fillStyle = filterLayer.style.backgroundColor;
                ctx.globalAlpha = 0.5;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            let a = document.createElement("a");
            a.href = canvas.toDataURL("image/png");
            a.download = "screenshot.png";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });

        filters.forEach(filter => {
            filter.addEventListener("click", () => {
                let color = getComputedStyle(filter).backgroundColor;
                filterLayer.style.backgroundColor = color;
            });
        });

    })
    .catch((err) => {
        console.error("Error accessing media devices:", err);
    });

function startTimer() {
    counter = 0;
    timerID = setInterval(() => {
        let hours = Math.floor(counter / 3600);
        let minutes = Math.floor((counter % 3600) / 60);
        let seconds = counter % 60;

        timer.innerText = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        counter++;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerID);
    timer.innerText = "00:00:00";
}
