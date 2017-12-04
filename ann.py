import numpy as np

class NeuralNetwork():
    def __init__(self):
        # seeding numpy
        np.random.seed(42)

        # Init random weights with values in the range -1 to 1 and mean 0
        self.synaptic_weights = 2 * np.random.random((3, 1)) - 1

    # activation function
    def __sigmoid(self, X):
        return 1 / (1 + np.exp(-X))

    # gradient of the sigmoid curve
    def __sigmoid_derivative(self, X):
        return X * (1 - X)

    def fit(self, X, y, epochs):
        for _ in range(epochs):
            # pass training data into the network
            output = self.__predict(X)

            # calculate the error
            error = y - output

            # calculate adjustment
            adjustment = np.dot(X.T, error * self.__sigmoid_derivative(output))

            # update the weights
            self.synaptic_weights += adjustment


    def __predict(self, X):
        return self.__sigmoid(np.dot(X, self.synaptic_weights))

    def predict(self, X):
        return 1 if self.__predict(X) > 0.5 else 0


if __name__ == '__main__':
    # init single neuron Neural Network
    neural_network = NeuralNetwork()

    print('Random Initial Weights:')
    print(neural_network.synaptic_weights)

    # training set
    X = np.array([[0, 0, 1],
                  [1, 1, 1],
                  [1, 0, 1],
                  [0, 1, 1]])

    y = np.array([[0, 1, 1, 0]]).T

    # train the network
    neural_network.fit(X, y, 10000)

    print('Weights after training:')
    print(neural_network.synaptic_weights)

    # test the network
    print('Predicting:')
    print('[1, 0, 0] =>', neural_network.predict(np.array([1, 0, 0])))
    print('[0, 0, 0] =>', neural_network.predict(np.array([0, 0, 0])))
