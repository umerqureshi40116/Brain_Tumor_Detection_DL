#!/usr/bin/env python3
"""
Quick fix: Load .keras model by ignoring quantization_config in Dense layers
"""

import json
import zipfile
import tempfile
import shutil
from pathlib import Path
import keras

def fix_and_load_keras_model(keras_file_path):
    """
    Fix corrupted .keras model by removing quantization_config from Dense layers
    """
    
    keras_path = Path(keras_file_path)
    
    if not keras_path.exists():
        print(f"❌ File not found: {keras_path}")
        return None
    
    print(f"🔧 Attempting to fix {keras_path.name}...")
    
    # Create temporary directory
    with tempfile.TemporaryDirectory() as tmpdir:
        tmpdir = Path(tmpdir)
        
        # Extract .keras file (it's a ZIP)
        with zipfile.ZipFile(keras_path, 'r') as zip_ref:
            zip_ref.extractall(tmpdir)
        
        # Find and fix config.json
        config_file = tmpdir / "config.json"
        
        if not config_file.exists():
            print(f"❌ config.json not found in {keras_path}")
            return None
        
        # Read config
        with open(config_file, 'r') as f:
            config = json.load(f)
        
        # Remove quantization_config from all layers
        def remove_quantization_config(obj):
            if isinstance(obj, dict):
                if 'quantization_config' in obj:
                    print(f"   ✂️  Removing quantization_config from {obj.get('name', 'unknown')}")
                    del obj['quantization_config']
                
                for key, value in obj.items():
                    remove_quantization_config(value)
            elif isinstance(obj, list):
                for item in obj:
                    remove_quantization_config(item)
        
        print("   Scanning for problematic parameters...")
        remove_quantization_config(config)
        
        # Write fixed config back
        with open(config_file, 'w') as f:
            json.dump(config, f)
        
        # Create new .keras file from fixed content
        fixed_file = keras_path.parent / f"{keras_path.stem}_fixed.keras"
        
        print(f"   📦 Repackaging model...")
        with zipfile.ZipFile(fixed_file, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for file_path in tmpdir.rglob('*'):
                if file_path.is_file():
                    arcname = file_path.relative_to(tmpdir)
                    zipf.write(file_path, arcname)
        
        print(f"✅ Fixed model saved to: {fixed_file}")
        
        # Try to load it
        try:
            print(f"   Loading model...")
            model = keras.models.load_model(str(fixed_file))
            print(f"✅ Model loaded successfully!")
            print(f"   Model name: {model.name}")
            print(f"   Input shape: {model.input_shape}")
            print(f"   Output shape: {model.output_shape}")
            
            # Optionally save as original name
            print(f"\n💾 Saving over original file...")
            model.save(keras_path)
            print(f"✅ Original file updated!")
            
            return model
        except Exception as e:
            print(f"❌ Still can't load: {e}")
            print(f"   Try loading from: {fixed_file}")
            return None

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python fix_model.py <path_to_keras_file>")
        print("Example: python fix_model.py 'corrupted model/brain_tumor_model_new.keras'")
        sys.exit(1)
    
    model = fix_and_load_keras_model(sys.argv[1])
    sys.exit(0 if model else 1)