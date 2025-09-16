import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';

interface AnalyticsEvent {
  [key: string]: any;
}

class AnalyticsService {
  private isEnabled: boolean = true;

  async logEvent(eventName: string, params?: AnalyticsEvent) {
    if (!this.isEnabled) return;

    try {
      await analytics().logEvent(eventName, params);
      crashlytics().log(`Analytics event: ${eventName}`);
    } catch (error) {
      console.error('Analytics error:', error);
      crashlytics().recordError(error instanceof Error ? error : new Error(String(error)));
    }
  }

  async logScreenView(screenName: string, screenClass?: string) {
    try {
      await analytics().logScreenView({
        screen_name: screenName,
        screen_class: screenClass || screenName,
      });
    } catch (error) {
      console.error('Analytics screen view error:', error);
    }
  }

  async setUserId(userId: string | null) {
    try {
      await analytics().setUserId(userId);
    } catch (error) {
      console.error('Analytics setUserId error:', error);
    }
  }

  async setUserProperty(name: string, value: string | null) {
    try {
      await analytics().setUserProperty(name, value);
    } catch (error) {
      console.error('Analytics setUserProperty error:', error);
    }
  }

  // App lifecycle events
  async logAppOpened() {
    const now = new Date();
    await this.logEvent('app_opened', {
      timestamp: now.toISOString(),
      hour_of_day: now.getHours(),
      day_of_week: now.getDay(),
    });
  }

  // Audio playback events
  async logAudioStarted(params: {
    audioId: string;
    audioTitle: string;
    audioType: 'meandering' | 'boring';
    gender: 'male' | 'female';
    isSubscribed: boolean;
    sourceScreen: string;
  }) {
    const now = new Date();
    await this.logEvent('audio_started', {
      audio_id: params.audioId,
      audio_title: params.audioTitle,
      audio_type: params.audioType,
      gender_preference: params.gender,
      is_subscribed: params.isSubscribed,
      source_screen: params.sourceScreen,
      hour_of_day: now.getHours(),
      timestamp: now.toISOString(),
    });
  }

  async logAudioPaused(audioId: string, positionSeconds: number) {
    await this.logEvent('audio_paused', {
      audio_id: audioId,
      position_seconds: Math.floor(positionSeconds),
    });
  }

  async logAudioResumed(audioId: string, positionSeconds: number) {
    await this.logEvent('audio_resumed', {
      audio_id: audioId,
      position_seconds: Math.floor(positionSeconds),
    });
  }

  async logAudioCompleted(params: {
    audioId: string;
    audioTitle: string;
    durationSeconds: number;
    positionSeconds: number;
  }) {
    const completionPercentage = Math.round((params.positionSeconds / params.durationSeconds) * 100);
    await this.logEvent('audio_completed', {
      audio_id: params.audioId,
      audio_title: params.audioTitle,
      duration_seconds: Math.floor(params.durationSeconds),
      position_seconds: Math.floor(params.positionSeconds),
      completion_percentage: completionPercentage,
    });
  }

  async logFreePreviewLimitReached(audioId: string, audioTitle: string) {
    await this.logEvent('free_preview_limit_reached', {
      audio_id: audioId,
      audio_title: audioTitle,
    });
  }

  // Content discovery events
  async logCategorySelected(category: string, gender: 'male' | 'female') {
    await this.logEvent('category_selected', {
      category,
      gender_preference: gender,
    });
  }

  async logGenderPreferenceChanged(newGender: 'male' | 'female', oldGender: 'male' | 'female') {
    await this.logEvent('gender_preference_changed', {
      new_gender: newGender,
      old_gender: oldGender,
    });
  }

  async logViewAllOpened(source: string) {
    await this.logEvent('view_all_opened', {
      source,
    });
  }

  async logDailyContentOpened(params: {
    itemId: string;
    itemTitle: string;
    audioType: 'meandering' | 'boring';
    dayNumber: string;
  }) {
    await this.logEvent('daily_content_opened', {
      item_id: params.itemId,
      item_title: params.itemTitle,
      audio_type: params.audioType,
      day_number: params.dayNumber,
      date: new Date().toISOString(),
    });
  }

  // Monetization events
  async logPaywallShown(source: string, trigger?: string) {
    await this.logEvent('paywall_shown', {
      source,
      trigger: trigger || 'manual',
    });
  }

  async logPaywallDismissed(source: string) {
    await this.logEvent('paywall_dismissed', {
      source,
    });
  }

  async logSubscriptionPurchased(productId: string, price?: number) {
    await this.logEvent('subscription_purchased', {
      product_id: productId,
      price,
    });
  }

  async logSubscriptionStatusChecked(isSubscribed: boolean) {
    await this.logEvent('subscription_status_checked', {
      is_subscribed: isSubscribed,
    });
  }

  // User properties
  async setGenderPreference(gender: 'male' | 'female') {
    await this.setUserProperty('gender_preference', gender);
  }

  async setSubscriptionStatus(isSubscribed: boolean) {
    await this.setUserProperty('subscription_status', isSubscribed ? 'subscribed' : 'free');
  }

  async setMostUsedAudioType(audioType: 'meandering' | 'boring') {
    await this.setUserProperty('most_used_audio_type', audioType);
  }

  // Error tracking
  async logError(error: Error, context?: string) {
    await this.logEvent('app_error', {
      error_message: error.message,
      error_stack: error.stack,
      context: context || 'unknown',
    });
  }
}

export default new AnalyticsService();