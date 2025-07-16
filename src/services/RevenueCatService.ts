import Purchases, {
  CustomerInfo,
  PurchasesPackage,
  LOG_LEVEL,
} from 'react-native-purchases';
import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';
import { Platform } from 'react-native';
import Config from 'react-native-config';
import crashlytics from '@react-native-firebase/crashlytics';

class RevenueCatService {
  private initialized = false;

  async initialize() {
    if (this.initialized) {
      crashlytics().log('RevenueCat already initialized');
      return;
    }

    try {
      crashlytics().log('Starting RevenueCat initialization');
      Purchases.setLogLevel(LOG_LEVEL.VERBOSE);

      // Configure with your RevenueCat API keys from environment
      const apiKey = Platform.select({
        ios: Config.REVENUECAT_IOS_API_KEY,
        android: Config.REVENUECAT_ANDROID_API_KEY,
      });

      crashlytics().log(`Platform: ${Platform.OS}`);
      crashlytics().log(`API Key present: ${!!apiKey}`);

      if (!apiKey) {
        const error = new Error('RevenueCat API key not configured');
        crashlytics().recordError(error);
        throw error;
      }

      Purchases.configure({ apiKey });
      this.initialized = true;
      console.log('RevenueCat initialized successfully');
      crashlytics().log('RevenueCat initialized successfully');
    } catch (error) {
      console.error('Error initializing RevenueCat:', error);
      crashlytics().log(`RevenueCat initialization error: ${error}`);
      crashlytics().recordError(error as Error);
      throw error;
    }
  }

  async login(userId: string) {
    try {
      const customerInfo = await Purchases.logIn(userId);
      console.log('User logged in to RevenueCat:', userId);
      return customerInfo;
    } catch (error) {
      console.error('Error logging in to RevenueCat:', error);
      throw error;
    }
  }

  async logout() {
    try {
      const customerInfo = await Purchases.logOut();
      console.log('User logged out from RevenueCat');
      return customerInfo;
    } catch (error) {
      console.error('Error logging out from RevenueCat:', error);
      throw error;
    }
  }

  async getCustomerInfo(): Promise<CustomerInfo> {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      return customerInfo;
    } catch (error) {
      console.error('Error getting customer info:', error);
      throw error;
    }
  }

  async getOfferings() {
    try {
      const offerings = await Purchases.getOfferings();
      return offerings;
    } catch (error) {
      console.error('Error getting offerings:', error);
      throw error;
    }
  }

  async purchasePackage(purchasePackage: PurchasesPackage) {
    try {
      const { customerInfo } = await Purchases.purchasePackage(purchasePackage);
      console.log('Purchase successful');
      return customerInfo;
    } catch (error) {
      const purchaseError = error as { userCancelled?: boolean };
      if (!purchaseError.userCancelled) {
        console.error('Error purchasing package:', error);
      }
      throw error;
    }
  }

  async restorePurchases() {
    try {
      const customerInfo = await Purchases.restorePurchases();
      console.log('Purchases restored successfully');
      return customerInfo;
    } catch (error) {
      console.error('Error restoring purchases:', error);
      throw error;
    }
  }

  async checkSubscriptionStatus(): Promise<boolean> {
    try {
      const customerInfo = await this.getCustomerInfo();
      // Check if user has any active entitlements
      return Object.keys(customerInfo.entitlements.active).length > 0;
    } catch (error) {
      console.error('Error checking subscription status:', error);
      return false;
    }
  }

  async presentPaywall(): Promise<PAYWALL_RESULT> {
    crashlytics().log('presentPaywall called');
    
    if (!this.initialized) {
      console.error('RevenueCat not initialized. Cannot present paywall.');
      const error = new Error('RevenueCat must be initialized before presenting paywall');
      crashlytics().recordError(error);
      throw error;
    }
    
    try {
      crashlytics().log('Calling RevenueCatUI.presentPaywall');
      const paywallResult = await RevenueCatUI.presentPaywall();
      console.log('Paywall result:', paywallResult);
      crashlytics().log(`Paywall presented with result: ${paywallResult}`);
      return paywallResult;
    } catch (error) {
      console.error('Error presenting paywall:', error);
      crashlytics().log(`Error in presentPaywall: ${error}`);
      crashlytics().recordError(error as Error);
      throw error;
    }
  }

  async presentPaywallIfNeeded(requiredEntitlementIdentifier?: string): Promise<PAYWALL_RESULT> {
    crashlytics().log(`presentPaywallIfNeeded called with entitlement: ${requiredEntitlementIdentifier || 'none'}`);
    
    if (!this.initialized) {
      console.error('RevenueCat not initialized. Cannot present paywall.');
      const error = new Error('RevenueCat must be initialized before presenting paywall');
      crashlytics().recordError(error);
      throw error;
    }
    
    try {
      crashlytics().log('Calling RevenueCatUI.presentPaywallIfNeeded');
      const paywallResult = await RevenueCatUI.presentPaywallIfNeeded(
        requiredEntitlementIdentifier ? { requiredEntitlementIdentifier } : undefined as any
      );
      console.log('Paywall result:', paywallResult);
      crashlytics().log(`PaywallIfNeeded result: ${paywallResult}`);
      return paywallResult;
    } catch (error) {
      console.error('Error presenting paywall if needed:', error);
      crashlytics().log(`Error in presentPaywallIfNeeded: ${error}`);
      crashlytics().recordError(error as Error);
      throw error;
    }
  }
}

export default new RevenueCatService();