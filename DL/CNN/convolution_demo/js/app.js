window.addEventListener('load', () => {
    const feedVideo           = document.querySelector('#feed-video');
    const filteredVideo       = document.getElementById("filtered-video");
    const filteredVideoCtx    = filteredVideo.getContext('2d');
    const filteredVideoHeight = filteredVideo.height;
    const filteredVideoWidth  = filteredVideo.width;

    const blur = [1 / 9, 1 / 9, 1 / 9,
                  1 / 9, 1 / 9, 1 / 9,
                  1 / 9, 1 / 9, 1 / 9];

    const edge = [ -1, -1, -1,
                   -1,  8, -1,
                   -1, -1, -1];

    navigator.getUserMedia({video: true},
        stream => feedVideo.srcObject = stream,
        err => alert('Something went terribly wrong! :('));

    setInterval(() => {
        filteredVideoCtx.drawImage(feedVideo, 0, 0, filteredVideoWidth, filteredVideoHeight);
        filteredVideoCtx.putImageData(convolve(filteredVideoCtx,
          filteredVideoCtx.getImageData(0, 0, filteredVideoWidth, filteredVideoHeight), blur), 0, 0); 
    }, 1000 / 30);
});

function convolve(ctx, pixels, weights) {
    const side     = Math.round(Math.sqrt(weights.length));
    const halfSide = Math.floor(side / 2);
    const src      = pixels.data;
    const w        = pixels.width;
    const h        = pixels.height;

    const output = ctx.createImageData(w, h);
    let dst      = output.data;

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        let dstOff = (y * w + x) * 4;
        let r = 0, g = 0, b = 0, a = 0;

        for (let cy = 0; cy < side; cy++) {
          for (let cx = 0; cx < side; cx++) {
            let scy = y + cy - halfSide;
            let scx = x + cx - halfSide;

            if (scy >= 0 && scy < h && scx >= 0 && scx < w) {
              let srcOff = (scy * w + scx) * 4;
              let wt = weights[cy * side + cx];
              r += src[srcOff] * wt;
              g += src[srcOff + 1] * wt;
              b += src[srcOff + 2] * wt;
              a += src[srcOff + 3] * wt;
            }
          }
        }

        dst[dstOff] = r;
        dst[dstOff + 1] = g;
        dst[dstOff + 2] = b;
        dst[dstOff + 3] = a;
      }
    }

    return output;
} 