# Taxaformer Backend API

FastAPI backend with ngrok tunneling for hosting on Kaggle and processing taxonomic sequence analysis.

## 🚀 Quick Start

### Option 1: Run on Kaggle (Recommended)

1. **Create a new Kaggle Notebook**
   - Go to [Kaggle](https://www.kaggle.com/)
   - Create a new Notebook
   - Enable Internet access in settings

2. **Upload backend files**
   ```python
   # In Kaggle notebook, upload these files:
   # - main.py
   # - pipeline.py
   # - requirements.txt
   ```

3. **Install dependencies**
   ```bash
   !pip install -r requirements.txt
   ```

4. **Run the server**
   ```python
   !python main.py
   ```

5. **Copy the ngrok URL**
   ```
   Look for output like:
   📡 PUBLIC URL: https://xxxx-xx-xxx-xxx.ngrok-free.app
   ```

6. **Update your frontend**
   - Copy the PUBLIC URL
   - Update your frontend's API configuration

### Option 2: Run Locally

1. **Install Python 3.8+**

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the server**
   ```bash
   python main.py
   ```

4. **Access the API**
   - Local: http://localhost:8000
   - Ngrok: Check console for public URL

## 📁 File Structure

```
backend/
├── main.py              # FastAPI server with ngrok
├── pipeline.py          # Taxonomy analysis pipeline
├── requirements.txt     # Python dependencies
└── README.md           # This file
```

## 🔧 Configuration

### main.py Settings

```python
# Ngrok token (get from https://ngrok.com/)
NGROK_TOKEN = "your_token_here"

# Server port
PORT = 8000

# Enable/disable ngrok tunneling
USE_NGROK = True  # Set False for local-only
```

### Pipeline Settings

In `pipeline.py`, you can adjust:

```python
self.novelty_threshold = 0.15  # Novel detection threshold
```

## 📡 API Endpoints

### POST /analyze
Upload and analyze sequence files

**Request:**
```bash
curl -X POST "http://localhost:8000/analyze" \
  -F "file=@sequences.fasta"
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "metadata": {
      "sampleName": "sequences.fasta",
      "totalSequences": 150,
      "processingTime": "3.2s",
      "avgConfidence": 87,
      "novelSequences": 12
    },
    "taxonomy_summary": [
      { "name": "Alveolata", "value": 45, "color": "#22D3EE" },
      { "name": "Metazoa", "value": 28, "color": "#F59E0B" }
    ],
    "sequences": [
      {
        "accession": "seq_001",
        "taxonomy": "Eukaryota;Metazoa;Animalia",
        "length": 1842,
        "confidence": 0.94,
        "overlap": 87,
        "cluster": "C1",
        "novelty_score": 0.12,
        "status": "Known"
      }
    ],
    "cluster_data": [
      { "x": 12.5, "y": 8.3, "z": 45, "cluster": "Alveolata", "color": "#22D3EE" }
    ]
  }
}
```

### GET /
Health check

### GET /health
Detailed health status

## 🔌 Frontend Integration

### Update Frontend API URL

In your frontend code, update the API URL:

```javascript
// Before
const API_URL = "http://localhost:8000";

// After (using ngrok URL from backend)
const API_URL = "https://xxxx-xx-xxx-xxx.ngrok-free.app";
```

### Example Fetch Call

```javascript
async function analyzeFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${API_URL}/analyze`, {
    method: 'POST',
    body: formData
  });
  
  const result = await response.json();
  
  if (result.status === 'success') {
    localStorage.setItem('analysisResults', JSON.stringify(result.data));
    // Navigate to results page
  }
}
```

## 🐛 Troubleshooting

### Ngrok Connection Issues

**Problem:** "ngrok tunnel failed"
**Solution:** 
- Check your ngrok token is valid
- Ensure internet access (required on Kaggle)
- Try getting a new token from https://ngrok.com/

### File Upload Errors

**Problem:** "Unsupported file type"
**Solution:**
- Ensure file has extension: `.fasta`, `.fa`, `.fastq`, `.fq`, or `.txt`
- Check file is not corrupted

### CORS Errors

**Problem:** Frontend can't connect due to CORS
**Solution:**
- Already configured in `main.py` to allow all origins
- If issue persists, check browser console for specific error

### Memory Issues on Kaggle

**Problem:** "Out of memory"
**Solution:**
- Process smaller files
- Enable GPU in Kaggle settings (gives more RAM)
- Restart kernel and try again

## 📊 Supported File Formats

- **FASTA** (`.fasta`, `.fa`)
  ```
  >seq1
  ATCGATCGATCG
  >seq2
  GCTAGCTAGCTA
  ```

- **FASTQ** (`.fastq`, `.fq`)
  ```
  @seq1
  ATCGATCGATCG
  +
  IIIIIIIIIIII
  ```

## 🔒 Security Notes

- **Production:** Replace `allow_origins=["*"]` with your frontend domain
- **Ngrok Token:** Keep your token private
- **File Validation:** Backend validates file types and sizes

## 📈 Performance

- **Small files** (<100 sequences): ~1-3 seconds
- **Medium files** (100-1000 sequences): ~3-10 seconds
- **Large files** (1000+ sequences): ~10-30 seconds

Processing time depends on Kaggle/local machine resources.

## 🆘 Support

If you encounter issues:

1. Check Kaggle notebook logs
2. Verify all dependencies installed correctly
3. Ensure ngrok token is valid
4. Check internet connectivity
5. Review frontend API URL matches backend

## 📝 Example Kaggle Notebook Setup

```python
# Cell 1: Install dependencies
!pip install -q -r requirements.txt

# Cell 2: Run server
!python main.py

# Output will show:
# 📡 PUBLIC URL: https://xxxx.ngrok-free.app
# Copy this URL to your frontend!
```

## 🌟 Features

- ✅ FastAPI with automatic API documentation
- ✅ Ngrok tunneling for public access
- ✅ CORS configured for frontend access
- ✅ File validation and error handling
- ✅ Taxonomic classification
- ✅ Novelty detection
- ✅ Clustering visualization data
- ✅ Frontend-compatible JSON format

## 🔄 Development

To modify the analysis pipeline:

1. Edit `pipeline.py`
2. Modify `_analyze_sequences()` for custom logic
3. Update `_generate_taxonomy_summary()` for different groupings
4. Adjust `_generate_cluster_data()` for visualization

## 📄 License

Part of the Taxaformer project.
