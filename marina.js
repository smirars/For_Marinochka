const video = document.getElementById("video");

function changeVideo() {
    video.src = '2.mp4';
    goToBottom();
  };

const button = document.querySelector('.first');

function showButtonAndStopVideo() {
    document.getElementById("video").src = '3.mp4';
    const button1 = document.querySelector('.second'); 
    const video = document.getElementById('video');
    button1.addEventListener('click', () => {
      setTimeout(() => {
        video.pause();
        button.style.visibility = 'visible'; 
      }, 3000);
    });
  }

const stopBtn =  document.querySelector('.pauseBtn');
const playBtn = document.querySelector('.playBtn');

playBtn.addEventListener('click', function () {
  video.play();
});

stopBtn.addEventListener('click',function(){
  video.pause();
});

