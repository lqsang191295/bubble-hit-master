var htmlDivScore = []

function addScore(score, x, y, color) {
    try {
        const divScore = this.spawnHtmlDivScore()

        setStyleDivScore(divScore)
        divScore.style.left = `${x}px`
        divScore.style.top = `${y}px`
        divScore.style.opacity = '1'
        divScore.style.transition = '.3s opacity'
        divScore.style.color = `#fff`
        divScore.style.fontWeight = '700'
        divScore.innerHTML = `+${score}`
        divScore.className = 'stroke-text'

        hideScore(divScore)
    } catch (error) {
        console.log('error ', error)
    }
}

function hideScore(divScore) {
    setTimeout(() => {
        divScore.style.opacity = '0';
    }, 300)
}

function spawnHtmlDivScore() {
    const filter = htmlDivScore.filter(h => {
        return h.style.opacity === '0'
    })

    if(filter && filter.length > 0) {
        return filter[0]
    }

    const body = document.getElementsByTagName("body");
    const divScore = document.createElement("div");

    htmlDivScore.push(divScore)
    body[0].appendChild(divScore)

    return divScore
}

function setStyleDivScore(divScore) {
    if(!divScore) return

    divScore.style.display = 'block';
    divScore.style.position = 'absolute';
}