# Backend Configuration Guide

## 🎯 How to Connect Frontend to Backend

### Step 1: Start the Backend on Kaggle

1. **Open Kaggle Notebook**
   - Go to https://kaggle.com/code
   - Create new Notebook
   - Enable Internet in Settings

2. **Upload Backend Files**
   - Upload `main.py`, `pipeline.py`, `requirements.txt` from `backend/` folder

3. **Install Dependencies**
   ```python
   !pip install -r requirements.txt
   ```

4. **Run the Server**
   ```python
   !python main.py
   ```

5. **Copy the ngrok URL**
   ```
   You'll see output like:
   
   ============================================================
   🚀 TAXAFORMER API STARTED
   ============================================================
   📡 PUBLIC URL: https://abc123-xx-xxx.ngrok-free.app
   🔧 LOCAL URL:  http://localhost:8000
   ============================================================
   
   ⚡ Copy the PUBLIC URL to your frontend configuration!
   ```

### Step 2: Update Frontend Configuration

1. **Open** `src/components/UploadPage.tsx`

2. **Find line 7** (the API_URL constant)

3. **Replace with your ngrok URL:**
   ```typescript
   // Before
   const API_URL: string = "https://old-url.ngrok-free.dev";
   
   // After (paste YOUR ngrok URL)
   const API_URL: string = "https://abc123-xx-xxx.ngrok-free.app";
   ```

4. **Save the file**

5. **Restart your dev server** (if running)
   ```bash
   npm run dev
   ```

### Step 3: Test the Connection

1. Go to your frontend (http://localhost:3000)
2. Upload a test FASTA file
3. If connected successfully, you'll see analysis results
4. If not connected, you'll see mock data with a warning

## 🔄 Backend Stays Active

- **Important:** Keep the Kaggle notebook running
- **URL Changes:** Every time you restart the backend, ngrok generates a NEW URL
- **Update:** Remember to update frontend with the new URL each time

## 📝 Quick Reference

### Current Frontend API URL
Check line 7 in `src/components/UploadPage.tsx`:
```typescript
const API_URL: string = "https://unexcited-nondepreciatively-justice.ngrok-free.dev";
```

### Backend Status Check
Open in browser: `https://your-ngrok-url.ngrok-free.app/health`

Should return:
```json
{
  "status": "healthy",
  "pipeline": "initialized",
  "temp_dir": true,
  "timestamp": "2025-12-09T..."
}
```

## 🚨 Troubleshooting

### "Failed to fetch" Error
- ✅ Backend is running on Kaggle
- ✅ Ngrok URL is correct in UploadPage.tsx
- ✅ URL doesn't have trailing slash
- ✅ Internet connection active

### "Ngrok tunnel failed"
- Get new token: https://dashboard.ngrok.com/get-started/your-authtoken
- Update `NGROK_TOKEN` in `main.py`
- Restart backend

### Backend Keeps Disconnecting
- Kaggle notebooks timeout after inactivity
- Keep the notebook tab open
- Refresh the cell output occasionally
- Consider upgrading to ngrok paid plan for persistent URLs

## 🎯 Environment Variables (Optional)

For production, create `.env` file in `backend/`:

```env
NGROK_TOKEN=your_token_here
PORT=8000
USE_NGROK=true
```

Update `main.py` to read from env:
```python
import os
from dotenv import load_dotenv

load_dotenv()
NGROK_TOKEN = os.getenv("NGROK_TOKEN")
```

## 📊 Testing Without Backend

To test UI without backend connection:

```typescript
// In UploadPage.tsx line 7
const API_URL: string = "";  // Empty string uses mock data
```

## 🌐 Alternative to Kaggle

### Run on Google Colab
```python
!pip install -r requirements.txt
!python main.py
```

### Run Locally
```bash
cd backend
pip install -r requirements.txt
python main.py
```

### Deploy to Render/Railway
- Add `backend/` folder to git
- Connect to Render/Railway
- Will get permanent URL (no ngrok needed)

## ✅ Verification Checklist

- [ ] Backend running on Kaggle
- [ ] Ngrok URL copied from output
- [ ] UploadPage.tsx updated with new URL
- [ ] Frontend dev server restarted
- [ ] Test upload works
- [ ] Check browser console for errors
- [ ] Verify /health endpoint responds

## 📸 Expected Output

### Backend Console
```
🚀 TAXAFORMER API STARTED
📡 PUBLIC URL: https://xxxx.ngrok-free.app
Processing file: sample.fasta (1234 bytes)
Analysis complete: sample.fasta (2.45s)
```

### Frontend Console
```
🔗 API URL: https://xxxx.ngrok-free.app
📤 Uploading file: sample.fasta
✅ Upload successful
💾 Saved to localStorage: analysisResults
```

## 🔗 Useful Links

- Ngrok Dashboard: https://dashboard.ngrok.com/
- Kaggle Notebooks: https://www.kaggle.com/code
- FastAPI Docs: Your ngrok URL + `/docs`
