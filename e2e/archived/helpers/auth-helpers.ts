import { Page, expect } from '@playwright/test';

/**
 * 🔧 AUTHENTICATION HELPER FUNCTIONS
 *
 * Reusable functions for common authentication actions in E2E tests
 */

export interface UserCredentials {
  email: string;
  password: string;
  fullName?: string;
  confirmPassword?: string;
}

export class AuthHelpers {
  constructor(private page: Page) {}

  /**
   * Navigate to sign up form
   */
  async navigateToSignUp(): Promise<void> {
    const signUpButton = this.page.locator('[data-testid="sign-up-button"], button:has-text("Sign Up"), a:has-text("Sign Up")').first();

    if (await signUpButton.isVisible()) {
      await signUpButton.click();
    }
  }

  /**
   * Navigate to login form
   */
  async navigateToLogin(): Promise<void> {
    const loginButton = this.page.locator('[data-testid="login-button"], button:has-text("Login"), a:has-text("Login"), button:has-text("Sign In"), a:has-text("Sign In")').first();

    if (await loginButton.isVisible()) {
      await loginButton.click();
    }
  }

  /**
   * Fill out registration form
   */
  async fillRegistrationForm(credentials: UserCredentials): Promise<void> {
    await this.page.fill('[data-testid="email"], input[type="email"]', credentials.email);
    await this.page.fill('[data-testid="password"], input[type="password"]', credentials.password);

    if (credentials.confirmPassword) {
      await this.page.fill('[data-testid="confirm-password"], input[name="confirmPassword"]', credentials.confirmPassword);
    }

    if (credentials.fullName) {
      await this.page.fill('[data-testid="full-name"], input[name="fullName"]', credentials.fullName);
    }
  }

  /**
   * Check required checkboxes for registration
   */
  async checkRequiredConsents(): Promise<void> {
    const ageVerification = this.page.locator('[data-testid="age-verification"], input[name="ageVerification"]');
    if (await ageVerification.isVisible()) {
      await ageVerification.check();
    }

    const termsAgreement = this.page.locator('[data-testid="terms-agreement"], input[name="termsAgreed"]');
    if (await termsAgreement.isVisible()) {
      await termsAgreement.check();
    }
  }

  /**
   * Submit authentication form
   */
  async submitForm(): Promise<void> {
    const submitButton = this.page.locator('[data-testid="submit-button"], button[type="submit"], button:has-text("Sign Up"), button:has-text("Login"), button:has-text("Sign In")').first();
    await submitButton.click();
  }

  /**
   * Fill login form
   */
  async fillLoginForm(credentials: UserCredentials): Promise<void> {
    await this.page.fill('[data-testid="email"], input[type="email"]', credentials.email);
    await this.page.fill('[data-testid="password"], input[type="password"]', credentials.password);
  }

  /**
   * Complete registration flow
   */
  async registerUser(credentials: UserCredentials): Promise<void> {
    await this.navigateToSignUp();
    await this.fillRegistrationForm(credentials);
    await this.checkRequiredConsents();
    await this.submitForm();

    // Wait for successful registration
    await expect(this.page).toHaveURL(/chat/, { timeout: 10000 });
  }

  /**
   * Complete login flow
   */
  async loginUser(credentials: UserCredentials): Promise<void> {
    await this.navigateToLogin();
    await this.fillLoginForm(credentials);
    await this.submitForm();

    // Wait for successful login
    await expect(this.page).toHaveURL(/chat/, { timeout: 10000 });
  }

  /**
   * Logout user
   */
  async logoutUser(): Promise<void> {
    const logoutButton = this.page.locator('[data-testid="logout-button"], button:has-text("Logout"), button:has-text("Sign Out")').first();
    await logoutButton.click();

    // Wait for logout to complete
    await expect(this.page).toHaveURL(/login|signin|auth|^\/$/, { timeout: 5000 });
  }

  /**
   * Check if user is authenticated by trying to access a protected route
   */
  async isAuthenticated(): Promise<boolean> {
    await this.page.goto('/chat');

    try {
      await expect(this.page).toHaveURL(/chat/, { timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Wait for authentication state to be loaded
   */
  async waitForAuthState(): Promise<void> {
    // Wait for the app to finish loading authentication state
    await this.page.waitForLoadState('networkidle');

    // Give additional time for auth context to initialize
    await this.page.waitForTimeout(1000);
  }

  /**
   * Expect validation error to be visible
   */
  async expectValidationError(): Promise<void> {
    await expect(this.page.locator('text=/invalid|error|required/i')).toBeVisible({ timeout: 5000 });
  }

  /**
   * Expect authentication error to be visible
   */
  async expectAuthError(): Promise<void> {
    await expect(this.page.locator('text=/invalid|error|incorrect|failed/i')).toBeVisible({ timeout: 5000 });
  }
}

/**
 * Test user credentials for consistent testing
 */
export const TEST_USERS = {
  validUser: {
    email: 'test@example.com',
    password: 'Test123!@#',
    fullName: 'Test User',
    confirmPassword: 'Test123!@#'
  },
  invalidUser: {
    email: 'wrong@example.com',
    password: 'wrongpassword'
  },
  weakPassword: {
    email: 'weak@example.com',
    password: 'weak'
  },
  mobileUser: {
    email: 'mobile@example.com',
    password: 'Mobile123!@#',
    fullName: 'Mobile User',
    confirmPassword: 'Mobile123!@#'
  }
} as const;
