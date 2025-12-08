# 📥 Download Analysis Results Script

Automatically downloads JSON analysis results from your frontend when new data is received.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pip install -r download_requirements.txt
```

This installs:
- `selenium` - Browser automation
- `webdriver-manager` - Automatic Chrome driver setup

### 2. Start Your Frontend

Make sure your frontend is running:

```bash
npm run dev
```

Frontend should be accessible at: http://localhost:3000

### 3. Run the Download Script

```bash
python download_results.py
```

### 4. Upload Files

Go to your frontend (http://localhost:3000) and upload FASTA files as normal.

The script will:
- ✅ Detect when new analysis results arrive
- ✅ Automatically download 3 files:
  - `sample_analysis_TIMESTAMP.json` - Full response
  - `sample_sequences_TIMESTAMP.csv` - Sequences data
  - `sample_taxonomy_summary_TIMESTAMP.csv` - Taxonomy summary

## 📂 Output

All files are saved to `downloaded_results/` folder in your project directory.

Example output:
```
downloaded_results/
├── sample1_analysis_20251209_143052.json
├── sample1_sequences_20251209_143052.csv
├── sample1_taxonomy_summary_20251209_143052.csv
├── sample2_analysis_20251209_143412.json
├── sample2_sequences_20251209_143412.csv
└── sample2_taxonomy_summary_20251209_143412.csv
```

## 🎯 How It Works

1. Opens Chrome browser (visible by default)
2. Navigates to your frontend
3. Monitors `localStorage` for new analysis results
4. When new data detected, downloads all files automatically
5. Continues monitoring for next upload

## ⚙️ Configuration

Edit `download_results.py` to customize:

```python
FRONTEND_URL = "http://localhost:3000"  # Your frontend URL
OUTPUT_DIR = "downloaded_results"        # Output folder name
CHECK_INTERVAL = 5                       # Check every 5 seconds
```

### Run Headless (No Browser Window)

Uncomment line 23 in `download_results.py`:

```python
chrome_options.add_argument('--headless')
```

## 📊 Console Output

```
🚀 Starting Analysis Results Monitor
📂 Output directory: downloaded_results
🌐 Monitoring: http://localhost:3000
⏱️  Check interval: 5s
============================================================
✅ Browser driver initialized
✅ Opened http://localhost:3000

📊 Monitoring for new analysis results...
   Upload a file to start analysis
   Press Ctrl+C to stop

🔔 New data detected at 14:30:52
✅ Downloaded: downloaded_results\sample_analysis_20251209_143052.json
✅ Downloaded: downloaded_results\sample_sequences_20251209_143052.csv
✅ Downloaded: downloaded_results\sample_taxonomy_summary_20251209_143052.csv

📋 Analysis Summary:
   Sample: test.fasta
   Sequences: 150
   Avg Confidence: 87%
   Novel Sequences: 12

✅ Download complete! Waiting for next analysis...
```

## 🛑 Stop Monitoring

Press `Ctrl+C` to stop the script.

## 🔧 Troubleshooting

### "Chrome driver not found"
- Script automatically downloads driver on first run
- Make sure you have Chrome browser installed

### "Cannot connect to frontend"
- Ensure `npm run dev` is running
- Check frontend is at http://localhost:3000
- Update `FRONTEND_URL` if using different port

### "No data detected"
- Make sure you're uploading files through the frontend
- Check browser console (F12) for errors
- Verify backend is running and connected

### "Permission denied"
- Run terminal as Administrator (Windows)
- Check `downloaded_results` folder permissions

## 📝 Alternative: Manual Download

If you prefer not to run the automated script, files are also automatically downloaded by the frontend itself when analysis completes (already implemented in `UploadPage.tsx`).

## 🎓 Usage Example

```bash
# Terminal 1: Start frontend
npm run dev

# Terminal 2: Start Kaggle backend (see backend/README.md)
python backend/main.py

# Terminal 3: Run download monitor
python download_results.py

# Now upload files through the frontend!
```

## 🔍 What Gets Downloaded

### 1. JSON File
Complete API response with all data:
```json
{
  "metadata": { ... },
  "taxonomy_summary": [ ... ],
  "sequences": [ ... ],
  "cluster_data": [ ... ]
}
```

### 2. Sequences CSV
All sequences with details:
```csv
Accession,Taxonomy,Length,Confidence,Overlap,Cluster,Novelty_Score,Status
SEQ_001,"Eukaryota;Metazoa",1842,0.94,87,C1,0.12,Known
```

### 3. Taxonomy Summary CSV
Group counts:
```csv
Taxonomy_Group,Count,Color
Metazoa,45,#F59E0B
Alveolata,32,#22D3EE
```

## 💡 Tips

- **Keep script running** - It monitors continuously for multiple uploads
- **Timestamp ensures no overwrites** - Each analysis gets unique filenames
- **Works with any backend** - Monitors localStorage regardless of backend
- **Browser stays open** - See what's happening in real-time

## 🔗 Related Files

- `download_results.py` - Main script
- `download_requirements.txt` - Dependencies
- `src/components/UploadPage.tsx` - Frontend also downloads automatically

---

**Happy analyzing! 🧬📊**
