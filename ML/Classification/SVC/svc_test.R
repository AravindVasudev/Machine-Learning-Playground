library(e1071)

# load iris dataset
data(iris)
head(iris)

# split X and y from dataset
X <- subset(iris, select = -Species)
y <- iris$Species

# SVM
model <- svm(X, y)
summary(model)

# test
pred <- predict(model, X)
table(pred, y)
