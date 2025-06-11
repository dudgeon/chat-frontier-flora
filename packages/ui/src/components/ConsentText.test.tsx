import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { ConsentText, ConsentType } from './ConsentText';

describe('ConsentText Component', () => {
  describe('Age Verification Consent', () => {
    it('renders age verification with default variant', () => {
      render(<ConsentText type="age-verification" testID="age-consent" />);

      const consentText = screen.getByTestId('age-consent');
      expect(consentText).toBeTruthy();
      expect(consentText.props.accessibilityLabel).toBe('Age verification consent: Confirms user is 18 or older');

      const content = screen.getByTestId('age-consent-content');
      expect(content).toBeTruthy();
    });

    it('renders age verification with compact variant', () => {
      render(<ConsentText type="age-verification" variant="compact" testID="age-consent-compact" />);

      const consentText = screen.getByTestId('age-consent-compact');
      expect(consentText).toBeTruthy();

      // Compact variant should have shorter text
      const content = screen.getByTestId('age-consent-compact-content');
      expect(content).toBeTruthy();
    });

    it('renders age verification with detailed variant', () => {
      render(<ConsentText type="age-verification" variant="detailed" testID="age-consent-detailed" />);

      const consentText = screen.getByTestId('age-consent-detailed');
      expect(consentText).toBeTruthy();

      // Detailed variant should include title
      const title = screen.getByTestId('age-consent-detailed-title');
      expect(title).toBeTruthy();

      const content = screen.getByTestId('age-consent-detailed-content');
      expect(content).toBeTruthy();
    });
  });

  describe('Development Consent', () => {
    it('renders development consent with default variant', () => {
      render(<ConsentText type="development-consent" testID="dev-consent" />);

      const consentText = screen.getByTestId('dev-consent');
      expect(consentText).toBeTruthy();
      expect(consentText.props.accessibilityLabel).toBe('Development consent: Allows data usage for app improvement');

      const content = screen.getByTestId('dev-consent-content');
      expect(content).toBeTruthy();
    });

    it('renders development consent with compact variant', () => {
      render(<ConsentText type="development-consent" variant="compact" testID="dev-consent-compact" />);

      const consentText = screen.getByTestId('dev-consent-compact');
      expect(consentText).toBeTruthy();

      const content = screen.getByTestId('dev-consent-compact-content');
      expect(content).toBeTruthy();
    });

    it('renders development consent with detailed variant', () => {
      render(<ConsentText type="development-consent" variant="detailed" testID="dev-consent-detailed" />);

      const consentText = screen.getByTestId('dev-consent-detailed');
      expect(consentText).toBeTruthy();

      // Detailed variant should include title
      const title = screen.getByTestId('dev-consent-detailed-title');
      expect(title).toBeTruthy();

      const content = screen.getByTestId('dev-consent-detailed-content');
      expect(content).toBeTruthy();
    });
  });

  describe('Terms of Service Consent', () => {
    it('renders terms of service with default variant', () => {
      render(<ConsentText type="terms-of-service" testID="terms-consent" />);

      const consentText = screen.getByTestId('terms-consent');
      expect(consentText).toBeTruthy();
      expect(consentText.props.accessibilityLabel).toBe('Terms of service agreement');

      const content = screen.getByTestId('terms-consent-content');
      expect(content).toBeTruthy();
    });

    it('renders terms of service with compact variant', () => {
      render(<ConsentText type="terms-of-service" variant="compact" testID="terms-consent-compact" />);

      const consentText = screen.getByTestId('terms-consent-compact');
      expect(consentText).toBeTruthy();

      const content = screen.getByTestId('terms-consent-compact-content');
      expect(content).toBeTruthy();
    });
  });

  describe('Privacy Policy Consent', () => {
    it('renders privacy policy with default variant', () => {
      render(<ConsentText type="privacy-policy" testID="privacy-consent" />);

      const consentText = screen.getByTestId('privacy-consent');
      expect(consentText).toBeTruthy();
      expect(consentText.props.accessibilityLabel).toBe('Privacy policy acknowledgment');

      const content = screen.getByTestId('privacy-consent-content');
      expect(content).toBeTruthy();
    });

    it('renders privacy policy with detailed variant', () => {
      render(<ConsentText type="privacy-policy" variant="detailed" testID="privacy-consent-detailed" />);

      const consentText = screen.getByTestId('privacy-consent-detailed');
      expect(consentText).toBeTruthy();

      // Detailed variant should include title
      const title = screen.getByTestId('privacy-consent-detailed-title');
      expect(title).toBeTruthy();

      const content = screen.getByTestId('privacy-consent-detailed-content');
      expect(content).toBeTruthy();
    });
  });

  describe('Default Consent Type', () => {
    it('renders default consent for unknown type', () => {
      render(<ConsentText type={'unknown-type' as ConsentType} testID="default-consent" />);

      const consentText = screen.getByTestId('default-consent');
      expect(consentText).toBeTruthy();
      expect(consentText.props.accessibilityLabel).toBe('General consent');

      const content = screen.getByTestId('default-consent-content');
      expect(content).toBeTruthy();
    });
  });

  describe('Accessibility Features', () => {
    it('has proper accessibility role and labels', () => {
      render(<ConsentText type="age-verification" testID="accessibility-test" />);

      const consentText = screen.getByTestId('accessibility-test');
      expect(consentText.props.accessible).toBe(true);
      expect(consentText.props.accessibilityRole).toBe('text');
      expect(consentText.props.accessibilityLabel).toBe('Age verification consent: Confirms user is 18 or older');
    });

    it('content elements are not individually accessible (parent handles it)', () => {
      render(<ConsentText type="development-consent" variant="detailed" testID="accessibility-detailed" />);

      const title = screen.getByTestId('accessibility-detailed-title');
      expect(title.props.accessible).toBe(false);

      const content = screen.getByTestId('accessibility-detailed-content');
      expect(content.props.accessible).toBe(false);
    });
  });

  describe('Variant Styling', () => {
    it('applies correct styling for compact variant', () => {
      render(<ConsentText type="age-verification" variant="compact" testID="compact-styling" />);

      const consentText = screen.getByTestId('compact-styling');
      expect(consentText).toBeTruthy();
      // Note: Specific style testing would require additional setup for style inspection
    });

    it('applies correct styling for detailed variant', () => {
      render(<ConsentText type="development-consent" variant="detailed" testID="detailed-styling" />);

      const consentText = screen.getByTestId('detailed-styling');
      expect(consentText).toBeTruthy();

      // Detailed variant should have title
      const title = screen.getByTestId('detailed-styling-title');
      expect(title).toBeTruthy();
    });

    it('applies correct styling for default variant', () => {
      render(<ConsentText type="terms-of-service" testID="default-styling" />);

      const consentText = screen.getByTestId('default-styling');
      expect(consentText).toBeTruthy();
    });
  });

  describe('TestID Propagation', () => {
    it('propagates testID to child elements correctly', () => {
      render(<ConsentText type="development-consent" variant="detailed" testID="testid-test" />);

      const consentText = screen.getByTestId('testid-test');
      expect(consentText).toBeTruthy();

      const title = screen.getByTestId('testid-test-title');
      expect(title).toBeTruthy();

      const content = screen.getByTestId('testid-test-content');
      expect(content).toBeTruthy();
    });

    it('handles missing testID gracefully', () => {
      render(<ConsentText type="age-verification" />);

      // Should render without errors even without testID
      expect(screen.getByRole('text')).toBeTruthy();
    });
  });
});
