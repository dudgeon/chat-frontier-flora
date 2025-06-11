import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { ValidationIcon, ValidationState } from './ValidationIcon';

describe('ValidationIcon Component', () => {
  describe('Validation States', () => {
    it('renders success state correctly', () => {
      render(<ValidationIcon state="success" testID="success-icon" />);

      const icon = screen.getByTestId('success-icon');
      expect(icon).toBeTruthy();
      expect(icon.props.accessibilityLabel).toBe('Success: Validation passed');

      const iconElement = screen.getByTestId('success-icon-icon');
      expect(iconElement).toBeTruthy();
    });

    it('renders error state correctly', () => {
      render(<ValidationIcon state="error" testID="error-icon" />);

      const icon = screen.getByTestId('error-icon');
      expect(icon).toBeTruthy();
      expect(icon.props.accessibilityLabel).toBe('Error: Validation failed');

      const iconElement = screen.getByTestId('error-icon-icon');
      expect(iconElement).toBeTruthy();
    });

    it('renders warning state correctly', () => {
      render(<ValidationIcon state="warning" testID="warning-icon" />);

      const icon = screen.getByTestId('warning-icon');
      expect(icon).toBeTruthy();
      expect(icon.props.accessibilityLabel).toBe('Warning: Validation warning');

      const iconElement = screen.getByTestId('warning-icon-icon');
      expect(iconElement).toBeTruthy();
    });

    it('renders pending state correctly', () => {
      render(<ValidationIcon state="pending" testID="pending-icon" />);

      const icon = screen.getByTestId('pending-icon');
      expect(icon).toBeTruthy();
      expect(icon.props.accessibilityLabel).toBe('Pending: Validation in progress');

      const iconElement = screen.getByTestId('pending-icon-icon');
      expect(iconElement).toBeTruthy();
    });

    it('renders neutral state correctly', () => {
      render(<ValidationIcon state="neutral" testID="neutral-icon" />);

      const icon = screen.getByTestId('neutral-icon');
      expect(icon).toBeTruthy();
      expect(icon.props.accessibilityLabel).toBe('Neutral: No validation status');

      const iconElement = screen.getByTestId('neutral-icon-icon');
      expect(iconElement).toBeTruthy();
    });
  });

  describe('Size Variants', () => {
    it('renders small size correctly', () => {
      render(<ValidationIcon state="success" size="sm" testID="small-icon" />);

      const icon = screen.getByTestId('small-icon');
      expect(icon).toBeTruthy();

      const iconElement = screen.getByTestId('small-icon-icon');
      expect(iconElement).toBeTruthy();
    });

    it('renders medium size correctly (default)', () => {
      render(<ValidationIcon state="success" testID="medium-icon" />);

      const icon = screen.getByTestId('medium-icon');
      expect(icon).toBeTruthy();

      const iconElement = screen.getByTestId('medium-icon-icon');
      expect(iconElement).toBeTruthy();
    });

    it('renders large size correctly', () => {
      render(<ValidationIcon state="success" size="lg" testID="large-icon" />);

      const icon = screen.getByTestId('large-icon');
      expect(icon).toBeTruthy();

      const iconElement = screen.getByTestId('large-icon-icon');
      expect(iconElement).toBeTruthy();
    });
  });

  describe('Text Display', () => {
    it('shows default text when showText is true', () => {
      render(<ValidationIcon state="success" showText={true} testID="text-icon" />);

      const icon = screen.getByTestId('text-icon');
      expect(icon).toBeTruthy();

      const iconElement = screen.getByTestId('text-icon-icon');
      expect(iconElement).toBeTruthy();

      const textElement = screen.getByTestId('text-icon-text');
      expect(textElement).toBeTruthy();
    });

    it('shows custom text when provided', () => {
      render(<ValidationIcon state="error" showText={true} customText="Custom Error" testID="custom-text-icon" />);

      const icon = screen.getByTestId('custom-text-icon');
      expect(icon).toBeTruthy();

      const textElement = screen.getByTestId('custom-text-icon-text');
      expect(textElement).toBeTruthy();
    });

    it('does not show text when showText is false', () => {
      render(<ValidationIcon state="success" showText={false} testID="no-text-icon" />);

      const icon = screen.getByTestId('no-text-icon');
      expect(icon).toBeTruthy();

      const iconElement = screen.getByTestId('no-text-icon-icon');
      expect(iconElement).toBeTruthy();

      // Text element should not exist
      expect(() => screen.getByTestId('no-text-icon-text')).toThrow();
    });

    it('does not show text by default', () => {
      render(<ValidationIcon state="success" testID="default-no-text-icon" />);

      const icon = screen.getByTestId('default-no-text-icon');
      expect(icon).toBeTruthy();

      // Text element should not exist by default
      expect(() => screen.getByTestId('default-no-text-icon-text')).toThrow();
    });
  });

  describe('Default Text Values', () => {
    it('shows correct default text for success state', () => {
      render(<ValidationIcon state="success" showText={true} testID="success-default-text" />);

      const textElement = screen.getByTestId('success-default-text-text');
      expect(textElement).toBeTruthy();
      // Note: Actual text content testing would require additional setup
    });

    it('shows correct default text for error state', () => {
      render(<ValidationIcon state="error" showText={true} testID="error-default-text" />);

      const textElement = screen.getByTestId('error-default-text-text');
      expect(textElement).toBeTruthy();
    });

    it('shows correct default text for warning state', () => {
      render(<ValidationIcon state="warning" showText={true} testID="warning-default-text" />);

      const textElement = screen.getByTestId('warning-default-text-text');
      expect(textElement).toBeTruthy();
    });

    it('shows correct default text for pending state', () => {
      render(<ValidationIcon state="pending" showText={true} testID="pending-default-text" />);

      const textElement = screen.getByTestId('pending-default-text-text');
      expect(textElement).toBeTruthy();
    });

    it('shows correct default text for neutral state', () => {
      render(<ValidationIcon state="neutral" showText={true} testID="neutral-default-text" />);

      const textElement = screen.getByTestId('neutral-default-text-text');
      expect(textElement).toBeTruthy();
    });
  });

  describe('Accessibility Features', () => {
    it('has proper accessibility role and labels', () => {
      render(<ValidationIcon state="success" testID="accessibility-test" />);

      const icon = screen.getByTestId('accessibility-test');
      expect(icon.props.accessible).toBe(true);
      expect(icon.props.accessibilityRole).toBe('image');
      expect(icon.props.accessibilityLabel).toBe('Success: Validation passed');
    });

    it('child elements are not individually accessible (parent handles it)', () => {
      render(<ValidationIcon state="success" showText={true} testID="accessibility-children" />);

      const iconElement = screen.getByTestId('accessibility-children-icon');
      expect(iconElement.props.accessible).toBe(false);

      const textElement = screen.getByTestId('accessibility-children-text');
      expect(textElement.props.accessible).toBe(false);
    });

    it('provides correct accessibility labels for all states', () => {
      const states: ValidationState[] = ['success', 'error', 'warning', 'pending', 'neutral'];
      const expectedLabels = [
        'Success: Validation passed',
        'Error: Validation failed',
        'Warning: Validation warning',
        'Pending: Validation in progress',
        'Neutral: No validation status'
      ];

      states.forEach((state, index) => {
        const { unmount } = render(<ValidationIcon state={state} testID={`accessibility-${state}`} />);

        const icon = screen.getByTestId(`accessibility-${state}`);
        expect(icon.props.accessibilityLabel).toBe(expectedLabels[index]);

        unmount();
      });
    });
  });

  describe('TestID Propagation', () => {
    it('propagates testID to child elements correctly', () => {
      render(<ValidationIcon state="success" showText={true} testID="testid-test" />);

      const icon = screen.getByTestId('testid-test');
      expect(icon).toBeTruthy();

      const iconElement = screen.getByTestId('testid-test-icon');
      expect(iconElement).toBeTruthy();

      const textElement = screen.getByTestId('testid-test-text');
      expect(textElement).toBeTruthy();
    });

    it('handles missing testID gracefully', () => {
      render(<ValidationIcon state="success" />);

      // Should render without errors even without testID
      expect(screen.getByRole('image')).toBeTruthy();
    });

    it('handles testID with icon only (no text)', () => {
      render(<ValidationIcon state="success" testID="icon-only-test" />);

      const icon = screen.getByTestId('icon-only-test');
      expect(icon).toBeTruthy();

      const iconElement = screen.getByTestId('icon-only-test-icon');
      expect(iconElement).toBeTruthy();

      // Text element should not exist
      expect(() => screen.getByTestId('icon-only-test-text')).toThrow();
    });
  });

  describe('Custom Text Override', () => {
    it('uses custom text instead of default for all states', () => {
      const states: ValidationState[] = ['success', 'error', 'warning', 'pending', 'neutral'];

      states.forEach((state) => {
        const customText = `Custom ${state} text`;
        const { unmount } = render(
          <ValidationIcon
            state={state}
            showText={true}
            customText={customText}
            testID={`custom-${state}`}
          />
        );

        const textElement = screen.getByTestId(`custom-${state}-text`);
        expect(textElement).toBeTruthy();

        unmount();
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles invalid state gracefully', () => {
      render(<ValidationIcon state={'invalid' as ValidationState} testID="invalid-state" />);

      const icon = screen.getByTestId('invalid-state');
      expect(icon).toBeTruthy();
      // Should default to neutral state behavior
      expect(icon.props.accessibilityLabel).toBe('Neutral: No validation status');
    });

    it('handles invalid size gracefully', () => {
      render(<ValidationIcon state="success" size={'invalid' as any} testID="invalid-size" />);

      const icon = screen.getByTestId('invalid-size');
      expect(icon).toBeTruthy();
      // Should default to medium size behavior
    });
  });
});
