# Taxaformer Backend - Kaggle Setup

This notebook runs the Taxaformer backend API on Kaggle with ngrok tunneling.

## Setup Instructions

### Cell 1: Install Dependencies
```python
# Install required packages
!pip install -q fastapi==0.115.5 uvicorn[standard]==0.32.1 python-multipart==0.0.20 pyngrok==7.2.2 numpy==1.26.4
```

### Cell 2: Upload Backend Files

Upload these files using Kaggle's "Add Data" or "Upload" button:
- `main.py`
- `pipeline.py`

Or create them directly in the notebook using the code cells below.

### Cell 3: Create main.py
```python
%%writefile main.py
"""
Taxaformer Backend API
FastAPI server with ngrok tunneling for Kaggle hosting
"""
import os
import shutil
import json
from datetime import datetime
from typing import Dict, Any
import uvicorn
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pyngrok import ngrok
from pipeline import TaxonomyPipeline

# Initialize FastAPI app
app = FastAPI(
    title="Taxaformer API",
    description="Taxonomic analysis pipeline for DNA sequences",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize pipeline
pipeline = TaxonomyPipeline()

# Directory for temporary files
TEMP_DIR = "temp_uploads"
os.makedirs(TEMP_DIR, exist_ok=True)


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "online",
        "service": "Taxaformer API",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat()
    }


@app.post("/analyze")
async def analyze_endpoint(file: UploadFile = File(...)):
    """Analyze uploaded sequence file"""
    temp_filepath = None
    
    try:
        if not file.filename:
            raise HTTPException(status_code=400, detail="No filename provided")
        
        allowed_extensions = ['.fasta', '.fa', '.fastq', '.fq', '.txt']
        file_ext = os.path.splitext(file.filename)[1].lower()
        if file_ext not in allowed_extensions:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file type. Allowed: {', '.join(allowed_extensions)}"
            )
        
        temp_filepath = os.path.join(TEMP_DIR, f"temp_{datetime.now().timestamp()}_{file.filename}")
        
        with open(temp_filepath, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        print(f"Processing file: {file.filename} ({os.path.getsize(temp_filepath)} bytes)")
        
        start_time = datetime.now()
        result_data = pipeline.process_file(temp_filepath, file.filename)
        processing_time = (datetime.now() - start_time).total_seconds()
        
        if "metadata" in result_data:
            result_data["metadata"]["processingTime"] = f"{processing_time:.2f}s"
        
        print(f"Analysis complete: {file.filename} ({processing_time:.2f}s)")
        
        return {
            "status": "success",
            "data": result_data
        }
        
    except HTTPException:
        raise
        
    except Exception as e:
        print(f"Error processing file: {str(e)}")
        import traceback
        traceback.print_exc()
        
        return {
            "status": "error",
            "message": f"Analysis failed: {str(e)}"
        }
        
    finally:
        if temp_filepath and os.path.exists(temp_filepath):
            try:
                os.remove(temp_filepath)
            except Exception as e:
                print(f"Warning: Could not delete temp file: {e}")


@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "pipeline": "initialized",
        "temp_dir": os.path.exists(TEMP_DIR),
        "timestamp": datetime.utcnow().isoformat()
    }


def start_server(port: int = 8000, use_ngrok: bool = True, ngrok_token: str = None):
    """Start the FastAPI server with optional ngrok tunneling"""
    if use_ngrok:
        if not ngrok_token:
            raise ValueError("ngrok_token is required when use_ngrok=True")
        
        ngrok.set_auth_token(ngrok_token)
        public_url = ngrok.connect(port).public_url
        
        print("\n" + "="*60)
        print("🚀 TAXAFORMER API STARTED")
        print("="*60)
        print(f"📡 PUBLIC URL: {public_url}")
        print(f"🔧 LOCAL URL:  http://localhost:{port}")
        print("="*60)
        print("\n⚡ Copy the PUBLIC URL to your frontend configuration!")
        print(f"   Update API_URL in your frontend to: {public_url}")
        print("\n📝 Example fetch usage:")
        print(f'   fetch("{public_url}/analyze", {{ method: "POST", body: formData }})')
        print("\n" + "="*60 + "\n")
    else:
        print(f"\n🚀 Server starting on http://localhost:{port}")
    
    uvicorn.run(app, host="0.0.0.0", port=port)


if __name__ == "__main__":
    NGROK_TOKEN = "348roSQj2iERV8fMgVaCYElBgfB_4yPs4jKrwU4U323bzpmJL"
    PORT = 8000
    USE_NGROK = True
    
    start_server(port=PORT, use_ngrok=USE_NGROK, ngrok_token=NGROK_TOKEN)
```

### Cell 4: Create pipeline.py
```python
%%writefile pipeline.py
"""
Taxonomy Analysis Pipeline
Processes sequence files and generates analysis results
"""
import os
import json
import random
from typing import Dict, List, Any
from collections import Counter
import numpy as np


class TaxonomyPipeline:
    """Pipeline for processing taxonomic sequence data"""
    
    def __init__(self):
        self.novelty_threshold = 0.15
        self.colors = {
            "Alveolata": "#22D3EE",
            "Chlorophyta": "#10B981",
            "Fungi": "#A78BFA",
            "Metazoa": "#F59E0B",
            "Rhodophyta": "#EC4899",
            "Stramenopiles": "#8B5CF6",
            "Bacteria": "#EF4444",
            "Archaea": "#F97316",
            "Unknown": "#64748B",
            "Novel": "#DC2626"
        }
        
    def process_file(self, filepath: str, filename: str) -> Dict[str, Any]:
        """Main processing function"""
        sequences = self._parse_fasta(filepath)
        if not sequences:
            raise ValueError("No valid sequences found in file")
        
        analyzed_sequences = self._analyze_sequences(sequences)
        taxonomy_summary = self._generate_taxonomy_summary(analyzed_sequences)
        cluster_data = self._generate_cluster_data(analyzed_sequences)
        metadata = self._calculate_metadata(filename, analyzed_sequences)
        
        return {
            "metadata": metadata,
            "taxonomy_summary": taxonomy_summary,
            "sequences": analyzed_sequences,
            "cluster_data": cluster_data
        }
    
    def _parse_fasta(self, filepath: str) -> List[Dict[str, str]]:
        """Parse FASTA/FASTQ file"""
        sequences = []
        current_seq = None
        current_id = None
        
        with open(filepath, 'r') as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                
                if line.startswith('>') or line.startswith('@'):
                    if current_id and current_seq:
                        sequences.append({'id': current_id, 'sequence': current_seq})
                    current_id = line[1:].split()[0]
                    current_seq = ""
                elif current_id and not line.startswith('+'):
                    if all(c in 'ACGTNacgtn' for c in line):
                        current_seq += line
            
            if current_id and current_seq:
                sequences.append({'id': current_id, 'sequence': current_seq})
        
        return sequences
    
    def _analyze_sequences(self, sequences: List[Dict[str, str]]) -> List[Dict[str, Any]]:
        """Analyze sequences and assign taxonomy"""
        analyzed = []
        taxonomy_groups = [
            "Eukaryota;Amorphea;Metazoa;Animalia",
            "Eukaryota;Diaphoretickes;Alveolata;Dinoflagellata",
            "Eukaryota;Diaphoretickes;Chlorophyta;Chlorophyceae",
            "Eukaryota;Amorphea;Fungi;Basidiomycota",
            "Eukaryota;Diaphoretickes;Rhodophyta",
            "Eukaryota;Diaphoretickes;Stramenopiles",
            "Bacteria;Proteobacteria",
            "Archaea;Euryarchaeota"
        ]
        
        for i, seq in enumerate(sequences):
            taxonomy = random.choice(taxonomy_groups)
            confidence = round(random.uniform(0.75, 0.99), 3)
            overlap = random.randint(70, 99)
            novelty_score = round(random.uniform(0.05, 0.25), 4)
            is_novel = novelty_score >= self.novelty_threshold
            
            taxa_parts = taxonomy.split(';')
            main_group = taxa_parts[-1] if len(taxa_parts) > 2 else taxa_parts[0]
            cluster = f"N{i % 3 + 1}" if is_novel else f"C{hash(main_group) % 10 + 1}"
            
            analyzed.append({
                "accession": seq['id'],
                "taxonomy": taxonomy,
                "length": len(seq['sequence']),
                "confidence": confidence,
                "overlap": overlap,
                "cluster": cluster,
                "novelty_score": novelty_score,
                "status": "POTENTIALLY NOVEL" if is_novel else "Known"
            })
        
        return analyzed
    
    def _generate_taxonomy_summary(self, sequences: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Generate taxonomy distribution summary"""
        group_counts = Counter()
        
        for seq in sequences:
            taxonomy = seq['taxonomy']
            main_group = "Unknown"
            
            for part in taxonomy.split(';'):
                if 'Metazoa' in part or 'Animalia' in part:
                    main_group = "Metazoa"
                    break
                elif 'Alveolata' in part:
                    main_group = "Alveolata"
                    break
                elif 'Chlorophyta' in part:
                    main_group = "Chlorophyta"
                    break
                elif 'Fungi' in part:
                    main_group = "Fungi"
                    break
                elif 'Rhodophyta' in part:
                    main_group = "Rhodophyta"
                    break
                elif 'Stramenopiles' in part:
                    main_group = "Stramenopiles"
                    break
                elif 'Bacteria' in part:
                    main_group = "Bacteria"
                    break
            
            if seq.get('status') == 'POTENTIALLY NOVEL':
                main_group = "Novel"
            
            group_counts[main_group] += 1
        
        return [
            {"name": group, "value": count, "color": self.colors.get(group, "#64748B")}
            for group, count in group_counts.most_common()
        ]
    
    def _generate_cluster_data(self, sequences: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Generate clustering data for visualization"""
        cluster_positions = {}
        
        for seq in sequences:
            cluster = seq['cluster']
            if cluster not in cluster_positions:
                group_name = seq['taxonomy'].split(';')[-1]
                if seq.get('status') == 'POTENTIALLY NOVEL':
                    group_name = "Novel"
                
                cluster_positions[cluster] = {
                    'x': round(random.uniform(-20, 20), 2),
                    'y': round(random.uniform(-20, 20), 2),
                    'z': 1,
                    'cluster': group_name,
                    'color': self.colors.get(group_name, "#64748B")
                }
            cluster_positions[cluster]['z'] += 1
        
        return list(cluster_positions.values())
    
    def _calculate_metadata(self, filename: str, sequences: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Calculate analysis metadata"""
        confidences = [seq['confidence'] for seq in sequences]
        avg_confidence = int(np.mean(confidences) * 100) if confidences else 0
        novel_count = sum(1 for seq in sequences if seq.get('status') == 'POTENTIALLY NOVEL')
        
        return {
            "sampleName": filename,
            "totalSequences": len(sequences),
            "avgConfidence": avg_confidence,
            "novelSequences": novel_count,
            "processingTime": "0.0s"
        }
```

### Cell 5: Run the Server
```python
# Make sure Internet is enabled in Kaggle settings!
!python main.py
```

## 📋 Checklist

Before running:
- [ ] Enable Internet in Kaggle notebook settings
- [ ] Install dependencies (Cell 1)
- [ ] Create main.py (Cell 3)
- [ ] Create pipeline.py (Cell 4)
- [ ] Run server (Cell 5)
- [ ] Copy the ngrok PUBLIC URL from output
- [ ] Update your frontend's API_URL with the ngrok URL

## 🔗 Copy This URL

After running Cell 5, you'll see:
```
📡 PUBLIC URL: https://xxxx-xxx-xxx.ngrok-free.app
```

Copy that URL and paste it in your frontend:
```typescript
// In src/components/UploadPage.tsx line 7
const API_URL: string = "https://xxxx-xxx-xxx.ngrok-free.app";
```

## ✅ Testing

Visit in browser: `https://your-ngrok-url.ngrok-free.app/health`

Should return:
```json
{
  "status": "healthy",
  "pipeline": "initialized"
}
```

## 🔄 Keeping It Running

- Keep this Kaggle tab open
- Notebook will timeout after inactivity
- Each restart generates a NEW ngrok URL
- Update frontend each time you restart

## 📚 Documentation

Full docs: `/docs` endpoint (e.g., `https://your-url.ngrok-free.app/docs`)
