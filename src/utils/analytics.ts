/**
 * Privacy-Friendly Analytics System for TaxaFormer
 * Tracks user behavior without collecting personal information
 */

interface AnalyticsConfig {
  enabled: boolean;
  apiUrl: string;
  sessionId: string | null;
  debugMode: boolean;
}

interface SessionData {
  sessionId: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  browserName: string;
  startTime: number;
  pageCount: number;
  lastActivity: number;
}

interface InteractionData {
  type: 'click' | 'upload' | 'download' | 'scroll' | 'sample_select' | 'analysis_complete' | 'page_view';
  elementId?: string;
  elementText?: string;
  data?: Record<string, any>;
}

class TaxaformerAnalytics {
  private config: AnalyticsConfig;
  private session: SessionData | null = null;
  private scrollDepth = 0;
  private pageStartTime = Date.now();
  private isTracking = false;

  constructor() {
    this.config = {
      enabled: true, // Set to false to disable all tracking
      apiUrl: process.env.NODE_ENV === 'production' 
        ? 'https://unexcited-nondepreciatively-justice.ngrok-free.dev/api/analytics'  // Kaggle Backend Analytics
        : 'https://unexcited-nondepreciatively-justice.ngrok-free.dev/api/analytics', // Use Kaggle for development too
      sessionId: null,
      debugMode: true // Set to true for console logging
    };

    // Only initialize in browser environment
    if (typeof window !== 'undefined' && this.config.enabled) {
      this.initializeSession();
      this.setupEventListeners();
    }
  }

  /**
   * Initialize analytics session
   */
  private async initializeSession() {
    try {
      // Get or create session
      const existingSessionId = sessionStorage.getItem('taxaformer_session_id');
      
      if (existingSessionId) {
        this.config.sessionId = existingSessionId;
        await this.updateSession();
      } else {
        await this.createNewSession();
      }

      this.isTracking = true;
      this.log('Analytics initialized', { sessionId: this.config.sessionId });
    } catch (error) {
      this.log('Failed to initialize analytics', error);
    }
  }

  /**
   * Create new analytics session
   */
  private async createNewSession() {
    const sessionData = {
      deviceType: this.getDeviceType(),
      browserName: this.getBrowserName(),
      referrer: document.referrer ? new URL(document.referrer).hostname : 'direct',
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language
    };

    try {
      const response = await fetch(`${this.config.apiUrl}/session`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(sessionData)
      });

      if (response.ok) {
        const result = await response.json();
        this.config.sessionId = result.sessionId;
        sessionStorage.setItem('taxaformer_session_id', result.sessionId);
        
        this.session = {
          sessionId: result.sessionId,
          deviceType: sessionData.deviceType,
          browserName: sessionData.browserName,
          startTime: Date.now(),
          pageCount: 1,
          lastActivity: Date.now()
        };
      }
    } catch (error) {
      this.log('Failed to create session', error);
    }
  }

  /**
   * Update existing session
   */
  private async updateSession() {
    if (!this.config.sessionId) return;

    try {
      await fetch(`${this.config.apiUrl}/session/${this.config.sessionId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          lastActivity: new Date().toISOString(),
          pageCount: (this.session?.pageCount || 0) + 1
        })
      });
    } catch (error) {
      this.log('Failed to update session', error);
    }
  }

  /**
   * Track page view
   */
  public trackPageView(pagePath: string, pageTitle?: string) {
    if (!this.isTracking || typeof window === 'undefined') return;

    this.pageStartTime = Date.now();
    this.scrollDepth = 0;

    const pageData = {
      sessionId: this.config.sessionId,
      pagePath,
      pageTitle: pageTitle || document.title,
      timestamp: new Date().toISOString()
    };

    this.sendAnalytics('/page-view', pageData);
    this.log('Page view tracked', pageData);
  }

  /**
   * Track user interaction
   */
  public trackInteraction(interaction: InteractionData) {
    if (!this.isTracking || typeof window === 'undefined') return;

    const interactionData = {
      sessionId: this.config.sessionId,
      pagePath: window.location.pathname,
      interactionType: interaction.type,
      elementId: interaction.elementId,
      elementText: interaction.elementText,
      interactionData: interaction.data || {},
      timestamp: new Date().toISOString()
    };

    this.sendAnalytics('/interaction', interactionData);
    this.log('Interaction tracked', interactionData);
  }

  /**
   * Track file upload
   */
  public trackFileUpload(fileName: string, fileSize: number, fileType: string) {
    this.trackInteraction({
      type: 'upload',
      elementId: 'file-upload',
      elementText: 'File Upload',
      data: {
        fileName,
        fileSize,
        fileType,
        fileSizeMB: Math.round(fileSize / 1024 / 1024 * 100) / 100
      }
    });
  }

  /**
   * Track sample file selection
   */
  public trackSampleSelection(sampleId: string, sampleName: string) {
    this.trackInteraction({
      type: 'sample_select',
      elementId: `sample-${sampleId}`,
      elementText: sampleName,
      data: {
        sampleId,
        sampleName
      }
    });

    // Also update popular content
    this.updatePopularContent('sample_file', sampleId, sampleName);
  }

  /**
   * Track analysis completion
   */
  public trackAnalysisComplete(processingTime: string, sequenceCount: number) {
    this.trackInteraction({
      type: 'analysis_complete',
      elementId: 'analysis-complete',
      elementText: 'Analysis Complete',
      data: {
        processingTime,
        sequenceCount
      }
    });
  }

  /**
   * Track button clicks
   */
  public trackClick(elementId: string, elementText: string, additionalData?: Record<string, any>) {
    this.trackInteraction({
      type: 'click',
      elementId,
      elementText,
      data: additionalData
    });
  }

  /**
   * Setup automatic event listeners
   */
  private setupEventListeners() {
    // Only run in browser environment
    if (typeof window === 'undefined') return;
    
    // Track scroll depth
    let maxScrollDepth = 0;
    const trackScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      
      if (scrollPercent > maxScrollDepth) {
        maxScrollDepth = scrollPercent;
        this.scrollDepth = scrollPercent;
        
        // Track significant scroll milestones
        if (scrollPercent >= 25 && scrollPercent < 50 && maxScrollDepth < 25) {
          this.trackInteraction({ type: 'scroll', data: { depth: 25 } });
        } else if (scrollPercent >= 50 && scrollPercent < 75 && maxScrollDepth < 50) {
          this.trackInteraction({ type: 'scroll', data: { depth: 50 } });
        } else if (scrollPercent >= 75 && scrollPercent < 90 && maxScrollDepth < 75) {
          this.trackInteraction({ type: 'scroll', data: { depth: 75 } });
        } else if (scrollPercent >= 90 && maxScrollDepth < 90) {
          this.trackInteraction({ type: 'scroll', data: { depth: 90 } });
        }
      }
    };

    window.addEventListener('scroll', this.throttle(trackScroll, 1000));

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.trackPageExit();
      }
    });

    // Track page unload
    window.addEventListener('beforeunload', () => {
      this.trackPageExit();
    });

    // Auto-track clicks on buttons and links
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      
      if (target.tagName === 'BUTTON' || target.tagName === 'A') {
        const elementId = target.id || target.className || 'unknown';
        const elementText = target.textContent?.trim() || target.getAttribute('aria-label') || 'Unknown';
        
        this.trackClick(elementId, elementText);
      }
    });
  }

  /**
   * Track when user leaves page
   */
  private trackPageExit() {
    if (!this.isTracking) return;

    const timeOnPage = Math.round((Date.now() - this.pageStartTime) / 1000);
    
    const exitData = {
      sessionId: this.config.sessionId,
      pagePath: window.location.pathname,
      timeOnPage,
      scrollDepth: this.scrollDepth,
      timestamp: new Date().toISOString()
    };

    // Use sendBeacon for reliable tracking on page exit
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        `${this.config.apiUrl}/page-exit`,
        JSON.stringify(exitData)
      );
    }
  }

  /**
   * Update popular content tracking
   */
  private updatePopularContent(contentType: string, contentId: string, contentTitle: string) {
    const data = {
      contentType,
      contentId,
      contentTitle,
      timestamp: new Date().toISOString()
    };

    this.sendAnalytics('/popular-content', data);
  }

  /**
   * Send analytics data to backend
   */
  private async sendAnalytics(endpoint: string, data: any) {
    if (!this.config.enabled) return;

    try {
      await fetch(`${this.config.apiUrl}${endpoint}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(data)
      });
    } catch (error) {
      this.log('Failed to send analytics', error);
    }
  }

  /**
   * Utility functions
   */
  private getDeviceType(): 'desktop' | 'mobile' | 'tablet' {
    const userAgent = navigator.userAgent;
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) return 'tablet';
    if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) return 'mobile';
    return 'desktop';
  }

  private getBrowserName(): string {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome')) return 'chrome';
    if (userAgent.includes('Firefox')) return 'firefox';
    if (userAgent.includes('Safari')) return 'safari';
    if (userAgent.includes('Edge')) return 'edge';
    if (userAgent.includes('Opera')) return 'opera';
    return 'unknown';
  }

  private throttle(func: Function, limit: number) {
    let inThrottle: boolean;
    return function(this: any) {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  private log(message: string, data?: any) {
    if (this.config.debugMode) {
      console.log(`[TaxaFormer Analytics] ${message}`, data);
    }
  }
}

// Create global analytics instance
export const analytics = new TaxaformerAnalytics();

// Export convenience functions
export const trackPageView = (pagePath: string, pageTitle?: string) => 
  analytics.trackPageView(pagePath, pageTitle);

export const trackClick = (elementId: string, elementText: string, data?: Record<string, any>) => 
  analytics.trackClick(elementId, elementText, data);

export const trackFileUpload = (fileName: string, fileSize: number, fileType: string) => 
  analytics.trackFileUpload(fileName, fileSize, fileType);

export const trackSampleSelection = (sampleId: string, sampleName: string) => 
  analytics.trackSampleSelection(sampleId, sampleName);

export const trackAnalysisComplete = (processingTime: string, sequenceCount: number) => 
  analytics.trackAnalysisComplete(processingTime, sequenceCount);