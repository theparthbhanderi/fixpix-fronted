import { useState, useCallback } from 'react';

const useHistory = (initialState) => {
    const [index, setIndex] = useState(0);
    const [history, setHistory] = useState([initialState]);

    const setState = useCallback((newState) => {
        setHistory((prev) => {
            const newHistory = prev.slice(0, index + 1);
            newHistory.push(newState);
            return newHistory;
        });
        setIndex((prev) => prev + 1);
    }, [index]);

    const undo = useCallback(() => {
        setIndex((prev) => (prev > 0 ? prev - 1 : prev));
    }, []);

    const redo = useCallback(() => {
        setIndex((prev) => (prev < history.length - 1 ? prev + 1 : prev));
    }, [history]);

    const jumpTo = useCallback((newIndex) => {
        if (newIndex >= 0 && newIndex < history.length) {
            setIndex(newIndex);
        }
    }, [history.length]);

    return [history[index], setState, undo, redo, index > 0, index < history.length - 1, history, jumpTo, index];
};

export default useHistory;
