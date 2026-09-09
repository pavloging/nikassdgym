import { describe, it, expect } from 'vitest';
import { store } from './store';
import { fetchLogout } from './redusers/user/ActionLogout';

describe('store', () => {
    it('собран из одной ветки user', () => {
        expect(Object.keys(store.getState())).toEqual(['user']);
    });

    it('стартует с состоянием гостя', () => {
        expect(store.getState().user.isAuth).toBe(false);
        expect(store.getState().user.isLoading).toBe(false);
    });

    it('принимает экшены и обновляет состояние', () => {
        store.dispatch({ type: fetchLogout.pending.type });
        expect(store.getState().user.isLoading).toBe(true);
        store.dispatch({ type: fetchLogout.fulfilled.type });
        expect(store.getState().user.isLoading).toBe(false);
    });
});
