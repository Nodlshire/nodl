// Wnode Browser Node - Capability Detection

const Capabilities = {
    getReport: async function() {
        const report = {
            cores: navigator.hardwareConcurrency || 1,
            memoryEstimateMB: (navigator.deviceMemory || 1) * 1024,
            userAgent: navigator.userAgent,
            battery: null
        };

        // Attempt to read battery status if supported
        if ('getBattery' in navigator) {
            try {
                const battery = await navigator.getBattery();
                report.battery = {
                    level: battery.level,
                    charging: battery.charging
                };
            } catch (e) {
                console.warn("Battery API error", e);
            }
        }

        return report;
    },

    display: async function() {
        const caps = await this.getReport();
        const displayEl = document.getElementById('capsDisplay');
        if (displayEl) {
            displayEl.textContent = JSON.stringify(caps, null, 2);
        }
    }
};

// Initialize display on load
document.addEventListener('DOMContentLoaded', () => {
    Capabilities.display();
});
