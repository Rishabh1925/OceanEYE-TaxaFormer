# test.py
import numpy as np
from pipeline import TaxonomyPipeline

# Create a simple test FASTA file
with open('test.fasta', 'w') as f:
    f.write('>seq1\n')
    f.write('ATCGATCG\n')

# Run the pipeline
pipeline = TaxonomyPipeline()
result = pipeline.process_file('test.fasta', 'test.fasta')
print(result)
