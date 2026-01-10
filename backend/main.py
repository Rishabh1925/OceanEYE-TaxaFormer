"""
Taxaformer Backend API

This is the main FastAPI server that handles DNA sequence analysis requests.
It provides a REST API for uploading sequence files and getting taxonomic analysis results.
The server can run locally or use ngrok tunneling for hosting on Kaggle notebooks.

Author: Learning Developer (Age 16)
Purpose: Educational bioinformatics web API
Features: File upload, sequence analysis, CORS support, ngrok tunneling

Batch 2 Updates (9 hours):
- Improved error handling with specific error codes
- Better HTTP status codes for different error types
- Client-side file size check before upload
- Structured error responses with actionable messages
- Added centralized logging system with performance tracking
- Memory usage monitoring for large files
- Request/response logging with timing
- File validation statistics tracking
"""
import os
import shutil
import json
import psutil
from datetime import datetime
from typing import Dict, Any
import uvicorn
from fastapi import FastAPI, File, UploadFile, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pyngrok import ngrok
from pipeline import (
    TaxonomyPipeline, 
    PipelineError, 
    FileSizeError, 
    InvalidSequenceError, 
    EmptyFileError, 
    FileParseError
)
from logger import performance_logger

# Batch 2: Configuration constants for validation
MAX_UPLOAD_SIZE = 50 * 1024 * 1024  # 50MB - must match pipeline.py
ALLOWED_EXTENSIONS = ['.fasta', '.fa', '.fastq', '.fq', '.txt']

# Initialize FastAPI application with metadata
app = FastAPI(
    title="Taxaformer API",
    description="Taxonomic analysis pipeline for DNA sequences with enhanced error handling",
    version="1.1.0"  # Batch 2: Version bump
)

# Batch 2: Add request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all requests with timing and memory usage."""
    start_time = datetime.now()
    
    # Get memory usage before request
    process = psutil.Process()
    memory_before = process.memory_info().rss / 1024 / 1024  # MB
    
    # Process request
    response = await call_next(request)
    
    # Calculate metrics
    processing_time = (datetime.now() - start_time).total_seconds()
    memory_after = process.memory_info().rss / 1024 / 1024  # MB
    memory_used = memory_after - memory_before
    
    # Log request details
    performance_logger.log_performance_metrics(
        operation="http_request",
        duration=processing_time,
        additional_metrics={
            "method": request.method,
            "url": str(request.url),
            "status_code": response.status_code,
            "memory_before_mb": round(memory_before, 2),
            "memory_after_mb": round(memory_after, 2),
            "memory_used_mb": round(memory_used, 2),
            "client_ip": request.client.host if request.client else "unknown"
        }
    )
    
    return response

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
    
    Batch 2 Updates:
    - Returns specific error codes for different failure types
    - Validates file size before processing
    - Returns warnings for non-fatal issues
    - Better HTTP status codes (413 for too large, 422 for invalid content)
    
    Args:
        file (UploadFile): Uploaded sequence file (FASTA/FASTQ format)
            - Supported extensions: .fasta, .fa, .fastq, .fq, .txt
            - Maximum file size: 50MB
            - Must contain valid DNA sequences (A, T, G, C, N)
            
    Returns:
        Dict[str, Any]: Analysis results in JSON format:
            - status: "success" or "error"
            - data: Complete analysis results (if successful)
            - warnings: List of non-fatal issues encountered
            - error_code: Specific error code (if failed)
            - message: Error description (if failed)
            - suggestion: How to fix the error (if failed)
    """
    temp_filepath = None
    
    try:
        # Step 1: Validate that a filename was provided
        if not file.filename:
            return JSONResponse(
                status_code=400,
                content={
                    "status": "error",
                    "error_code": "NO_FILENAME",
                    "message": "No filename provided",
                    "suggestion": "Please select a file before uploading"
                }
            )
        
        # Step 2: Check if the file extension is supported
        file_ext = os.path.splitext(file.filename)[1].lower()
        if file_ext not in ALLOWED_EXTENSIONS:
            return JSONResponse(
                status_code=400,
                content={
                    "status": "error",
                    "error_code": "INVALID_FILE_TYPE",
                    "message": f"Unsupported file type: {file_ext}",
                    "suggestion": f"Please upload a file with one of these extensions: {', '.join(ALLOWED_EXTENSIONS)}",
                    "allowed_extensions": ALLOWED_EXTENSIONS
                }
            )
        
        # Step 3: Save the uploaded file to a temporary location
        temp_filepath = os.path.join(TEMP_DIR, f"temp_{datetime.now().timestamp()}_{file.filename}")
        
        # Write the uploaded file content to disk
        with open(temp_filepath, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Batch 2: Check file size after saving (more accurate than content-length header)
        file_size = os.path.getsize(temp_filepath)
        if file_size > MAX_UPLOAD_SIZE:
            # Clean up the oversized file
            os.remove(temp_filepath)
            return JSONResponse(
                status_code=413,  # Payload Too Large
                content={
                    "status": "error",
                    "error_code": "FILE_TOO_LARGE",
                    "message": f"File size ({file_size / 1024 / 1024:.2f}MB) exceeds maximum allowed (50MB)",
                    "suggestion": "Please upload a smaller file or split your sequences into multiple files",
                    "file_size_bytes": file_size,
                    "max_size_bytes": MAX_UPLOAD_SIZE
                }
            )
        
        print(f"Processing file: {file.filename} ({file_size} bytes)")
        
        # Batch 2: Log memory usage before processing
        process = psutil.Process()
        memory_before = process.memory_info().rss / 1024 / 1024  # MB
        performance_logger.log_performance_metrics(
            operation="file_upload",
            duration=0,
            additional_metrics={
                "filename": file.filename,
                "file_size_bytes": file_size,
                "memory_before_mb": round(memory_before, 2)
            }
        )
        
        # Step 4: Process the file through the analysis pipeline
        performance_logger.start_timer("pipeline_processing")
        start_time = datetime.now()
        result_data = pipeline.process_file(temp_filepath, file.filename)
        processing_time = performance_logger.end_timer("pipeline_processing")
        
        # Batch 2: Log memory usage after processing
        memory_after = process.memory_info().rss / 1024 / 1024  # MB
        memory_used = memory_after - memory_before
        
        # Step 5: Add processing time to the metadata
        if "metadata" in result_data:
            result_data["metadata"]["processingTime"] = f"{processing_time:.2f}s"
            result_data["metadata"]["memoryUsedMB"] = round(memory_used, 2)
        
        # Batch 2: Log successful processing with detailed metrics
        performance_logger.log_file_processing(
            filename=file.filename,
            file_size=file_size,
            sequence_count=result_data.get("metadata", {}).get("totalSequences", 0),
            processing_time=processing_time,
            warnings=result_data.get("warnings", [])
        )
        
        print(f"Analysis complete: {file.filename} ({processing_time:.2f}s, {memory_used:.1f}MB used)")
        
        # Step 6: Return the results with any warnings
        response = {
            "status": "success",
            "data": result_data
        }
        
        # Batch 2: Include warnings if any were generated
        if result_data.get("warnings"):
            response["warnings"] = result_data["warnings"]
            response["warning_count"] = len(result_data["warnings"])
        
        return response
    
    # Batch 2: Handle specific pipeline errors with appropriate status codes and logging
    except FileSizeError as e:
        performance_logger.log_error("FILE_TOO_LARGE", e.message, file.filename, e.details)
        return JSONResponse(
            status_code=413,
            content={
                "status": "error",
                "error_code": e.error_code,
                "message": e.message,
                "suggestion": "Please upload a smaller file (max 50MB)",
                "details": e.details
            }
        )
    
    except EmptyFileError as e:
        performance_logger.log_error("EMPTY_FILE", e.message, file.filename, e.details)
        return JSONResponse(
            status_code=422,  # Unprocessable Entity
            content={
                "status": "error",
                "error_code": e.error_code,
                "message": e.message,
                "suggestion": "Please ensure your file contains valid FASTA/FASTQ sequences with headers (>) and DNA data",
                "details": e.details
            }
        )
    
    except InvalidSequenceError as e:
        performance_logger.log_error("INVALID_SEQUENCE", e.message, file.filename, e.details)
        return JSONResponse(
            status_code=422,
            content={
                "status": "error",
                "error_code": e.error_code,
                "message": e.message,
                "suggestion": "Please check your sequences contain only valid DNA characters (A, T, G, C, N)",
                "details": e.details
            }
        )
    
    except FileParseError as e:
        performance_logger.log_error("PARSE_ERROR", e.message, file.filename, e.details)
        return JSONResponse(
            status_code=422,
            content={
                "status": "error",
                "error_code": e.error_code,
                "message": e.message,
                "suggestion": "Please ensure your file is in valid FASTA or FASTQ format",
                "details": e.details
            }
        )
    
    except PipelineError as e:
        performance_logger.log_error("PIPELINE_ERROR", e.message, file.filename, e.details)
        # Catch-all for other pipeline errors
        return JSONResponse(
            status_code=500,
            content={
                "status": "error",
                "error_code": e.error_code,
                "message": e.message,
                "details": e.details
            }
        )
        
    except HTTPException:
        raise
        
    except Exception as e:
        performance_logger.log_error("UNEXPECTED_ERROR", str(e), getattr(file, 'filename', 'unknown'))
        print(f"Error processing file: {str(e)}")
        import traceback
        traceback.print_exc()
        
        return JSONResponse(
            status_code=500,
            content={
                "status": "error",
                "error_code": "INTERNAL_ERROR",
                "message": f"Analysis failed: {str(e)}",
                "suggestion": "Please try again or contact support if the problem persists"
            }
        )
        
    finally:
        if temp_filepath and os.path.exists(temp_filepath):
            try:
                os.remove(temp_filepath)
            except Exception as e:
                print(f"Warning: Could not delete temp file: {e}")


@app.get("/health")
async def health_check():
    """
    Detailed health check endpoint for monitoring and debugging.
    
    Batch 2 Updates:
    - Added performance statistics
    - Memory usage monitoring
    - Processing queue status
    """
    process = psutil.Process()
    memory_info = process.memory_info()
    
    return {
        "status": "healthy",
        "pipeline": "initialized",
        "temp_dir": os.path.exists(TEMP_DIR),
        "timestamp": datetime.utcnow().isoformat(),
        "performance_stats": performance_logger.get_stats(),
        "system_info": {
            "memory_usage_mb": round(memory_info.rss / 1024 / 1024, 2),
            "cpu_percent": psutil.cpu_percent(),
            "disk_usage_percent": psutil.disk_usage('.').percent
        }
    }


@app.get("/stats")
async def get_performance_stats():
    """
    Batch 2: New endpoint for detailed performance statistics.
    
    Returns processing metrics, error rates, and system performance data.
    Useful for monitoring and optimization.
    """
    stats = performance_logger.get_stats()
    process = psutil.Process()
    
    return {
        "processing_stats": stats,
        "system_metrics": {
            "memory_usage_mb": round(process.memory_info().rss / 1024 / 1024, 2),
            "cpu_percent": psutil.cpu_percent(interval=1),
            "available_memory_mb": round(psutil.virtual_memory().available / 1024 / 1024, 2),
            "disk_free_gb": round(psutil.disk_usage('.').free / 1024 / 1024 / 1024, 2)
        },
        "error_rate": round(stats["errors"] / max(stats["files_processed"], 1) * 100, 2),
        "warning_rate": round(stats["warnings"] / max(stats["total_sequences"], 1) * 100, 2),
        "timestamp": datetime.utcnow().isoformat()
    }


def start_server(port: int = 8000, use_ngrok: bool = True, ngrok_token: str = None):
    """
    Start the FastAPI server with optional ngrok tunneling.
    
    Batch 2 Updates:
    - Added startup logging
    - Performance monitoring initialization
    """
    # Batch 2: Log application startup
    performance_logger.log_startup()
    
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
