/**
 * Example Test - Button Component
 * 
 * Demonstrates testing patterns for FixPix components.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../components/ui/Button';


describe('Button Component', () => {
    it('renders with children text', () => {
        render(<Button>Click Me</Button>);
        expect(screen.getByRole('button')).toHaveTextContent('Click Me');
    });

    it('calls onClick when clicked', () => {
        const handleClick = vi.fn();
        render(<Button onClick={handleClick}>Click Me</Button>);

        fireEvent.click(screen.getByRole('button'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('applies primary variant styles', () => {
        render(<Button variant="primary">Primary</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('bg-primary');
    });

    it('is disabled when disabled prop is true', () => {
        render(<Button disabled>Disabled</Button>);
        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('renders icon when provided', () => {
        const TestIcon = () => <span data-testid="test-icon">Icon</span>;
        render(<Button icon={TestIcon}>With Icon</Button>);
        expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });
});
