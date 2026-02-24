# FixPix - AI Image Restoration

FixPix is a powerful web application that uses Artificial Intelligence to restore, colorize, and enhance old or damaged photos. It features a modern, user-friendly interface inspired by Google's Material Design.

## 🚀 Tech Stack

- **Frontend:** React, Tailwind CSS, Framer Motion
- **Backend:** Django, Django REST Framework
- **AI/Image Processing:** OpenCV, NumPy, Pillow
- **Database:** SQLite (Default)

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd FixPix
```

### 2. Backend Setup
Navigate to the backend folder and install Python dependencies.
```bash
cd backend
pip install -r requirements.txt
# Run migrations
python manage.py migrate
cd ..
```

### 3. Frontend Setup
Install Node.js dependencies in the root directory.
```bash
npm install
```

## ▶️ How to Run

### Windows
Simply double-click the `run_project.bat` file in the root directory.
This will automatically open two terminal windows: one for the Django backend and one for the React frontend.

### macOS / Linux
Run the shell script:
```bash
sh run_project.sh
```
Or manually run:
1. **Backend:** `cd backend && python3 manage.py runserver`
2. **Frontend:** `npm run dev`

## ✨ Features
- **Project Organization:** Dashboard to manage your image projects.
- **AI Restoration:**
  - **Colorize:** Add color to black & white photos.
  - **Remove Scratches:** Auto-inpaint damaged areas (Simulated/Basic implementation).
  - **Upscale:** Increase image resolution.
- **Before/After Comparison:** Interactive slider to view results.
- **Secure:** User authentication with JWT.

## 📄 License
MIT License
