from prettytable import PrettyTable
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import numpy as np
from sklearn.datasets import load_iris
from sklearn.svm import SVC
from sklearn.decomposition import PCA
from sklearn.model_selection import train_test_split
from sklearn.utils import shuffle
from sklearn.metrics import accuracy_score, precision_score, \
                                            recall_score, f1_score

# Load the dataset
iris = load_iris()
X    = iris.data
y    = iris.target

# Shuffle the dataset before split
X, y = shuffle(X, y, random_state=42)

# PCA
P = PCA(n_components=3).fit_transform(X) # PCA is used only for Visualization here

# Split data into train and test set
X_train, X_test, y_train, y_test = train_test_split(X, y, \
                                                test_size=0.4, random_state=42)

# Create the classifier
clf = SVC()

# Fit the classifier
clf.fit(X_train, y_train)

# Evaluation
y_pred = clf.predict(X_test)

accuracyScore  = accuracy_score(y_test, y_pred)
precisionScore = precision_score(y_test, y_pred, average='weighted')
recallScore    = recall_score(y_test, y_pred, average='weighted')
f1Score        = f1_score(y_test, y_pred, average='weighted')

# Visualization
y_pred_full = clf.predict(X)
for i, r in enumerate(P):
    color = ''
    if y_pred_full[i] != y[i]:
        color = 'k'
    elif y[i] == 0:
        color = 'b'
    elif y[i] == 1:
        color = 'g'
    elif y[i] == 2:
        color = 'r'

    plt.scatter(r[0], r[1], c=color)

plt.xlabel('1st eigenvector')
plt.ylabel('2nd eigenvector')

blue_patch  = mpatches.Patch(color='blue', label='I. setosa')
red_patch   = mpatches.Patch(color='red', label='I. versicolor')
green_patch = mpatches.Patch(color='green', label='I. virginica')
black_patch = mpatches.Patch(color='black', label='Misclassfied')
plt.legend(handles=[blue_patch, red_patch, green_patch, black_patch])

plt.axis('equal')
plt.show()

# Print the Evaluation metrics
table = PrettyTable(['Metric', 'Value'])
table.add_row(['Accuracy Score', accuracyScore])
table.add_row(['Precision Score', precisionScore])
table.add_row(['Recall Score', recallScore])
table.add_row(['F1 Score', f1Score])
table.align['Metric'] = 'r'

print(table)
