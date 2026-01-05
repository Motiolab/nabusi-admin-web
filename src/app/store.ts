import { configureStore } from '@reduxjs/toolkit';
import selectedCenterIdReducer from '@/entities/selectedCenterId/model/reducer';

export const store = configureStore({
    reducer: {
        selectedCenterId: selectedCenterIdReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
