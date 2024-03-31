var ysdk;
var playerY;
var lbY;
var appLang = 'en';// (getCookie('app_lang') === 0 || getCookie('app_lang') == 'ru') ? 'ru' : 'en';
var localeArray = {
    "ru" : {
        "CONTINUE" : "Смотреть рекламу",
        "CANCEL" : "ОТМЕНА",
        "BEST" : "ЛУЧШИЙ",
        "BEST:" : "ЛУЧШИЙ:",
        "TOUCH TO START" : "НАЖМИТЕ ДЛЯ НАЧАЛА",
        "SCORE:" : "СЧЁТ:",
        "SCORE" : "СЧЁТ",
        "WATCH" : "Смотреть рекламу",
        "GOT IT" : "ПОНЯТНО",
        "GAME OVER" : "ИГРА ОКОНЧЕНА",
        "TOUCH TO RESTART" : "НАЖМИТЕ ДЛЯ РЕСТАРТА",
        "YOU WON" : "ВЫ ВЫИГРАЛИ",
        "NEW RECORD" : "НОВЫЙ РЕКОРД",
        "Watch ads to rescue" : "Смотреть рекламу для спасения",
        "Leaderboards" : "Таблица Лидеров",
        "LEADERBOARD_EMPTY": "Таблица рекордов пуста!",
        "REPLAY" : "ПОВТОРИТЬ",
    },
    "en" : {
        "CONTINUE" : "Watch ads",
        "CANCEL" : "CANCEL",
        "BEST:" : "BEST:",
        "BEST" : "BEST",
        "TOUCH TO START" : "TOUCH TO START",
        "SCORE:" : "SCORE:",
        "SCORE" : "SCORE",
        "WATCH" : "Watch ads",
        "GOT IT" : "GOT IT",
        "GAME OVER" : "GAME OVER",
        "TOUCH TO RESTART" : "TOUCH TO RESTART",
        "YOU WON" : "YOU WON",
        "NEW RECORD" : "NEW RECORD",
        "Watch ads to rescue" : "Watch ads to rescue",
        "Leaderboards" : "Leaderboards",
        "LEADERBOARD_EMPTY": "Leaderboard is empty!",
        "REPLAY" : "REPLAY",
    },
    "tr" : {
        "CONTINUE" : "Reklamları İzle",
        "CANCEL" : "İPTAL ET",
        "BEST:" : "EN İYİ:",
        "BEST" : "EN İYİ",
        "TOUCH TO START" : "BAŞLAMAK İÇİN DOKUN.",
        "SCORE:" : "SKOR:",
        "SCORE" : "SKOR",
        "WATCH" : "Reklamları İzle",
        "GOT IT" : "ANLADIM",
        "GAME OVER" : "OYUN BİTTİ",
        "TOUCH TO RESTART" : "DOKUNARAK YENİDEN BAŞLAT",
        "YOU WON" : "KAZANDIN",
        "NEW RECORD" : "YENİ REKOR",
        "Watch ads to rescue" : "Kurtarmak için reklamları izle",
        "Leaderboards" : "LİDERLİK TABLOSU",
        "LEADERBOARD_EMPTY": "Liderlik tablosu boş!",
        "REPLAY" : "YENİDEN OYNA",
    }
};
var divFPS = document.getElementById('fps')
var lastCalledTime;
var speedMoveDown = 0.3
var numberLevelRowInit = 4
var startShoot = false
var heightHeader = 70
var heightFooter = 200
var borderPlayerSize = 100
var cupTrained = (getCookie('cup_trained') === 0) ? false : true;
var bonusTrained = (getCookie('bonus_trained') === 0) ? false : true;
var bestScore = getCookie('score');
var competitiveBestScore = getCookie('competitive_score');
var timerBestScore = getCookie('timer_score');
var scoreDisplay = document.getElementById('level-score');
var pauseText = document.getElementById('dashboard-modal');
var startText = document.getElementById('start-text');
var actionText = document.getElementById('action-text');
var leaderTable = document.getElementById('leaderboard');
var tableContainer = document.getElementById('table-container');
var popupAd = document.getElementById('popup-ad');
var popupRescue = document.getElementById('popup-rescue');
var popupGameOver = document.getElementById('popup-game-over');
var popupText = document.getElementById('popup-text');
var popupTextRescue = document.getElementById('popup-text-rescue');
var gText = document.getElementById('start');
var sText = document.getElementById('score');
var bText = document.getElementById('best');
var tText = document.getElementById('touch');
var competitiveText = document.getElementById('competitive-best');
var timerText = document.getElementById('timer-best');
var muteButton = document.getElementById('mute-button');
var soundIcon = document.getElementById('sound-icon');
var closeAdButton = document.getElementById('close-ad-button');
// var closeRescueButton = document.getElementById('close-rescue-button');
var popupAction = document.getElementById('popup-action');
var popupActionContinue = document.getElementById('popup-action-continue');
var popupActionCancel = document.getElementById('popup-action-cancel');
var popupActionReplay = document.getElementById('popup-action-replay');
var headerBackground = document.getElementById('header-box');
var header = document.getElementById('header');
var loader = document.getElementById('loader');
var textBestScore = document.getElementById('text-best-score');
var dangerLine = document.getElementById('danger-line');

// Header
var bestScoreText = document.getElementById('best-score-text');
var scoreText = document.getElementById('score-text');

// Leaderboards
var popupLeaderboard = document.getElementById('popup-leaderboard');
var popupTextLeaderboard = document.getElementById('popup-text-leaderboard');
var leaderboardButton = document.getElementById('leaderboard-button');
var closeLeaderboardButton = document.getElementById('close-leaderboard-button');
var leaderTable = document.getElementById('leaderboard');
var tableBoxLoader = document.getElementById('table-box-loader');
var tableBoxNoData = document.getElementById('table-box-no-data');

async function initSDK() {
    return new Promise(async (resolve, reject) => {
        await LaggedAPI.init('lagdev_3172', 'ca-pub-Uni7 Studio');

        setCookie('app_lang', 'en');
        setLocale();
        loadBestScore()

        resolve()
    })
}

setLocale();

if (competitiveText) {
    competitiveText.innerHTML = competitiveBestScore;
}
if (timerText) {
    timerText.innerHTML = timerBestScore;
}

function loadBestScore(item) {
    if (item && item.score) {
        if (item.score > bestScore) {
            bestScore = item.score;
            setCookie('score', bestScore);
        }
        else if (bestScore > item.score) {
            setData('score');
        }
    }

    textBestScore.innerHTML = convertNumberScore(bestScore);
}

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    let lsData = localStorage.getItem(name);
    if (matches) {
        return decodeURIComponent(matches[1]);
    }
    else if (lsData != null) {
        return lsData;
    }
    return 0;
}

function setCookie(name, value) {
    let options = {
        path: '/',
        secure: true,
        samesite: 'none',
        'max-age': 2592000
    };
    var dateExp = new Date();
    dateExp.setTime(dateExp.getTime() + 2592000000);
    options.expires = dateExp.toUTCString();
    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
    for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
        }
    }
    document.cookie = updatedCookie;
    localStorage.setItem(name, value);
}

function setLocale() {
    // actionText.innerHTML = localeArray[appLang]['TOUCH TO START'];
    popupAction.querySelector('span').innerHTML = localeArray[appLang]['WATCH'];
    let bestArr = pauseText.querySelectorAll('p#best-text');
    for (let i = 0; i < bestArr.length; ++i) {
        bestArr[i].innerHTML = localeArray[appLang]['BEST:'];
    }
    // pauseText.querySelector('p#score-text').innerHTML = localeArray[appLang]['SCORE:'];

    // Popup Rescue
    popupRescue.querySelector('#popup-action-continue').innerHTML = localeArray[appLang]['CONTINUE'];
    popupRescue.querySelector('#popup-action-cancel').innerHTML = localeArray[appLang]['CANCEL'];
    popupTextRescue.innerHTML = localeArray[appLang]['Watch ads to rescue'];

    // Popup Leaderboards
    popupTextLeaderboard.innerHTML = localeArray[appLang]['Leaderboards'];
    tableBoxNoData.querySelector('p#empty-text').innerHTML = localeArray[appLang]['LEADERBOARD_EMPTY'];

    // Popup Rescue
    popupGameOver.querySelector('#popup-text-game-over').innerHTML = localeArray[appLang]['GAME OVER'];
    popupGameOver.querySelector('#popup-action-replay').innerHTML = localeArray[appLang]['REPLAY'];
    popupGameOver.querySelector('p#score-text').innerHTML = localeArray[appLang]['SCORE:'];
    popupGameOver.querySelector('p#best-text').innerHTML = localeArray[appLang]['BEST:'];

    // Header
    scoreText.innerHTML = localeArray[appLang]['SCORE'];
    bestScoreText.innerHTML = localeArray[appLang]['BEST'];
}

function showMainUI() {
    if (header) {
        header.style.opacity = 1
        header.style.animation = 'header-move-down .55s linear'
    }

    if (loader) {
        loader.style.display = 'none'
    }

    if (actionText) {
        actionText.style.display = 'block'
        actionText.style.animation = 'scale-up .3s linear'

        setTimeout(() => {
            actionText.style.animation = 'shaking .55s infinite'
        }, 300)
    }
}

function convertNumberScore(number) {
    if (number > 0 && number < 1000) return `${number}`

    if (number >= 1000 && number < 1000 * 1000) return `${(number / 1000).toFixed(2)}K`

    if (number >= 1000 * 1000) return `${(number / (1000 * 1000)).toFixed(2)}M`

    return '0'
}

window.onload = async function() {
    await initSDK()
    console.log('aaaaaaaaaaaa onLOAD')
    var currentPage = 'home';
    var newRecord = false;
    var gamestart = false;
    var competitiveTimerId;
    var timerSeconds = 0;
    var isPause = true;
    var whatBonus = '';
    var soundContext = new (window.AudioContext || window.webkitAudioContext)();
    var buffer = new Buffer(soundContext, [
        'audios/background.mp3',
        'audios/hit.mp3',
        'audios/no-hit.mp3',
        'audios/button_click.mp3',
        // 'audios/game-over.mp3',
    ]);
    var particles = []
    var backgroundSound = false;
    var popSound = false;
    var dontPopSound = false;
    var buttonClickSound = false;
    // var gameOverSound = false;
    var mute = false;
    var promoBegin = new Date(2022, 1, 9);
    var promoEnd = new Date(2022, 1, 14, 23, 59);
    var todayDate = new Date();

    function loadAudio() {
        buffer.loadAll();
        buffer.loaded = function() {
            backgroundSound = new Sound(soundContext, buffer.getSoundByIndex(0), true);
            backgroundSound.play();
            if (document.visibilityState == 'hidden') {
                backgroundSound.pause();
            }
            popSound = new Sound(soundContext, buffer.getSoundByIndex(1), false);
            dontPopSound = new Sound(soundContext, buffer.getSoundByIndex(2), false);
            // gameOverSound = new Sound(soundContext, buffer.getSoundByIndex(3), false);
            buttonClickSound = new Sound(soundContext, buffer.getSoundByIndex(3), false);
        }
    }
    document.addEventListener('visibilitychange', function() {
        if (backgroundSound && !mute) {
            if (document.visibilityState == 'hidden') {
                backgroundSound.pause();
            }
            else {
                backgroundSound.resume();
            }
        }
    });
    // Get the canvas and context
    var canvas = document.getElementById("viewport");
    var context = canvas.getContext("2d");
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    // Timing and frames per second
    var lastframe = 0;
    var fpstime = 0;
    var framecount = 0;
    var fps = 0;
    var initialized = false;
    // Level
    var level = {
        x: 4,           // X position
        y: 10,          // Y position
        width: 0,       // Width, gets calculated
        height: 0,      // Height, gets calculated
        columns: 16,    // Number of tile columns
        rows: 15,       // Number of tile rows
        tilewidth: 40,  // Visual width of a tile
        tileheight: 40, // Visual height of a tile
        rowheight: 34,  // Height of a row
        radius: 20,     // Bubble collision radius
        tiles: [],       // The two-dimensional tile array
        marginTopTiles: -100, // Margin top for hide tiles
        bubbleMove: 0,
        offsetYLineDanger: 0,
        borderLeftY: 0,
        borderRightY: 0,
    };
    // Define a tile class
    var Tile = function(x, y, type, shift) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.removed = false;
        this.shift = shift;
        this.velocity = 0;
        this.alpha = 1;
        this.processed = false;
    };
    // Player
    var player = {
        x: 0,
        y: 0,
        angle: 0,
        tiletype: 0,
        bubble: {
                    x: 0,
                    y: 0,
                    angle: 0,
                    speed: 1000,
                    dropspeed: 900,
                    tiletype: 0,
                    visible: false
                },
        nextbubble: {
                        x: 0,
                        y: 0,
                        tiletype: 0
                    }
    };
    // Neighbor offset table
    var neighborsoffsets = [[[1, 0], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1]], // Even row tiles
                            [[1, 0], [1, 1], [0, 1], [-1, 0], [0, -1], [1, -1]]];  // Odd row tiles
    // Number of different colors
    var bubblecolors = 6;
    var bubbleSize = 90;
    // Game states
    var gamestates = { init: 0, ready: 1, shootbubble: 2, removecluster: 3, gameover: 4, win: 5, animation: 6, rescue: 7 };
    var gamestate = gamestates.init;
    // Score
    var score = 0;
    var turncounter = 0;
    var rowoffset = 0;
    // Animation variables
    var animationstate = 0;
    var animationtime = 0;
    // Clusters
    var showcluster = false;
    var cluster = [];
    var floatingclusters = [];
    // Images
    var images = [];
    var bubbleimage;
    // Image loading global variables
    var loadcount = 0;
    var loadtotal = 0;
    var preloaded = false;

    muteButton.onclick = function() {
        mute = !mute;
        if (backgroundSound) {
            if (mute) {
                backgroundSound.pause();
                soundIcon.src = './images/icons/sound-off.png';
            }
            else {
                backgroundSound.resume();
                soundIcon.src = './images/icons/sound-on.png';
            }
        }
        if (!mute && buttonClickSound) {
            buttonClickSound.play();
        }
    }
    async function showScreenAdv(type) {
        return new Promise((resolve, reject) => {
            muteSound()

            if (type === 'interstitial') {
                LaggedAPI.APIAds.show(function() {
                    unmuteSound()
                    resolve()
                });
            }
            else if (type === 'rewarded') {
                window.LaggedAPI.GEvents.reward(
                    (success, showAdFn) => {
                        if (success) {
                            showAdFn()
                        } else {
                            unmuteSound()
                            reject()
                        }
                    },
                    (success) => {
                        unmuteSound()
                        resolve()
                    }
                )
            } else {
                reject(new Error('Unknown ad type'))
            }
        })
    }
    function muteSound() {
        console.log('111111111 muteSound ==== ')
        if(mute) return
        try {
            mute = true
            if(backgroundSound) backgroundSound.pause()
            if(popSound) popSound.pause()
            if(dontPopSound) dontPopSound.pause()
            if(buttonClickSound) buttonClickSound.pause()
            // if(gameOverSound) gameOverSound.pause()
        } catch (error) {
            
        }
       
    }
    function unmuteSound() {
        console.log('222222 unmuteSound ==== ')
        if(!mute) return
        try {
            mute = false
            if(backgroundSound) backgroundSound.resume()
            if(popSound) popSound.resume()
            if(dontPopSound) dontPopSound.resume()
            if(buttonClickSound) buttonClickSound.resume()
            // if(gameOverSound) gameOverSound.resume()
        } catch (error) {
            
        }
    }
    // Load images
    function loadImages(imagefiles) {
        // Initialize variables
        loadcount = 0;
        loadtotal = imagefiles.length;
        preloaded = false;
        // Load the images
        var loadedimages = [];
        for (var i=0; i<imagefiles.length; i++) {
            // Create the image object
            var image = new Image();
            // Add onload event handler
            image.onload = function () {
                loadcount++;
                if (loadcount == loadtotal) {
                    // Done loading
                    preloaded = true;
                }
            };
            // Set the source url of the image
            image.src = imagefiles[i];
            // Save to the image array
            loadedimages[i] = image;
        }
        // Return an array of images
        return loadedimages;
    }

    function getHeightOfBubbleBlock() {
        var heightMain = canvas.height - heightFooter - heightHeader

        return heightMain
    }

    function getRows() {
        const mainHeight = getHeightOfBubbleBlock()

        return Math.floor(mainHeight / level.tileheight) + 1
    }
    
    // Initialize the game
    function init() {
        // Load images
        images = loadImages(["images/sprites.png", "images/bar-left.png", "images/player-circle.png"]);

        bubbleimage = images[0];
    
        // Add mouse events
        canvas.addEventListener("mousemove", onMouseMove);
        canvas.addEventListener("touchstart", onMouseMove);
        canvas.addEventListener("touchmove", onMouseMove);
        canvas.addEventListener("mousedown", onMouseDown);
        canvas.addEventListener("touchend", onMouseDown);
        let min = Math.min(canvas.width, canvas.height);
        if (canvas.width < 300) {
            heightHeader = 50
            level.columns = 11;
            // level.rows = 10;
            heightFooter = 150
        }
        else if (canvas.width < 400) {
            heightHeader = 55
            level.columns = 12;
            // level.rows = 11;
            heightFooter = 150
        }
        else if (canvas.width < 600) {
            heightHeader = 55
            level.columns = 13;
            // level.rows = 12;
            heightFooter = 160
        }
        else if (canvas.width < 800) {
            heightHeader = 55
            level.columns = 14;
            // level.rows = 13;
            heightFooter = 170
        }
        else if (canvas.width < 1000) {
            heightHeader = 60
            level.columns = 15;
            // level.rows = 14;
            heightFooter = 170
        }

        if (canvas.height < 800) {
            heightFooter = 150
        }

        header.style.height = `${heightHeader - 5}px`
        level.radius = Math.floor(min / (level.columns + 1) / 2);
        level.tilewidth = 2 * level.radius;
        level.tileheight = level.tilewidth;
        level.rows = getRows();

        // Initialize the two-dimensional tile array
        for (var i=0; i<level.columns; i++) {
            level.tiles[i] = [];
            for (var j=0; j<level.rows; j++) {
                // Define a tile type and a shift parameter for animation
                level.tiles[i][j] = new Tile(i, j, 0, 0);
            }
        }
        level.rowheight = Math.floor((level.radius + 2) * Math.sqrt(3)) + 1;
        level.width = level.columns * (level.tilewidth ) + (level.tilewidth ) / 2 - 2;
        level.height = (level.rows-1) * level.rowheight + level.tileheight ;
        level.x = (canvas.width - level.width) / 2;
        level.y = (canvas.height - level.height) / 2;
        // Init the player
        player.x = level.x + level.width/2 - level.tilewidth / 2;
        player.y = canvas.height - 2 * level.tileheight / 2 - borderPlayerSize / 2;
        player.angle = 90;
        player.tiletype = 0;
        let pXBubbleNext = player.x - 2 * level.tilewidth
        let pYBubbleNext = player.y + level.tilewidth / 4

        if (canvas.width < 300) {
            heightHeader = 50
            level.columns = 11;
            // level.rows = 10;
            heightFooter = 150
        }
        else if (canvas.width < 400) {
            heightHeader = 55
            level.columns = 12;
            // level.rows = 11;
            heightFooter = 150
        }

        player.nextbubble.x = pXBubbleNext;
        player.nextbubble.y = pYBubbleNext;
        player.bubble.speed = 1.5 * min;
        player.bubble.dropspeed = 1.2 * min;

        const lineDangerY = canvas.height - heightFooter
        level.offsetYLineDanger = lineDangerY - level.height - heightHeader

        headerBackground.style.width = `${level.width}px`
        // New game
        newGame();
        // Enter main loop
        main(0);

    }

    window.addEventListener('resize', onResize, true);

    function onResize() {
        canvas.width = document.body.clientWidth;
        canvas.height = document.body.clientHeight;
        let min = Math.min(canvas.width, canvas.height);

        if (canvas.width < 300) {
            heightHeader = 50
            level.columns = 11;
            // level.rows = 10;
            heightFooter = 150
        }
        else if (canvas.width < 400) {
            heightHeader = 55
            level.columns = 12;
            // level.rows = 11;
            heightFooter = 150
        }
        else if (canvas.width < 600) {
            heightHeader = 55
            level.columns = 13;
            // level.rows = 12;
            heightFooter = 160
        }
        else if (canvas.width < 800) {
            heightHeader = 55
            level.columns = 14;
            // level.rows = 13;
            heightFooter = 170
        }
        else if (canvas.width < 1000) {
            heightHeader = 60
            level.columns = 15;
            // level.rows = 14;
            heightFooter = 170
        }

        if (canvas.height < 800) {
            heightFooter = 150
        }

        level.radius = Math.floor(min / (level.columns + 1) / 2);
        level.tilewidth = 2 * level.radius;
        level.tileheight = level.tilewidth;
        level.rows = getRows();

        for (var i=0; i<level.columns; i++) {
            if(!level.tiles[i]) level.tiles[i] = [];

            for (var j=0; j<level.rows; j++) {
                if(level.tiles[i][j]) continue
                level.tiles[i][j] = new Tile(i, j, -1, 0);
            }
        }

        let pXBubbleNext = player.x - 2 * level.tilewidth
        let pYBubbleNext = player.y + level.tilewidth / 4

        if (canvas.width < 300) {
            heightHeader = 50
            level.columns = 11;
            // level.rows = 10;
            heightFooter = 150
        }
        else if (canvas.width < 400) {
            heightHeader = 55
            level.columns = 12;
            // level.rows = 11;
            heightFooter = 150
        }

        level.rowheight = Math.floor((level.radius + 2) * Math.sqrt(3)) + 1;
        level.width = level.columns * (level.tilewidth ) + (level.tilewidth ) / 2 - 2;
        level.height = (level.rows-1) * level.rowheight + level.tileheight ;
        level.x = (canvas.width - level.width) / 2;
        level.y = (canvas.height - level.height) / 2;
        // Init the player
        player.x = level.x + level.width/2 - level.tilewidth / 2;
        player.y = canvas.height - 2 * level.tileheight / 2 - borderPlayerSize / 2;
        player.nextbubble.x = pXBubbleNext;
        player.nextbubble.y = pYBubbleNext;
        player.bubble.x = player.x;
        player.bubble.y = player.y;
        player.bubble.speed = 1.5 * min;
        player.bubble.dropspeed = 1.2 * min;

        const lineDangerY = canvas.height - heightFooter
        level.offsetYLineDanger = lineDangerY - level.height - heightHeader

        headerBackground.style.width = `${level.width}px`
    }
    
    // Main loop
    function main(tframe) {
        // Request animation frames
        window.requestAnimationFrame(main);
        if (!initialized) {
            // Preloader
            // Clear the canvas
            context.clearRect(0, 0, canvas.width, canvas.height);
            // Draw the frame
            drawFrame();
            if (preloaded) {
                initialized = true;
                showMainUI()
                loadAudio()
            }
        }
        else {
            if (gamestate !== gamestates.gameover 
                && gamestate !== gamestates.win
                && gamestate !== gamestates.rescue) {
                // Update and render the game
                update(tframe);
                render();
                // playParticles()
            } else {
                startShoot = false
            }

            // var fps;
            // if (!lastCalledTime) {
            //     lastCalledTime = new Date().getTime();
            //     fps = 0;
            // }
        
            // var delta = (new Date().getTime() - lastCalledTime) / 1000;
            // lastCalledTime = new Date().getTime();
            // fps = Math.ceil((1/delta));

            // divFPS.innerHTML = `FPS: ${fps}`
        }
    }
    
    // Update the game state
    function update(tframe) {
        var dt = (tframe - lastframe) / 1000;
        lastframe = tframe;
        // Update the fps counter
        updateFps(dt);
        if (gamestate == gamestates.ready) {
            // Game is ready for player input
            checkGameOver()
        }
        else if (gamestate == gamestates.shootbubble) {
            startShoot = true
            // Bubble is moving
            stateShootBubble(dt);
        }
        else if (gamestate == gamestates.removecluster) {
            // Remove cluster and drop tiles
            stateRemoveCluster(dt);
        } else if (gamestate == gamestates.animation) {
            level.marginTopTiles += 4
            startShoot = false

            if(level.marginTopTiles >= -level.tileheight){
                setGameState(gamestates.ready);
            }
        }

        if(startShoot) {
            level.marginTopTiles += speedMoveDown
            level.bubbleMove += speedMoveDown
        }

        if(startShoot && level.bubbleMove >= level.tileheight) {
            level.bubbleMove = 0
            addBubbles()
        }
    }
    
    function setGameState(newgamestate) {
        gamestate = newgamestate;
        animationstate = 0;
        animationtime = 0;
    }
    
    function stateShootBubble(dt) {
        // Bubble is moving
        // Move the bubble in the direction of the mouse
        player.bubble.x += dt * player.bubble.speed * Math.cos(degToRad(player.bubble.angle));
        player.bubble.y += dt * player.bubble.speed * -1*Math.sin(degToRad(player.bubble.angle));

        let pXLeft = level.borderLeftY + 8
        let pXRight = level.borderRightY - level.tilewidth
        
        // Handle left and right collisions with the level
        if (player.bubble.x <= pXLeft) {
            // Left edge
            player.bubble.angle = 180 - player.bubble.angle;
            player.bubble.x = pXLeft;
        }
        else if (player.bubble.x >= pXRight) {
            // Right edge
            player.bubble.angle = 180 - player.bubble.angle;
            player.bubble.x = pXRight;
        }
        // Collisions with the top of the level
        if (player.bubble.y <= level.y) {
            // Top collision
            player.bubble.y = level.y;
            snapBubble(-1, -1);
            return;
        }
        // Collisions with other tiles
        for (var i=0; i<level.columns; i++) {
            for (var j=0; j<level.rows; j++) {
                var tile = level.tiles[i][j];
                // Skip empty tiles
                if (tile.type < 0) {
                    continue;
                }
                // Check for intersections
                var coord = getTileCoordinate(i, j);
                if (circleIntersection(player.bubble.x + level.tilewidth/2,
                                       player.bubble.y + level.tileheight/2,
                                       level.radius,
                                       coord.tilex + level.tilewidth/2,
                                       coord.tiley + level.tileheight/2,
                                       level.radius)) {
                                        
                    // Intersection with a level bubble
                    player.bubble.visible = false;
                    snapBubble(i, j);
                    return;
                }
            }
        }
    }

    // Create Particles Eat Tile
    function createParticles(x, y, color) {
        var size = Math.random() * level.tilewidth
        var particle = new Particle(x, y, size / 2, color)

        particles.push(particle);
    }

    function playParticles() {
        particles.forEach((particle, index) => {
            particle.update()
            particle.draw(context)

            if (particle.size <= 0.2) {
                particles.splice(index, 1)
            }
        })
    }
    
    function stateRemoveCluster(dt) {
        if (animationstate == 0) {
            resetRemoved();
            let lScore = score;
            // Mark the tiles as removed
            for (var i=0; i<cluster.length; i++) {
                // Set the removed flag
                cluster[i].removed = true;
                var coord = getTileCoordinate(cluster[i].x, cluster[i].y);
                var color = getColorByIndex(cluster[i].type)
                addScore(100, coord.tilex, coord.tiley, color)
            }
            // Add cluster score
            if (currentPage === 'regular' || currentPage === 'timer') {
                score += cluster.length * 100;

            }
            // Find floating clusters
            floatingclusters = findFloatingClusters();
            if (floatingclusters.length > 0) {
                // Setup drop animation
                for (var i=0; i<floatingclusters.length; i++) {
                    for (var j=0; j<floatingclusters[i].length; j++) {
                        var tile = floatingclusters[i][j];
                        tile.shift = 1;
                        tile.velocity = player.bubble.dropspeed;
                        if (currentPage === 'regular' || currentPage === 'timer') {
                            score += 150;
                          
                        }
                    }
                }
            }
            if (lScore != score && (currentPage === 'regular' || currentPage === 'timer')) {
                scoreDisplay.innerHTML = convertNumberScore(score);
            }
            animationstate = 1;
        }
        if (animationstate == 1) {
            // Pop bubbles
            var tilesleft = false;
            for (var i=0; i<cluster.length; i++) {
                var tile = cluster[i];
                if (tile.type >= 0) {
                    tilesleft = true;
                    // Alpha animation
                    tile.alpha -= dt * 15;
                    if (tile.alpha < 0) {
                        tile.alpha = 0;
                    }
                    if (tile.alpha == 0) {
                        // var color = getColorByIndex(tile.type)
                        tile.type = -1;
                        tile.alpha = 1;
                        // createParticles(tile.positionX, tile.positionY, color)
                    }
                }                
            }
            
            // Drop bubbles
            for (var i=0; i<floatingclusters.length; i++) {
                for (var j=0; j<floatingclusters[i].length; j++) {
                    var tile = floatingclusters[i][j];
                    if (tile.type >= 0) {
                        var showScore = false
                        tilesleft = true;
                        // Accelerate dropped tiles
                        tile.velocity += dt * 700;
                        tile.shift += dt * tile.velocity;
                        // Alpha animation
                        tile.alpha -= dt * 2;
                        if (tile.alpha < 0) {
                            tile.alpha = 0;
                            showScore = true
                            var coord = getTileCoordinate(tile.x, tile.y);
                            var color = getColorByIndex(tile.type)
                            addScore(150, coord.tilex, coord.tiley + tile.shift, color)
                        }
                        // Check if the bubbles are past the bottom of the level
                        if (tile.alpha == 0 || (tile.y * level.rowheight + tile.shift > (level.rows - 1) * level.rowheight + level.tileheight)) {
                            if(!showScore) {
                                var coord = getTileCoordinate(tile.x, tile.y);
                                var color = getColorByIndex(tile.type)
                                addScore(150, coord.tilex, coord.tiley + tile.shift, color)
                            }

                            tile.type = -1;
                            tile.shift = 0;
                            tile.alpha = 1;
                        }
                    }
                }
            }
            if (!tilesleft) {
                // Next bubble
                nextBubble();
                // Check for game over
                var tilefound = false
                for (var i=0; i<level.columns; i++) {
                    for (var j=0; j<level.rows; j++) {
                        if (level.tiles[i][j].type != -1) {
                            tilefound = true;
                            break;
                        }
                    }
                }
                if (tilefound) {
                    setGameState(gamestates.ready);
                }
                else {
                    // No tiles left, game over
                    setGameState(gamestates.win);
                }
                if (currentPage == 'competitive') {
                    setCompetitiveScore();
                }
            }
        }
    }
    // Snap bubble to the grid
    function snapBubble(tilex, tiley) {
        // Get the grid position
        var centerx = player.bubble.x + level.tilewidth/2;
        var centery = player.bubble.y + level.tileheight/2;
        var gridpos = getGridPosition(tilex, tiley, centerx, centery);
        // Make sure the grid position is valid
        if (gridpos.x < 0) {
            gridpos.x = 0;
        }
        if (gridpos.x >= level.columns) {
            gridpos.x = level.columns - 1;
        }
        if (gridpos.y < 0) {
            gridpos.y = 0;
        }
        if (gridpos.y >= level.rows) {
            gridpos.y = level.rows - 1;
        }
        // Check if the tile is empty
        var addtile = false;
        if (level.tiles[gridpos.x][gridpos.y].type != -1) {
            // Tile is not empty, shift the new tile downwards
            for (var newrow=gridpos.y+1; newrow<level.rows; newrow++) {
                if (level.tiles[gridpos.x][newrow].type == -1) {
                    gridpos.y = newrow;
                    addtile = true;
                    break;
                }
            }
        }
        else {
            addtile = true;
        }

        if(!addtile) {
            if (checkGameOver()) {
                return;
            }
        }
        // Add the tile to the grid
        if (addtile) {
            // Hide the player bubble
            player.bubble.visible = false;
            // Set the tile
            level.tiles[gridpos.x][gridpos.y].type = player.bubble.tiletype;
            // Check for game over
            if (checkGameOver()) {
                return;
            }
            // Find clusters
            cluster = findCluster(gridpos.x, gridpos.y, true, true, false);
            if (cluster.length >= 3) {
                // Remove the cluster
                setGameState(gamestates.removecluster);
                if (!mute && popSound) {
                    popSound.play();
                }
                return;
            }
        } 


        if (!mute && dontPopSound) {
            dontPopSound.play();
        }
        // // No clusters found
        // turncounter++;
        // /*if (turncounter == 4) {
        //     showTip('miss');
        // }*/
        // if (turncounter >= 3) {
        //     // Add a row of bubbles
        //     addBubbles();
        //     turncounter = 0;
        //     rowoffset = (rowoffset + 1) % 2;
        //     if (checkGameOver()) {
        //         return;
        //     }
        // }
        // Next bubble
        nextBubble();
        setGameState(gamestates.ready);
    }
    function checkGameOver() {
        // Check for game over
        var lastTile
        for (var j=level.rows-1; j>=0; j--) {
            for (var i=0; i<level.columns; i++) {
            // Check if there are bubbles in the bottom row
                if (level.tiles[i][j].type != -1){
                    lastTile = level.tiles[i][j]
                    break
                }

            }
            
            if(lastTile) break
        }

        if(lastTile){
            const lineDangerY = canvas.height - heightFooter - level.offsetYLineDanger
            if(lastTile.positionY + level.tileheight > lineDangerY){
                nextBubble();
                setGameState(gamestates.rescue);
                popupRescue.style.display = 'flex';
              
                return true;
            }
        }

        return false;
    }
    function addBubbles() {
        level.marginTopTiles -= level.rowheight * 2

        level.rows +=2
        for (var i=0; i<level.columns; i++) {
            if(!level.tiles[i]) level.tiles[i] = [];

            for (var j=0; j<level.rows; j++) {
                if(level.tiles[i][j]) continue

                level.tiles[i][j] = new Tile(i, j, 1, 0);
            }
        }

        // Move the rows downwards
        for (var i=0; i<level.columns; i++) {
            for (var j=0; j<level.rows-2; j++) {
                level.tiles[i][level.rows-1-j].type = level.tiles[i][level.rows-1-j-2].type;
            }
        }

        for (var i=0; i<level.columns; i++) {
            level.tiles[i][0].type = getExistingColor();
        }
    }
    // Find the remaining colors
    function findColors() {
        var foundcolors = [];
        var colortable = [];
        for (var i=0; i<bubblecolors; i++) {
            colortable.push(false);
        }
        // Check all tiles
        for (var i=0; i<level.columns; i++) {
            for (var j=0; j<level.rows; j++) {
                var tile = level.tiles[i][j];
                if (tile.type >= 0) {
                    if (!colortable[tile.type]) {
                        colortable[tile.type] = true;
                        foundcolors.push(tile.type);
                    }
                }
            }
        }
        return foundcolors;
    }
    // Find cluster at the specified tile location
    function findCluster(tx, ty, matchtype, reset, skipremoved) {
        // Reset the processed flags
        if (reset) {
            resetProcessed();
        }
        // Get the target tile. Tile coord must be valid.
        var targettile = level.tiles[tx][ty];
        // Initialize the toprocess array with the specified tile
        var toprocess = [targettile];
        targettile.processed = true;
        var foundcluster = [];
        while (toprocess.length > 0) {
            // Pop the last element from the array
            var currenttile = toprocess.pop();
            // Skip processed and empty tiles
            if (currenttile.type == -1) {
                continue;
            }
            // Skip tiles with the removed flag
            if (skipremoved && currenttile.removed) {
                continue;
            }
            // Check if current tile has the right type, if matchtype is true
            if (!matchtype || (currenttile.type == targettile.type)) {
                // Add current tile to the cluster
                foundcluster.push(currenttile);
                // Get the neighbors of the current tile
                var neighbors = getNeighbors(currenttile);
                // Check the type of each neighbor
                for (var i=0; i<neighbors.length; i++) {
                    if (!neighbors[i].processed) {
                        // Add the neighbor to the toprocess array
                        toprocess.push(neighbors[i]);
                        neighbors[i].processed = true;
                    }
                }
            }
        }
        // Return the found cluster
        return foundcluster;
    }
    
    // Find floating clusters
    function findFloatingClusters() {
        // Reset the processed flags
        resetProcessed();
        var foundclusters = [];
        // Check all tiles
        for (var i=0; i<level.columns; i++) {
            for (var j=0; j<level.rows; j++) {
                var tile = level.tiles[i][j];
                if (!tile.processed) {
                    // Find all attached tiles
                    var foundcluster = findCluster(i, j, false, false, true);
                    // There must be a tile in the cluster
                    if (foundcluster.length <= 0) {
                        continue;
                    }
                    // Check if the cluster is floating
                    var floating = true;
                    for (var k=0; k<foundcluster.length; k++) {
                        if (foundcluster[k].y == 0) {
                            // Tile is attached to the roof
                            floating = false;
                            break;
                        }
                    }
                    if (floating) {
                        // Found a floating cluster
                        foundclusters.push(foundcluster);
                    }
                }
            }
        }
        return foundclusters;
    }
    // Reset the processed flags
    function resetProcessed() {
        for (var i=0; i<level.columns; i++) {
            for (var j=0; j<level.rows; j++) {
                level.tiles[i][j].processed = false;
            }
        }
    }
    // Reset the removed flags
    function resetRemoved() {
        for (var i=0; i<level.columns; i++) {
            for (var j=0; j<level.rows; j++) {
                level.tiles[i][j].removed = false;
            }
        }
    }
    // Get the neighbors of the specified tile
    function getNeighbors(tile) {
        var tilerow = (tile.y + rowoffset) % 2; // Even or odd row
        var neighbors = [];
        // Get the neighbor offsets for the specified tile
        var n = neighborsoffsets[tilerow];
        // Get the neighbors
        for (var i=0; i<n.length; i++) {
            // Neighbor coordinate
            var nx = tile.x + n[i][0];
            var ny = tile.y + n[i][1];
            // Make sure the tile is valid
            if (nx >= 0 && nx < level.columns && ny >= 0 && ny < level.rows) {
                neighbors.push(level.tiles[nx][ny]);
            }
        }
        return neighbors;
    }
    function updateFps(dt) {
        if (fpstime > 0.25) {
            // Calculate fps
            fps = Math.round(framecount / fpstime);
            // Reset time and framecount
            fpstime = 0;
            framecount = 0;
        }
        // Increase time and framecount
        fpstime += dt;
        framecount++;
    }
    // Render the game
    function render() {
        // Draw the frame around the game
        drawFrame();

        drawBorderLeftRight()
        drawBorderFooter()
        
        // Render tiles
        renderTiles();
        // Render cluster
        if (showcluster) {
            renderCluster(cluster, 255, 128, 128);
            for (var i=0; i<floatingclusters.length; i++) {
                var col = Math.floor(100 + 100 * i / floatingclusters.length);
                renderCluster(floatingclusters[i], col, col, col);
            }
        }
        // Render player bubble
        renderPlayer();
        // Game Over overlay
        if (gamestate == gamestates.gameover) {
            if (currentPage === 'regular') {
                if (score > bestScore) {
                    newRecord = true;
                    bestScore = score;
                    setData('score');
                }
                bText.innerHTML = bestScore;
            }
            gText.innerHTML = localeArray[appLang]['GAME OVER'];
            sText.innerHTML = score;
            beforeEndGame(false);
        }
        else if (gamestate == gamestates.win) {
            if (todayDate >= promoBegin && todayDate <= promoEnd) {
                score += 5000;
            }
            if (currentPage === 'regular') {
                if (score > bestScore) {
                    newRecord = true;
                    bestScore = score;
                    setData('score');
                }
                bText.innerHTML = bestScore;
            }
            else if (currentPage === 'timer') {
                score += 5000;
                if (score > timerBestScore) {
                    newRecord = true;
                    timerBestScore = score;
                    setData('timer_score');
                }
                timerText.innerHTML = timerBestScore;
                bText.innerHTML = timerBestScore;
                clearInterval(competitiveTimerId);
                competitiveTimerId = -1;
            }
            else if (currentPage === 'competitive') {
                score += 5000;
                if (score > competitiveBestScore) {
                    newRecord = true;
                    competitiveBestScore = score;
                    setData('competitive_score');
                }
                competitiveText.innerHTML = competitiveBestScore;
                bText.innerHTML = competitiveBestScore;
                clearInterval(competitiveTimerId);
                competitiveTimerId = -1;
            }
            gText.innerHTML = localeArray[appLang]['YOU WON'];
            sText.innerHTML = score;
            beforeEndGame(true);
        }
    }

    function drawBorderLeftRight() {
        level.borderLeftY = level.x - 15
        level.borderRightY = level.x + level.width + 5

        if(canvas.width < 600){
            level.borderLeftY = -3
            level.borderRightY = canvas.width - 9
        }

        context.drawImage(images[1], level.borderLeftY - 7, 0, 24, canvas.height);
        context.drawImage(images[1], level.borderRightY - 7, 0, 24, canvas.height);
        header.style.width = `${level.borderRightY - level.borderLeftY + 20}px`
    }

    function drawBorderFooter() {
        const pY = canvas.height - heightFooter - level.offsetYLineDanger

        // context.drawImage(images[4], (canvas.width - level.width) / 2, pY, level.width, 10);

        dangerLine.style.width = `${level.width}px`
        dangerLine.style.top = `${pY}px`
    }

    async function beforeEndGame(win) {
        if (newRecord) {
            newRecord = false;
            pauseText.classList.add('new-record');
            if (win) {
                gText.innerHTML = localeArray[appLang]['YOU WON'];
            }
            else {
                gText.innerHTML = localeArray[appLang]['NEW RECORD'];
            }
        }
        else {
            pauseText.classList.remove('new-record');
        }
        isPause = true;
        popupGameOver.style.display = 'flex';
        startText.style.display = 'flex';
        tText.innerHTML = localeArray[appLang]['TOUCH TO RESTART'];
        // try {
        //     await showScreenAdv('interstitial');
        // } catch (error) {
        //     //
        // }
        // newGame();
        // setGameState(gamestates.ready)
    }
    // Draw a frame around the game
    function drawFrame() {
        // Draw background
        context.fillStyle = "#6200EA";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.clearRect(0, 0, canvas.width, canvas.height);
    }
    // Render tiles
    function renderTiles() {
        // Top to bottom
        for (var j=0; j<level.rows; j++) {
            for (var i=0; i<level.columns; i++) {
                // Get the tile
                var tile = level.tiles[i][j];
                // Get the shift of the tile for animation
                var shift = tile.shift;
                // Calculate the tile coordinates
                var coord = getTileCoordinate(i, j);
                // Check if there is a tile present
                if (tile.type >= 0) {
                    // Support transparency
                    context.save();
                    context.globalAlpha = tile.alpha;
                    // Draw the tile using the color
                    drawBubble(coord.tilex, coord.tiley + shift, tile.type);
                    tile.positionX = coord.tilex
                    tile.positionY = coord.tiley + shift
                    context.restore();
                }
            }
        }
    }
    // Render cluster
    function renderCluster(cluster, r, g, b) {
        for (var i=0; i<cluster.length; i++) {
            // Calculate the tile coordinates
            var coord = getTileCoordinate(cluster[i].x, cluster[i].y);
            // Draw the tile using the color
            context.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
            context.fillRect(coord.tilex+level.tilewidth/4, coord.tiley+level.tileheight/4, level.tilewidth/2, level.tileheight/2);
        }
    }

    function drawCirlePlayer(x, y) {
        var w = level.tilewidth + level.tilewidth / 2
        var h = level.tileheight + level.tileheight / 2

        context.drawImage(images[2], x - w / 2, y - h / 2, w, h);
    }
    
    // Render the player bubble
    function renderPlayer() {
        var centerx = player.x + level.tilewidth/2;
        var centery = player.y + level.tileheight/2;
        // Draw player background circle
        // context.fillStyle = "#7E57C2";
        // context.beginPath();
        // context.arc(centerx, centery, 0.8 * level.tileheight, 0, 2 * Math.PI, false);
        // context.fill();
        for (let i = 0; i < turncounter; ++i) {
            context.fillStyle = "#a881eb";
            context.beginPath();
            context.arc(centerx + 1.5 * level.tileheight + i * level.tileheight + 20, centery, 0.2 * level.tileheight, 0, 2*Math.PI, false);
            context.fill();
        }
        
        // Draw the angle
        let x1 = centerx
        let y1 = centery

        drawCirlePlayer(x1, y1)

        let borderLeftX = level.borderLeftY + 8 + level.tilewidth / 2
        let borderLeftY = level.borderRightY - level.tilewidth / 2
        
        let tangentPoint = calculateTangentPointWithObstacle({x: centerx, y: centery}, {x: borderLeftX}, player.angle)
        let distance = calculateDistance({x: centerx, y: centery}, {x: tangentPoint.x, y: tangentPoint.y})

        let x2 = centerx + (distance) * Math.cos(degToRad(player.angle))
        let y2 = centery - (distance) * Math.sin(degToRad(player.angle))

        if(player.angle == 90) y2 = 1

        let tileCollider

        for (let i = 0; i < level.tiles.length; i++) {
            const tiles = level.tiles[i]
            for (let j = 0; j < tiles.length; j++) {
                const tile = tiles[j]
                const circle = {
                    x: tile.positionX+level.tilewidth/2,
                    y: tile.positionY+level.tilewidth/2,
                    radius: level.tilewidth / 2 + 3,
                };
            
                // context.beginPath();
                // context.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
                // context.stroke();

                const isCollision = isLineCircleCollision(x1, y1, x2, y2, circle.x, circle.y, circle.radius);

                if(isCollision && tile.type != -1){
                    if(!tileCollider) tileCollider = tile

                    if(tileCollider.y == tile.y){
                        const distance1 = calculateDistance({x: x1, y: y1}, {x: tileCollider.positionX, y: tileCollider.positionY})
                        const distance2 = calculateDistance({x: x1, y: y1}, {x: tile.positionX, y: tile.positionY})
                        if(distance2 < distance1) tileCollider = tile
                    }

                    if(tileCollider.y < tile.y) {
                        tileCollider = tile
                    }
                }
            }
        }

        if(tileCollider){
            const circle = {
                x: tileCollider.positionX+level.tilewidth/2,
                y: tileCollider.positionY+level.tilewidth/2,
                radius: level.tilewidth / 2 + 3,
            }


            const tangentPoint = findTangentPointLineWithCircle(x1,y1,x2,y2,circle);

            distance = calculateDistance({x: x1, y: y1}, {x: tangentPoint.x, y: tangentPoint.y})
            distance -= level.tileheight / 2 + 5

            x2 = x1 + distance * Math.cos(degToRad(player.angle))
            y2 = y1 - distance * Math.sin(degToRad(player.angle))
        }

        drawDashedLine(x1,y1,x2,y2)

        for (let index = 0; index < 3; index++) {
            let reflectAngle = player.angle

            if(tangentPoint && !tileCollider){
                if(index % 2 == 0){
                    reflectAngle = 180 - reflectAngle
                } 

                let border = borderLeftX

                if(reflectAngle <= 90){
                    border = borderLeftY
                }

                x1 = x2
                y1 = y2

                tangentPoint = calculateTangentPointWithObstacle({x: x1, y: y1}, {x: border}, reflectAngle)
                let distance = calculateDistance({x: x1, y: y1}, {x: tangentPoint.x, y: tangentPoint.y})
                x2 = x1 + (distance) * Math.cos(degToRad(reflectAngle))
                y2 = y1 - (distance) * Math.sin(degToRad(reflectAngle))

                for (let i = 0; i < level.tiles.length; i++) {
                    const tiles = level.tiles[i]
                    for (let j = 0; j < tiles.length; j++) {
                        const tile = tiles[j]
                        const circle = {
                            x: tile.positionX+level.tilewidth/2,
                            y: tile.positionY+level.tilewidth/2,
                            radius: level.tilewidth / 2 + 3,
                        };
                    
                        // context.beginPath();
                        // context.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
                        // context.stroke();
        
                        const isCollision = isLineCircleCollision(x1, y1, x2, y2, circle.x, circle.y, circle.radius);
        
                        if(isCollision && tile.type != -1){
                            if(!tileCollider) tileCollider = tile
        
                            if(tileCollider.y == tile.y){
                                const distance1 = calculateDistance({x: x1, y: y1}, {x: tileCollider.positionX, y: tileCollider.positionY})
                                const distance2 = calculateDistance({x: x1, y: y1}, {x: tile.positionX, y: tile.positionY})
                                if(distance2 < distance1) tileCollider = tile
                            }
        
                            if(tileCollider.y < tile.y) {
                                tileCollider = tile
                            }
                        }
                    }
                }
        
                if(tileCollider){
                    const circle = {
                        x: tileCollider.positionX+level.tilewidth/2,
                        y: tileCollider.positionY+level.tilewidth/2,
                        radius: level.tilewidth / 2 + 3,
                    }
        
                    const tangentPointColliderCircle = findTangentPointLineWithCircle(x1,y1,x2,y2,circle);
        
                    distance = calculateDistance({x: x1, y: y1}, {x: tangentPointColliderCircle.x, y: tangentPointColliderCircle.y})
                    distance -= level.tileheight / 2 + 5

                    x2 = x1 + distance * Math.cos(degToRad(reflectAngle))
                    y2 = y1 - distance * Math.sin(degToRad(reflectAngle))
                }

                drawDashedLine(x1,y1,x2,y2)
            }
        }

        // Draw the next bubble
        drawBubble(player.nextbubble.x, player.nextbubble.y, player.nextbubble.tiletype);
        // Draw the bubble
        if (player.bubble.visible) {
            drawBubble(player.bubble.x, player.bubble.y, player.bubble.tiletype);
        }
    }

    // Find TangentPoint Between Line With Circle
    function findTangentPointLineWithCircle(x1, y1, x2, y2, circle) {
        const m = (y2-y1)/(x2-x1)
        const c = calculateIntercept(x1,y1,x2,y2)
        const h = circle.x
        const k = circle.y
        const r = circle.radius

        const mPerp = -1 / m

        const x = (m * k + h - m * c) / (m * m + 1)
        const y = m * x + c

        const xPerp = x + r / Math.sqrt(1 + mPerp * mPerp)
        const yPerp = mPerp * (xPerp - x) + y

        return { x: xPerp, y: yPerp }
    }

    // Calculate Intercept
    function calculateIntercept(x1, y1, x2, y2) {
        const m = (y2 - y1) / (x2 - x1)
        const b = y1 - m * x1
    
        return b
    }

    // Check collider 
    function isLineCircleCollision(x1, y1, x2, y2, circleX, circleY, circleRadius) {
        const lineVector = { x: x2 - x1, y: y2 - y1 }
  
        const lineToCircleVector = { x: circleX - x1, y: circleY - y1 }
  
        const dotProduct = (lineToCircleVector.x * lineVector.x) + (lineToCircleVector.y * lineVector.y)
  
        const closestPointOnLine = {
          x: x1 + (dotProduct / (lineVector.x * lineVector.x + lineVector.y * lineVector.y)) * lineVector.x,
          y: y1 + (dotProduct / (lineVector.x * lineVector.x + lineVector.y * lineVector.y)) * lineVector.y,
        }
  
        const isOnLineSegment = closestPointOnLine.x >= Math.min(x1, x2) && closestPointOnLine.x <= Math.max(x1, x2)
          && closestPointOnLine.y >= Math.min(y1, y2) && closestPointOnLine.y <= Math.max(y1, y2)
  
        const distanceToCircle = Math.sqrt((closestPointOnLine.x - circleX) ** 2 + (closestPointOnLine.y - circleY) ** 2)
  
        return isOnLineSegment && distanceToCircle <= circleRadius
    }

    // Calculate Tangent Point
    function calculateTangentPointWithObstacle(pointA, obstacle, angle) {

        const angleInRadian = (angle * Math.PI) / 180
        const correctRadian = angleInRadian.toFixed(2)

        const slope = Math.tan(correctRadian)

        const tangentPointY = pointA.y + slope * (obstacle.x - pointA.x)

        const tangentPoint = { x: obstacle.x, y: tangentPointY }
      
        return tangentPoint
    }

    // Calculate Distance Between Two Points
    function calculateDistance(pointA, pointB) {
        const dx = pointB.x - pointA.x
        const dy = pointB.y - pointA.y

        return Math.sqrt(dx * dx + dy * dy)
      }

    // Draw Dashed Line
    function drawDashedLine(x1, y1, x2, y2) {
        // context.beginPath();
        // context.moveTo(x1, y1);
        // context.lineTo(x2, y2);
        // context.stroke();
        // return
        const dashLength = 10
        const gapLength = 5
        const deltaX = x2 - x1
        const deltaY = y2 - y1
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
        const dashCount = distance / (dashLength + gapLength)

        const xIncrement = deltaX / dashCount
        const yIncrement = deltaY / dashCount

        for (let i = 0; i < dashCount; i++) {
            const startX = x1 + i * xIncrement
            const startY = y1 + i * yIncrement
            const endX = startX + xIncrement * 0.5
            const endY = startY + yIncrement * 0.5

            context.beginPath();
            context.arc(endX, endY, dashLength / 2, 0, Math.PI * 2)
            context.fillStyle = getColorByIndex(player.bubble.tiletype)
            context.fill()
            context.closePath()
        }
    }

    // Get Color By Index
    function getColorByIndex(index){
        let color = level.lineColor

        switch (index) {
            case 0:
                color = "#d03ddc"
                break;
            case 1:
                color = "#df2936"
                break;
            case 2:
                color = "#d02719"
                break;
            case 3:
                color = "#f3c504"
                break;
            case 4:
                color = "#2086dd"
                break;
            case 5:
                color = "#96da07"
                break;
        }

        return color
    }

    // Get the tile coordinate
    function getTileCoordinate(column, row) {
        let tilex = level.x + column * (level.tilewidth );
        // X offset for odd or even rows
        if ((row + rowoffset) % 2) {
            tilex += (level.tilewidth ) / 2;
        }
        // Margin top = 70
        let tiley = level.marginTopTiles + row * level.rowheight;
        return { tilex: tilex, tiley: tiley };
    }
    // Get the closest grid position
    function getGridPosition(tx, ty, x, y) {
        let gridy;
        let gridx;
        if (tx !== -1 && ty !== -1) {
            let t = getTileCoordinate(tx, ty);
            t.tiley += 2 + level.radius;
            t.tilex += 2 + level.radius;
            let vec = {
                x: -1 * Math.cos(degToRad(player.bubble.angle)),
                y: Math.sin(degToRad(player.bubble.angle))
            };
            x += (2 * level.radius - Math.sqrt((x - t.tilex) * (x - t.tilex) + (y - t.tiley) * (y - t.tiley))) * vec.x;
            y += (2 * level.radius - Math.sqrt((x - t.tilex) * (x - t.tilex) + (y - t.tiley) * (y - t.tiley))) * vec.y;
            gridy = ty;
            if (y - t.tiley >= level.radius) {
                gridy = ty + 1;
            }
            if (t.tiley - y >= level.radius) {
                gridy = ty - 1;
            }
            gridx = tx + 1;
            if (t.tilex < x) {
                gridx = tx + 1;
                if (gridy != ty && (gridy + rowoffset) % 2 == 1) {
                    gridx = tx;
                }
            }
            else {
                gridx = tx - 1;
                if (gridy != ty && (ty + rowoffset) % 2 == 1) {
                    gridx = tx;
                }
            }
        }
        else {
            gridy = Math.floor((y - level.y) / level.rowheight);
            // Check for offset
            if ((gridy + rowoffset) % 2) {
                x -= (level.tilewidth ) / 2;
            }
            gridx = Math.floor((x - level.x) / (level.tilewidth ));
        }
        return { x: gridx, y: gridy };
    }
    // Draw the bubble
    function drawBubble(x, y, index) {
        if (index < 0 || index >= bubblecolors)
            return;
        // Draw the bubble sprite
        context.drawImage(bubbleimage, index * bubbleSize, 0, bubbleSize, bubbleSize, x, y, level.tilewidth, level.tileheight);
    }
    // Start a new game
    function newGame() {
        level.marginTopTiles = -100

        timerSeconds = 0;
        turncounter = 0;
        rowoffset = 0;
        // Set the gamestate to ready
        // setGameState(gamestates.ready);
        // Create the level
        createLevel();
        // Reset score
        if (currentPage === 'competitive') {
            setCompetitiveScore();
        }
        else {
            score = 0;
            scoreDisplay.innerHTML = score;
        }
        // Init the next bubble and set the current bubble
        nextBubble();
        nextBubble();
    }
    function getEmptyTiles() {
        let k = 0;
        for (let i = 0; i < level.columns; i++) {
            for (let j = 0; j < level.rows; j++) {
                if (level.tiles[i][j].type == -1) {
                    ++k;
                }
            }
        }
        return k;
    }
    function setCompetitiveScore() {
        score = Math.max(Math.floor(5000 * getEmptyTiles() / (level.columns * Math.ceil(level.rows / 2 - 2)) - 5 * timerSeconds), 0);
        scoreDisplay.innerHTML = convertNumberScore(score);
    }
    // Create a random level
    function createLevel() {
        // Create a level with random tiles
        for (var j=0; j<level.rows; j++) {
            var randomtile = randRange(0, bubblecolors-1);
            var count = 0;
            for (var i=0; i<level.columns; i++) {
                if (count >= 2) {
                    // Change the random tile
                    var newtile = randRange(0, bubblecolors-1);
                    // Make sure the new tile is different from the previous tile
                    if (newtile == randomtile) {
                        newtile = (newtile + 1) % bubblecolors;
                    }
                    randomtile = newtile;
                    count = 0;
                }
                count++;
                if (j < numberLevelRowInit) {
                    level.tiles[i][j].type = randomtile;
                }
                else {
                    level.tiles[i][j].type = -1;
                }
            }
        }
    }
    // Create a random bubble for the player
    function nextBubble() {
        // Set the current bubble
        player.tiletype = player.nextbubble.tiletype;
        player.bubble.tiletype = player.nextbubble.tiletype;
        player.bubble.x = player.x;
        player.bubble.y = player.y;
        player.bubble.visible = true;
        // Get a random type from the existing colors
        var nextcolor = getExistingColor();
        // Set the next bubble
        player.nextbubble.tiletype = nextcolor;
    }
    
    // Get a random existing color
    function getExistingColor() {
        existingcolors = findColors();
        var bubbletype = 0;
        if (existingcolors.length > 0) {
            bubbletype = existingcolors[randRange(0, existingcolors.length-1)];
        }
        return bubbletype;
    }
    // Get a random int between low and high, inclusive
    function randRange(low, high) {
        return Math.floor(low + Math.random()*(high-low+1));
    }
    // Shoot the bubble
    function shootBubble() {
        // Shoot the bubble in the direction of the mouse
        player.bubble.x = player.x;
        player.bubble.y = player.y;
        player.bubble.angle = player.angle;
        player.bubble.tiletype = player.tiletype;
        // Set the gamestate
        setGameState(gamestates.shootbubble);
    }
    // Check if two circles intersect
    function circleIntersection(x1, y1, r1, x2, y2, r2) {
        // Calculate the distance between the centers
        var dx = x1 - x2;
        var dy = y1 - y2;
        var len = Math.sqrt(dx * dx + dy * dy);
        if (len < r1 + r2) {
            // Circles intersect
            return true;
        }
        return false;
    }
    // Convert radians to degrees
    function radToDeg(angle) {
        return angle * (180 / Math.PI);
    }
    // Convert degrees to radians
    function degToRad(angle) {
        return angle * (Math.PI / 180);
    }
    // On mouse movement
    function onMouseMove(e) {
        // Get the mouse position
        var pos = getMousePos(canvas, e);
        // Get the mouse angle
        var mouseangle = radToDeg(Math.atan2((player.y+level.tileheight/2) - pos.y, pos.x - (player.x+level.tilewidth/2)));
        // Convert range to 0, 360 degrees
        if (mouseangle < 0) {
            mouseangle = 180 + (180 + mouseangle);
        }
        // Restrict angle to 8, 172 degrees
        var lbound = 8;
        var ubound = 172;
        if (mouseangle > 90 && mouseangle < 270) {
            // Left
            if (mouseangle > ubound) {
                mouseangle = ubound;
            }
        }
        else {
            // Right
            if (mouseangle < lbound || mouseangle >= 270) {
                mouseangle = lbound;
            }
        }
        // Set the player angle
        player.angle = mouseangle;
    }
    // On mouse button click
    function onMouseDown(e) {
        // Get the mouse position
        var pos = getMousePos(canvas, e);
        if (gamestate == gamestates.ready) {
            shootBubble();
        }
    }
    // Get the mouse position
    function getMousePos(canvas, e) {
        var rect = canvas.getBoundingClientRect();
        let cX = 0;
        let cY = 0;
        if (e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend') {
            cX = e.changedTouches[0].clientX;
            cY = e.changedTouches[0].clientY;
        }
        else {
            cX = e.clientX;
            cY = e.clientY;
        }
        return {
            x: Math.round((cX - rect.left)/(rect.right - rect.left)*canvas.width),
            y: Math.round((cY - rect.top)/(rect.bottom - rect.top)*canvas.height)
        };
    }
    function setData(name) {
        if (playerY) {
            playerY.getStats(
                ['score']
            ).then((item) => {
                console.log('data is get to set');
                if ((item.score || 0) > bestScore) {
                    bestScore = item.score;
                    setCookie('score', bestScore);
                } else {
                    if (lbY) {
                        lbY.setLeaderboardScore('GlobalLeaderboard', score);
                    }
                }
                playerY.incrementStats({
                    score: bestScore
                }).then(() => {
                    console.log('data is set');
                });
            });

        }

        loadBestScore()
        setCookie('score', bestScore);
    }
    // Call init to start the game
    init();
    actionText.onclick = function(event) {
        setGameState(gamestates.animation);
        currentPage = 'regular';
        gamestart = true;
        startText.style.display = 'flex';
        actionText.style.display = 'none';
        if (!bonusTrained) {
            isPause = true;
        }
        if (!mute && buttonClickSound) {
            buttonClickSound.play();
        }
    }
    function closePopupAd() {
        isPause = false;
        if (backgroundSound && mute) {
            mute = false;
            backgroundSound.resume();
        }
        popupAd.style.display = 'none';
        whatBonus = '';
    }
    closeAdButton.onclick = function(event) {
        closePopupAd();
        if (!mute && buttonClickSound) {
            buttonClickSound.play();
        }
    }
    function closePopupRescue() {
        isPause = false;
        popupRescue.style.display = 'none';
        whatBonus = '';
    }
    function closePopupGameOver() {
        if (backgroundSound && mute) {
            mute = false;
            backgroundSound.resume();
        }
        popupGameOver.style.display = 'none';
        whatBonus = '';
    }
    // closeRescueButton.onclick = function(event) {
    //     closePopupRescue()
    //     setGameState(gamestates.gameover)
    //     if (!mute && gameOverSound) {
    //         gameOverSound.play();
    //     }
    //     if (!mute && buttonClickSound) {
    //         buttonClickSound.play();
    //     }
    //     render()
    // }
    popupAction.onclick = async function(event) {
        if (!mute && buttonClickSound) {
            buttonClickSound.play();
        }
        
        try {
            await showScreenAdv('rewarded');

            if (whatBonus == 'miss') {
                turncounter = Math.max(0, turncounter - 1);
            }
            else if (whatBonus == 'timer') {
                timerSeconds = Math.min(180, timerSeconds + 20);
            }
            else if (whatBonus == 'competitive') {
                timerSeconds = Math.max(0, timerSeconds - 20);
            }
            console.log('Rewarded!');
        } catch (error) {
            //
        } finally {
            closePopupAd();
        }
    }
    popupActionContinue.onclick = function(event) {
        if (!mute && buttonClickSound) {
            buttonClickSound.play();
        }

        function onRescue() {
            var middleTile
            const mainHeight = getHeightOfBubbleBlock()
            for (var j=0; j< level.rows; j++) {
                for (var i=0; i<level.columns; i++) {
                    if (level.tiles[i][j].type != -1){
                        if(level.tiles[i][j].positionY > mainHeight / 2){
                            middleTile = level.tiles[i][j]
                        }
                        break
                    }

                }
                
                if(middleTile) break
            }

            for (var j = middleTile.y; j < level.rows; j++) {
                for (var i = 0; i < level.columns; i++) {
                    if (level.tiles[i][j].type != -1){
                        level.tiles[i][j].type = -1;
                        level.tiles[i][j].shift = 0;
                        level.tiles[i][j].alpha = 1;
                    }
                }
            }

            closePopupRescue()

            setGameState(gamestates.ready)
        }

        muteSound()
        window.LaggedAPI.GEvents.reward(
            (success, showAdFn) => {
                if (success) {
                    showAdFn()
                } else {
                    unmuteSound()
                    closePopupRescue();
                }
            },
            (success) => {
                unmuteSound()
                onRescue()
            }
        )
    }
    popupActionCancel.onclick = function(event) {
        closePopupRescue()
        setGameState(gamestates.gameover)
        // if (!mute && gameOverSound) {
        //     gameOverSound.play();
        // }
        if (!mute && buttonClickSound) {
            buttonClickSound.play();
        }
        render()
    }
    popupActionReplay.onclick = async function(event) {
        closePopupGameOver()
        if (!mute && buttonClickSound) {
            buttonClickSound.play();
        }
        if(gamestate === 4 && isPause) { // case click to start when gameOver
            try {
               await showScreenAdv('interstitial');
           } catch (error) {
               //
           }
           newGame();
           setGameState(gamestates.animation)

           pauseText.style.display = 'none';
           isPause = false;
           return
       }
    }
    pauseText.onclick = async function(event) {
        console.log('isPause ======== ', isPause, gamestate)
        if (!mute && buttonClickSound) {
            buttonClickSound.play();
        }

        if(gamestate === 4 && isPause) { // case click to start when gameOver
             try {
                await showScreenAdv('interstitial');
            } catch (error) {
                //
            }
            newGame();
            setGameState(gamestates.ready)

            pauseText.style.display = 'none';
            isPause = false;
            return
        }

        if (initialized && gamestate !== 0 && currentPage !== 'home' && gamestart) {
            if ((currentPage == 'competitive' || currentPage == 'timer') && competitiveTimerId == -1) {
                // competitiveTimerId = setInterval(() => setTimerScore(), 1000);
            }
            pauseText.style.display = 'none';
            isPause = false;
        }
    }

    // Leaderboards
    leaderboardButton.onclick = function(event) {
        if (!mute && buttonClickSound) {
            buttonClickSound.play();
        }
        getLeaderTable();
        if (!cupTrained) {
            setCookie('cup_trained', true);
            cupTrained = true;
        }
        popupLeaderboard.style.display = 'flex';
        tableContainer.style.display = 'flex';
    }
    closeLeaderboardButton.onclick = function(event) {
        popupLeaderboard.style.display = 'none';
        if (!mute && buttonClickSound) {
            buttonClickSound.play();
        }
    }
    function getLeaderTable() {
        // var entries = [
        //     {
        //         "extraData": "",
        //         "score": 68050,
        //         "rank": 1,
        //         "player": {
        //             "uniqueID": "1MUydx0v4Qw+y7k5/KfROMKCulFopxl/maorqWzZXFs=",
        //             "lang": "ru",
        //             "publicName": "ALEKSANDR E.",
        //             "avatarIdHash": "QFGVRG2A3SELX76MSMCUAROEEQ4TOVSFCPOTXBGO5HIY4MZAILF3H46V4FXCMN2FAC32KOHRIHW4IINCUSQYFPMNZQ3VKL24Y3UVON4JPROWUZZQDGSYUFEU7USDXZOXXD7Q452WVK3NFI7PRCNA====",
        //             "scopePermissions": {
        //                 "avatar": "allow",
        //                 "public_name": "allow"
        //             },
        //             "subscriptions": {},
        //             "hasPremium": false
        //         },
        //         "formattedScore": "68050"
        //     },
        //     {
        //         "extraData": "",
        //         "score": 42880,
        //         "rank": 2,
        //         "player": {
        //             "uniqueID": "1wJM3jPOTfWEnVfsT7v1TcvIJe7fnCutwxL+/5QIj0c=",
        //             "lang": "ru",
        //             "publicName": "",
        //             "avatarIdHash": "0",
        //             "scopePermissions": {
        //                 "avatar": "forbid",
        //                 "public_name": "forbid"
        //             },
        //             "hasPremium": false
        //         },
        //         "formattedScore": "42880"
        //     },
        //     {
        //         "extraData": "",
        //         "score": 42065,
        //         "rank": 3,
        //         "player": {
        //             "uniqueID": "jSwayttTOc7eZldJkzucq1N9VLWjAwu4piaqTnaaJ3c=",
        //             "lang": "ru",
        //             "publicName": "Сергей Лопухов",
        //             "avatarIdHash": "0",
        //             "scopePermissions": {
        //                 "avatar": "allow",
        //                 "public_name": "allow"
        //             },
        //             "hasPremium": false
        //         },
        //         "formattedScore": "42065"
        //     },
        //     {
        //         "extraData": "",
        //         "score": 41962,
        //         "rank": 4,
        //         "player": {
        //             "uniqueID": "EMJb10kKU5GAMvD1QLVu29rQUHUfUStAphR/bwCeLr8=",
        //             "lang": "ru",
        //             "publicName": "Галина Р.",
        //             "avatarIdHash": "0",
        //             "scopePermissions": {
        //                 "avatar": "allow",
        //                 "public_name": "allow"
        //             },
        //             "hasPremium": false
        //         },
        //         "formattedScore": "41962"
        //     },
        //     {
        //         "extraData": "",
        //         "score": 41925,
        //         "rank": 5,
        //         "player": {
        //             "uniqueID": "FDE/JKPQQes2gISE3Z5A3bCzSFalQ7wcr5czcV48SLM=",
        //             "lang": "ru",
        //             "publicName": "компания С.",
        //             "avatarIdHash": "0",
        //             "scopePermissions": {
        //                 "avatar": "allow",
        //                 "public_name": "allow"
        //             },
        //             "hasPremium": false
        //         },
        //         "formattedScore": "41925"
        //     },
        //     {
        //         "extraData": "",
        //         "score": 41924,
        //         "rank": 6,
        //         "player": {
        //             "uniqueID": "FDE/JKPQQes2gISE3Z5A3bCzSFalQ7wcr5czcV48SLM=",
        //             "lang": "ru",
        //             "publicName": "компания С.",
        //             "avatarIdHash": "0",
        //             "scopePermissions": {
        //                 "avatar": "allow",
        //                 "public_name": "allow"
        //             },
        //             "hasPremium": false
        //         },
        //         "formattedScore": "41924"
        //     },
        //     {
        //         "extraData": "",
        //         "score": 41923,
        //         "rank": 7,
        //         "player": {
        //             "uniqueID": "FDE/JKPQQes2gISE3Z5A3bCzSFalQ7wcr5czcV48SLM=",
        //             "lang": "ru",
        //             "publicName": "компания С.",
        //             "avatarIdHash": "0",
        //             "scopePermissions": {
        //                 "avatar": "allow",
        //                 "public_name": "allow"
        //             },
        //             "hasPremium": false
        //         },
        //         "formattedScore": "41923"
        //     },
        //     {
        //         "extraData": "",
        //         "score": 41922,
        //         "rank": 8,
        //         "player": {
        //             "uniqueID": "FDE/JKPQQes2gISE3Z5A3bCzSFalQ7wcr5czcV48SLM=",
        //             "lang": "ru",
        //             "publicName": "компания С.",
        //             "avatarIdHash": "0",
        //             "scopePermissions": {
        //                 "avatar": "allow",
        //                 "public_name": "allow"
        //             },
        //             "hasPremium": false
        //         },
        //         "formattedScore": "41922"
        //     },
        //     {
        //         "extraData": "",
        //         "score": 41921,
        //         "rank": 9,
        //         "player": {
        //             "uniqueID": "FDE/JKPQQes2gISE3Z5A3bCzSFalQ7wcr5czcV48SLM=",
        //             "lang": "ru",
        //             "publicName": "компания С.",
        //             "avatarIdHash": "0",
        //             "scopePermissions": {
        //                 "avatar": "allow",
        //                 "public_name": "allow"
        //             },
        //             "hasPremium": false
        //         },
        //         "formattedScore": "41921"
        //     },
        //     {
        //         "extraData": "",
        //         "score": 41920,
        //         "rank": 10,
        //         "player": {
        //             "uniqueID": "FDE/JKPQQes2gISE3Z5A3bCzSFalQ7wcr5czcV48SLM=",
        //             "lang": "ru",
        //             "publicName": "компания С.",
        //             "avatarIdHash": "0",
        //             "scopePermissions": {
        //                 "avatar": "allow",
        //                 "public_name": "allow"
        //             },
        //             "hasPremium": false
        //         },
        //         "formattedScore": "41920"
        //     },
        //     {
        //         "extraData": "",
        //         "score": 41919,
        //         "rank": 11,
        //         "player": {
        //             "uniqueID": "FDE/JKPQQes2gISE3Z5A3bCzSFalQ7wcr5czcV48SLM=",
        //             "lang": "ru",
        //             "publicName": "компания С.",
        //             "avatarIdHash": "0",
        //             "scopePermissions": {
        //                 "avatar": "allow",
        //                 "public_name": "allow"
        //             },
        //             "hasPremium": false
        //         },
        //         "formattedScore": "41919"
        //     }
        // ]

        // var userRank = -1;
        // leaderTable.innerHTML = '';

        // for (let elem of entries) {
        //     let e = document.createElement('tr');
        //     if (userRank == elem.rank) {
        //         e.className = 'its-you';
        //     }
        //     e.innerHTML = '<td><span>' + elem.rank + '</span></td><td class="middle-cell"><span>' + elem.player.publicName + '</span></td><td><span>' + elem.score + '</span></td>'
        //     leaderTable.appendChild(e);
        // }

        // tableBoxLoader.style.display = 'flex'
        // tableBoxNoData.style.display = 'none'
        // leaderTable.style.display = 'none'

        // setTimeout(() => {
        //     tableBoxLoader.style.display = 'none'
        //     tableBoxNoData.style.display = 'flex'
        //     leaderTable.style.display = 'none'
        // }, 2000)

        // setTimeout(() => { // has data
        //     tableBoxLoader.style.display = 'none'
        //     tableBoxNoData.style.display = 'none'
        //     leaderTable.style.display = 'block'
        // }, 5000)
        // return

        tableBoxLoader.style.display = 'flex'
        tableBoxNoData.style.display = 'none'
        leaderTable.style.display = 'none'

        if (lbY && playerY) {
            lbY.getLeaderboardEntries('GlobalLeaderboard', {     
                includeUser: false,
                quantityAround: 0,
                quantityTop: 20, 
            })
            .then((res) => {
                console.log('resssss ', res)
                if(!res.entries || res.entries.length === 0) {
                    tableBoxLoader.style.display = 'none'
                    tableBoxNoData.style.display = 'flex'
                    leaderTable.style.display = 'none'

                    return
                }

                tableBoxLoader.style.display = 'none'
                tableBoxNoData.style.display = 'none'
                leaderTable.style.display = 'block'

                let userRank = res.userRank;
                leaderTable.innerHTML = '';
                for (let elem of res.entries) {
                    let e = document.createElement('tr');
                    if (userRank == elem.rank) {
                        e.className = 'its-you';
                    }
                    e.innerHTML = '<td><span>' + elem.rank + '</span></td><td class="middle-cell"><span>' + elem.player.publicName + '</span></td><td><span>' + elem.score + '</span></td>'
                    leaderTable.appendChild(e);
                }
            })
            .catch((ex ) => {
                console.log('exxxx ', ex)
                tableBoxLoader.style.display = 'none'
                tableBoxNoData.style.display = 'flex'
                leaderTable.style.display = 'none'
            });
        } else {
            tableBoxLoader.style.display = 'none'
            tableBoxNoData.style.display = 'flex'
            leaderTable.style.display = 'none'
        }
    }
};