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
    
    // Request Type Performance Chart - Updated with latest data
    const requestTypeCtx = document.getElementById('requestTypeChart');
    if (requestTypeCtx) {
        new Chart(requestTypeCtx, {
            type: 'bar',
            data: {
                labels: ['Simple', 'JSON', 'Complex'],
                datasets: [{
                    label: 'Requests per Second',
                    data: [13374, 2059, 2213],
                    backgroundColor: [
                        colors.accent,
                        colors.primary,
                        colors.secondary
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
                labels: ['PivotPHP Core', 'PivotPHP ORM', 'Slim 4', 'Lumen', 'Flight'],
                datasets: [
                    {
                        label: 'Simple Route (req/s)',
                        data: [13374, 8893, 4562, 2912, 0],
                        backgroundColor: colors.primary
                    },
                    {
                        label: 'JSON API (req/s)',
                        data: [2059, 876, 4826, 2708, 0],
                        backgroundColor: colors.secondary
                    },
                    {
                        label: 'Complex (req/s)',
                        data: [2213, 2252, 1192, 0, 0],
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
                                return context.dataset.label + ': ' + context.parsed.x.toLocaleString();
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