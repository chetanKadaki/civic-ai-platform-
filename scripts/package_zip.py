import os
import zipfile

def create_zip(output_path, root_dir):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    exclude_dirs = {'node_modules', 'dist', '.git', '.aistudio', '__pycache__', '.venv', 'venv'}
    exclude_exts = {'.zip', '.tar.gz', '.pyc'}
    
    with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as zf:
        for root, dirs, files in os.walk(root_dir):
            dirs[:] = [
                d for d in dirs 
                if d not in exclude_dirs and (not d.startswith('.') or d == '.vscode')
            ]
            
            for file in files:
                ext = os.path.splitext(file)[1].lower()
                if ext in exclude_exts:
                    continue
                if file.startswith('.') and not root.endswith('.vscode'):
                    continue
                if file.endswith('.zip'):
                    continue
                
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, root_dir)
                
                # Write directly at the root of the zip archive
                zf.write(full_path, rel_path)

if __name__ == '__main__':
    workspace_root = '/app/applet'
    
    cgk_zip = '/app/applet/public/cgk.zip'
    create_zip(cgk_zip, workspace_root)
    print(f"cgk.zip created: {os.path.getsize(cgk_zip) / (1024*1024):.2f} MB")
    
    civic_zip = '/app/applet/public/civicpulse_project.zip'
    create_zip(civic_zip, workspace_root)
    print("Done!")
