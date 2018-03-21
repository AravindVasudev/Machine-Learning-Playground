window.addEventListener('load', () => {
    const display  = document.querySelector('#display');
    const canvas   = document.querySelector('#canvas');
    const ctx      = canvas.getContext('2d');
    const model    = initModel();
    const HEIGHT   = 100;
    const WIDTH    = 100;

    navigator.getUserMedia({video: { width: WIDTH, height: HEIGHT }},
        stream => display.srcObject = stream,
        err => alert('Something went terribly wrong! :('));

    setInterval(() => {
        ctx.drawImage(display, 0, 0, WIDTH, HEIGHT);
        let image = ctx.getImageData(0, 0, WIDTH, HEIGHT);

        console.log(predict(model, image));
    }, 1000 / 30);
});

function initModel() {
    const net = new brain.NeuralNetwork({
        activation: 'sigmoid',
        hiddenLayers: [1000, 100],
        learningRate: 0.6
    });

    const model = loadModel(net);
    return model;
}

function loadModel(net) {
    fetch('../model.json')
        .then(res => res.json())
        .then(json => net.fromJSON(json));

    return net;
}

function predict(net, image) {
    const input = channelToArray(grayscale(image), 0);
    return (net.run(input) >= 0.5) ? "No Obstacle" : "Obstacle";
}

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