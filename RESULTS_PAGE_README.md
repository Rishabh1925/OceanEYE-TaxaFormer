# Taxaformer Results Visualization

## Overview
This update adds comprehensive visualization capabilities to the Taxaformer platform, displaying taxonomic analysis results through interactive charts and graphs.

## New Features

### 1. Results Page (`/results`)
A dedicated page for visualizing CSV data from taxonomic analysis with the following components:

#### Charts Implemented:

**Novelty Score Distribution Histogram**
- Displays the distribution of novelty scores across all sequences
- Bins: 0.15-0.17, 0.17-0.19, 0.19-0.21, 0.21-0.23, 0.23-0.25, 0.25+
- Shows average novelty score and total sequences analyzed

**Known Taxa Frequency & Abundance Graph**
- Horizontal bar chart showing the top 15 most abundant taxa
- Displays frequency counts for each taxon
- Shows total unique taxa identified

**Taxonomy Composition Charts (Multiple Levels)**
- 4 pie charts showing distribution at different taxonomic levels:
  - Phylum level
  - Class level
  - Order level
  - Kingdom level
- Each chart shows top 10 groups with percentage distribution
- Interactive tooltips with detailed information

### 2. New Chart Components

Created three reusable chart components in `src/components/charts/`:

1. **ChartNoveltyHistogram.tsx**
   - Bar chart for novelty score distribution
   - Configurable bins and colors
   - Responsive design

2. **ChartTaxaAbundance.tsx**
   - Horizontal bar chart for taxa frequency
   - Shows top N taxa (default: 15)
   - Color-coded bars

3. **ChartTaxonomyComposition.tsx**
   - Pie chart for taxonomic composition
   - Configurable taxonomic level (kingdom, phylum, class, order)
   - Legend and percentage labels
   - Interactive tooltips

### 3. Data Structure

The CSV file format expected:
```csv
Sequence_ID,Predicted_Taxonomy,Novelty_Score,Status,Nearest_Neighbor_Taxonomy,Nearest_Neighbor_Dist
```

Example:
```csv
contig_10140_1_1969_+,AF250064.1.1828 Eukaryota;Amorphea;Obazoa;...,0.15,POTENTIALLY NOVEL,...,0.1486
```

### 4. Summary Statistics

The Results page displays:
- Total sequences analyzed
- Unique taxa identified
- Average novelty score
- Number of potentially novel sequences

## File Structure

```
src/
├── components/
│   ├── ResultsPage.tsx (main results page)
│   └── charts/
│       ├── ChartNoveltyHistogram.tsx
│       ├── ChartTaxaAbundance.tsx
│       └── ChartTaxonomyComposition.tsx
public/
└── results/
    └── novel_candidates_list.csv (data file)
```

## Navigation

Access the Results page through:
- Main navigation → Analysis → Analysis Charts
- Direct navigation using `onNavigate('results')`

## Technologies Used

- **Next.js 16** - React framework
- **Recharts** - Charting library
- **shadcn/ui** - UI components
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling

## Features

✅ Responsive design (mobile, tablet, desktop)
✅ Dark mode support
✅ Interactive tooltips
✅ Data export functionality (JSON)
✅ Share functionality
✅ Sample data table (first 10 sequences)
✅ Color-coded status indicators
✅ Loading states and error handling

## Usage

1. Navigate to the Results page from the main navigation
2. The page automatically loads the CSV data from `/public/results/`
3. View charts and statistics
4. Export data using the Export button
5. Share results using the Share button

## Data Processing

The CSV data is parsed and processed to:
1. Extract taxonomic information at different levels
2. Calculate novelty score distributions
3. Count taxa frequencies
4. Generate composition percentages
5. Handle missing or invalid data gracefully

## Future Enhancements

Potential improvements:
- [ ] File upload capability for custom CSV files
- [ ] Additional chart types (scatter plots, heatmaps)
- [ ] Filter and search functionality
- [ ] PDF report generation
- [ ] Comparative analysis between multiple datasets
- [ ] Time-series analysis for longitudinal data

## Notes

- Ensure the CSV file is placed in `public/results/` for the page to load correctly
- The taxonomy parsing expects semicolon-separated hierarchical structure
- Charts are optimized for datasets with up to 1000 sequences
- For larger datasets, consider implementing pagination or data sampling
