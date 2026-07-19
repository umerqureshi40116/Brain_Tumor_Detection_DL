markdown
<div align="center">
  
# 🧠 Brain Tumor Detection using Deep Learning

### *Advanced Brain Tumor Classification using Deep Learning*

[![Python](https://img.shields.io/badge/Python-3.9+-3776AB.svg?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688.svg?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.0+-61DAFB.svg?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.0+-FF6F00.svg?style=for-the-badge&logo=tensorflow&logoColor=white)](https://tensorflow.org/)
[![VGG16](https://img.shields.io/badge/Architecture-VGG16-00BCD4.svg?style=for-the-badge&logo=keras&logoColor=white)](https://keras.io/api/applications/vgg/)

</div>

---

## 📋 Overview

**NeuroScan AI** is a state-of-the-art deep learning system for automatic brain tumor classification from MRI scans. Leveraging transfer learning with the VGG16 architecture, the system achieves high accuracy in distinguishing between four classes:

- 🧬 **Glioma**
- 🧫 **Meningioma**  
- ✅ **No Tumor**
- 🎯 **Pituitary Tumor**

The complete solution includes a **FastAPI backend** for model inference and a **React frontend** for an intuitive user interface, making it suitable for clinical and research applications.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🧠 **Deep Learning Model** | VGG16-based transfer learning with 4-class softmax output |
| 🖼️ **Image Processing** | Automatic preprocessing (128×128×3 input) |
| ⚡ **Fast Inference** | ~100ms per prediction on GPU |
| 🌐 **RESTful API** | Well-documented endpoints with Swagger UI |
| 🎨 **Modern UI** | Responsive React frontend with drag-and-drop |
| 📊 **Probability Visualization** | Confidence scores for all classes |
| 🔒 **Production Ready** | Error handling, CORS support, validation |

---

## 🏗️ Architecture
┌─────────────────────────────────────────────────────────────────┐
│ USER INTERFACE │
│ React Frontend (Port 3000) │
└─────────────────────────────┬───────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────────┐
│ API GATEWAY │
│ FastAPI Backend (Port 8000) │
└─────────────────────────────┬───────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────────┐
│ MODEL INFERENCE │
│ VGG16 + Custom Classification Head │
│ Input: 128×128×3 RGB │
│ Output: 4-class Softmax │
└─────────────────────────────────────────────────────────────────┘

text

### Model Details

| Parameter | Value |
|-----------|-------|
| **Base Model** | VGG16 (pre-trained on ImageNet) |
| **Input Shape** | 128 × 128 × 3 |
| **Output Classes** | 4 (Glioma, Meningioma, No Tumor, Pituitary) |
| **Activation** | Softmax |
| **Loss Function** | Categorical Crossentropy |
| **Optimizer** | Adam |

---

## 📁 Project Structure
NeuroScan-AI/
│
├── MRI/
│ ├── Jupyter_notebook_code/
│ │ └── brain_tumour_detection_notebook.ipynb # Model training
│ ├── web_app/
│ │ ├── backend/
│ │ │ ├── main.py # FastAPI server
│ │ │ └── fix_model.py # Model utilities
│ │ └── frontend/
│ │ ├── public/ # Static assets
│ │ ├── src/ # React components
│ │ ├── package.json # Dependencies
│ │ └── package-lock.json
│ ├── requirements.txt # Python deps
│ ├── .gitignore
│ └── README.md

text

---

## 🚀 Quick Start

### Prerequisites

- **Python** 3.9+
- **Node.js** 16+
- **npm** or **yarn**
- **TensorFlow** (GPU optional but recommended)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/NeuroScan-AI.git
cd NeuroScan-AI/MRI/web_app
2. Backend Setup
bash
cd backend
pip install -r requirements.txt

# Run the server
uvicorn main:app --reload --port 8000
<details> <summary><b>Requirements.txt</b></summary>
txt
fastapi==0.100.0
uvicorn==0.23.0
tensorflow==2.13.0
python-multipart==0.0.6
Pillow==10.0.0
numpy==1.24.3
python-dotenv==1.0.0
</details>
3. Frontend Setup
bash
cd ../frontend
npm install
npm start

</div> ```
