
const stepController = {
    configName: "config.json",
    config: null,

    getStep: function(step_id) {
        if (!step_id )
          console.error("nextStep: invalid step_id", step_id)
    
        let step = this.config[step_id]
    
        if (!step)
            console.error("nextStep: no such step under step_id", step_id)
    
        return step
    },

    nextStep: function(step_id, is_initial_step = false) {
        let step = this.getStep(step_id)
    
        if (step.choices.length > 0 && step.next_step)
            console.warn("WARNING: choices and next_step are both not empty! step_id:", step_id)

        
        videoController.setAutoNextStep(step.next_step)
        overlayController.clean()
        overlayController.setTitle(step.title)
        step.choices.forEach(choice => {
            overlayController.addButton(choice.next_step, choice.text, choice.pic_src)
        });
    
        videoController.setVideoSrc(step.src)
    
        // Первое видео не запустится автоматически
        if (!is_initial_step)
            videoController.playVideo() 
    },

    init: function() {
  
        fetch(this.configName)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            this.config = data;
            videoPlayer.appendChild(overlayController.overlay);
            this.nextStep(this.config.initial_step, true)
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
    }
}


const overlayController = {

    overlay: document.getElementById('overlay'),
    overlayTitle: document.getElementById('overlayTitle'),
    buttonContainer: document.getElementById('buttonContainer'),

    visible: false,

    setTitle: function(title) {
        this.overlayTitle.textContent = title;
    },

    addButton: function(step_id, text, src) {
        const button = document.createElement('button');
        const img = document.createElement('img');
        if (src === "")
            button.textContent = text;
        else {
            img.src = src;
            button.appendChild(img);
        }
        
        button.onclick = () => {
            console.info("next step clicked:", step_id)
            stepController.nextStep(step_id)
        };
        this.buttonContainer.appendChild(button);
    },

    clean: function() {
        overlayController.hide()
        this.overlayTitle.textContent = '';
        this.buttonContainer.innerHTML = '';
    },

    hide: function () {
        if (!this.visible)
            return
        this.overlay.classList.remove('active')
        this.overlay.classList.add('fade-out')
        this.overlay.classList.remove('fade-in')
        this.visible = false
    },

    show: function () {
        if (this.visible)
            return
        this.overlay.classList.add('active')
        this.overlay.classList.remove('fade-out')
        this.overlay.classList.add('fade-in')
        this.visible = true
    }

}


const videoController = {
    player: videojs('videoPlayer'),

    setAutoNextStep: function(step_id) {
        if (step_id) {
          
            this.player.on('ended', () => { stepController.nextStep(step_id) });
            this.player.on('timeupdate', () => {});

        } else {
          
            this.player.on('ended', () => {});
            this.player.on('timeupdate', () => {
                this.player.remainingTime() < 0.5  ? overlayController.show() 
                                            : overlayController.hide()
            });

        }
    }, 

    setVideoSrc: function(src) {
        this.player.src({ type: 'application/x-mpegURL', src: src });
    },
    
    playVideo: function() {
        this.player.load();
        this.player.ready(function() {
            // player.muted(true);
            videoController.player.play().then(() => {
            //    console.log('Video is playing');
            }).catch(error => {
                // тут возникает ошибка при автоматическом запуске видео
                // console.error('Failed to play video:', error);
            });
        });

        document.addEventListener('keydown', function(evt) {
          if (evt.code === "Space") {
            if (player.play()) {
                player.pause()
            } else
            player.play()
          }
        })
    }
}

stepController.init();







