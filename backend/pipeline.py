"""
Taxonomy Analysis Pipeline


This module contains the core DNA sequence processing pipeline for Taxaformer.
It handles parsing FASTA/FASTQ files, performs taxonomic classification,
and generates visualization data for the frontend.


Author: Learning Developer (Age 16)
Purpose: Educational project for understanding bioinformatics pipelines
"""
import os
import json
import random
from typing import Dict, List, Any, Tuple
from collections import Counter
import numpy as np



class TaxonomyPipeline:
    """
    Main pipeline class for processing taxonomic sequence data.
    
    This class handles the entire workflow from file parsing to result generation.
    It's designed to be simple but realistic for educational purposes.
    
    Attributes:
        novelty_threshold (float): Threshold for determining novel sequences (0.15)
        colors (dict): Color mapping for different taxonomic groups used in visualizations
    
    Example:
        >>> pipeline = TaxonomyPipeline()
        >>> results = pipeline.process_file("sample.fasta", "sample.fasta")
        >>> print(f"Found {results['metadata']['totalSequences']} sequences")
    """
    
    def __init__(self):
        """
        Initialize the pipeline with default parameters.
        
        Sets up the novelty detection threshold and color scheme for visualizations.
        The colors are chosen to be distinct and accessible for data visualization.
        """
        # Threshold for determining if a sequence is potentially novel
        # Sequences with novelty_score >= 0.15 are flagged as potentially novel
        self.novelty_threshold = 0.15
        
        # Color scheme for different taxonomic groups
        # These colors are used in charts and 3D visualizations
        # Colors chosen for good contrast and accessibility
        self.colors = {
            "Alveolata": "#22D3EE",      # Light blue - for protists
            "Chlorophyta": "#10B981",    # Green - for green algae
            "Fungi": "#A78BFA",          # Purple - for fungi
            "Metazoa": "#F59E0B",        # Orange - for animals
            "Rhodophyta": "#EC4899",     # Pink - for red algae
            "Stramenopiles": "#8B5CF6",  # Violet - for brown algae/diatoms
            "Bacteria": "#EF4444",       # Red - for bacteria
            "Archaea": "#F97316",        # Dark orange - for archaea
            "Cryptophyta": "#06B6D4",    # Cyan - for cryptophytes
            "Haptophyta": "#14B8A6",     # Teal - for haptophytes
            "Unknown": "#64748B",        # Gray - for unclassified
            "Novel": "#DC2626"           # Dark red - for novel sequences
        }
        
    def process_file(self, filepath: str, filename: str) -> Dict[str, Any]:
        """
        Main processing function that analyzes a sequence file.
        
        This is the main entry point for the pipeline. It orchestrates the entire
        analysis workflow from file parsing to result generation.
        
        Args:
            filepath (str): Full path to the uploaded sequence file
            filename (str): Original filename (used for metadata)
            
        Returns:
            Dict[str, Any]: Complete analysis results in frontend-compatible format
                - metadata: Basic statistics about the analysis
                - taxonomy_summary: Counts of different taxonomic groups
                - sequences: Detailed analysis for each sequence
                - cluster_data: 3D coordinates for visualization
                
        Raises:
            Exception: If file parsing fails or no sequences are found
            
        Example:
            >>> pipeline = TaxonomyPipeline()
            >>> result = pipeline.process_file("/tmp/sample.fasta", "sample.fasta")
            >>> print(f"Analysis complete: {result['metadata']['totalSequences']} sequences")
        """
        try:
            # Step 1: Parse the uploaded file to extract sequences
            # This handles both FASTA and FASTQ formats
            sequences = self._parse_fasta(filepath)
            
            # Validate that we found at least one sequence
            if not sequences:
                raise ValueError("No valid sequences found in file")
            
            # Step 2: Analyze each sequence for taxonomy and novelty
            # This assigns taxonomic classifications and calculates confidence scores
            analyzed_sequences = self._analyze_sequences(sequences)
            
            # Step 3: Generate summary statistics for the taxonomy distribution
            # This creates data for pie charts and summary displays
            taxonomy_summary = self._generate_taxonomy_summary(analyzed_sequences)
            
            # Step 4: Generate cluster coordinates for 3D visualization
            # This creates x,y,z coordinates for the interactive 3D plot
            cluster_data = self._generate_cluster_data(analyzed_sequences)
            
            # Step 5: Calculate overall metadata and statistics
            # This includes total counts, averages, and processing info
            metadata = self._calculate_metadata(filename, analyzed_sequences)
            
            # Format the final result for the frontend
            # This structure matches what the React components expect
            result = {
                "metadata": metadata,
                "taxonomy_summary": taxonomy_summary,
                "sequences": analyzed_sequences,
                "cluster_data": cluster_data
            }
            
            return result
            
        except Exception as e:
            # Re-raise with more context for debugging
            raise Exception(f"Pipeline processing failed: {str(e)}")
    
    def _parse_fasta(self, filepath: str) -> List[Dict[str, str]]:
        """
        Parse FASTA or FASTQ files to extract DNA sequences.
        
        This function handles both FASTA (>) and FASTQ (@) format files.
        It extracts sequence IDs and DNA sequences while skipping quality scores.
        
        Args:
            filepath (str): Path to the sequence file to parse
            
        Returns:
            List[Dict[str, str]]: List of sequences, each containing:
                - id: Sequence identifier (from header line)
                - sequence: DNA sequence string (A, T, G, C, N)
                
        Raises:
            Exception: If file cannot be read or parsed
            
        Example:
            Input FASTA:
                >seq1 description
                ATCGATCG
                >seq2 description  
                GCTAGCTA
                
            Output:
                [{'id': 'seq1', 'sequence': 'ATCGATCG'}, 
                 {'id': 'seq2', 'sequence': 'GCTAGCTA'}]
        """
        sequences = []
        current_seq = None
        current_id = None
        
        try:
            with open(filepath, 'r') as f:
                for line in f:
                    line = line.strip()
                    
                    # Skip empty lines
                    if not line:
                        continue
                    
                    # FASTA header line (starts with >)
                    if line.startswith('>'):
                        # Save the previous sequence if we have one
                        if current_id and current_seq:
                            sequences.append({
                                'id': current_id,
                                'seq': current_seq  # ⚠️ BUG: Changed 'sequence' to 'seq'
                            })
                        
                        # Start new sequence - extract ID from header
                        # Take only the first part before any spaces
                        current_id = line[1:].split()[0]
                        current_seq = ""
                    
                    # FASTQ header line (starts with @)
                    elif line.startswith('@'):
                        # Save previous sequence
                        if current_id and current_seq:
                            sequences.append({
                                'id': current_id,
                                'seq': current_seq  # ⚠️ BUG: Changed 'sequence' to 'seq'
                            })
                        # Extract ID from FASTQ header
                        current_id = line[1:].split()[0]
                        current_seq = ""
                    
                    # Sequence data line
                    elif current_id and not line.startswith('+'):
                        # Skip FASTQ quality score lines (start with +)
                        # Only accept valid DNA characters (A, T, G, C, N)
                        if all(c in 'ACGTNacgtn' for c in line):
                            current_seq += line
                
                # Don't forget the last sequence in the file
                if current_id and current_seq:
                    sequences.append({
                        'id': current_id,
                        'seq': current_seq  # ⚠️ BUG: Changed 'sequence' to 'seq'
                    })
            
            return sequences
            
        except Exception as e:
            raise Exception(f"Failed to parse file: {str(e)}")
    
    def _analyze_sequences(self, sequences: List[Dict[str, str]]) -> List[Dict[str, Any]]:
        """
        Analyze sequences and assign taxonomic classifications.
        
        This function performs the core analysis on each sequence:
        - Assigns taxonomic classification from predefined groups
        - Calculates confidence scores and overlap percentages
        - Determines novelty scores and potential novel status
        - Assigns cluster IDs for visualization grouping
        
        Args:
            sequences (List[Dict[str, str]]): Parsed sequences with id and sequence
            
        Returns:
            List[Dict[str, Any]]: Analyzed sequences with classification data:
                - accession: Sequence ID
                - taxonomy: Full taxonomic lineage string
                - length: Sequence length in base pairs
                - confidence: Classification confidence (0.75-0.99)
                - overlap: Database match overlap percentage (70-99%)
                - cluster: Cluster ID for visualization grouping
                - novelty_score: Novelty detection score (0.05-0.25)
                - status: "POTENTIALLY NOVEL" or "Known"
                
        Note:
            This is a mock analysis for educational purposes. In a real system,
            this would involve BLAST searches against taxonomic databases.
        """
        analyzed = []
        
        # Predefined taxonomic lineages for realistic mock analysis
        # These represent common groups found in environmental DNA samples
        taxonomy_groups = [
            "Eukaryota;Amorphea;Obazoa;Opisthokonta;Holozoa;Choanozoa;Metazoa;Animalia",
            "Eukaryota;Diaphoretickes;SAR;Alveolata;Dinoflagellata",
            "Eukaryota;Diaphoretickes;Archaeplastida;Chlorophyta;Chlorophyceae",
            "Eukaryota;Amorphea;Obazoa;Opisthokonta;Nucletmycea;Fungi;Basidiomycota",
            "Eukaryota;Diaphoretickes;Archaeplastida;Rhodophyta",
            "Eukaryota;Diaphoretickes;SAR;Stramenopiles;Bacillariophyta",
            "Eukaryota;Cryptophyceae",
            "Bacteria;Proteobacteria",
            "Bacteria;Bacteroidetes",
            "Archaea;Euryarchaeota"
        ]
        
        # Analyze each sequence
        for i, seq in enumerate(sequences):
            seq_id = seq['id']
            seq_len = len(seq['sequence'])
            
            # Randomly assign taxonomy (in real system, this would be BLAST results)
            taxonomy = random.choice(taxonomy_groups)
            
            # Generate realistic confidence score (75-99%)
            confidence = round(random.uniform(0.75, 0.99), 3)
            
            # Generate realistic overlap percentage (70-99%)
            overlap = random.randint(70, 99)
            
            # Calculate novelty score (lower = more similar to known sequences)
            novelty_score = round(random.uniform(0.05, 0.25), 4)
            is_novel = novelty_score >= self.novelty_threshold
            
            # Extract main taxonomic group for clustering
            taxa_parts = taxonomy.split(';')
            main_group = taxa_parts[-1] if len(taxa_parts) > 2 else taxa_parts[0]
            
            # Assign cluster ID for visualization grouping
            if is_novel:
                # Novel sequences get special cluster IDs (N1, N2, N3)
                cluster = f"N{i % 3 + 1}"
            else:
                # Known sequences clustered by taxonomic group
                cluster = f"C{hash(main_group) % 10 + 1}"
            
            # Build the analysis result for this sequence
            analyzed.append({
                "accession": seq_id,
                "taxonomy": taxonomy,
                "length": seq_len,
                "confidence": confidence,
                "overlap": overlap,
                "cluster": cluster,
                "novelty_score": novelty_score,
                "status": "POTENTIALLY NOVEL" if is_novel else "Known"
            })
        
        return analyzed
    
    def _generate_taxonomy_summary(self, sequences: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Generate summary statistics of taxonomy distribution.
        
        This function counts sequences by major taxonomic groups and formats
        the data for pie charts and summary displays in the frontend.
        
        Args:
            sequences (List[Dict[str, Any]]): Analyzed sequences with taxonomy data
            
        Returns:
            List[Dict[str, Any]]: Summary data for each taxonomic group:
                - name: Group name (e.g., "Metazoa", "Bacteria")
                - value: Number of sequences in this group
                - color: Hex color code for visualization
                
        Example:
            [
                {"name": "Metazoa", "value": 15, "color": "#F59E0B"},
                {"name": "Bacteria", "value": 8, "color": "#EF4444"},
                {"name": "Novel", "value": 2, "color": "#DC2626"}
            ]
        """
        # Count sequences by main taxonomic group
        group_counts = Counter()
        
        for seq in sequences:
            taxonomy = seq['taxonomy']
            
            # Parse the taxonomic lineage to extract the main group
            parts = taxonomy.split(';')
            
            # Default to "Unknown" if we can't classify
            main_group = "Unknown"
            
            # Look for recognizable taxonomic keywords in the lineage
            for part in parts:
                part = part.strip()
                
                # Check for animals (Metazoa)
                if any(keyword in part for keyword in ['Metazoa', 'Animalia']):
                    main_group = "Metazoa"
                    break
                # Check for protists (Alveolata)
                elif 'Alveolata' in part or 'Dinoflagellata' in part:
                    main_group = "Alveolata"
                    break
                # Check for green algae (Chlorophyta)
                elif 'Chlorophyta' in part:
                    main_group = "Chlorophyta"
                    break
                # Check for fungi
                elif 'Fungi' in part:
                    main_group = "Fungi"
                    break
                # Check for red algae (Rhodophyta)
                elif 'Rhodophyta' in part:
                    main_group = "Rhodophyta"
                    break
                # Check for brown algae/diatoms (Stramenopiles)
                elif 'Stramenopiles' in part:
                    main_group = "Stramenopiles"
                    break
                # Check for bacteria
                elif 'Bacteria' in part:
                    main_group = "Bacteria"
                    break
                # Check for archaea
                elif 'Archaea' in part:
                    main_group = "Archaea"
                    break
                # Check for cryptophytes
                elif 'Cryptophyta' in part:
                    main_group = "Cryptophyta"
                    break
            
            # Override with "Novel" if this sequence is potentially novel
            if seq.get('status') == 'POTENTIALLY NOVEL':
                main_group = "Novel"
            
            # Increment the count for this group
            group_counts[main_group] += 1
        
        # Convert to frontend format with colors
        # Sort by count (most common first) for better visualization
        summary = []
        for group, count in group_counts.most_common():
            summary.append({
                "name": group,
                "value": count,
                "color": self.colors.get(group, "#64748B")  # Default to gray if color not found
            })
        
        return summary
    
    def _generate_cluster_data(self, sequences: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Generate 3D clustering coordinates for visualization.
        
        This function creates x,y,z coordinates for each cluster to display
        in the 3D scatter plot. Sequences in the same cluster are grouped
        together, and cluster size represents the number of sequences.
        
        Args:
            sequences (List[Dict[str, Any]]): Analyzed sequences with cluster assignments
            
        Returns:
            List[Dict[str, Any]]: Cluster data for 3D visualization:
                - x, y: 2D coordinates for cluster position (-20 to 20)
                - z: Cluster size (number of sequences in cluster)
                - cluster: Cluster name/group
                - color: Hex color for this cluster
                
        Note:
            In a real system, these coordinates would come from dimensionality
            reduction techniques like UMAP or t-SNE applied to sequence similarity data.
        """
        cluster_data = []
        cluster_positions = {}
        
        # Process each sequence to build cluster information
        for seq in sequences:
            cluster = seq['cluster']
            taxonomy = seq['taxonomy']
            
            # Extract a readable group name for the cluster
            parts = taxonomy.split(';')
            group_name = parts[-1] if len(parts) > 2 else parts[0]
            
            # Special handling for novel sequences
            if seq.get('status') == 'POTENTIALLY NOVEL':
                group_name = "Novel"
            else:
                # Simplify to main taxonomic group for better readability
                for part in parts:
                    if any(keyword in part for keyword in ['Metazoa', 'Alveolata', 'Chlorophyta', 
                                                           'Fungi', 'Rhodophyta', 'Bacteria']):
                        group_name = part
                        break
            
            # Generate cluster position if this is a new cluster
            if cluster not in cluster_positions:
                cluster_positions[cluster] = {
                    'x': round(random.uniform(-20, 20), 2),  # Random x coordinate
                    'y': round(random.uniform(-20, 20), 2),  # Random y coordinate
                    'z': 1,                                  # Start with size 1
                    'cluster': group_name,                   # Readable cluster name
                    'color': self.colors.get(group_name, "#64748B")  # Color for this group
                }
            else:
                # Increment cluster size for each additional sequence
                cluster_positions[cluster]['z'] += 1
        
        # Convert to list format for frontend
        cluster_data = list(cluster_positions.values())
        return cluster_data
    
    def _calculate_metadata(self, filename: str, sequences: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Calculate overall metadata and statistics for the analysis.
        
        This function computes summary statistics that are displayed
        in the metadata panel of the frontend interface.
        
        Args:
            filename (str): Original filename of the uploaded file
            sequences (List[Dict[str, Any]]): All analyzed sequences
            
        Returns:
            Dict[str, Any]: Metadata dictionary containing:
                - sampleName: Original filename
                - totalSequences: Total number of sequences processed
                - avgConfidence: Average confidence score as percentage (0-100)
                - novelSequences: Number of potentially novel sequences
                - processingTime: Processing duration (updated by main.py)
                
        Example:
            {
                "sampleName": "marine_sample.fasta",
                "totalSequences": 150,
                "avgConfidence": 87,
                "novelSequences": 12,
                "processingTime": "2.3s"
            }
        """
        # Calculate average confidence score across all sequences
        confidences = [seq['confidence'] for seq in sequences]
        avg_confidence = int(np.mean(confidences) * 100) if confidences else 0
        
        # Count sequences flagged as potentially novel
        novel_count = sum(1 for seq in sequences if seq.get('status') == 'POTENTIALLY NOVEL')
        
        # Build metadata dictionary
        metadata = {
            "sampleName": filename,
            "totalSequences": len(sequences),
            "avgConfidence": avg_confidence,
            "novelSequences": novel_count,
            "processingTime": "0.0s"  # Will be updated by main.py with actual timing
        }
        
        return metadata
