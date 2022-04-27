from bs4 import BeautifulSoup


'''
Parses pascal formatted xml file to pull out width, height, and x/y variables

Returns tuple with width, height, and then a list of lists of all the
xmin,ymin,xmax,ymax for each box that is present
'''
def parseXML(filepath):
    infile = open(filepath,'r')
    content = infile.read()
    soup = BeautifulSoup(content,'xml')
    width = int(soup.find('width').text)
    height = int(soup.find('height').text)
    xmins = soup.findAll('xmin')
    ymins = soup.findAll('ymin')
    xmax = soup.findAll('xmax')
    ymax = soup.findAll('ymax')
    boxes = []
    for i in range(len(xmins)):
        box = []
        box.append(int(xmins[i].contents[0]))
        box.append(int(ymins[i].contents[0]))
        box.append(int(xmax[i].contents[0]))
        box.append(int(ymax[i].contents[0]))
        boxes.append(box)

    return width, height, boxes


'''
converts tuple provided by parseXML() to list of yolo formatted
returns list of box objects in the format of x,y,width,height in 
the format of proportion of total image width/height
'''
def convert_coord(pascal):
    width = pascal[0]
    height = pascal[1]
    
    list_boxes = pascal[2]

    yolo = []

    for i in range(len(list_boxes)):
        yolo_box = []
        
        xmin = list_boxes[i][0]
        ymin = list_boxes[i][1]
        xmax = list_boxes[i][2]
        ymax = list_boxes[i][3]

        yolo_x = ((xmax-xmin)/2 + xmin)/width
        yolo_y = ((ymax-ymin)/2 + ymin)/height

        yolo_width = round((xmax-xmin)/width,6)
        yolo_height = round((ymax-ymin)/height,6)

        yolo_box.append(format(yolo_x,'.6f'))
        yolo_box.append(format(yolo_y,'.6f'))
        yolo_box.append(format(yolo_width,'.6f'))
        yolo_box.append(format(yolo_height,'.6f'))

        yolo.append(yolo_box)

    return yolo   

'''
Converts list of format provided from convert_coord to single string
'''
def convert_yolo_list(yolo_box):
    yolo_complete = ""
    for i in range(len(yolo_box)):    
        curr_box = yolo_box[i]
        yolo_str = "0 "
        for i in range(len(curr_box)):
            yolo_str += curr_box[i]
            yolo_str += " "
        
        yolo_str = yolo_str[:-1]
        yolo_str += "\n"
        yolo_complete += yolo_str

    return yolo_complete

