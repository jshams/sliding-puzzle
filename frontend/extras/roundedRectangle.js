function fillRectBorderRadius(ctx, x, y, width, height, borderRadius, color) {
    /**
    * similar to ctx.fillRect with added borderRadius and color choices
    * draws to the canvas a rectangle x amd y starting positions
    * of size width and height, with a rounded border of size borderRadius.
    * color or "fillstyle" can also be customized
    */
    ctx.fillStyle = color
    ctx.beginPath()
    // draw vertical (taller) rectangle
    ctx.rect(x + borderRadius, y, width - 2 * borderRadius, height)
    // draw horizontal (wider) rectangle
    ctx.rect(x, y + borderRadius, width, height - 2 * borderRadius)
    // ctx.arc(left, top, radius, faces right + (0...2)*Math.pi, draw till (0...2)*Math.pi)
    // ctx.fillStyle = 'blue'
    // draw top left circle
    ctx.arc(x + borderRadius, y + borderRadius, borderRadius, Math.PI, 1.5 * Math.PI)
    // ctx.fill()
    // draw top right circle
    ctx.arc(x + width - borderRadius, y + borderRadius, borderRadius, 1.5 * Math.PI, 0)
    // ctx.fill()
    // draw bottom left circle
    ctx.arc(x + borderRadius, y + height - borderRadius, borderRadius, 0.5 * Math.PI, Math.PI)
    // ctx.fill()
    // draw bottom right circle
    ctx.arc(x + width - borderRadius, y + height - borderRadius, borderRadius, 0, 0.5 * Math.PI)
    ctx.fill()
}