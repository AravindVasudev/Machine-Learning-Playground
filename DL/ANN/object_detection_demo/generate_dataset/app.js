window.addEventListener('load', () => {
    const display  = document.querySelector('#display');
    const canvas   = document.querySelector('#canvas');
    const ctx      = canvas.getContext('2d');
    const startBtn = document.querySelector('#start');
    const stopBtn  = document.querySelector('#stop');
    const HEIGHT   = 100;
    const WIDTH    = 100;

    let dataset = [];
    let intervalLoop;

    navigator.getUserMedia({video: { width: WIDTH, height: HEIGHT }},
        stream => display.srcObject = stream,
        err => alert('Something went terribly wrong! :('));


    startBtn.addEventListener('click', () => {
        intervalLoop = setInterval(() => {
            ctx.drawImage(display, 0, 0, WIDTH, HEIGHT);
            let image      = ctx.getImageData(0, 0, WIDTH, HEIGHT);
            let grayscaled = grayscale(image);
    
            let gray = channelToArray(grayscaled, 0);
            dataset.push(gray);
            console.log(gray);

            ctx.putImageData(grayscaled, 0, 0);
        }, 1000 / 30);
    });

    stopBtn.addEventListener('click', () => {
        clearInterval(intervalLoop);

        // dataset.splice(0, 30);
        arrayToCSV(dataset);
    });
});

function grayscale(image) {
    let pixels = image.data;
    for (let i = 0; i < pixels.length; i += 4) {
      pixels[i] = pixels[i + 1] = pixels[i + 2] = 0.2126 * pixels[i] + 0.7152 * pixels[i + 1] + 0.0722 * pixels[i + 2];
    }

    return image;
}

function channelToArray(image, channelID) {
    let pixels = image.data;
    let channel = [];

    for (let i = 0; i < pixels.length; i += 4) {
        channel.push(pixels[i + channelID]);
    }

    return channel;
}

function arrayToCSV(arr) {
    let csvContent = 'data:text/csv;charset=utf-8,';
    arr.forEach(row => {
        csvContent += row.join(',') + '\r\n';
    });

    let URI  = encodeURI(csvContent);
    let link = document.createElement('a');
    link.setAttribute('href', URI);
    link.setAttribute('download', 'dataset.csv');
    document.body.appendChild(link);
    link.click();
}