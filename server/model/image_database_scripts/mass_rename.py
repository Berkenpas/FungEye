import sys
import os
import shutil

def make_dir(dir):
    if not os.path.isdir(os.path.abspath(dir)):
        # Make out directory if it doesn't exist
        os.mkdir(os.path.abspath(dir))
        print(f"Output directory {dir} not found, so created")
    else:
        print(f"Output directory {dir} found!")

def rename_dir(in_dir, out_dir):
    '''
    Travels to each directory one level lower and:
    - Searches for all image files, checking if they have a corresponding text file (image segmentation labelImg file)
    - Adds them to temporary dictionary
    - Renames the file (and respective pair if applicable)
    '''

    # key = directory
    # value = list of lists containing image file and corresponding text file if found
    new_dir_files = dict()

    for dir in os.listdir(in_dir):
        new_dir = dir
        # Create new dictionary key (a new directory) w/ dictionary for corresponding files
        new_dir_files[new_dir] = dict()
        for file in os.listdir(os.path.join(in_dir, dir)):
            file_prefix = file.split(".")[0]

            # Add to prefixes dictionary
            if file_prefix not in new_dir_files[new_dir]:
                # Create new list of files for file_prefix
                new_dir_files[new_dir][file_prefix] = [file]
            else:
                new_dir_files[new_dir][file_prefix].append(file)
    #print(new_dir_files)

    # Create root output directory
    make_dir(out_dir)
    # Create sub-folders and populate with newly indexed data
    for dir in new_dir_files.keys():
        make_dir(os.path.join(out_dir, dir))
        for i, prefix in enumerate(new_dir_files[dir]):
            for file in new_dir_files[dir][prefix]:
                shutil.copy(os.path.join(in_dir, dir, file), os.path.join(out_dir, dir, f'{dir}_{i}.{file.split(".")[1]}'))

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("mass_rename.py {IN_DIRECTORY} {OUT_DIRECTORY}")
    else:
        rename_dir(sys.argv[1], sys.argv[2])