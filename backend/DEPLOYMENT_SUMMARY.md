# 🚀 Taxaformer Backend - Complete Setup Guide

## 📦 What's Been Created

Your backend is now ready! Here's what was set up:

```
backend/
├── main.py                    # FastAPI server with ngrok
├── pipeline.py                # Data processing pipeline
├── requirements.txt           # Python dependencies
├── test_backend.py           # Testing script
├── README.md                 # Complete documentation
├── KAGGLE_SETUP.md          # Kaggle-specific guide
└── temp_uploads/            # (auto-created) Temp file storage
```

## ⚡ Quick Start (3 Steps)

### Step 1: Deploy on Kaggle

1. **Go to Kaggle**: https://www.kaggle.com/code
2. **Create New Notebook**
3. **Enable Internet** in notebook settings (⚙️)
4. **Copy and paste** the content from `KAGGLE_SETUP.md`
5. **Run all cells**
6. **Copy the ngrok URL** from output

### Step 2: Update Frontend

1. Open `src/components/UploadPage.tsx`
2. Find line 7:
   ```typescript
   const API_URL: string = "...";
   ```
3. Replace with your new ngrok URL:
   ```typescript
   const API_URL: string = "https://YOUR-NEW-URL.ngrok-free.app";
   ```
4. Save file

### Step 3: Test

1. Restart your dev server: `npm run dev`
2. Go to upload page
3. Upload a FASTA file
4. See results! 🎉

## 🔧 How It Works

### Architecture Flow

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Browser   │────────▶│   Ngrok      │────────▶│   Kaggle    │
│  (Frontend) │         │  (Tunnel)    │         │  (Backend)  │
└─────────────┘         └──────────────┘         └─────────────┘
     Upload                   HTTPS                  Processing
     FASTA                   Forwarding               Analysis
                                                      Return JSON
```

### Request Flow

1. **User uploads** file in frontend
2. **Frontend sends** POST to `/analyze` endpoint
3. **Ngrok forwards** to Kaggle backend
4. **Pipeline processes** file:
   - Parse sequences
   - Analyze taxonomy
   - Calculate statistics
   - Generate visualizations
5. **Backend returns** JSON response
6. **Frontend displays** results

## 📁 File Descriptions

### main.py
- FastAPI application setup
- CORS configuration for frontend access
- File upload handling
- Ngrok tunnel management
- Error handling and logging

**Key Features:**
- ✅ Validates file types (FASTA/FASTQ)
- ✅ Temporary file management
- ✅ Processing time tracking
- ✅ Health check endpoints

### pipeline.py
- Sequence parsing (FASTA/FASTQ)
- Taxonomy classification
- Novelty detection
- Data aggregation
- Frontend-compatible formatting

**Key Features:**
- ✅ Multi-format support
- ✅ Taxonomy assignment
- ✅ Clustering data generation
- ✅ Statistical calculations

### requirements.txt
Core dependencies:
- `fastapi` - Web framework
- `uvicorn` - ASGI server
- `pyngrok` - Ngrok tunnel
- `numpy` - Data processing
- `python-multipart` - File uploads

## 🎯 API Endpoints

### GET /
Health check - returns online status

### GET /health
Detailed health information

### POST /analyze
Main analysis endpoint

**Request:**
```bash
curl -X POST "https://your-url.ngrok-free.app/analyze" \
  -F "file=@sample.fasta"
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "metadata": { ... },
    "taxonomy_summary": [ ... ],
    "sequences": [ ... ],
    "cluster_data": [ ... ]
  }
}
```

## 🧪 Testing

### Local Testing

```bash
# 1. Install dependencies
cd backend
pip install -r requirements.txt

# 2. Run locally (without ngrok)
# Edit main.py: USE_NGROK = False
python main.py

# 3. Test with script
python test_backend.py
```

### Kaggle Testing

1. Upload files to Kaggle
2. Run notebook
3. Check health: `https://your-url.ngrok-free.app/health`
4. Test with frontend

## 🔐 Security Notes

### Production Recommendations

1. **CORS**: Update `allow_origins` to specific domains
   ```python
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["https://yourdomain.com"],
       ...
   )
   ```

2. **Ngrok Token**: Keep private, don't commit to git
   ```python
   # Use environment variables
   import os
   NGROK_TOKEN = os.getenv("NGROK_TOKEN")
   ```

3. **File Validation**: Already implemented
   - Extension checking
   - Size limits (add if needed)
   - Content validation

4. **Rate Limiting**: Consider adding
   ```python
   from slowapi import Limiter
   limiter = Limiter(key_func=get_remote_address)
   ```

## 🐛 Troubleshooting

### Issue: "Ngrok tunnel failed"
**Solutions:**
- ✅ Check ngrok token is valid
- ✅ Enable Internet in Kaggle settings
- ✅ Try getting new token from ngrok.com
- ✅ Restart notebook kernel

### Issue: "Import errors"
**Solutions:**
- ✅ Run `pip install -r requirements.txt`
- ✅ Check Python version (3.8+)
- ✅ Restart kernel after installing

### Issue: "CORS errors in frontend"
**Solutions:**
- ✅ Verify CORS middleware is active
- ✅ Check URL doesn't have trailing slash
- ✅ Clear browser cache
- ✅ Check browser console for details

### Issue: "File upload fails"
**Solutions:**
- ✅ Check file extension (.fasta, .fa, etc.)
- ✅ Verify file isn't corrupted
- ✅ Check file size reasonable
- ✅ Look at backend logs for error

### Issue: "Backend times out"
**Solutions:**
- ✅ Keep Kaggle tab open and active
- ✅ Refresh notebook occasionally
- ✅ Upgrade to ngrok paid plan for persistence
- ✅ Consider deploying to Render/Railway instead

## 🌐 Alternative Hosting Options

### Option 1: Kaggle (Free, Temporary)
- ✅ Free
- ✅ Easy setup
- ✅ Good for testing
- ❌ URL changes on restart
- ❌ Times out with inactivity

### Option 2: Google Colab (Free, Temporary)
Same as Kaggle, similar setup

### Option 3: Render.com (Free tier available)
- ✅ Permanent URL
- ✅ Auto-deploys from git
- ✅ Free tier available
- ❌ Spins down with inactivity
- Setup: Connect git repo, deploy

### Option 4: Railway.app (Free trial)
- ✅ Permanent URL
- ✅ Always on
- ✅ Easy deployment
- ❌ Limited free tier

### Option 5: Local Network
- ✅ No external dependencies
- ✅ Full control
- ❌ Not accessible remotely
- Setup: Run `python main.py` with `USE_NGROK=False`

## 📊 Performance

### Expected Processing Times
- **Small** (< 100 sequences): 1-3 seconds
- **Medium** (100-1000 sequences): 3-10 seconds
- **Large** (1000+ sequences): 10-30 seconds

### Optimization Tips
1. Process smaller batches
2. Enable Kaggle GPU (more RAM)
3. Use async processing for multiple files
4. Cache common results

## 🔄 Updating the Backend

### To modify analysis logic:

1. Edit `pipeline.py`
2. Find `_analyze_sequences()` method
3. Update classification logic
4. Restart backend
5. Test with `test_backend.py`

### To add new endpoints:

1. Edit `main.py`
2. Add new route:
   ```python
   @app.get("/new-endpoint")
   async def new_endpoint():
       return {"message": "Hello"}
   ```
3. Restart server
4. Test endpoint

## 📚 Additional Resources

- FastAPI Docs: https://fastapi.tiangolo.com/
- Ngrok Docs: https://ngrok.com/docs
- Kaggle Notebooks: https://www.kaggle.com/docs/notebooks
- Backend README: `backend/README.md`
- Connection Guide: `BACKEND_CONNECTION_GUIDE.md`

## ✅ Deployment Checklist

- [ ] Backend files created in `backend/` folder
- [ ] Dependencies listed in `requirements.txt`
- [ ] Ngrok token configured in `main.py`
- [ ] Files uploaded to Kaggle notebook
- [ ] Internet enabled in Kaggle settings
- [ ] Dependencies installed on Kaggle
- [ ] Server started, ngrok URL obtained
- [ ] Frontend `API_URL` updated with ngrok URL
- [ ] Frontend dev server restarted
- [ ] Test upload performed
- [ ] Results displayed correctly
- [ ] Documentation reviewed

## 🎓 Next Steps

1. **Test thoroughly** with various file types
2. **Monitor** Kaggle notebook for errors
3. **Keep URL updated** in frontend when restarting
4. **Consider** permanent hosting for production
5. **Add** custom analysis logic as needed
6. **Document** any modifications made

## 💡 Tips

- **Bookmark** your ngrok dashboard: https://dashboard.ngrok.com/
- **Save** the Kaggle notebook URL for quick access
- **Keep** a text file with current ngrok URL
- **Test** health endpoint before uploading files
- **Check** browser console for detailed errors
- **Use** FastAPI docs: `https://your-url.ngrok-free.app/docs`

---

## 🆘 Need Help?

1. Check `backend/README.md` for detailed docs
2. Run `python test_backend.py` to diagnose issues
3. Review `BACKEND_CONNECTION_GUIDE.md` for connection help
4. Check Kaggle notebook output logs
5. Verify frontend console for errors

**Happy analyzing! 🧬🔬**
