-- ================================
-- USER ANALYTICS SCHEMA FOR TAXAFORMER
-- ================================
-- Privacy-friendly analytics without personal data collection

-- 1. USER SESSIONS TABLE
-- Tracks unique visits and basic session info
CREATE TABLE public.user_sessions (
    session_id uuid NOT NULL DEFAULT uuid_generate_v4(),
    session_hash text NOT NULL, -- Anonymous hash based on IP + User-Agent (changes daily)
    first_visit timestamp with time zone DEFAULT now(),
    last_activity timestamp with time zone DEFAULT now(),
    page_count integer DEFAULT 1,
    total_time_seconds integer DEFAULT 0,
    device_type text, -- 'desktop', 'mobile', 'tablet'
    browser_name text, -- 'chrome', 'firefox', 'safari', etc.
    referrer_domain text, -- Where they came from
    country_code text, -- 2-letter country code (if available)
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT user_sessions_pkey PRIMARY KEY (session_id)
);

-- 2. PAGE VIEWS TABLE
-- Tracks which pages users visit
CREATE TABLE public.page_views (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    session_id uuid NOT NULL,
    page_path text NOT NULL, -- '/upload', '/output', '/home', etc.
    page_title text,
    visit_duration_seconds integer DEFAULT 0,
    scroll_depth_percent integer DEFAULT 0, -- How far they scrolled (0-100)
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT page_views_pkey PRIMARY KEY (id),
    CONSTRAINT page_views_session_fkey FOREIGN KEY (session_id) REFERENCES public.user_sessions(session_id) ON DELETE CASCADE
);

-- 3. USER INTERACTIONS TABLE
-- Tracks clicks, uploads, and other interactions
CREATE TABLE public.user_interactions (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    session_id uuid NOT NULL,
    page_path text NOT NULL,
    interaction_type text NOT NULL, -- 'click', 'upload', 'download', 'scroll', 'sample_select'
    element_id text, -- Button ID, link text, etc.
    element_text text, -- Button text or link text
    interaction_data jsonb DEFAULT '{}', -- Additional data (file size, sample name, etc.)
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT user_interactions_pkey PRIMARY KEY (id),
    CONSTRAINT user_interactions_session_fkey FOREIGN KEY (session_id) REFERENCES public.user_sessions(session_id) ON DELETE CASCADE
);

-- 4. ANALYTICS SUMMARY TABLE
-- Daily aggregated statistics for dashboard
CREATE TABLE public.analytics_summary (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    date_period date NOT NULL,
    period_type text NOT NULL DEFAULT 'daily' CHECK (period_type = ANY (ARRAY['daily'::text, 'weekly'::text, 'monthly'::text])),
    
    -- Visit metrics
    unique_sessions integer DEFAULT 0,
    total_page_views integer DEFAULT 0,
    avg_session_duration_seconds numeric DEFAULT 0,
    avg_pages_per_session numeric DEFAULT 0,
    
    -- Page popularity
    home_visits integer DEFAULT 0,
    upload_visits integer DEFAULT 0,
    output_visits integer DEFAULT 0,
    report_visits integer DEFAULT 0,
    
    -- User actions
    file_uploads integer DEFAULT 0,
    sample_selections integer DEFAULT 0,
    analysis_completions integer DEFAULT 0,
    
    -- Device breakdown
    desktop_sessions integer DEFAULT 0,
    mobile_sessions integer DEFAULT 0,
    tablet_sessions integer DEFAULT 0,
    
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT analytics_summary_pkey PRIMARY KEY (id),
    CONSTRAINT analytics_summary_unique_date UNIQUE (date_period, period_type)
);

-- 5. POPULAR CONTENT TABLE
-- Track most popular sample files and features
CREATE TABLE public.popular_content (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    content_type text NOT NULL, -- 'sample_file', 'feature', 'page'
    content_identifier text NOT NULL, -- sample job_id, feature name, page path
    content_title text,
    interaction_count integer DEFAULT 1,
    last_interaction timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT popular_content_pkey PRIMARY KEY (id),
    CONSTRAINT popular_content_unique UNIQUE (content_type, content_identifier)
);

-- ================================
-- INDEXES FOR PERFORMANCE
-- ================================

-- Session tracking indexes
CREATE INDEX idx_user_sessions_hash ON public.user_sessions(session_hash);
CREATE INDEX idx_user_sessions_created_at ON public.user_sessions(created_at DESC);

-- Page views indexes
CREATE INDEX idx_page_views_session_id ON public.page_views(session_id);
CREATE INDEX idx_page_views_page_path ON public.page_views(page_path);
CREATE INDEX idx_page_views_created_at ON public.page_views(created_at DESC);

-- Interactions indexes
CREATE INDEX idx_user_interactions_session_id ON public.user_interactions(session_id);
CREATE INDEX idx_user_interactions_type ON public.user_interactions(interaction_type);
CREATE INDEX idx_user_interactions_page ON public.user_interactions(page_path);
CREATE INDEX idx_user_interactions_created_at ON public.user_interactions(created_at DESC);

-- Analytics summary indexes
CREATE INDEX idx_analytics_summary_date ON public.analytics_summary(date_period DESC);
CREATE INDEX idx_analytics_summary_period ON public.analytics_summary(period_type);

-- Popular content indexes
CREATE INDEX idx_popular_content_type ON public.popular_content(content_type);
CREATE INDEX idx_popular_content_count ON public.popular_content(interaction_count DESC);

-- ================================
-- FUNCTIONS FOR ANALYTICS
-- ================================

-- Function to generate anonymous session hash
CREATE OR REPLACE FUNCTION generate_session_hash(ip_address text, user_agent text)
RETURNS text AS $$
BEGIN
    -- Create anonymous hash that changes daily for privacy
    RETURN encode(
        digest(
            ip_address || user_agent || CURRENT_DATE::text || 'taxaformer_salt',
            'sha256'
        ),
        'hex'
    );
END;
$$ LANGUAGE plpgsql;

-- Function to update analytics summary (called daily)
CREATE OR REPLACE FUNCTION update_analytics_summary(target_date date DEFAULT CURRENT_DATE)
RETURNS void AS $$
BEGIN
    INSERT INTO analytics_summary (
        date_period,
        unique_sessions,
        total_page_views,
        avg_session_duration_seconds,
        avg_pages_per_session,
        home_visits,
        upload_visits,
        output_visits,
        report_visits,
        file_uploads,
        sample_selections,
        analysis_completions,
        desktop_sessions,
        mobile_sessions,
        tablet_sessions
    )
    SELECT 
        target_date,
        COUNT(DISTINCT us.session_id),
        COUNT(pv.id),
        AVG(us.total_time_seconds),
        AVG(us.page_count),
        COUNT(CASE WHEN pv.page_path = '/home' OR pv.page_path = '/' THEN 1 END),
        COUNT(CASE WHEN pv.page_path = '/upload' THEN 1 END),
        COUNT(CASE WHEN pv.page_path = '/output' THEN 1 END),
        COUNT(CASE WHEN pv.page_path = '/report' THEN 1 END),
        COUNT(CASE WHEN ui.interaction_type = 'upload' THEN 1 END),
        COUNT(CASE WHEN ui.interaction_type = 'sample_select' THEN 1 END),
        COUNT(CASE WHEN ui.interaction_type = 'analysis_complete' THEN 1 END),
        COUNT(CASE WHEN us.device_type = 'desktop' THEN 1 END),
        COUNT(CASE WHEN us.device_type = 'mobile' THEN 1 END),
        COUNT(CASE WHEN us.device_type = 'tablet' THEN 1 END)
    FROM user_sessions us
    LEFT JOIN page_views pv ON us.session_id = pv.session_id
    LEFT JOIN user_interactions ui ON us.session_id = ui.session_id
    WHERE DATE(us.created_at) = target_date
    ON CONFLICT (date_period, period_type) 
    DO UPDATE SET
        unique_sessions = EXCLUDED.unique_sessions,
        total_page_views = EXCLUDED.total_page_views,
        avg_session_duration_seconds = EXCLUDED.avg_session_duration_seconds,
        avg_pages_per_session = EXCLUDED.avg_pages_per_session,
        home_visits = EXCLUDED.home_visits,
        upload_visits = EXCLUDED.upload_visits,
        output_visits = EXCLUDED.output_visits,
        report_visits = EXCLUDED.report_visits,
        file_uploads = EXCLUDED.file_uploads,
        sample_selections = EXCLUDED.sample_selections,
        analysis_completions = EXCLUDED.analysis_completions,
        desktop_sessions = EXCLUDED.desktop_sessions,
        mobile_sessions = EXCLUDED.mobile_sessions,
        tablet_sessions = EXCLUDED.tablet_sessions;
END;
$$ LANGUAGE plpgsql;

-- ================================
-- PRIVACY & CLEANUP
-- ================================

-- Function to clean old analytics data (GDPR compliance)
CREATE OR REPLACE FUNCTION cleanup_old_analytics()
RETURNS void AS $$
BEGIN
    -- Delete sessions older than 90 days
    DELETE FROM user_sessions WHERE created_at < NOW() - INTERVAL '90 days';
    
    -- Delete page views older than 90 days
    DELETE FROM page_views WHERE created_at < NOW() - INTERVAL '90 days';
    
    -- Delete interactions older than 90 days
    DELETE FROM user_interactions WHERE created_at < NOW() - INTERVAL '90 days';
    
    -- Keep summary data for 2 years
    DELETE FROM analytics_summary WHERE created_at < NOW() - INTERVAL '2 years';
END;
$$ LANGUAGE plpgsql;

-- ================================
-- SAMPLE QUERIES FOR DASHBOARD
-- ================================

-- Get today's stats
-- SELECT * FROM analytics_summary WHERE date_period = CURRENT_DATE;

-- Get most popular pages last 7 days
-- SELECT page_path, COUNT(*) as visits 
-- FROM page_views 
-- WHERE created_at >= NOW() - INTERVAL '7 days' 
-- GROUP BY page_path 
-- ORDER BY visits DESC;

-- Get most clicked sample files
-- SELECT content_title, interaction_count 
-- FROM popular_content 
-- WHERE content_type = 'sample_file' 
-- ORDER BY interaction_count DESC 
-- LIMIT 10;

-- ================================
-- ANALYTICS SCHEMA COMPLETE
-- ================================