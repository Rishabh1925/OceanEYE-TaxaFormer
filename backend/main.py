"""
Taxaformer Backend API

This is the main FastAPI server that handles DNA sequence analysis requests.
It provides a REST API for uploading sequence files and getting taxonomic analysis results.
The server can run locally or use ngrok tunneling for hosting on Kaggle notebooks.

Author: Learning Developer (Age 16)
Purpose: Educational bioinformatics web API
Features: File upload, sequence analysis, CORS support, ngrok tunneling
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

# Initialize FastAPI application with metadata
# This creates the main web API that handles HTTP requests
app = FastAPI(
    title="Taxaformer API",
    description="Taxonomic analysis pipeline for DNA sequences",
    version="1.0.0"
)

# Configure Cross-Origin Resource Sharing (CORS)
# This allows the frontend (running on a different port) to make requests to this API
# In production, you should specify your actual frontend domain instead of "*"
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow requests from any origin (for development)
    allow_credentials=True,  # Allow cookies and authentication headers
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Initialize the taxonomy analysis pipeline
# This is the core component that processes DNA sequences
pipeline = TaxonomyPipeline()

# Directory for storing temporary uploaded files
# Files are saved here briefly during processing, then deleted
TEMP_DIR = "temp_uploads"
os.makedirs(TEMP_DIR, exist_ok=True)  # Create directory if it doesn't exist


@app.get("/")
async def root():
    """
    Root endpoint - basic health check and API information.
    
    This is the main landing page for the API. It returns basic information
    about the service status and current timestamp.
    
    Returns:
        Dict[str, str]: API status information including:
            - status: "online" if the API is running
            - service: Name of the service
            - version: Current API version
            - timestamp: Current UTC timestamp
            
    Example:
        GET / 
        Response: {
            "status": "online",
            "service": "Taxaformer API", 
            "version": "1.0.0",
            "timestamp": "2024-01-08T10:30:00.000Z"
        }
    """
    return {
        "status": "online",
        "service": "Taxaformer API",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat()
    }


@app.post("/analyze")
async def analyze_endpoint(file: UploadFile = File(...)):
    """
    Main analysis endpoint - processes uploaded DNA sequence files.
    
    This is the core endpoint that accepts FASTA/FASTQ files and returns
    taxonomic analysis results. The file is temporarily saved, processed
    through the analysis pipeline, and then deleted.
    
    Args:
        file (UploadFile): Uploaded sequence file (FASTA/FASTQ format)
            - Supported extensions: .fasta, .fa, .fastq, .fq, .txt
            - File size should be reasonable (no explicit limit set)
            - Must contain valid DNA sequences (A, T, G, C, N)
            
    Returns:
        Dict[str, Any]: Analysis results in JSON format:
            - status: "success" or "error"
            - data: Complete analysis results (if successful)
                - metadata: File statistics and processing info
                - taxonomy_summary: Counts by taxonomic group
                - sequences: Detailed results for each sequence
                - cluster_data: 3D visualization coordinates
            - message: Error description (if failed)
            
    Raises:
        HTTPException: 400 error for invalid files or missing filename
        
    Example:
        POST /analyze
        Content-Type: multipart/form-data
        Body: [FASTA file content]
        
        Response: {
            "status": "success",
            "data": {
                "metadata": {"totalSequences": 10, "avgConfidence": 85, ...},
                "taxonomy_summary": [{"name": "Bacteria", "value": 5, "color": "#EF4444"}, ...],
                "sequences": [...],
                "cluster_data": [...]
            }
        }
    """
    temp_filepath = None
    
    try:
        # Step 1: Validate that a filename was provided
        if not file.filename:
            raise HTTPException(status_code=400, detail="No filename provided")
        
        # Step 2: Check if the file extension is supported
        # We only accept common sequence file formats
        allowed_extensions = ['.fasta', '.fa', '.fastq', '.fq', '.txt']
        file_ext = os.path.splitext(file.filename)[1].lower()
        if file_ext not in allowed_extensions:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file type. Allowed: {', '.join(allowed_extensions)}"
            )
        
        # Step 3: Save the uploaded file to a temporary location
        # We use timestamp to ensure unique filenames and avoid conflicts
        temp_filepath = os.path.join(TEMP_DIR, f"temp_{datetime.now().timestamp()}_{file.filename}")
        
        # Write the uploaded file content to disk
        with open(temp_filepath, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Log the file processing start (helpful for debugging)
        file_size = os.path.getsize(temp_filepath)
        print(f"Processing file: {file.filename} ({file_size} bytes)")
        
        # Step 4: Process the file through the analysis pipeline
        # Time the processing to provide performance feedback
        start_time = datetime.now()
        result_data = pipeline.process_file(temp_filepath, file.filename)
        processing_time = (datetime.now() - start_time).total_seconds()
        
        # Step 5: Add processing time to the metadata
        # This helps users understand performance and provides debugging info
        if "metadata" in result_data:
            result_data["metadata"]["processingTime"] = f"{processing_time:.2f}s"
        
        # Log successful completion
        print(f"Analysis complete: {file.filename} ({processing_time:.2f}s)")
        
        # Step 6: Return the results in the expected format
        return {
            "status": "success",
            "data": result_data
        }
        
    except HTTPException:
        # Re-raise HTTP exceptions (like 400 errors) without modification
        raise
        
    except Exception as e:
        # Handle any other errors that occur during processing
        print(f"Error processing file: {str(e)}")
        import traceback
        traceback.print_exc()  # Print full error traceback for debugging
        
        # Return a user-friendly error response
        return {
            "status": "error",
            "message": f"Analysis failed: {str(e)}"
        }
        
    finally:
        # Step 7: Clean up the temporary file (always runs, even if there's an error)
        if temp_filepath and os.path.exists(temp_filepath):
            try:
                os.remove(temp_filepath)
            except Exception as e:
                # Log cleanup errors but don't fail the request
                print(f"Warning: Could not delete temp file: {e}")


@app.get("/health")
async def health_check():
    """
    Detailed health check endpoint for monitoring and debugging.
    
    This endpoint provides more detailed information about the API status
    than the root endpoint. It's useful for monitoring systems and debugging.
    
    Returns:
        Dict[str, Any]: Detailed health information:
            - status: Overall health status
            - pipeline: Whether the analysis pipeline is initialized
            - temp_dir: Whether the temporary directory exists
            - timestamp: Current UTC timestamp
            
    Example:
        GET /health
        Response: {
            "status": "healthy",
            "pipeline": "initialized", 
            "temp_dir": true,
            "timestamp": "2024-01-08T10:30:00.000Z"
        }
    """
    return {
        "status": "healthy",
        "pipeline": "initialized",
        "temp_dir": os.path.exists(TEMP_DIR),
        "timestamp": datetime.utcnow().isoformat()
    }


def start_server(port: int = 8000, use_ngrok: bool = True, ngrok_token: str = None):
    """
    Start the FastAPI server with optional ngrok tunneling.
    
    This function handles server startup and can optionally create an ngrok tunnel
    for public access. This is especially useful when running on Kaggle notebooks
    where you need external access to the API.
    
    Args:
        port (int): Port number to run the server on (default: 8000)
        use_ngrok (bool): Whether to create an ngrok tunnel (default: True)
        ngrok_token (str): Ngrok authentication token (required if use_ngrok=True)
            Get your token from: https://dashboard.ngrok.com/get-started/your-authtoken
            
    Raises:
        ValueError: If ngrok_token is not provided when use_ngrok=True
        Exception: If ngrok tunnel creation fails
        
    Example:
        # Start with ngrok tunnel (for Kaggle/Colab)
        start_server(port=8000, use_ngrok=True, ngrok_token="your_token_here")
        
        # Start locally only
        start_server(port=8000, use_ngrok=False)
    """
    if use_ngrok:
        # Validate that ngrok token is provided
        if not ngrok_token:
            raise ValueError("ngrok_token is required when use_ngrok=True")
        
        # Set the ngrok authentication token
        ngrok.set_auth_token(ngrok_token)
        
        # Clean up any existing ngrok tunnels to avoid conflicts
        try:
            tunnels = ngrok.get_tunnels()
            for tunnel in tunnels:
                print(f"Closing existing tunnel: {tunnel.public_url}")
                ngrok.disconnect(tunnel.public_url)
        except Exception as e:
            print(f"Note: {e}")
        
        # Create the ngrok tunnel
        try:
            public_url = ngrok.connect(port).public_url
            
            # Display startup information with clear instructions
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
            
        except Exception as e:
            # Provide helpful error messages and solutions
            print(f"\n❌ Failed to create ngrok tunnel: {e}")
            print("\n💡 Try these solutions:")
            print("1. Check if ngrok is already running elsewhere")
            print("2. Get a new auth token from: https://dashboard.ngrok.com/")
            print("3. Run without ngrok: Set USE_NGROK = False in main.py")
            raise
    else:
        # Local-only startup message
        print(f"\n🚀 Server starting on http://localhost:{port}")
        print("⚠️  No ngrok tunnel - local access only\n")
    
    # Start the FastAPI server using uvicorn
    # host="0.0.0.0" allows connections from any IP (needed for ngrok)
    uvicorn.run(app, host="0.0.0.0", port=port)


# Main execution block - runs when this file is executed directly
if __name__ == "__main__":
    # Server configuration
    # TODO: Move these to environment variables for better security
    NGROK_TOKEN = "348roSQj2iERV8fMgVaCYElBgfB_4yPs4jKrwU4U323bzpmJL"  # Your ngrok auth token
    PORT = 8000  # Port to run the server on
    USE_NGROK = True  # Set to False for local testing without tunnel
    
    # Start the server with the configured settings
    start_server(port=PORT, use_ngrok=USE_NGROK, ngrok_token=NGROK_TOKEN)
