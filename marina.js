
const configName = "config.json";
const player = videojs('videoPlayer');
let config = null;


const overlayController = {

    overlay: document.getElementById('overlay'),
    overlayTitle: document.getElementById('overlayTitle'),
    buttonContainer: document.getElementById('buttonContainer'),

    setTitle: function(title) {
        this.overlayTitle.textContent = title;
    },

    addButton: function(step_id, text, src) {
        const button = document.createElement('button');
        const img = document.createElement('img');
        img.src = src;
        img.alt = text;
        button.appendChild(img);
        button.onclick = () => {
            console.log("button clicked")
            nextStep(step_id)
        };
        this.buttonContainer.appendChild(button);
    },

    clean: function() {
        this.overlayTitle.textContent = '';
        this.buttonContainer.innerHTML = '';
    }

}


init();


function init() {
  
    fetch(configName)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        config = data;
        
        videoPlayer.appendChild(overlayController.overlay);
        

        player.on('timeupdate', () => {
            if (player.duration() - player.currentTime() < 0.5) {
                overlayController.overlay.style.opacity = 1.0;
            } else {
                overlayController.overlay.style.opacity = 0.0;
            }
        });


        nextStep(config.initial_step)
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });
          
}

function getStep(step_id) {
    if (!step_id) {
      console.error("nextStep: invalid step_id", step_id)
    }

    return config[step_id]
}

function setVideoSrc(src) {
    player.src({ type: 'video/mp4', src: src });
}

function playVideo() {
    player.ready(function() {
        console.log('The player is ready');
        // player.muted(true);
        player.play().then(() => {
           console.log('Video is playing');
        }).catch(error => {
            console.error('Failed to play video:', error);
        });
    });
}



function setAutoNextStep(step_id) {
  if (step_id)
    player.on('ended', function() { nextStep(step_id) });
  else
    player.on('ended', function() {});
}


function cleanOverlay() {

}


function nextStep(step_id) {
  let step = getStep(step_id)
  setVideoSrc(step.src)
  
  if(step.choices) {
    setAutoNextStep("")
    overlayController.clean()
    overlayController.setTitle(step.title)
    step.choices.forEach(choice => {
        overlayController.addButton(choice.next_step, choice.text, choice.pic_src)
    });

  } else
    setAutoNextStep(step.next_step)

//   playVideo() //Warning первое видео не запустится!
}







