document.addEventListener('DOMContentLoaded', () => {
    const calculateBtn = document.getElementById('calculate-btn');
    const ipAddressInput = document.getElementById('ip-address');
    const cidrInput = document.getElementById('cidr');
    const resultsDiv = document.getElementById('results');
    const darkModeToggle = document.getElementById('dark-mode-toggle');

    // --- Event Listeners ---
    calculateBtn.addEventListener('click', calculateSubnet);
    darkModeToggle.addEventListener('click', toggleDarkMode);

    // --- Main Calculation Function ---
    function calculateSubnet() {
        const ipAddress = ipAddressInput.value.trim();
        const cidr = parseInt(cidrInput.value, 10);

        if (!isValidIp(ipAddress) || isNaN(cidr) || cidr < 0 || cidr > 32) {
            resultsDiv.innerHTML = '<p class="text-red-400">Please enter a valid IP address and a CIDR suffix (0-32).</p>';
            return;
        }

        const ipParts = ipAddress.split('.').map(Number);
        const ipAsInt = (ipParts[0] << 24) | (ipParts[1] << 16) | (ipParts[2] << 8) | ipParts[3];

        const subnetMaskInt = (-1 << (32 - cidr)) >>> 0;
        const networkAddressInt = (ipAsInt & subnetMaskInt) >>> 0;
        const broadcastAddressInt = (networkAddressInt | ~subnetMaskInt) >>> 0;

        const networkAddress = intToIp(networkAddressInt);
        const broadcastAddress = intToIp(broadcastAddressInt);
        const subnetMask = intToIp(subnetMaskInt);
        const wildcardMask = intToIp(~subnetMaskInt >>> 0);

        const firstHostInt = networkAddressInt + 1;
        const lastHostInt = broadcastAddressInt - 1;
        const firstHost = intToIp(firstHostInt);
        const lastHost = intToIp(lastHostInt);

        const totalHosts = Math.pow(2, 32 - cidr);
        const usableHosts = totalHosts > 2 ? totalHosts - 2 : 0;

        displayResults({
            networkAddress,
            broadcastAddress,
            subnetMask,
            wildcardMask,
            firstHost: usableHosts > 0 ? firstHost : 'N/A',
            lastHost: usableHosts > 0 ? lastHost : 'N/A',
            totalHosts,
            usableHosts
        });
    }

    // --- Helper and Display Functions ---
    function isValidIp(ip) {
        const regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        return regex.test(ip);
    }

    function intToIp(int) {
        return `${(int >>> 24)}.${(int >> 16) & 255}.${(int >> 8) & 255}.${int & 255}`;
    }

    function displayResults(data) {
        resultsDiv.innerHTML = `
            <div class="grid grid-cols-2 gap-4 text-left">
                ${generateResultRow('Network Address:', data.networkAddress)}
                ${generateResultRow('Broadcast Address:', data.broadcastAddress)}
                ${generateResultRow('Subnet Mask:', data.subnetMask)}
                ${generateResultRow('Wildcard Mask:', data.wildcardMask)}
                ${generateResultRow('First Usable Host:', data.firstHost)}
                ${generateResultRow('Last Usable Host:', data.lastHost)}
                ${generateResultRow('Total Hosts:', data.totalHosts.toLocaleString())}
                ${generateResultRow('Usable Hosts:', data.usableHosts.toLocaleString())}
            </div>
        `;
    }

    function generateResultRow(label, value) {
        return `
            <div class="font-semibold text-gray-400">${label}</div>
            <div class="font-mono text-fuchsia-400">${value}</div>
        `;
    }

    function toggleDarkMode() {
        document.documentElement.classList.toggle('dark');
    }
});
