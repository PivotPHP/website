// Benchmark Charts - PivotPHP Performance Visualization

document.addEventListener('DOMContentLoaded', function() {
    // Function to get current theme colors
    function getThemeColors() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        return {
            primary: '#7C3AED',
            secondary: '#EC4899',
            accent: '#06B6D4',
            dark: '#0F172A',
            gray: '#64748B',
            light: '#F8FAFC',
            text: isDark ? '#E2E8F0' : '#1E293B',
            gridColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            tickColor: isDark ? '#CBD5E1' : '#475569'
        };
    }
    
    // Update charts when theme changes
    window.addEventListener('theme-changed', function(e) {
        // Destroy and recreate all charts with new colors
        const charts = Chart.instances;
        Object.values(charts).forEach(chart => {
            chart.destroy();
        });
        initCharts();
    });
    
    // Chart.js default configuration
    Chart.defaults.font.family = getComputedStyle(document.documentElement).getPropertyValue('--font-display');
    
    function initCharts() {
        const colors = getThemeColors();
    
    // Request Type Performance Chart - Updated with Docker v1.2.0 data
    const requestTypeCtx = document.getElementById('requestTypeChart');
    if (requestTypeCtx) {
        new Chart(requestTypeCtx, {
            type: 'bar',
            data: {
                labels: ['Request Parsing', 'Response Creation', 'Status Codes', 'Content Negotiation'],
                datasets: [{
                    label: 'Operations per Second',
                    data: [317847, 294110, 692472, 548849],
                    backgroundColor: [
                        colors.accent,
                        colors.primary,
                        colors.secondary,
                        colors.primary
                    ],
                    borderWidth: 0,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.parsed.y.toLocaleString() + ' req/s';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: colors.tickColor,
                            callback: function(value) {
                                return value.toLocaleString();
                            }
                        },
                        grid: {
                            color: colors.gridColor
                        }
                    },
                    x: {
                        ticks: {
                            color: colors.tickColor
                        },
                        grid: {
                            color: colors.gridColor
                        }
                    }
                }
            }
        });
    }
    
    // PivotPHP v1.1.4 Performance Chart - Updated with Phase 3 results
    const v114PerformanceCtx = document.getElementById('v114-performance-chart');
    if (v114PerformanceCtx) {
        new Chart(v114PerformanceCtx, {
            type: 'bar',
            data: {
                labels: ['Application Creation', 'Array Callable', 'Route Registration', 'JSON Response', 'Multiple Routes'],
                datasets: [
                    {
                        label: 'PivotPHP v1.1.4 Performance (ops/sec)',
                        data: [84998, 28624, 20742, 13885, 4868],
                        backgroundColor: [
                            colors.primary,
                            colors.secondary,
                            colors.accent,
                            '#22c55e',
                            '#f59e0b'
                        ],
                        borderWidth: 2,
                        borderRadius: 8
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: colors.text,
                            padding: 20,
                            usePointStyle: true,
                            font: {
                                size: 14,
                                weight: 500
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const value = context.parsed.y;
                                let description = '';
                                const labels = ['Application Creation', 'Array Callable', 'Route Registration', 'JSON Response', 'Multiple Routes'];
                                const label = labels[context.dataIndex];
                                
                                switch(label) {
                                    case 'Application Creation': description = ' (🚀 Revolutionary)'; break;
                                    case 'Array Callable': description = ' (🔥 Outstanding - PHP 8.4+)'; break;
                                    case 'Route Registration': description = ' (⚡ Exceptional)'; break;
                                    case 'JSON Response': description = ' (💫 Excellent)'; break;
                                    case 'Multiple Routes': description = ' (✨ Solid)'; break;
                                }
                                
                                return label + ': ' + value.toLocaleString() + ' ops/s' + description;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'PivotPHP v1.1.4 Operations (Phase 3 Analysis)',
                            color: colors.text,
                            font: { size: 14, weight: 600 }
                        },
                        ticks: {
                            color: colors.tickColor,
                            font: { size: 12 }
                        },
                        grid: {
                            color: colors.gridColor,
                            drawBorder: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Operations per Second (v1.1.4)',
                            color: colors.text,
                            font: { size: 14, weight: 600 }
                        },
                        ticks: {
                            color: colors.tickColor,
                            font: { size: 12 },
                            callback: function(value) {
                                return value.toLocaleString();
                            }
                        },
                        grid: {
                            color: colors.gridColor,
                            drawBorder: false
                        }
                    }
                }
            }
        });
    }

    // Docker Cross-Framework Performance Chart - Updated with July 2025 Docker validation
    const variantCtx = document.getElementById('variantCtx');
    if (variantCtx) {
        new Chart(variantCtx, {
            type: 'bar',
            data: {
                labels: ['PivotPHP ReactPHP', 'Slim 4', 'Lumen', 'PivotPHP Core', 'Flight'],
                datasets: [
                    {
                        label: 'Cross-Framework Performance (req/sec)',
                        data: [19707, 6881, 6322, 6227, 3179],
                        backgroundColor: [
                            '#7C3AED', // Purple for PivotPHP ReactPHP (winner)
                            '#22c55e', // Green for Slim 4
                            '#3b82f6', // Blue for Lumen
                            '#EC4899', // Pink for PivotPHP Core
                            '#ef4444'  // Red for Flight
                        ],
                        borderWidth: 2,
                        borderRadius: 8
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: colors.text,
                            padding: 20,
                            usePointStyle: true,
                            font: {
                                size: 14,
                                weight: 500
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: colors.text === '#E2E8F0' ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                        titleColor: colors.text === '#E2E8F0' ? '#E2E8F0' : '#1E293B',
                        bodyColor: colors.text === '#E2E8F0' ? '#CBD5E1' : '#475569',
                        borderColor: colors.primary,
                        borderWidth: 1,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                const value = context.parsed.y;
                                let ranking = '';
                                const labels = ['PivotPHP ReactPHP', 'Slim 4', 'Lumen', 'PivotPHP Core', 'Flight'];
                                const label = labels[context.dataIndex];
                                
                                switch(label) {
                                    case 'PivotPHP ReactPHP': ranking = ' (🚀 1st place - LEADER)'; break;
                                    case 'Slim 4': ranking = ' (🥈 2nd place)'; break;
                                    case 'Lumen': ranking = ' (🥉 3rd place)'; break;
                                    case 'PivotPHP Core': ranking = ' (4th place)'; break;
                                    case 'Flight': ranking = ' (5th place)'; break;
                                }
                                
                                return label + ': ' + value.toLocaleString() + ' req/s' + ranking;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Cross-Framework Performance + ReactPHP (July 2025)',
                            color: colors.text,
                            font: {
                                size: 14,
                                weight: 600
                            }
                        },
                        ticks: {
                            color: colors.tickColor,
                            font: {
                                size: 12
                            }
                        },
                        grid: {
                            color: colors.gridColor,
                            drawBorder: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Requests per Second (Docker + ReactPHP)',
                            color: colors.text,
                            font: {
                                size: 14,
                                weight: 600
                            }
                        },
                        ticks: {
                            color: colors.tickColor,
                            font: {
                                size: 12
                            },
                            callback: function(value) {
                                return value.toLocaleString();
                            }
                        },
                        grid: {
                            color: colors.gridColor,
                            drawBorder: false
                        }
                    }
                }
            }
        });
    }
    
    // PivotPHP Ecosystem Specialized Performance Chart
    const ecosystemCtx = document.getElementById('ecosystemChart');
    if (ecosystemCtx) {
        new Chart(ecosystemCtx, {
            type: 'doughnut',
            data: {
                labels: ['ReactPHP (Async)', 'Core (API)', 'ORM (Database)'],
                datasets: [{
                    label: 'Specialized Performance (K ops/s)',
                    data: [1970.7, 2186.0, 457.9],
                    backgroundColor: [
                        colors.accent,
                        colors.primary,
                        colors.secondary
                    ],
                    borderWidth: 3,
                    borderColor: '#ffffff',
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: colors.text,
                            padding: 20,
                            usePointStyle: true,
                            font: {
                                size: 14,
                                weight: 500
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const value = context.parsed;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return context.label + ': ' + value.toLocaleString() + 'K ops/s (' + percentage + '%)';
                            }
                        }
                    }
                },
                elements: {
                    arc: {
                        borderWidth: 3
                    }
                }
            }
        });
    }
    
    // Concurrency Performance Chart - Updated with concurrent test data
    const concurrencyCtx = document.getElementById('concurrencyChart');
    if (concurrencyCtx) {
        new Chart(concurrencyCtx, {
            type: 'line',
            data: {
                labels: ['1', '10', '50', '100'],
                datasets: [
                    {
                        label: 'Simple API',
                        data: [3931, 3325, 3033, 3991],
                        borderColor: colors.primary,
                        backgroundColor: 'rgba(124, 58, 237, 0.1)',
                        tension: 0.3
                    },
                    {
                        label: 'Data API',
                        data: [1229, 129, 1163, 1057],
                        borderColor: colors.secondary,
                        backgroundColor: 'rgba(236, 72, 153, 0.1)',
                        tension: 0.3
                    },
                    {
                        label: 'Heavy Processing',
                        data: [2647, 0, 1447, 1508],
                        borderColor: colors.accent,
                        backgroundColor: 'rgba(6, 182, 212, 0.1)',
                        tension: 0.3
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.parsed.y.toLocaleString() + ' req/s';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Concurrent Connections'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Requests per Second'
                        },
                        ticks: {
                            callback: function(value) {
                                return value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Latency Distribution Chart - Updated with stress test data
    const latencyCtx = document.getElementById('latencyChart');
    if (latencyCtx) {
        new Chart(latencyCtx, {
            type: 'radar',
            data: {
                labels: ['Average', 'P50', 'P95', 'P99'],
                datasets: [
                    {
                        label: 'Simple (10K requests)',
                        data: [0.07, 0.07, 0.11, 0.15],
                        borderColor: colors.accent,
                        backgroundColor: 'rgba(6, 182, 212, 0.2)'
                    },
                    {
                        label: 'JSON (10K requests)',
                        data: [0.48, 0.45, 0.73, 0.85],
                        borderColor: colors.primary,
                        backgroundColor: 'rgba(124, 58, 237, 0.2)'
                    },
                    {
                        label: 'Complex (10K requests)',
                        data: [0.44, 0.42, 0.89, 1.05],
                        borderColor: colors.secondary,
                        backgroundColor: 'rgba(236, 72, 153, 0.2)'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.parsed.r + 'ms';
                            }
                        }
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value + 'ms';
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Framework Comparison Chart - Updated with actual stress test results
    const comparisonCtx = document.getElementById('comparisonChart');
    if (comparisonCtx) {
        new Chart(comparisonCtx, {
            type: 'bar',
            data: {
                labels: ['HTTP Performance', 'REST API', 'API Middleware'],
                datasets: [
                    {
                        label: 'PivotPHP Core v1.2.0',
                        data: [605.3, 1120.4, 460.3],
                        backgroundColor: colors.primary
                    },
                    {
                        label: 'Slim 4',
                        data: [736.6, 1299.9, 460.7],
                        backgroundColor: colors.secondary
                    },
                    {
                        label: 'PivotPHP ReactPHP',
                        data: [null, null, 1970.7],
                        backgroundColor: colors.accent
                    }
                ]
            },
            options: {
                indexAxis: 'y', // Make it horizontal
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: colors.text
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const value = context.parsed.y || context.parsed.x;
                                let gap = '';
                                if (context.datasetIndex === 0 && context.dataset.label.includes('PivotPHP Core')) {
                                    const slimData = context.chart.data.datasets.find(d => d.label === 'Slim 4');
                                    if (slimData && slimData.data[context.dataIndex]) {
                                        const slimValue = slimData.data[context.dataIndex];
                                        const gapPercent = ((slimValue - value) / slimValue * 100).toFixed(1);
                                        gap = ` (${gapPercent}% gap)`;
                                    }
                                }
                                return context.dataset.label + ': ' + value.toLocaleString() + 'K ops/s' + gap;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: {
                            color: colors.tickColor,
                            callback: function(value) {
                                return value.toLocaleString();
                            }
                        },
                        grid: {
                            color: colors.gridColor
                        }
                    },
                    y: {
                        ticks: {
                            color: colors.tickColor
                        },
                        grid: {
                            color: colors.gridColor
                        }
                    }
                }
            }
        });
    }
    
    // New: Stress Test Chart
    const stressTestCtx = document.getElementById('stress-test-chart');
    if (stressTestCtx) {
        new Chart(stressTestCtx, {
            type: 'bar',
            data: {
                labels: ['100 requests', '1,000 requests', '10,000 requests'],
                datasets: [
                    {
                        label: 'PivotPHP Core',
                        data: [9059, 5661, 13374],
                        backgroundColor: colors.primary
                    },
                    {
                        label: 'PivotPHP ORM',
                        data: [9059, 5661, 8893],
                        backgroundColor: colors.secondary
                    },
                    {
                        label: 'Slim 4',
                        data: [2641, 4782, 4562],
                        backgroundColor: colors.accent
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.parsed.y.toLocaleString() + ' req/s';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Requests per Second'
                        },
                        ticks: {
                            callback: function(value) {
                                return value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Concurrent Performance Chart - Area Chart for better visualization
    const concurrencyPerfCtx = document.getElementById('concurrency-performance-chart');
    if (concurrencyPerfCtx) {
        new Chart(concurrencyPerfCtx, {
            type: 'line',
            data: {
                labels: ['1 Connection', '10 Connections', '50 Connections', '100 Connections'],
                datasets: [
                    {
                        label: 'Simple API',
                        data: [3931, 3325, 3033, 3991],
                        borderColor: colors.primary,
                        backgroundColor: 'rgba(124, 58, 237, 0.3)',
                        fill: true,
                        tension: 0.4,
                        borderWidth: 3,
                        pointBackgroundColor: colors.primary,
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 6,
                        pointHoverRadius: 8
                    },
                    {
                        label: 'Data API',
                        data: [1229, 129, 1163, 1057],
                        borderColor: colors.secondary,
                        backgroundColor: 'rgba(236, 72, 153, 0.3)',
                        fill: true,
                        tension: 0.4,
                        borderWidth: 3,
                        pointBackgroundColor: colors.secondary,
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 6,
                        pointHoverRadius: 8
                    },
                    {
                        label: 'Heavy Processing',
                        data: [2647, null, 1447, 1508], // null for missing data point
                        borderColor: colors.accent,
                        backgroundColor: 'rgba(6, 182, 212, 0.3)',
                        fill: true,
                        tension: 0.4,
                        borderWidth: 3,
                        pointBackgroundColor: colors.accent,
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 6,
                        pointHoverRadius: 8,
                        spanGaps: true // Connect across null values
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: colors.text,
                            font: {
                                size: 14,
                                weight: 500
                            },
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        backgroundColor: colors.text === '#E2E8F0' ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                        titleColor: colors.text === '#E2E8F0' ? '#E2E8F0' : '#1E293B',
                        bodyColor: colors.text === '#E2E8F0' ? '#CBD5E1' : '#475569',
                        borderColor: colors.primary,
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: true,
                        callbacks: {
                            label: function(context) {
                                const value = context.parsed.y;
                                return value ? context.dataset.label + ': ' + value.toLocaleString() + ' req/s' : context.dataset.label + ': No data';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Concurrent Load Levels',
                            color: colors.text,
                            font: {
                                size: 14,
                                weight: 600
                            }
                        },
                        ticks: {
                            color: colors.tickColor,
                            font: {
                                size: 12
                            }
                        },
                        grid: {
                            color: colors.gridColor,
                            drawBorder: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Performance (req/s)',
                            color: colors.text,
                            font: {
                                size: 14,
                                weight: 600
                            }
                        },
                        ticks: {
                            color: colors.tickColor,
                            font: {
                                size: 12
                            },
                            callback: function(value) {
                                return value.toLocaleString();
                            }
                        },
                        grid: {
                            color: colors.gridColor,
                            drawBorder: false
                        }
                    }
                },
                elements: {
                    point: {
                        hoverBackgroundColor: '#ffffff',
                        hoverBorderWidth: 3
                    }
                }
            }
        });
    }
    
    // New: Concurrent Performance Radar Chart
    const concurrentRadarCtx = document.getElementById('comparison-radar-chart');
    if (concurrentRadarCtx) {
        new Chart(concurrentRadarCtx, {
            type: 'radar',
            data: {
                labels: ['Throughput', 'Low Latency', 'Scalability', 'Memory Efficiency', 'Stability'],
                datasets: [
                    {
                        label: 'PivotPHP Core',
                        data: [95, 98, 90, 95, 100],
                        borderColor: colors.primary,
                        backgroundColor: 'rgba(124, 58, 237, 0.2)'
                    },
                    {
                        label: 'Slim 4',
                        data: [70, 85, 75, 80, 90],
                        borderColor: colors.secondary,
                        backgroundColor: 'rgba(236, 72, 153, 0.2)'
                    },
                    {
                        label: 'Lumen',
                        data: [60, 70, 65, 60, 75],
                        borderColor: colors.accent,
                        backgroundColor: 'rgba(6, 182, 212, 0.2)'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Animate stat cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe stat cards
    document.querySelectorAll('.stat-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
    
    // Observe component cards
    document.querySelectorAll('.component-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
    }
    
    // Initialize charts when DOM is loaded
    initCharts();
});