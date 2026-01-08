# TaxaFormer

AI-powered environmental DNA (eDNA) classification platform using transformer-based deep learning for marine biodiversity analysis.

Live Demo: https://taxaformer-sih-oceaneye.vercel.app

## Overview

TaxaFormer is a full-stack web application that leverages the Nucleotide Transformer model to classify environmental DNA sequences. The platform provides taxonomic classification from domain to genus level, with novelty detection capabilities for identifying potentially undiscovered species. It is designed for marine biologists, ecologists, and researchers working with eDNA metabarcoding data.

## Key Features

- Transformer-based DNA sequence classification using fine-tuned Nucleotide Transformer (100M parameters)
- PR2 and SILVA reference database integration for comprehensive taxonomic matching
- Novelty detection using k-NN clustering on transformer embeddings
- Interactive data visualizations including pie charts, bar charts, and scatter plots
- Biodiversity metrics calculation (Shannon index, Simpson index, species richness)
- Batch processing with queue management for multiple concurrent users
- Database caching via Supabase for improved performance on repeated analyses
- PDF report generation for analysis results
- Sample file library with pre-analyzed datasets for demonstration

## Architecture

```
taxaformer/
├── src/                          # Frontend (Next.js 16 + React 19)
│   ├── app/                      # Next.js app router
│   ├── components/               # React components
│   │   ├── charts/               # Data visualization components
│   │   ├── figma/                # Design system components
│   │   └── ui/                   # UI primitives (shadcn/ui)
│   └── utils/                    # Client utilities and API helpers
├── backend/                      # Python FastAPI backend
│   ├── main.py                   # Main API server with ngrok tunneling
│   ├── pipeline.py               # ML inference pipeline
│   ├── queue_system.py           # Job queue for concurrent processing
│   └── analytics_api.py          # Usage analytics endpoints
├── db/                           # Database layer
│   ├── supabase_schema.sql       # Main database schema
│   ├── analytics_schema.sql      # User analytics schema
│   └── connection.py             # Database connection utilities
├── notebooks/                    # Jupyter notebooks
│   └── taxaformer_model.ipynb    # Model training and inference notebook
└── public/                       # Static assets and sample results
```

## Technology Stack

### Frontend
- Next.js 16 with App Router
- React 19 with React Compiler
- Tailwind CSS 4 for styling
- Recharts and React Google Charts for visualizations
- Radix UI primitives via shadcn/ui
- GSAP for animations
- Leaflet for geographic mapping

### Backend
- FastAPI for REST API
- PyTorch with Hugging Face Transformers
- PEFT (Parameter-Efficient Fine-Tuning) for LoRA adapters
- Biopython for sequence parsing
- scikit-learn for k-NN classification
- pyngrok for tunnel hosting from Kaggle

### Database
- Supabase (PostgreSQL) for data persistence
- File hash-based caching for idempotent analysis

### ML Model
- Base: InstaDeepAI/nucleotide-transformer-v2-100m-multi-species
- Fine-tuned with LoRA adapters on marine eDNA reference sequences
- 4-bit quantization for efficient GPU inference

## Getting Started

### Prerequisites

- Node.js 20+ (see .nvmrc)
- Python 3.11+
- GPU with CUDA support (recommended for backend inference)

### Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
npm start
```

The frontend will be available at http://localhost:3000

### Backend Setup

```bash
cd backend

# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the API server
python main.py
```

The backend API will start on port 8000. If ngrok is configured, a public URL will be generated for remote access.

### Database Setup

1. Create a Supabase project at https://supabase.com
2. Run the SQL scripts in the `db/` folder via the Supabase SQL Editor:
   - `supabase_schema.sql` - Core tables for analysis jobs and sequences
   - `analytics_schema.sql` - Optional user analytics tables
3. Copy your project URL and anon key

### Environment Variables

Create a `.env.local` file in the project root:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

For the backend, set environment variables or update the configuration in `main.py`:

```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
NGROK_TOKEN=your_ngrok_token  # Optional, for remote hosting
```

## Usage

1. Navigate to the Upload page
2. Either drag and drop a FASTA/FASTQ file or select from the sample library
3. Optionally add sample metadata (location, environmental parameters)
4. Click "Analyze" to submit the file for processing
5. View results on the Output page with interactive visualizations
6. Export results as CSV or generate a PDF report

### Supported File Formats

- FASTA (.fasta, .fa, .fna)
- FASTQ (.fastq, .fq)
- Plain text with sequences (.txt)

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Health check |
| `/health` | GET | Detailed health status |
| `/analyze` | POST | Submit file for analysis |
| `/queue/status` | GET | Get queue status for session |
| `/queue/stats` | GET | Get overall queue statistics |

## Model Training

The Jupyter notebook in `notebooks/taxaformer_model.ipynb` contains the complete training pipeline:

1. Data preparation from PR2/SILVA reference databases
2. Sequence normalization and chunking
3. Fine-tuning with LoRA adapters
4. Embedding generation for reference sequences
5. k-NN index construction for classification

The notebook is designed to run on Kaggle with GPU acceleration.

## Database Schema

### Core Tables

- `analysis_jobs` - Stores analysis metadata and results
- `sequences` - Individual sequence classifications
- `samples` - Sample metadata for multi-sample comparisons

### Analytics Tables (Optional)

- `user_sessions` - Anonymous session tracking
- `page_views` - Page visit analytics
- `user_interactions` - Feature usage tracking
- `analytics_summary` - Aggregated daily statistics

## Performance Considerations

- File hash-based caching prevents redundant processing of identical files
- Queue system limits concurrent processing to prevent GPU memory issues
- 4-bit quantization reduces model memory footprint by 4x
- Smart batching with length-sorted sequences minimizes padding overhead
- Sequence deduplication reduces redundant inference on identical reads

## Contributing

Contributions are welcome. Please ensure code follows the existing style and includes appropriate tests.

## License

MIT

## Acknowledgments

- InstaDeep for the Nucleotide Transformer model
- PR2 and SILVA databases for reference sequences
- Supabase for database infrastructure
