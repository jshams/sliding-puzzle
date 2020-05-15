/** Tile class for drawing a numbered tile to the canvas in its position */
class Tile {
    /** 
     * @param { num } int The number on the tile
     * @param { width } int The tile's width in proportion to the canvas
     * @param { x } int The top left x coordinate of the tile. used to draw.
     * @param { y } int the top left y coordinate of the tile, used to draw
     */
    constructor(num, width, x, y) {
        this.num = num
        this.width = width
        this.x = x
        this.y = y
        this.color = 'yellow'
        this.fontsize = Math.floor(this.width / 2.4)
    }

    draw(color = "black") {
        /** draws a tile to the canvas */
        ctx.fillStyle = 'black'
        fillRectBorderRadius(ctx, this.x + 4, this.y + 4, this.width - 8, this.width - 8, Math.floor(this.width / 4), color)
        ctx.fillStyle = '#53FE08'
        ctx.font = `${this.fontsize}px Courier New`
        let leftPad = this.width / 2.5
        if (this.num >= 10) {
            leftPad = this.width / 4
        }
        if (this.num >= 100) {
            leftPad = this.width / 6
        }
        ctx.fillText(this.num.toString(), this.x + leftPad, this.y + this.width / 1.6)
    }


    move(xInc, yInc) {
        /** 
         * moves the tile by incrementing or decrementing the x and y
         * coordinates of the tile then redrawing
         * @param {xInc} int the increase in the x position of the tile
         * @param {yInc} int the increase in the y position of the tile
         */
        ctx.clearRect(this.x, this.y, this.width, this.width)
        // fillRectBorderRadius(ctx, this.x + 3, this.y + 3, this.width, this.width, Math.floor(this.width / 4), "#2B8F11")
        this.x += xInc
        this.y += yInc
        this.draw()
    }
}