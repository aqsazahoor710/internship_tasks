let mainInterval;

// --- 1. AUTH LOGIC (FIXED) ---
function toggleAuth(type) {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const loginTab = document.getElementById('login-tab');
    const signupTab = document.getElementById('signup-tab');

    if (type === 'login') {
        loginForm.classList.add('active');
        signupForm.classList.remove('active');
        loginTab.classList.add('active');
        signupTab.classList.remove('active');
    } else {
        signupForm.classList.add('active');
        loginForm.classList.remove('active');
        signupTab.classList.add('active');
        loginTab.classList.add('active');
    }
}

function completeAuth() {
    const overlay = document.getElementById('auth-overlay');
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        overlay.style.display = 'none';
        // Initialize the first view immediately after auth
        initHomeCharts();
    }, 500);
}

// --- 2. NAVIGATION (FIXED) ---
function switchTab(tabId) {
    // UI Updates
    document.querySelectorAll('.view').forEach(v => {
        v.classList.remove('active');
        v.style.display = 'none'; // Ensure previous views are fully hidden
    });
    document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
    
    const targetView = document.getElementById('view-' + tabId);
    if(targetView) {
        targetView.style.display = 'block';
        // Small timeout to allow display:block to register before adding active class for CSS transitions
        setTimeout(() => targetView.classList.add('active'), 10);
    }
    
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
    
    if(mainInterval) clearInterval(mainInterval);

    // Load tab-specific charts with a small delay for visibility
    setTimeout(() => {
        if(tabId === 'home') initHomeCharts();
        if(tabId === 'dashboard') initDashboard();
        if(tabId === 'analytics') initAnalytics();
        if(tabId === 'campaigns') initCampaigns();
        if(tabId === 'transactions') initTransactions();
    }, 50);
    
    lucide.createIcons();
}

// --- 3. CHART CLEANUP UTILITY ---
function clearChart(id) { 
    const canvas = document.getElementById(id);
    if (canvas) {
        const instance = Chart.getChart(canvas); 
        if (instance) instance.destroy(); 
    }
}

// --- 4. SECTION INITIALIZERS (ALL GRAPHS FIXED) ---

function initHomeCharts() {
    const charts = ['homePulseChart', 'nodeGeoChart', 'whaleTrackerChart', 'mempoolRadarChart', 
                    'securityStrengthChart', 'latencyChart', 'flowChart', 'saturationChart'];
    charts.forEach(clearChart);

    // Live Pulse
    const ctxPulse = document.getElementById('homePulseChart');
    if(ctxPulse) {
        const pulseChart = new Chart(ctxPulse, {
            type: 'line',
            data: {
                labels: Array.from({length: 30}, (_, i) => i),
                datasets: [{
                    data: Array.from({length: 30}, () => Math.floor(Math.random() * (680 - 620) + 620)),
                    borderColor: '#f7931a', borderWidth: 2, fill: true,
                    backgroundColor: 'rgba(247,147,26,0.05)', tension: 0.4, pointRadius: 0
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { suggestedMin: 600, suggestedMax: 700 } } }
        });

        mainInterval = setInterval(() => {
            pulseChart.data.datasets[0].data.shift();
            pulseChart.data.datasets[0].data.push(Math.floor(Math.random() * (680 - 620) + 620));
            pulseChart.update('none');
            updateMetrics();
        }, 2000);
    }

    // Node Geo
    const ctxGeo = document.getElementById('nodeGeoChart');
    if(ctxGeo) {
        new Chart(ctxGeo, {
            type: 'doughnut',
            data: { labels: ['US', 'EU', 'Asia', 'Other'], datasets: [{ data: [40, 30, 20, 10], backgroundColor: ['#f7931a', '#444', '#222', '#888'], borderWidth: 0 }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { color: '#888', font: { size: 10 } } } } }
        });
    }

    // Whale Tracker
    const ctxWhale = document.getElementById('whaleTrackerChart');
    if(ctxWhale) {
        new Chart(ctxWhale, {
            type: 'bar',
            data: { labels: ['1H', '2H', '3H', '4H', '5H'], datasets: [{ data: [12, 19, 3, 5, 2], backgroundColor: '#f7931a' }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
        });
    }

    // Mempool Radar
    const ctxRadar = document.getElementById('mempoolRadarChart');
    if(ctxRadar) {
        new Chart(ctxRadar, {
            type: 'radar',
            data: { labels: ['Speed', 'Size', 'Weight', 'Fees', 'Nodes'], datasets: [{ data: [80, 50, 70, 40, 90], borderColor: '#f7931a', backgroundColor: 'rgba(247,147,26,0.2)' }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { r: { grid: { color: '#333' }, pointLabels: { color: '#888' }, ticks: { display: false } } } }
        });
    }

    // Hash Strength
    const ctxSec = document.getElementById('securityStrengthChart');
    if(ctxSec) {
        new Chart(ctxSec, { type: 'doughnut', data: { datasets: [{ data: [98, 2], backgroundColor: ['#22c55e', '#111'], borderWidth: 0 }] }, options: { cutout: '80%', responsive: true, maintainAspectRatio: false } });
    }

    // Flow Chart
    const ctxFlow = document.getElementById('flowChart');
    if(ctxFlow) {
        new Chart(ctxFlow, { type: 'bar', data: { labels: ['Buy','Sell'], datasets: [{ data: [65, 35], backgroundColor: ['#22c55e', '#ef4444'] }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } } });
    }

    // Latency
    const ctxLat = document.getElementById('latencyChart');
    if(ctxLat) {
        new Chart(ctxLat, { type: 'line', data: { labels: ['NY','LDN','TOK','SGP','MUM'], datasets: [{ data: [20, 45, 120, 80, 150], borderColor: '#888', tension: 0.4 }] }, options: { responsive: true, maintainAspectRatio: false } });
    }

    // Saturation
    const ctxSat = document.getElementById('saturationChart');
    if(ctxSat) {
        new Chart(ctxSat, { type: 'doughnut', data: { datasets: [{ data: [85, 15], backgroundColor: ['#f7931a','#111'] }] }, options: { cutout:'80%', responsive: true, maintainAspectRatio: false } });
    }
}

function initDashboard() {
    clearChart('dashChart');
    const ctx = document.getElementById('dashChart');
    if(ctx) {
        new Chart(ctx, { type: 'line', data: { labels: ['1','2','3','4','5'], datasets: [{ data: [93800, 94100, 93900, 94400, 94120], borderColor: '#22c55e', fill: true, backgroundColor: 'rgba(34,197,94,0.1)', tension: 0.4 }] }, options: { responsive: true, maintainAspectRatio: false } });
    }
}

function initAnalytics() {
    ['campaignReachChart', 'userGrowthChart', 'sourceChart'].forEach(clearChart);
    const ctxReach = document.getElementById('campaignReachChart');
    if(ctxReach) {
        new Chart(ctxReach, { type: 'line', data: { labels: ['M','T','W','T','F','S','S'], datasets: [{ label: 'Reach', data: [65, 80, 81, 56, 85, 95, 120], borderColor: '#f7931a' }] }, options: { responsive: true, maintainAspectRatio: false } });
    }
    const ctxGrowth = document.getElementById('userGrowthChart');
    if(ctxGrowth) {
        new Chart(ctxGrowth, { type: 'bar', data: { labels: ['W1','W2','W3'], datasets: [{ data: [400, 900, 1100], backgroundColor: '#f7931a' }] }, options: { responsive: true, maintainAspectRatio: false } });
    }
    const ctxSource = document.getElementById('sourceChart');
    if(ctxSource) {
        new Chart(ctxSource, { type: 'polarArea', data: { labels: ['NA','EU','AS'], datasets: [{ data: [45, 25, 30], backgroundColor: ['#f7931a','#444','#222'] }] }, options: { responsive: true, maintainAspectRatio: false } });
    }
}

function initCampaigns() {
    ['campaignBubbleChart', 'campaignRadarChart'].forEach(clearChart);
    const ctxB = document.getElementById('campaignBubbleChart');
    if(ctxB) {
        new Chart(ctxB, { type: 'bubble', data: { datasets: [{ data: [{x:20,y:30,r:15}, {x:35,y:15,r:10}], backgroundColor: '#f7931a' }] }, options: { responsive: true, maintainAspectRatio: false } });
    }
    const ctxR = document.getElementById('campaignRadarChart');
    if(ctxR) {
        new Chart(ctxR, { type: 'radar', data: { labels: ['CTR','ROI','Reach','Conv','Time'], datasets: [{ data: [80,90,70,60,85], borderColor: '#f7931a' }] }, options: { responsive: true, maintainAspectRatio: false } });
    }
    if(document.getElementById('drag-list')) new Sortable(document.getElementById('drag-list'), { animation: 150 });
}

function initTransactions() {
    ['txStatusChart', 'txAssetChart', 'txFeeChart'].forEach(clearChart);
    const ctxS = document.getElementById('txStatusChart');
    if(ctxS) {
        new Chart(ctxS, { type: 'doughnut', data: { datasets: [{ data: [75, 25], backgroundColor: ['#f7931a','#1e1e1e'] }] }, options: { cutout: '80%', responsive: true, maintainAspectRatio: false } });
    }
    const ctxF = document.getElementById('txFeeChart');
    if(ctxF) {
        new Chart(ctxF, { type: 'line', data: { labels: ['1','2','3'], datasets: [{ data: [35, 55, 48], borderColor: '#f7931a' }] }, options: { responsive: true, maintainAspectRatio: false } });
    }
    const ctxA = document.getElementById('txAssetChart');
    if(ctxA) {
        new Chart(ctxA, { type: 'bar', data: { labels: ['Whale','Retail'], datasets: [{ data: [80, 20], backgroundColor: '#f7931a' }] }, options: { responsive: true, maintainAspectRatio: false } });
    }
}

// --- 5. UTILS & SYSTEM ---
function updateMetrics() {
    if(document.getElementById('live-hash')) document.getElementById('live-hash').innerText = (640 + Math.random() * 10).toFixed(1) + " EH/s";
    if(document.getElementById('live-fee')) document.getElementById('live-fee').innerText = Math.floor(12 + Math.random() * 10) + " sats/vB";
    if(document.getElementById('live-clock')) document.getElementById('live-clock').innerText = new Date().toLocaleTimeString();
    addLog();
}

function addLog() {
    const logs = document.getElementById('system-logs');
    if(!logs) return;
    const msgs = ["[NET] Block inbound...", "[SEC] Shield active", "[PEER] New node linked"];
    const div = document.createElement('div');
    div.innerText = `> ${msgs[Math.floor(Math.random() * msgs.length)]}`;
    logs.prepend(div);
    if(logs.children.length > 5) logs.lastElementChild.remove();
}

function updateTheme(t) { 
    document.documentElement.setAttribute('data-theme', t); 
}

function saveSettings() { alert('Settings Saved'); }

// --- 6. INITIAL LOAD ---
window.onload = () => { 
    lucide.createIcons(); 
};