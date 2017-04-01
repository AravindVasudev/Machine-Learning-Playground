const synaptic = require('synaptic');
const mnist    = require('mnist');
const fs       = require('fs');

// Load 700 training and 20 testing sample
const set = mnist.set(700, 20);
const trainingSet = set.training;
const testSet = set.test;
console.log('dataset loaded.');

// Create a network with 3 layers
// input layer – 784 neurons (28 x 28)
// hidden layer – 100 neurons
// output layer – 10 neurons (0 – 9)
const network = new synaptic.Architect.Perceptron(784, 100, 10);
console.log('network created.');

// Create a trainer for the network
// Learning rate η – 0.2
// Iterations – 20
// Cost Function C – Cross Entropy
console.log('training started');
const trainer = new synaptic.Trainer(network);
trainer.train(trainingSet, {
  rate: .2,
  iterations: 20,
  error: .1,
  shuffle: true,
  log: 1,
  cost: synaptic.Trainer.cost.CROSS_ENTROPY
});

console.log('training done.');

// Save the network
fs.writeFile('network.json', JSON.stringify(network.toJSON()), (err) => {
  if(err) console.log('Cannot write file: ', err);
  else console.log('network saved.');
});

// Test the network
let result = trainer.test(testSet, {
  cost: synaptic.Trainer.cost.CROSS_ENTROPY
});

console.log(result);
