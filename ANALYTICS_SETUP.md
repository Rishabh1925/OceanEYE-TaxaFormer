# 📊 TaxaFormer Analytics Setup Guide

## Overview
This analytics system tracks user behavior on your TaxaFormer website without collecting any personal information. It's completely privacy-friendly and GDPR compliant.

## 🎯 What Gets Tracked

### **User Sessions**
- Anonymous session IDs (change daily)
- Device type (desktop/mobile/tablet)
- Browser name
- Country (optional)
- Session duration

### **Page Views**
- Which pages users visit
- How long they stay on each page
- Scroll depth (how far they scroll)

### **User Interactions**
- Button clicks
- File uploads (filename, size, type)
- Sample file selections
- Analysis completions
- Scroll milestones (25%, 50%, 75%, 90%)

### **Popular Content**
- Most clicked sample files
- Most visited pages
- Most used features

## 🚀 Setup Instructions

### Step 1: Add Analytics Tables to Database

Run this SQL in your Supabase SQL Editor:

```sql
-- Copy and paste the entire content from db/analytics_schema.sql
```

### Step 2: Enable Analytics in Backend

1. Make sure `analytics_api.py` is in your `backend/` folder
2. The analytics endpoints are automatically added to your main API
3. Set environment variable: `USE_ANALYTICS=true`

### Step 3: Test the System

1. **Start your backend** with the analytics enabled
2. **Visit your website** and navigate around
3. **Check the database** - you should see data in:
   - `user_sessions`
   - `page_views` 
   - `user_interactions`

### Step 4: View Analytics (Optional)

Add the analytics dashboard to any page:

```tsx
import AnalyticsDashboard from '@/components/AnalyticsDashboard';

// In your component:
<AnalyticsDashboard isDarkMode={isDarkMode} />
```

## 📈 What You'll Learn

### **User Behavior**
- Which pages are most popular
- How users navigate through your site
- Where users spend the most time
- What features are used most

### **File Upload Patterns**
- What types of files users upload
- Average file sizes
- Upload success rates

### **Sample File Popularity**
- Which sample files users click most
- Most interesting analysis results

### **Device & Browser Stats**
- Desktop vs mobile usage
- Browser preferences
- Geographic distribution (if enabled)

## 🔒 Privacy Features

### **No Personal Data**
- No IP addresses stored
- No user identification
- Anonymous session hashes that change daily
- No tracking across devices

### **GDPR Compliant**
- Automatic data cleanup after 90 days
- No cookies required
- Users can't be identified
- Aggregated statistics only

### **Transparent**
- All tracking is invisible to users
- No performance impact
- Can be disabled with one setting
- Open source code

## 🛠️ Configuration Options

### Environment Variables

```bash
# Enable/disable analytics
USE_ANALYTICS=true

# Database connection (uses existing Supabase)
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

### Frontend Configuration

In `src/utils/analytics.ts`:

```typescript
const config = {
  enabled: true,        // Set to false to disable
  debugMode: false,     // Set to true for console logs
  apiUrl: '/api/analytics'
};
```

## 📊 Sample Analytics Queries

### Most Popular Pages (Last 7 Days)
```sql
SELECT page_path, COUNT(*) as visits 
FROM page_views 
WHERE created_at >= NOW() - INTERVAL '7 days' 
GROUP BY page_path 
ORDER BY visits DESC;
```

### Average Session Duration
```sql
SELECT AVG(total_time_seconds) as avg_duration_seconds
FROM user_sessions 
WHERE created_at >= CURRENT_DATE;
```

### Most Clicked Sample Files
```sql
SELECT content_title, interaction_count 
FROM popular_content 
WHERE content_type = 'sample_file' 
ORDER BY interaction_count DESC 
LIMIT 10;
```

### Device Breakdown
```sql
SELECT device_type, COUNT(*) as sessions
FROM user_sessions 
WHERE created_at >= CURRENT_DATE
GROUP BY device_type;
```

## 🎯 Benefits for Your Project

### **Understand Your Users**
- See which features are most valuable
- Identify areas for improvement
- Track user engagement over time

### **Optimize Performance**
- See which pages load slowly
- Identify popular content to optimize
- Track user flow through the site

### **Make Data-Driven Decisions**
- Know what features to build next
- Understand user preferences
- Measure impact of changes

### **Monitor Growth**
- Track daily/weekly/monthly usage
- See user retention patterns
- Measure success metrics

## 🔧 Troubleshooting

### Analytics Not Working?

1. **Check Backend Logs**
   ```bash
   # Look for these messages:
   "✅ Analytics database connected"
   "📊 Analytics API endpoints added"
   ```

2. **Check Database Tables**
   ```sql
   SELECT COUNT(*) FROM user_sessions;
   SELECT COUNT(*) FROM page_views;
   ```

3. **Check Browser Console**
   - Set `debugMode: true` in analytics config
   - Look for analytics messages

### Common Issues

- **No data appearing**: Check if `USE_ANALYTICS=true`
- **Database errors**: Verify Supabase connection
- **Frontend errors**: Check if analytics.ts is imported correctly

## 🚀 Next Steps

1. **Run the SQL schema** to create analytics tables
2. **Test the system** by browsing your website
3. **Check the data** in your Supabase dashboard
4. **Add the analytics dashboard** to view stats
5. **Monitor user behavior** and optimize accordingly

Your TaxaFormer website will now have comprehensive, privacy-friendly analytics! 🎉