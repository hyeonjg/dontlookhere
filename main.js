import { FilesetResolver, FaceLandmarker } from 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/vision_bundle.js';

const video = document.getElementById('webcam');
const canvas = document.getElementById('output_canvas');
const faceDot = canvas.getContext('2d');
const nofaceAlert = document.getElementById('noface-alert');
let showing = false;
let eyeCount = 0;
const count = document.getElementById('count');

const girl = document.getElementById('pic1');
const vase = document.getElementById('pic2');
const btf = document.getElementById('pic3');
const forest = document.getElementById('pic4');

//1. 웹캠 함수
async function startWebcam() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
    } catch (err) {
        console.error('웹캠 권한을 요청하는 중 오류 발생:', err);
    }
}

//2. 얼굴 모델 인식 함수
async function FaceTrackinggg() {
  //기본세팅
    try {
        const vision = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
        );

        const faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
            baseOptions: {
                modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task"
            },
            runningMode: "LIVE"
        });

        // 얼굴 특징을 추적하는 함수 onResults()
        function onResults(RS) { 

            if (RS && RS.faceLandmarks) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                faceDot.clearRect(0, 0, canvas.width, canvas.height);

                if (RS.faceLandmarks.length > 0) {
                    nofaceAlert.style.display = "none";

                    for (const landmarks of RS.faceLandmarks) {
                        const leftEye = landmarks[473]; // 왼쪽 눈
                        const rightEye = landmarks[468]; // 오른쪽 눈

                        //인식 여부에 따른 행동
                        const xx = leftEye.x - rightEye.x;
                        //console.log(xx);
                        if(xx<0.06){
                            //nofaceAlert.style.display = "block";
                            if(!showing){
                                eyeCount += 1;
                                console.log("eyeCount= ", eyeCount);
                                count.innerHTML = eyeCount;
                                showing = true;
                                wall();
                            }
                        }
                        else{
                            //nofaceAlert.style.display = "none";
                            showing = false; 
                        }

                        /** 눈 표시하는 코드
                        faceDot.beginPath();
                        faceDot.arc(leftEye.x* canvas.width, leftEye.y* canvas.height, 5, 0, 2 * Math.PI); // 왼쪽 눈
                        faceDot.fillStyle = "red";
                        faceDot.fill();

                        faceDot.beginPath();
                        faceDot.arc(rightEye.x* canvas.width, rightEye.y* canvas.height, 5, 0, 2 * Math.PI); // 오른쪽 눈
                        faceDot.fillStyle = "blue";
                        faceDot.fill();
                        */
                    }} else {
                        //console.log('얼굴 없음!');
                        //nofaceAlert.style.display = "block";
                        if(!showing){
                                eyeCount += 1;
                                console.log("eyeCount= ", eyeCount);
                                count.innerHTML = eyeCount;
                                showing = true;
                                wall();
                            }
                }
            } else {
                console.error('Results object is missing faceLandmarks:', RS);
            }
        }

        // 비디오에서 프레임을 캡처하여 얼굴 인식을 실행하는 인스턴트 함수
        video.addEventListener('play', async () => {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

            while (!video.paused && !video.ended) {
                try {
                    const timestamp = performance.now();
                    const detectResult = await faceLandmarker.detectForVideo(video, timestamp);
                    onResults(detectResult);
                } catch (err) {
                    console.error('얼굴 인식 오류:', err);
                }
                await new Promise(resolve => requestAnimationFrame(resolve)); 
            }
        });

        console.log("FaceLandmarker 작동중");
    } catch (error) {
        console.error("FaceLandmarker 작동실패: ", error);
    }
}

function wall(){
    if(eyeCount > 5){
        document.body.style.background
        = "red";
                                }
    else if(eyeCount > 2){
        girl.src = "/source/frame/f-girl-2.png";
        vase.src = "/source/frame/f-vase-2.png";
        btf.src = "/source/frame/f-btf-2.png";
        forest.src = "/source/frame/f-forest-2.png";

        document.body.style.background
        = "black";
    }
}




startWebcam();
FaceTrackinggg();


