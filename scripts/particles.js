class Particle {
    constructor(x, y, size, color) {
        this.x = x
        this.y = y
        this.size = size
        this.color = color
        this.speedX = Math.random() * 2 - 1
        this.speedY = Math.random() * 2 - 1
    }

    update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.size > 0.2) this.size -= 0.1
    }

    draw(context) {
        context.fillStyle = this.color
        context.strokeStyle = this.color
        context.lineWidth = 2

        context.beginPath()
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        context.fill()
        context.stroke()
        context.closePath()
    }
}