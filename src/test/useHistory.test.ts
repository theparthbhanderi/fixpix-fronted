/**
 * useHistory Hook Tests
 */

import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useHistory from '../hooks/useHistory';

describe('useHistory Hook', () => {
    it('initializes with initial state', () => {
        const { result } = renderHook(() => useHistory({ count: 0 }));
        const [state] = result.current;
        expect(state).toEqual({ count: 0 });
    });

    it('updates state correctly', () => {
        const { result } = renderHook(() => useHistory(0));

        act(() => {
            const setState = result.current[1];
            setState(5);
        });

        const [state] = result.current;
        expect(state).toBe(5);
    });

    it('can undo state changes', () => {
        const { result } = renderHook(() => useHistory('initial'));

        // Set new state
        act(() => {
            const setState = result.current[1];
            setState('changed');
        });
        expect(result.current[0]).toBe('changed');

        // Undo
        act(() => {
            const undo = result.current[2];
            undo();
        });
        expect(result.current[0]).toBe('initial');
    });

    it('can redo state changes', () => {
        const { result } = renderHook(() => useHistory('initial'));

        // Set new state
        act(() => {
            result.current[1]('changed');
        });

        // Undo
        act(() => {
            result.current[2]();
        });
        expect(result.current[0]).toBe('initial');

        // Redo
        act(() => {
            result.current[3]();
        });
        expect(result.current[0]).toBe('changed');
    });

    it('reports canUndo correctly', () => {
        const { result } = renderHook(() => useHistory(0));

        // Initially can't undo
        expect(result.current[4]).toBe(false);

        // After change, can undo
        act(() => {
            result.current[1](1);
        });
        expect(result.current[4]).toBe(true);
    });

    it('reports canRedo correctly', () => {
        const { result } = renderHook(() => useHistory(0));

        // Initially can't redo
        expect(result.current[5]).toBe(false);

        // Set and undo
        act(() => {
            result.current[1](1);
        });
        act(() => {
            result.current[2]();
        });

        // Now can redo
        expect(result.current[5]).toBe(true);
    });

    it('can jump to specific history index', () => {
        const { result } = renderHook(() => useHistory('a'));

        // Add history entries
        act(() => { result.current[1]('b'); });
        act(() => { result.current[1]('c'); });
        act(() => { result.current[1]('d'); });

        // Jump back to index 1 ('b')
        act(() => {
            const jumpTo = result.current[7];
            jumpTo(1);
        });

        expect(result.current[0]).toBe('b');
        expect(result.current[8]).toBe(1); // current index
    });
});
