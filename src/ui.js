import { defineStore } from "pinia";

export const useUIStore = defineStore('ui', {
    state: () => ({
        appearance: 'light',
        dashboardHeight: 60
    }),
    actions: {
        setDashboardHeight(height) {
            this.dashboardHeight = height;
        }
    }
});