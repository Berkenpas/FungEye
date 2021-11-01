import os
import cv2
import numpy as np 
from tqdm import tqdm
import matplotlib.pyplot as plt
import torch 
import torch.nn as nn
import torch.optim as optim
import torch.nn 
import torch.nn.functional as F 


# flag to rebuild/construct/train data
REBUILD_DATA = True

class Mush1VsMush2():
    IMG_SIZE = 50
    # directory 
    AmanitaMuscaria = "D:/Mushgroup/train/AmanitaMuscaria"
    AmanitaPantherina = "D:/Mushgroup/train/AmanitaPantherina"
    AmanitaPhalloides = "D:/Mushgroup/train/AmanitaPhalloides"
    AmanitaVirosa = "D:/Mushgroup/train/AmanitaVirosa"
    Conocybe = "D:/Mushgroup/train/Conocybe"
    CoprinopsisAtramentaria = "D:/Mushgroup/train/CoprinopsisAtramentaria"
    CortinariusViolaceus = "D:/Mushgroup/train/CortinariusViolaceus"
    GalerinaMarginata = "D:/Mushgroup/train/GalerinaMarginata"
    GyromitraEsculenta = "D:/Mushgroup/train/GyromitraEsculenta"
    HelvellaVespertina = "D:/Mushgroup/train/HelvellaVespertina"
    LaetiporusConifericola = "D:/Mushgroup/train/LaetiporusConifericola"
    PanaeolinaFoenisecii = "D:/Mushgroup/train/PanaeolinaFoenisecii"
    PaxillusInvolutus = "D:/Mushgroup/train/PaxillusInvolutus"
    PsilocybeCyanescens = "D:/Mushgroup/train/PsilocybeCyanescens"
    TurbinellusFloccosus = "D:/Mushgroup/train/TurbinellusFloccosus"
    
    LABELS = { AmanitaMuscaria: 0, 
               AmanitaPantherina: 1,
               AmanitaPhalloides: 2,
               AmanitaVirosa: 3,
               Conocybe: 4,
               CoprinopsisAtramentaria: 5,
               CortinariusViolaceus: 6,
               GalerinaMarginata: 7,
               GyromitraEsculenta: 8,
               HelvellaVespertina: 9,
               LaetiporusConifericola: 10,
               PanaeolinaFoenisecii: 11,
               PaxillusInvolutus: 12,
               PsilocybeCyanescens: 13,
               TurbinellusFloccosus: 14
               }

    training_data = []
    
    # useful for determining "balance"
    AmanitaMuscariaCount = 0
    AmanitaPantherinaCount = 0
    AmanitaPhalloidesCount = 0
    AmanitaVirosaCount = 0
    ConocybeCount = 0
    CoprinopsisAtramentariaCount = 0
    CortinariusViolaceusCount = 0
    GalerinaMarginataCount = 0
    GyromitraEsculentaCount = 0
    HelvellaVespertinaCount = 0
    LaetiporusConifericolaCount = 0
    PanaeolinaFoeniseciiCount = 0
    PaxillusInvolutusCount = 0
    PsilocybeCyanescensCount = 0
    TurbinellusFloccosusCount = 0

    def make_training_data(self):
        # iterate over the Keys AMANITAMUSCARIA/CortinariusViolaceus which are directories
        for label in self.LABELS:
            print("Next is print(label)")
            print(label)
            # iterate over all the images in each directory
            # tqdm is a progress bar to tell how far along you are
            for f in tqdm(os.listdir(label)):
                try:
                    # f is just fileName, we will join that with the label (which is directory)
                    path = os.path.join(label, f)
                    # go to image location, and convert said image to GRAY_SCALE
                    # Grayscale is not required, but color will add an additional "channel"
                    # this added data is not necessary, and so grayscale may be useful for optimization/speed
                    img = cv2.imread(path, cv2.IMREAD_GRAYSCALE)
                    # resize image (all inputs must be a standard IMG_SIZE)
                    img = cv2.resize(img, (self.IMG_SIZE, self.IMG_SIZE))
                    # this will append the image and which mushroom (index)
                    self.training_data.append([np.array(img), np.eye(15)[self.LABELS[label]]])

                    # determine the balance of dataset (if imbalanced, the NN will learn to always guess that class first and may never overcome/optimize)
                    if label == self.AmanitaMuscaria:
                        self.AmanitaMuscariaCount += 1
                    if label == self.AmanitaPantherina:
                        self.AmanitaPantherinaCount += 1
                    if label == self.AmanitaPhalloides:
                        self.AmanitaPhalloidesCount += 1
                    if label == self.AmanitaVirosa:
                        self.AmanitaVirosaCount += 1
                    if label == self.Conocybe:
                        self.ConocybeCount += 1
                    if label == self.CoprinopsisAtramentaria:
                        self.CoprinopsisAtramentariaCount += 1
                    if label == self.CortinariusViolaceus:
                        self.CortinariusViolaceusCount += 1
                    if label == self.GalerinaMarginata:
                        self.GalerinaMarginataCount += 1
                    if label == self.GyromitraEsculenta:
                        self.GyromitraEsculentaCount += 1
                    if label == self.HelvellaVespertina:
                        self.HelvellaVespertinaCount += 1
                    if label == self.LaetiporusConifericola:
                        self.LaetiporusConifericolaCount += 1
                    if label == self.PanaeolinaFoenisecii:
                        self.PanaeolinaFoeniseciiCount += 1
                    if label == PaxillusInvolutus:
                        self.PaxillusInvolutusCount += 1
                    if label == PsilocybeCyanescens:
                        self.PsilocybeCyanescensCount += 1
                    if label == TurbinellusFloccosus:
                        self.TurbinellusFloccosusCount += 1
                    
                except Exception as e:
                    # if image is no good or corrupt/empty
                    # print(str(e))
                    pass

        # shuffle the training data
        np.random.shuffle(self.training_data)
        np.save("new_training_data.npy", self.training_data)
#        print("Just loadded training_data. Next is print amanCount and cortCount")
#        print("AmanitaMuscaria: ", self.AmanitaMuscariaCount)
#        print("AmanitaPantherina: ", self.AmanitaPantherinaCount)
#        print("AmanitaPhalloides: ", self.AmanitaPhalloidesCount)
#        print("CortinariusViolaceus: ", self.CortinariusViolaceusCount)




if REBUILD_DATA:
    amanVsCort = Mush1VsMush2()
    amanVsCort.make_training_data()

# some times you may have to add  " allow_pickle=True "  sometimes not
training_data = np.load("new_training_data.npy", allow_pickle=True)

# # print the first item (0) in the second folder (1) which is a dog
# # cmap attempts to color change
#plt.imshow(training_data[1][0], cmap="gray")

# plt.imshow(training_data[1][0], cmap="gray")
# plt.show()


class Net(nn.Module):
    def __init__(self):
        super().__init__()
        # creating a 2d Convolutional Neural Network
        # input is 1, output is 32 features, kernel size is 5x5
        self.conv1 = nn.Conv2d(1, 32, 5)
        # input is 32 (from previous layer) output 64
        self.conv2 = nn.Conv2d(32, 64, 5)
        # input is 54 (from previous layer) output is 128
        self.conv3 = nn.Conv2d(64, 128, 5)
        
        # images from tensor will be a 1 by 50 by 50
        # -1 specifies take input of any size
        x = torch.randn(50,50).view(-1,1,50,50)
        self._to_linear = None
        self.convs(x)        
        #self._to_linear is to flatten
        self.fc1 = nn.Linear(self._to_linear, 512)
        self.fc2 = nn.Linear(512, 15)
    def convs(self, x):
        # max pooling over 2x2
        x = F.max_pool2d(F.relu(self.conv1(x)), (2,2))
        x = F.max_pool2d(F.relu(self.conv2(x)), (2,2))
        x = F.max_pool2d(F.relu(self.conv3(x)), (2,2))

        if self._to_linear is None:
            # x is a "batch of data"
            self._to_linear = x[0].shape[0]*x[0].shape[1]*x[0].shape[2]
        return x

    def forward(self, x):
        # pass through convnet layer
        x = self.convs(x)
        # reshape to be flattened
        x = x.view(-1, self._to_linear)
        # pass through linear regression layer
        x = F.relu(self.fc1(x))
        x = self.fc2(x)
        # .softmax() is an activation function
        return F.softmax(x, dim=1)

net = Net()

optimizer = optim.Adam(net.parameters(), lr=0.1)
# Mean Squared Error
loss_function = nn.MSELoss()

# reshape just the X values
x = torch.Tensor([i[0] for i in training_data]).view(-1, 50, 50)
# pixel values are between 0 and 255
# by dividing by 255, we will get between 0 and 1
x = x/255.0
y = torch.Tensor([i[1] for i in training_data])

# reserve 10% of data for validation/testing
VAL_PCT = 0.1
val_size = int(len(x)*VAL_PCT)
# print(val_size)

train_x = x[:-val_size]
train_y = y[:-val_size]

test_x = x[-val_size:]
test_y = y[-val_size:]

BATCH_SIZE = 100
EPOCHS = 1

for epoch in range(EPOCHS):
    # from 0 to length of size of X, take steps the size of BATCH_SIZE
    for i in tqdm(range(0, len(train_x), BATCH_SIZE)):
        batch_x = train_x[i:i+BATCH_SIZE].view(-1, 1, 50, 50)
        batch_y = train_y[i:i+BATCH_SIZE]
        # set gradient to 0
        net.zero_grad
        outputs = net(batch_x)
        # calculate loss
        loss = loss_function(outputs, batch_y)
        # do backwards propogation on loss
        loss.backward()
        optimizer.step()
print("Next is print(loss)")
print(loss)

correct = 0
total = 0
# no gradient for testing
with torch.no_grad():
    for i in tqdm(range(len(test_x))):
        real_class = torch.argmax(test_y[i])
        net_out = net(test_x[i].view(-1,1,50,50))[0]
        predicted_class = torch.argmax(net_out)
        if predicted_class == real_class:
            correct += 1
        total += 1
print("Next is print Accuracy")
print("Accuracy: ", round(correct/total,3))