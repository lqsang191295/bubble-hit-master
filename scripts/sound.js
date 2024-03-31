class Buffer {
    constructor(context, urls) {  
        this.context = context;
        this.urls = urls;
        this.buffer = [];
        this.loadedCount = 0;
    }
    loadSound(url, index) {
        let request = new XMLHttpRequest();
        request.open('get', url, true);
        request.responseType = 'arraybuffer';
        let thisBuffer = this;
        request.onload = function() {
            thisBuffer.context.decodeAudioData(request.response, function(buffer) {
                thisBuffer.loadedCount++;
                thisBuffer.buffer[index] = buffer;
                if (thisBuffer.loadedCount == thisBuffer.urls.length) {
                    thisBuffer.loaded();
                }       
            });
        };
        request.send();
    };
    loadAll() {
        this.urls.forEach((url, index) => {
            this.loadSound(url, index);
        });
    }
    loaded() {
        console.log('loaded');
    }
    getSoundByIndex(index) {
        return this.buffer[index];
    }
}

class Sound {
    constructor(context, buffer, loop) {
        this.context = context;
        this.buffer = buffer;
        this.loop = false;
        if (loop != undefined) {
            this.loop = loop;
        }
        this.pausedAt = '';
        this.startedAt = '';
    }
    init() {
        this.gainNode = this.context.createGain();
        this.gainNode.gain.value = 0.5;
        this.source = this.context.createBufferSource();
        this.source.buffer = this.buffer;
        this.source.connect(this.gainNode);
        this.gainNode.connect(this.context.destination);
        this.source.loop = this.loop;
        if (this.loop) {
            this.gainNode.gain.value = 0.3;
        }
        else {
            this.gainNode.gain.value = 1;
        }
    }
    play() {
        this.init();
        this.source.start(0);
        this.startedAt = Date.now();
    }
    resume() {
        this.init();
        this.startedAt = Date.now() - this.pausedAt;
        this.source.start(0, this.pausedAt / 1000);
    }
    pause() {
        this.pausedAt = Date.now() - this.startedAt;
        this.stop();
    }
    stop() {
        this.source.stop(0);
    }
}