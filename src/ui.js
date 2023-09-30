import { defineStore } from "pinia";

export const useUIStore = defineStore('ui', {
    state: () => ({
        appearance: 'light',
        dashboardHeight: 60,
        desktop: false,
    }),
    actions: {
        setDashboardHeight(height) {
            if (!height && this.desktop) {
                return 0;
            }
            this.dashboardHeight = height;
        },
        setDesktop() {
            this.desktop = true;
        }
    }
});