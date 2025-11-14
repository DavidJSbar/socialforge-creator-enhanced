/**
 * Internationalization (i18n) Configuration
 * 
 * This file contains all user-facing strings for easy translation
 * and internationalization support.
 */

export const i18nStrings = {
  en: {
    // Common
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      confirm: 'Confirm',
      back: 'Back',
      next: 'Next',
      finish: 'Finish',
      retry: 'Retry',
    },

    // Authentication
    auth: {
      signIn: 'Sign In',
      signUp: 'Sign Up',
      signOut: 'Sign Out',
      email: 'Email',
      password: 'Password',
      forgotPassword: 'Forgot Password?',
      resetPassword: 'Reset Password',
      unauthorized: 'User not authenticated',
      authError: 'Authentication failed',
    },

    // Content Creator
    contentCreator: {
      title: 'Create Content',
      postTitle: 'Post Title (optional)',
      postTitlePlaceholder: 'Post Title',
      contentPlaceholder: "What's on your mind?",
      saveAsDraft: 'Save as Draft',
      publishNow: 'Publish Now',
      saving: 'Saving...',
      publishing: 'Publishing...',
      successMessage: 'Post created successfully!',
      characterCount: '{count} / 10,000 characters',
      titleLengthError: 'Title must be between 1 and 280 characters',
      contentRequiredError: 'Content is required',
      contentLengthError: 'Content must not exceed 10,000 characters',
      createError: 'Failed to create post',
      publishError: 'Failed to publish post',
    },

    // Dashboard
    dashboard: {
      title: 'Dashboard',
      totalPosts: 'Total Posts',
      pendingApproval: 'Pending Approval',
      monthlyRevenue: 'Monthly Revenue',
      recentPosts: 'Recent Posts',
      viewAll: 'View All',
      noPosts: 'No posts yet',
      fetchError: 'Failed to fetch dashboard data',
    },

    // Posts
    posts: {
      createPost: 'Create Post',
      draftPosts: 'Draft Posts',
      publishedPosts: 'Published Posts',
      scheduledPosts: 'Scheduled Posts',
      postStatus: {
        draft: 'Draft',
        pendingApproval: 'Pending Approval',
        approved: 'Approved',
        posted: 'Posted',
        failed: 'Failed',
        rejected: 'Rejected',
      },
      deleteConfirm: 'Are you sure you want to delete this post?',
      fetchError: 'Failed to fetch posts',
    },

    // Insights
    insights: {
      title: 'Content Insights',
      generatePost: 'Generate Post',
      viewOpportunity: 'View Opportunity',
      platforms: 'Platforms',
      tone: 'Tone',
      tones: {
        casual: 'Casual',
        professional: 'Professional',
        educational: 'Educational',
      },
      generating: 'Generating...',
      generationSuccess: 'Post variations generated successfully',
      generationError: 'Failed to generate post variations',
      opportunityNotFound: 'Opportunity not found',
    },

    // Analytics
    analytics: {
      title: 'Analytics',
      totalViews: 'Total Views',
      totalEngagement: 'Total Engagement',
      totalReach: 'Total Reach',
      conversionRate: 'Conversion Rate',
      dateRange: 'Date Range',
      last7Days: 'Last 7 Days',
      last30Days: 'Last 30 Days',
      last90Days: 'Last 90 Days',
      fetchError: 'Failed to fetch analytics data',
    },

    // Monetization
    monetization: {
      title: 'Monetization',
      revenue: 'Revenue',
      earnings: 'Earnings',
      sources: {
        affiliate: 'Affiliate',
        sponsorship: 'Sponsorship',
        ads: 'Ads',
        digitalProduct: 'Digital Product',
      },
      fetchError: 'Failed to fetch monetization data',
    },

    // Platforms
    platforms: {
      instagram: 'Instagram',
      tiktok: 'TikTok',
      youtube: 'YouTube',
      twitter: 'Twitter',
      linkedin: 'LinkedIn',
      facebook: 'Facebook',
      pinterest: 'Pinterest',
      connectAccount: 'Connect Account',
      disconnectAccount: 'Disconnect Account',
      accountConnected: 'Account Connected',
      connectionError: 'Failed to connect account',
    },

    // Validation
    validation: {
      required: '{field} is required',
      invalidEmail: 'Invalid email format',
      invalidURL: 'Invalid URL format',
      minLength: '{field} must be at least {min} characters',
      maxLength: '{field} must not exceed {max} characters',
      invalidPlatform: 'Invalid platform selected',
    },

    // Errors
    errors: {
      unexpected: 'An unexpected error occurred',
      networkError: 'Network error. Please check your connection.',
      serverError: 'Server error. Please try again later.',
      notFound: 'Resource not found',
      rateLimitExceeded: 'Rate limit exceeded. Please try again later.',
      databaseError: 'Database error occurred',
      externalAPIError: 'External API error: {platform}',
    },

    // Settings
    settings: {
      title: 'Settings',
      profile: 'Profile',
      account: 'Account',
      notifications: 'Notifications',
      privacy: 'Privacy',
      preferences: 'Preferences',
      language: 'Language',
      theme: 'Theme',
      saveChanges: 'Save Changes',
      changesSaved: 'Changes saved successfully',
      saveError: 'Failed to save changes',
    },
  },

  // Add more languages here
  // es: { ... },
  // fr: { ... },
} as const;

export type Locale = keyof typeof i18nStrings;
export type I18nKeys = typeof i18nStrings.en;

/**
 * Get translated string
 * @param locale - Current locale
 * @param key - Translation key (dot notation)
 * @param params - Optional parameters for string interpolation
 */
export function t(
  locale: Locale,
  key: string,
  params?: Record<string, string | number>
): string {
  const keys = key.split('.');
  let value: unknown = i18nStrings[locale];

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
  }

  let result = String(value);

  // Replace parameters
  if (params) {
    Object.entries(params).forEach(([paramKey, paramValue]) => {
      result = result.replace(`{${paramKey}}`, String(paramValue));
    });
  }

  return result;
}

/**
 * Hook for using translations in React components
 */
export function useTranslation(locale: Locale = 'en') {
  return {
    t: (key: string, params?: Record<string, string | number>) => 
      t(locale, key, params),
    locale,
  };
}
