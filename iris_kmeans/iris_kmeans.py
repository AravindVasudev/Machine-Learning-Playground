import numpy as np
from matplotlib import pyplot as plt, patches as mpatches
from sklearn.datasets import load_iris
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from sklearn.preprocessing import MinMaxScaler

# Load the dataset
iris = load_iris()
X    = iris.data

# Rescaling the dataset
X = MinMaxScaler().fit_transform(X)

# Getting the Principle components
P = PCA(n_components=3).fit_transform(X)

# Create the classifier
kmeans = KMeans(n_clusters=3, random_state=42)

# Fit the classifier
kmeans.fit(P)

# Visualization
color = ['r', 'g', 'b']
for i, r in enumerate(P):
    plt.scatter(r[0], r[1], c=color[kmeans.labels_[i]])

plt.xlabel('1st eigenvector')
plt.ylabel('2nd eigenvector')


plt.axis('equal')
plt.savefig('plot.png')
plt.show()
