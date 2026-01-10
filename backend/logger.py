"""
Centralized Logging System for Taxaformer Backend

This module provides structured logging with file rotation and performance tracking.
Created during Batch 2 development to improve debugging and monitoring capabilities.

Author: Learning Developer (Age 16)
Purpose: Production-ready logging for bioinformatics pipeline
"""
import os
import logging
import json
from datetime import datetime
from typing import Dict, Any, Optional
from logging.handlers import RotatingFileHandler
import time


class PerformanceLogger:
    """
    Custom logger for tracking pipeline performance and errors.
    
    Features:
    - Structured JSON logging for easy parsing
    - File rotation to prevent disk space issues
    - Performance timing for each processing step
    - Error categorization with context
    """
    
    def __init__(self, log_dir: str = "logs"):
        """Initialize the logger with file rotation."""
        self.log_dir = log_dir
        os.makedirs(log_dir, exist_ok=True)
        
        # Create main logger
        self.logger = logging.getLogger("taxaformer")
        self.logger.setLevel(logging.INFO)
        
        # Prevent duplicate handlers
        if not self.logger.handlers:
            # File handler with rotation (10MB max, keep 5 files)
            file_handler = RotatingFileHandler(
                os.path.join(log_dir, "taxaformer.log"),
                maxBytes=10*1024*1024,  # 10MB
                backupCount=5
            )
            
            # Console handler for development
            console_handler = logging.StreamHandler()
            
            # JSON formatter for structured logs
            formatter = logging.Formatter(
                '%(asctime)s | %(levelname)s | %(message)s'
            )
            
            file_handler.setFormatter(formatter)
            console_handler.setFormatter(formatter)
            
            self.logger.addHandler(file_handler)
            self.logger.addHandler(console_handler)
        
        # Performance tracking
        self.timers: Dict[str, float] = {}
        self.stats: Dict[str, Any] = {
            "files_processed": 0,
            "total_sequences": 0,
            "errors": 0,
            "warnings": 0,
            "avg_processing_time": 0.0
        }
    
    def start_timer(self, operation: str) -> None:
        """Start timing an operation."""
        self.timers[operation] = time.time()
    
    def end_timer(self, operation: str) -> float:
        """End timing and return duration."""
        if operation in self.timers:
            duration = time.time() - self.timers[operation]
            del self.timers[operation]
            return duration
        return 0.0
    
    def log_file_processing(self, filename: str, file_size: int, sequence_count: int, 
                           processing_time: float, warnings: list = None) -> None:
        """Log successful file processing with performance metrics."""
        log_data = {
            "event": "file_processed",
            "filename": filename,
            "file_size_bytes": file_size,
            "file_size_mb": round(file_size / 1024 / 1024, 2),
            "sequence_count": sequence_count,
            "processing_time_seconds": round(processing_time, 3),
            "sequences_per_second": round(sequence_count / processing_time if processing_time > 0 else 0, 2),
            "warning_count": len(warnings) if warnings else 0,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        # Update stats
        self.stats["files_processed"] += 1
        self.stats["total_sequences"] += sequence_count
        if warnings:
            self.stats["warnings"] += len(warnings)
        
        # Update average processing time
        total_files = self.stats["files_processed"]
        self.stats["avg_processing_time"] = (
            (self.stats["avg_processing_time"] * (total_files - 1) + processing_time) / total_files
        )
        
        self.logger.info(f"FILE_PROCESSED | {json.dumps(log_data)}")
    
    def log_error(self, error_type: str, error_message: str, filename: str = None, 
                  context: Dict[str, Any] = None) -> None:
        """Log errors with structured context."""
        log_data = {
            "event": "error",
            "error_type": error_type,
            "error_message": error_message,
            "filename": filename,
            "context": context or {},
            "timestamp": datetime.utcnow().isoformat()
        }
        
        self.stats["errors"] += 1
        self.logger.error(f"ERROR | {json.dumps(log_data)}")
    
    def log_validation_warning(self, warning_type: str, details: Dict[str, Any]) -> None:
        """Log validation warnings."""
        log_data = {
            "event": "validation_warning",
            "warning_type": warning_type,
            "details": details,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        self.stats["warnings"] += 1
        self.logger.warning(f"VALIDATION_WARNING | {json.dumps(log_data)}")
    
    def log_performance_metrics(self, operation: str, duration: float, 
                               additional_metrics: Dict[str, Any] = None) -> None:
        """Log performance metrics for specific operations."""
        log_data = {
            "event": "performance_metric",
            "operation": operation,
            "duration_seconds": round(duration, 3),
            "metrics": additional_metrics or {},
            "timestamp": datetime.utcnow().isoformat()
        }
        
        self.logger.info(f"PERFORMANCE | {json.dumps(log_data)}")
    
    def get_stats(self) -> Dict[str, Any]:
        """Get current performance statistics."""
        return {
            **self.stats,
            "uptime_hours": (time.time() - self.start_time) / 3600 if hasattr(self, 'start_time') else 0
        }
    
    def log_startup(self) -> None:
        """Log application startup."""
        self.start_time = time.time()
        log_data = {
            "event": "application_startup",
            "timestamp": datetime.utcnow().isoformat(),
            "log_directory": self.log_dir
        }
        self.logger.info(f"STARTUP | {json.dumps(log_data)}")


# Global logger instance
performance_logger = PerformanceLogger()