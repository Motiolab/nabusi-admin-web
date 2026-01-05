import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

const LOCAL_STORAGE_KEY = "selectedCenterId";

const getInitialState = (): number => {
    if (typeof window === 'undefined') return 0;
    const storedValue = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    return storedValue ? parseInt(storedValue, 10) : 0;
};

export const selectedCenterIdSlice = createSlice({
    name: 'selectedCenterId',
    initialState: getInitialState(),
    reducers: {
        setSelectedCenterId: (_state, action: PayloadAction<number>) => {
            const newState = action.payload;
            localStorage.setItem(LOCAL_STORAGE_KEY, newState.toString());
            return newState;
        }
    }
});

export const { setSelectedCenterId } = selectedCenterIdSlice.actions;
export default selectedCenterIdSlice.reducer;
export { LOCAL_STORAGE_KEY };
