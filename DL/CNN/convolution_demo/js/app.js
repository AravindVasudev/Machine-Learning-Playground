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
                   -1,  9, -1,
                   -1, -1, -1];

    const green = [ 1,  1,  1,
                    1, .7, -1,
                   -1, -1, -1];

    navigator.getUserMedia({video: true},
        stream => feedVideo.srcObject = stream,
        err => alert('Something went terribly wrong! :('));

    setInterval(() => {
        filteredVideoCtx.drawImage(feedVideo, 0, 0, filteredVideoWidth, filteredVideoHeight);
        let image  = filteredVideoCtx.getImageData(0, 0, filteredVideoWidth, filteredVideoHeight);
        let kernel = edge;

        let filtered = convolve(filteredVideoCtx, threshold(image, 100), kernel);
        filteredVideoCtx.putImageData(filtered, 0, 0); 
    }, 1000 / 30);
});

function threshold(image, threshold) {
  let pixels = image.data;
  for (let i = 0; i < pixels.length; i += 4) {
    let v = (0.2126 * pixels[i] + 0.7152 * pixels[i + 1] + 0.0722 * pixels[i + 2] >= threshold) ? 255 : 0;
    pixels[i] = pixels[i + 1] = pixels[i + 2] = v;
  }

  return image; 
}

function grayscale(image) {
  let pixels = image.data;
  for (let i = 0; i < pixels.length; i += 4) {
    pixels[i] = pixels[i + 1] = pixels[i + 2] = 0.2126 * pixels[i] + 0.7152 * pixels[i + 1] + 0.0722 * pixels[i + 2];
  }

  return image;
}

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