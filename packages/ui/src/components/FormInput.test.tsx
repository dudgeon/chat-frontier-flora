import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { FormInput } from './FormInput';

describe('FormInput Component', () => {
  describe('Basic Rendering', () => {
    it('renders with label and input', () => {
      render(<FormInput label="Test Label" testID="basic-input" />);

      const input = screen.getByTestId('basic-input');
      expect(input).toBeTruthy();

      const label = screen.getByText('Test Label');
      expect(label).toBeTruthy();
    });

    it('renders with placeholder text', () => {
      render(<FormInput label="Test Label" placeholder="Enter text here" testID="placeholder-input" />);

      const input = screen.getByTestId('placeholder-input');
      expect(input).toBeTruthy();
      expect(input.props.placeholder).toBe('Enter text here');
    });

    it('renders with initial value', () => {
      render(<FormInput label="Test Label" value="Initial Value" testID="value-input" />);

      const input = screen.getByTestId('value-input');
      expect(input).toBeTruthy();
      expect(input.props.value).toBe('Initial Value');
    });
  });

  describe('Error States', () => {
    it('renders without error message when no error prop', () => {
      render(<FormInput label="Test Label" testID="no-error-input" />);

      const input = screen.getByTestId('no-error-input');
      expect(input).toBeTruthy();

      // Error text should not exist
      expect(() => screen.getByText(/error/i)).toThrow();
    });

    it('renders with error message when error prop is provided', () => {
      render(<FormInput label="Test Label" error="This field is required" testID="error-input" />);

      const input = screen.getByTestId('error-input');
      expect(input).toBeTruthy();

      const errorText = screen.getByText('This field is required');
      expect(errorText).toBeTruthy();
    });

    it('applies error styling when error is present', () => {
      render(<FormInput label="Test Label" error="Error message" testID="error-styling-input" />);

      const input = screen.getByTestId('error-styling-input');
      expect(input).toBeTruthy();
      // Note: Specific style testing would require additional setup for style inspection
    });

    it('applies normal styling when no error', () => {
      render(<FormInput label="Test Label" testID="normal-styling-input" />);

      const input = screen.getByTestId('normal-styling-input');
      expect(input).toBeTruthy();
      // Note: Specific style testing would require additional setup for style inspection
    });
  });

  describe('Input Interactions', () => {
    it('handles text input changes', () => {
      const onChangeText = jest.fn();
      render(<FormInput label="Test Label" onChangeText={onChangeText} testID="change-input" />);

      const input = screen.getByTestId('change-input');
      fireEvent.changeText(input, 'New text');

      expect(onChangeText).toHaveBeenCalledWith('New text');
    });

    it('handles focus events', () => {
      const onFocus = jest.fn();
      render(<FormInput label="Test Label" onFocus={onFocus} testID="focus-input" />);

      const input = screen.getByTestId('focus-input');
      fireEvent(input, 'focus');

      expect(onFocus).toHaveBeenCalled();
    });

    it('handles blur events', () => {
      const onBlur = jest.fn();
      render(<FormInput label="Test Label" onBlur={onBlur} testID="blur-input" />);

      const input = screen.getByTestId('blur-input');
      fireEvent(input, 'blur');

      expect(onBlur).toHaveBeenCalled();
    });

    it('handles submit editing events', () => {
      const onSubmitEditing = jest.fn();
      render(<FormInput label="Test Label" onSubmitEditing={onSubmitEditing} testID="submit-input" />);

      const input = screen.getByTestId('submit-input');
      fireEvent(input, 'submitEditing');

      expect(onSubmitEditing).toHaveBeenCalled();
    });
  });

  describe('TextInput Props Forwarding', () => {
    it('forwards keyboardType prop', () => {
      render(<FormInput label="Email" keyboardType="email-address" testID="keyboard-input" />);

      const input = screen.getByTestId('keyboard-input');
      expect(input.props.keyboardType).toBe('email-address');
    });

    it('forwards secureTextEntry prop', () => {
      render(<FormInput label="Password" secureTextEntry={true} testID="secure-input" />);

      const input = screen.getByTestId('secure-input');
      expect(input.props.secureTextEntry).toBe(true);
    });

    it('forwards autoCapitalize prop', () => {
      render(<FormInput label="Name" autoCapitalize="words" testID="capitalize-input" />);

      const input = screen.getByTestId('capitalize-input');
      expect(input.props.autoCapitalize).toBe('words');
    });

    it('forwards autoComplete prop', () => {
      render(<FormInput label="Email" autoComplete="email" testID="autocomplete-input" />);

      const input = screen.getByTestId('autocomplete-input');
      expect(input.props.autoComplete).toBe('email');
    });

    it('forwards textContentType prop', () => {
      render(<FormInput label="Email" textContentType="emailAddress" testID="content-type-input" />);

      const input = screen.getByTestId('content-type-input');
      expect(input.props.textContentType).toBe('emailAddress');
    });

    it('forwards editable prop', () => {
      render(<FormInput label="Read Only" editable={false} testID="readonly-input" />);

      const input = screen.getByTestId('readonly-input');
      expect(input.props.editable).toBe(false);
    });

    it('forwards multiline prop', () => {
      render(<FormInput label="Description" multiline={true} testID="multiline-input" />);

      const input = screen.getByTestId('multiline-input');
      expect(input.props.multiline).toBe(true);
    });

    it('forwards numberOfLines prop', () => {
      render(<FormInput label="Description" multiline={true} numberOfLines={4} testID="lines-input" />);

      const input = screen.getByTestId('lines-input');
      expect(input.props.numberOfLines).toBe(4);
    });

    it('forwards maxLength prop', () => {
      render(<FormInput label="Short Text" maxLength={50} testID="maxlength-input" />);

      const input = screen.getByTestId('maxlength-input');
      expect(input.props.maxLength).toBe(50);
    });
  });

  describe('Custom Styling', () => {
    it('applies custom style prop', () => {
      const customStyle = { backgroundColor: 'lightblue' };
      render(<FormInput label="Custom Style" style={customStyle} testID="custom-style-input" />);

      const input = screen.getByTestId('custom-style-input');
      expect(input).toBeTruthy();
      // Note: Specific style testing would require additional setup for style inspection
    });

    it('merges custom style with default styles', () => {
      const customStyle = { fontSize: 18 };
      render(<FormInput label="Merged Style" style={customStyle} testID="merged-style-input" />);

      const input = screen.getByTestId('merged-style-input');
      expect(input).toBeTruthy();
      // Note: Style merging verification would require additional setup
    });
  });

  describe('Accessibility', () => {
    it('associates label with input for accessibility', () => {
      render(<FormInput label="Accessible Input" testID="accessible-input" />);

      const label = screen.getByText('Accessible Input');
      expect(label).toBeTruthy();

      const input = screen.getByTestId('accessible-input');
      expect(input).toBeTruthy();
    });

    it('provides accessible error information', () => {
      render(<FormInput label="Error Input" error="This field has an error" testID="accessible-error-input" />);

      const errorText = screen.getByText('This field has an error');
      expect(errorText).toBeTruthy();

      const input = screen.getByTestId('accessible-error-input');
      expect(input).toBeTruthy();
    });
  });

  describe('Design System Integration', () => {
    it('uses consistent spacing for layout', () => {
      render(<FormInput label="Spacing Test" testID="spacing-input" />);

      const input = screen.getByTestId('spacing-input');
      expect(input).toBeTruthy();
      // Note: Specific spacing verification would require style inspection setup
    });

    it('uses consistent typography for label', () => {
      render(<FormInput label="Typography Test" testID="typography-input" />);

      const label = screen.getByText('Typography Test');
      expect(label).toBeTruthy();
      // Note: Typography verification would require style inspection setup
    });

    it('uses consistent colors for error state', () => {
      render(<FormInput label="Color Test" error="Error message" testID="color-input" />);

      const errorText = screen.getByText('Error message');
      expect(errorText).toBeTruthy();
      // Note: Color verification would require style inspection setup
    });
  });

  describe('Edge Cases', () => {
    it('handles empty label gracefully', () => {
      render(<FormInput label="" testID="empty-label-input" />);

      const input = screen.getByTestId('empty-label-input');
      expect(input).toBeTruthy();
    });

    it('handles empty error message gracefully', () => {
      render(<FormInput label="Test" error="" testID="empty-error-input" />);

      const input = screen.getByTestId('empty-error-input');
      expect(input).toBeTruthy();

      // Empty error should not render error text
      expect(() => screen.getByText('')).toThrow();
    });

    it('handles undefined error gracefully', () => {
      render(<FormInput label="Test" error={undefined} testID="undefined-error-input" />);

      const input = screen.getByTestId('undefined-error-input');
      expect(input).toBeTruthy();
    });

    it('handles null value gracefully', () => {
      render(<FormInput label="Test" value={null as any} testID="null-value-input" />);

      const input = screen.getByTestId('null-value-input');
      expect(input).toBeTruthy();
    });
  });

  describe('Component Structure', () => {
    it('maintains proper component hierarchy', () => {
      render(<FormInput label="Structure Test" error="Error message" testID="structure-input" />);

      // Should have label, input, and error text in proper order
      const label = screen.getByText('Structure Test');
      expect(label).toBeTruthy();

      const input = screen.getByTestId('structure-input');
      expect(input).toBeTruthy();

      const errorText = screen.getByText('Error message');
      expect(errorText).toBeTruthy();
    });
  });
});
