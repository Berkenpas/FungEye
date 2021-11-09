# This program is instructed to find the users image folder and return all the images found in this folder while also surrounding it by html card framework
import os
import sys
from PIL import Image

userName = sys.argv[1];

for filename in os.listdir("/var/www/html/MushAI/uploads/" + userName ):
    print('<div class="card" style="width: 18rem;">')
    print("<img src=\"/MushAI/uploads/" + userName +"/"+ filename + "\" class=\"card-img-top\" >")
    print('</div>')
    print('\n')
