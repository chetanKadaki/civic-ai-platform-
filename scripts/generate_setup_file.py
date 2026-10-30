import base64
import os

zip_path = '/app/applet/public/cgk.zip'
out_path = '/app/applet/public/setup_project.py'

with open(zip_path, 'rb') as f:
    b64 = base64.b64encode(f.read()).decode('ascii')

script_content = f'''"""
Single-File Self-Extractor for CGK Project
Run: python setup_project.py
This will unpack all frontend, backend, database, and VS Code files.
"""
import base64
import io
import zipfile
import os

ZIP_B64 = """{b64}"""

def main():
    print("=" * 60)
    print("Unpacking all project files for VS Code...")
    print("=" * 60)
    
    zip_bytes = base64.b64decode(ZIP_B64)
    with zipfile.ZipFile(io.BytesIO(zip_bytes)) as zf:
        zf.extractall(".")
    
    print("\\n[SUCCESS] Folder 'cgk' created successfully with all source files!")
    print("\\nNext steps to run in VS Code:")
    print("  1. cd cgk")
    print("  2. code .")
    print("  3. npm install")
    print("  4. npm run dev")
    print("\\nFor FastAPI backend (in a second terminal):")
    print("  cd cgk/backend")
    print("  pip install -r requirements.txt")
    print("  uvicorn main:app --port 8000 --reload")
    print("=" * 60)

if __name__ == "__main__":
    main()
'''

with open(out_path, 'w') as out:
    out.write(script_content)

print(f"Generated {out_path} ({os.path.getsize(out_path) / 1024:.1f} KB)")
