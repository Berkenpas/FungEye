#!/usr/bin/env python
# coding: utf-8

# Dec. 6
# Dr.CAO
# This is the template code to explore generating NFTs from the basics 

# In[1]:

#pip install pillow
from PIL import Image 
from IPython.display import display 
import random
import json
import subprocess
import os


# In[2]:


#   im1 = Image.open(f'./trait-layers/Back/{background_files[item["Background"]]}.png').convert('RGBA')
#   im2 = Image.open(f'./trait-layers/Accessories/{accessories_files[item["Accessories"]]}.png').convert('RGBA')
#   im3 = Image.open(f'./trait-layers/Stems/{stem_files[item["Stems"]]}.png').convert('RGBA')
#   im4 = Image.open(f'./trait-layers/Tops/{top_files[item["Tops"]]}.png').convert('RGBA')


# Each image is made up a series of traits
# The weightings for each trait drive the rarity and add up to 100%

backgroundNames = os.listdir('./trait-layers/Back/')
background = [name[:-4] for name in backgroundNames]
weight = 100/len(background)
background_weights = [weight for name in background]

accessoriesNames = os.listdir('./trait-layers/Accessories/')
accessories = [name[:-4] for name in accessoriesNames]
weight = 100/len(background)
accessories_weights = [weight for name in accessories]

stemNames = os.listdir('./trait-layers/Stems/')
stems = [name[:-4] for name in stemNames]
weight = 100/len(background)
stems_weights = [weight for name in stems]

topNames = os.listdir('./trait-layers/Tops/')
tops = [name[:-4] for name in topNames]
weight = 100/len(background)
tops_weights = [weight for name in tops]

# Dictionary variable for each trait. 
# Eech trait corresponds to its file name


# In[3]:


## Generate Traits

TOTAL_IMAGES = 300 # Number of random unique images we want to generate
random.seed(69696969696969)

all_images = [] 

# A recursive function to generate unique image combinations
def create_new_image():
    
    new_image = {} #

    # For each trait category, select a random trait based on the weightings 
    new_image ["Background"] = random.choices(background, background_weights)[0]
    new_image ["Accessories"] = random.choices(accessories, accessories_weights)[0]
    new_image ["Stems"] = random.choices(stems, stems_weights)[0]
    new_image ["Tops"] = random.choices(tops, tops_weights)[0]
    
    if new_image in all_images:
        return create_new_image()
    else:
        return new_image
    
    
# Generate the unique combinations based on trait weightings
for i in range(TOTAL_IMAGES): 
    
    new_trait_image = create_new_image()
    
    all_images.append(new_trait_image)
    


# In[4]:


# Returns true if all images are unique
def all_images_unique(all_images):
    seen = list()
    return not any(i in seen or seen.append(i) for i in all_images)

print("Are all images unique?", all_images_unique(all_images))


# In[5]:


# Add token Id to each image
i = 0
for item in all_images:
    item["tokenId"] = i
    i = i + 1


# In[6]:


print(all_images)


# In[7]:


# Get Trait Counts

background_count = {}
for item in background:
    background_count[item] = 0
    
accessories_count = {}
for item in accessories:
    accessories_count[item] = 0

stems_count = {}
for item in stems:
    stems_count[item] = 0

tops_count = {}
for item in tops:
    tops_count[item] = 0

for image in all_images:
    background_count[image["Background"]] += 1
    accessories_count[image["Accessories"]] += 1
    stems_count[image["Stems"]] += 1
    tops_count[image["Tops"]] += 1
    
print(background_count)
print(accessories_count)
print(stems_count)
print(tops_count)


# In[8]:


#### Generate Metadata for all Traits 
METADATA_FILE_NAME = './metadata/all-traits.json';
with open(METADATA_FILE_NAME, 'w') as outfile:
    json.dump(all_images, outfile, indent=4)


# In[9]:



  
#### Generate Images    
if not os.path.isdir("./imagesSmall"):
    os.makedirs("./imagesSmall")
    print("created folder : ", "./imagesSmall")

else:
    print("./imagesSmall", "folder already exists.")

if not os.path.isdir("./results"):
    os.makedirs("./results")
    print("created folder : ", "./results")

else:
    print("./results", "folder already exists.")

for item in all_images:

  im1 = Image.open(f'./trait-layers/Back/{item["Background"]}.png').convert('RGBA')
  im2 = Image.open(f'./trait-layers/Accessories/{item["Accessories"]}.png').convert('RGBA')
  im3 = Image.open(f'./trait-layers/Stems/{item["Stems"]}.png').convert('RGBA')
  im4 = Image.open(f'./trait-layers/Tops/{item["Tops"]}.png').convert('RGBA')

  #Create each composite
  com1 = Image.alpha_composite(im1, im3)
  com2 = Image.alpha_composite(com1, im4)
  com3 = Image.alpha_composite(com2, im2)

  #Convert to RGB
  rgb_im = com3.convert('RGB')
  file_name = str(item["tokenId"]) + ".png"

  rgb_im.save("./imagesSmall/" + file_name)

  subprocess.run(["magick", os.path.join("./imagesSmall",file_name), "-filter", "point", "-resize", "3000%", os.path.join("./results",file_name)])
  
  
  


# In[10]:


#### Generate Metadata for each Image    

f = open('./metadata/all-traits.json',) 
data = json.load(f)


IMAGES_BASE_URI = "ADD_IMAGES_BASE_URI_HERE"
PROJECT_NAME = "ADD_PROJECT_NAME_HERE"

def getAttribute(key, value):
    return {
        "trait_type": key,
        "value": value
    }
for i in data:
    token_id = i['tokenId']
    token = {
        "image": IMAGES_BASE_URI + str(token_id) + '.png',
        "tokenId": token_id,
        "name": PROJECT_NAME + ' ' + str(token_id),
        "attributes": []
    }
    token["attributes"].append(getAttribute("Background", i["Background"]))
    token["attributes"].append(getAttribute("Accessories", i["Accessories"]))
    token["attributes"].append(getAttribute("Stems", i["Stems"]))
    token["attributes"].append(getAttribute("Tops", i["Tops"]))

    with open('./metadata/' + str(token_id), 'w') as outfile:
        json.dump(token, outfile, indent=4)
f.close()


# In[ ]:





