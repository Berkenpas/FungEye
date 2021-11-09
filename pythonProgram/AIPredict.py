from imageai.Prediction.Custom import CustomImagePrediction
import os
import sys
if( (len(sys.argv) > 1)):
    execution_path = os.getcwd()

    prediction = CustomImagePrediction()
    prediction.setModelTypeAsResNet()
    # prediction.setModelPath(os.path.join(execution_path, "model_ex-055_acc-0.748698.h5"))
    # prediction.setJsonPath(os.path.join(execution_path, "model_class.json"))
    prediction.setModelPath(os.path.join("/var/www/html/MushAI/system/pythonProgram/model_ex-055_acc-0.748698.h5"))
    prediction.setJsonPath(os.path.join("/var/www/html/MushAI/system/pythonProgram/model_class.json"))
    prediction.loadModel(num_objects=15)

    location = '/var/www/html/MushAI/uploads/' + sys.argv[1]

    predictions, probabilities = prediction.predictImage(os.path.join(execution_path, location), result_count=5)
    for eachPrediction, eachProbability in zip(predictions, probabilities):
        if(float(eachProbability) > 80):
            print("<li class=\"list-group-item list-group-item-success\">")
            print(eachPrediction , " : " , round(float(eachProbability),2), "%")
            continue
        print("<li class=\"list-group-item\">")
        print(eachPrediction , " : " , round(float(eachProbability),2), "%")
        print("</li>")
else:
    print ('need input!')
