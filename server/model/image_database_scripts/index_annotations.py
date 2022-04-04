import os

class AnnotationIndexer:
    """
    TODO ADD DOCUMENTATION
    """
    def __init__(self, path, classes):
        """
        Requires path of combined annotation files and images
        Classes (in order)
        """
        self.path = path
        self.classes = classes
        self.prefixes = []

    _file_list = lambda self: [f for f in os.listdir() if f.endswith(".txt") and f != "classes.txt"]
    _get_prefixes = lambda self: set([f.split(".")[0] for f in os.listdir() if f.endswith(".txt")])
    _get_prefix = lambda self, file_name: [prefix for prefix in self.classes if prefix in file_name][0]

    def read_yolo_file(self, fname):
        """
        Returns a two dimensional array containing
        all annotations in a given yolo file
        Rows are annotations and columns are the respective associated numbers
        Ex.
        0 22 33 44 55 
        0 33 44 55 66 
        1 00 44 11 93
        would return
        [0, 22, 33, 44, 55]
        [0, 33, 44, 55, 66]
        [1, 00, 44, 11, 93]
        """
        data = []
        # Retrieve original data
        with open(os.path.join(self.path, fname), 'r') as f:
            for line in f.readlines():
                data.append(line.split(' '))
        return data

    def single_class_update(self, fname, class_index):
        """
        Changes the class (first index of each line) to a single specified class
        Updates file in place
        """
        raw_data = self.read_yolo_file(fname)
        new_data = []
        # Alter class for each annotation in file 
        for annotation in raw_data:
            new_data.append([str(class_index)] + annotation[1:])
        
        write_data = []
        for row in new_data:
            write_data.append(" ".join(row))

        # Rewrite file with new data
        with open(os.path.join(self.path, fname), 'w') as f:
            for row in write_data:
                f.write(row)

    def update_all(self):
        """
        Updates all annotation files to reflect class order and indexing
        """
        # Get classification index map
        class_map = dict()
        for i, c in enumerate(self.classes):
            class_map[c] = i

        # Update all files with correct class index
        for f in self._file_list():
            self.single_class_update(f, class_map[self._get_prefix(f)])

if __name__ == "__main__":
    path = "/home/cade/Projects/Fungi-Eye/server/model/image_database_scripts/"
    class_file = "classes.txt"

    # Get prefix orders
    classes = []
    with open(os.path.join(path, class_file), 'r') as f:
        classes = [l.strip() for l in f.readlines()]

    # Create annotator editor
    annotator = AnnotationIndexer(path, classes)

    # Reformat all files with respective classification index
    annotator.update_all()

    # Output classes.txt file and print to console naming convention
    for i, c in enumerate(classes):
        print(f"{i} {c}")