const brain = require('brain.js');
const fs    = require('fs');

function readCSV(path) {
    let content = fs.readFileSync(path, 'utf8');
    let arr     = [];

    content.split('\n').forEach(line => {
        arr.push(line.split(',').map(n => parseInt(n, 10)));
    });

    return arr;
}

function numToLabel(num) {
    return (num >= 0.5) ? "Obstacle" : "No Obstacle";
}

obstacle   = readCSV('./dataset/obstacle.csv');
noObstacle = readCSV('./dataset/no_obstacle.csv');

const net = new brain.NeuralNetwork({
    activation: 'sigmoid',
    hiddenLayers: [1000, 100],
    learningRate: 0.6
});

model = fs.readFileSync('./model.json', 'utf8');
model = JSON.parse(model);
model = net.fromJSON(model);

console.log(numToLabel(net.run(obstacle[5]))) // 0
console.log(numToLabel(net.run(noObstacle[5]))) // 1
console.log(numToLabel(net.run(obstacle[10]))) // 0
console.log(numToLabel(net.run(noObstacle[10]))) // 1