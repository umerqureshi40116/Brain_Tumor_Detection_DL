import io
import numpy as np
from pathlib import Path
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import tensorflow as tf
import keras
import os
import warnings

# Suppress warnings
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
warnings.filterwarnings('ignore')

# ============= APP INITIALIZATION =============
app = FastAPI(title="NeuroScan API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============= MODEL CONFIGURATION =============
MODEL_PATH = Path("E:/Umer/MRI/model/brain_tumor_model.keras")
CLASS_NAMES = ["Glioma", "Meningioma", "No Tumor", "Pituitary"]

_model = None

def get_model():
    """Load the Keras model"""
    global _model
    if _model is None:
        print(f"[INFO] TensorFlow {tf.__version__}, Keras {keras.__version__}")
        print(f"[INFO] Loading {MODEL_PATH}…")
        try:
            _model = keras.models.load_model(str(MODEL_PATH))
            print("[INFO] ✅ Model loaded successfully")
        except Exception as e:
            print(f"[ERROR] Failed to load model: {e}")
            raise
    return _model

# ============= STARTUP EVENT =============
@app.on_event("startup")
async def startup():
    """Load model on startup"""
    print("[INFO] Starting application...")
    try:
        get_model()
        print("[INFO] ✅ Application startup complete")
    except Exception as e:
        print(f"[ERROR] Startup failed: {e}")
        raise

# ============= HEALTH CHECK =============
@app.get("/health")
def health():
    """Health check endpoint"""
    return {
        "status": "ok",
        "model": "loaded" if _model is not None else "not loaded",
        "model_path": str(MODEL_PATH)
    }

# ============= PREDICTION ENDPOINT =============
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """
    Predict brain tumor type from MRI image
    
    Expected input:
    - MRI image file (JPEG, PNG, etc.)
    
    Returns:
    - top: Best prediction with label and probability
    - all: All predictions sorted by confidence
    """
    
    # Validate file type
    if not file.content_type.startswith("image/"):
        raise HTTPException(400, "File must be an image (JPEG, PNG, etc.)")

    try:
        # Read and process image
        contents = await file.read()
        img = Image.open(io.BytesIO(contents)).convert("RGB")
        img = img.resize((128, 128))
        
        # Normalize to [0, 1]
        arr = np.expand_dims(np.array(img, dtype=np.float32) / 255.0, 0)
        
    except Exception as e:
        raise HTTPException(400, f"Image processing error: {e}")

    try:
        # Get predictions
        model = get_model()
        preds = model.predict(arr, verbose=0)[0]
        
        # Format results
        results = sorted(
            [
                {
                    "label": name,
                    "probability": round(float(prob) * 100, 2)
                }
                for name, prob in zip(CLASS_NAMES, preds)
            ],
            key=lambda x: x["probability"],
            reverse=True,
        )

        return {
            "top": results[0],
            "all": results,
            "input_shape": list(arr.shape),
            "model_name": "VGG16 + Custom Classifier"
        }
        
    except Exception as e:
        raise HTTPException(500, f"Prediction error: {e}")

# ============= ROOT ENDPOINT =============
@app.get("/")
def root():
    """API information"""
    return {
        "name": "NeuroScan Brain Tumor Detection API",
        "version": "1.0",
        "endpoints": {
            "GET /": "This information",
            "GET /health": "Health check",
            "POST /predict": "Predict tumor type from MRI image"
        },
        "usage": "Send POST request with MRI image to /predict",
        "model_status": "loaded" if _model is not None else "not loaded"
    }
    
# ============= RUN =============
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)