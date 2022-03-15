# Model Run Instructions (WIP)

### deepstack-trainer
- Must use sm_37 sm_50 sm_60 sm_70 sm_75 cuda capable gpu. This corresponds to CUDA <=11.0
- Ampere GPUs (sm_86) have a CUDA version of 11.1+, which is not compatible with the Torch version compatible with deepstack-trainer (Torch 1.7, 1.7.1)

### Running Docker Image
`sudo docker run -e VISION-DETECTION=True -v {MODEL_DIR}:/modelstore/detection -p 80:5000 deepquestai/deepstack`