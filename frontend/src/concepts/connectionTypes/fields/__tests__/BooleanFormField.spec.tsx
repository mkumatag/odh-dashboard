import * as React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { BooleanField } from '~/concepts/connectionTypes/types';
import BooleanFormField from '~/concepts/connectionTypes/fields/BooleanFormField';

describe('BooleanFormField', () => {
  it('should render editable field', () => {
    const onChange = jest.fn();
    const field: BooleanField = {
      type: 'boolean',
      name: 'test-name',
      envVar: 'test-envVar',
      properties: {
        label: 'test-label',
        defaultValue: false,
      },
    };

    render(<BooleanFormField field={field} value onChange={onChange} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
    expect(checkbox).not.toBeDisabled();
    expect(screen.getByLabelText('test-label')).toBe(checkbox);

    act(() => {
      checkbox.click();
    });
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it('should render preview field', () => {
    const onChange = jest.fn();
    const field: BooleanField = {
      type: 'boolean',
      name: 'test-name',
      envVar: 'test-envVar',
      properties: {
        label: 'test-label',
        defaultValue: true,
      },
    };

    render(<BooleanFormField field={field} value={false} onChange={onChange} isPreview />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
    expect(checkbox).not.toBeDisabled();
    expect(screen.getByLabelText('test-label')).toBe(checkbox);

    act(() => {
      checkbox.click();
    });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('should render default value read only field', () => {
    const onChange = jest.fn();
    const field: BooleanField = {
      type: 'boolean',
      name: 'test-name',
      envVar: 'test-envVar',
      properties: {
        label: 'test-label',
        defaultValue: true,
        defaultReadOnly: true,
      },
    };

    render(<BooleanFormField field={field} value={false} onChange={onChange} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
    expect(checkbox).toBeDisabled();
    expect(screen.getByLabelText('test-label')).toBe(checkbox);

    act(() => {
      checkbox.click();
    });
    expect(onChange).not.toHaveBeenCalled();
  });
});
