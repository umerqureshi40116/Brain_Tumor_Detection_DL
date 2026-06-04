# NeuroScan AI

Brain tumor MRI classifier. VGG16 · 4 classes · FastAPI + React.

## Structure

```
neuroscan/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── brain_tumour_model_fixed.h5
└── frontend/
    ├── package.json
    └── src/
        ├── index.js
        └── App.jsx
```

## Run the backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

API available at http://localhost:8000  
Docs at http://localhost:8000/docs

## Run the frontend

```bash
cd frontend
npm install
npm start
```

Opens at http://localhost:3000

## Model

| | |
|---|---|
| Architecture | VGG16 (transfer learning) |
| Input | 128 × 128 × 3 |
| Classes | Glioma, Meningioma, No Tumor, Pituitary |
| Output | Softmax over 4 classes |

## API

`POST /predict` — multipart form, field `file` (image)

```json
{
  "top": { "label": "Glioma", "probability": 94.2 },
  "all": [
    { "label": "Glioma",     "probability": 94.2 },
    { "label": "No Tumor",   "probability":  3.1 },
    { "label": "Pituitary",  "probability":  1.9 },
    { "label": "Meningioma", "probability":  0.8 }
  ]
}
```
