#!/usr/bin/env python3
"""
Setup script to prepare the backend for deployment
"""

import os
import sys
from pathlib import Path

def update_cors_settings():
    """Update CORS settings in main.py to include Vercel frontend URL"""
    
    main_py_path = Path("backend/src/main.py")
    
    if not main_py_path.exists():
        print(f"Error: {main_py_path} not found!")
        return False
    
    with open(main_py_path, 'r') as f:
        content = f.read()
    
    # Look for the CORSMiddleware section
    if "allow_origins=" in content:
        print("CORS settings found in main.py")
        
        # Create updated content with Vercel URL
        # We'll add a comment to remind the user to update this
        updated_content = content.replace(
            'allow_origins=settings.BACKEND_CORS_ORIGINS.split(",") if settings.BACKEND_CORS_ORIGINS != "*" else ["*"],',
            '# IMPORTANT: Update this with your actual Vercel frontend URL before deployment\n'
            '    allow_origins=(settings.BACKEND_CORS_ORIGINS.split(",") if settings.BACKEND_CORS_ORIGINS != "*" else ["*"]) + ["https://frontend-fjp2z60tz-farhakhans-projects.vercel.app"],  # Add your Vercel URL here'
        )
        
        # If the update didn't work, we'll append a note at the end
        if updated_content == content:
            print("Manual update needed in main.py:")
            print("Add your Vercel frontend URL to the allow_origins list in the CORSMiddleware configuration.")
    
        with open(main_py_path, 'w') as f:
            f.write(updated_content)
        
        print("Updated main.py with CORS note")
        return True
    else:
        print("Could not find CORS configuration in main.py")
        return False

def create_runtime_file():
    """Create runtime.txt for Python version specification"""
    runtime_path = Path("backend/runtime.txt")
    with open(runtime_path, 'w') as f:
        f.write("python-3.11\n")
    print(f"Created {runtime_path}")

def create_procfile():
    """Create Procfile for deployment platforms"""
    procfile_path = Path("backend/Procfile")
    with open(procfile_path, 'w') as f:
        f.write("web: uvicorn src.main:app --host 0.0.0.0 --port $PORT\n")
    print(f"Created {procfile_path}")

def main():
    print("Setting up backend for deployment...")
    
    # Update CORS settings
    update_cors_settings()
    
    # Create deployment files
    create_runtime_file()
    create_procfile()
    
    print("\nSetup complete!")
    print("Next steps:")
    print("1. Deploy the backend to a Python-compatible platform (Render, Railway, etc.)")
    print("2. Update CORS settings in main.py with your actual Vercel frontend URL")
    print("3. Set NEXT_PUBLIC_API_URL in Vercel environment variables to your backend URL")
    print("4. Redeploy the frontend")

if __name__ == "__main__":
    main()