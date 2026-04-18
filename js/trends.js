// Set global Chart.js default font color to white
Chart.defaults.color = 'white';
// Also set global default font family for consistency with HTML
Chart.defaults.font.family = "'Inter', sans-serif";

function wrapLabel(label, maxLength) {
  if (label.length <= maxLength) {
    return label;
  }
  const words = label.split(' ');
  const lines = [];
  let currentLine = '';
  words.forEach((word) => {
    if ((currentLine + ' ' + word).trim().length > maxLength && currentLine.length > 0) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = (currentLine + ' ' + word).trim();
    }
  });
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}

const customTooltip = {
  plugins: {
    tooltip: {
      callbacks: {
        title: function (tooltipItems) {
          const item = tooltipItems[0];
          let label = item.chart.data.labels[item.dataIndex];
          if (Array.isArray(label)) {
            return label.join(' ');
          } else {
            return label;
          }
        },
        label: function (context) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            label += context.parsed.y;
          }
          return label;
        },
      },
      titleColor: 'white',
      bodyColor: 'white',
    },
  },
};

const palette = {
  primary: '#4F46E5', // Indigo-600
  secondary: '#818CF8', // Indigo-400
  complementary: '#38BDF8', // Sky-400
  darkGray: '#1F2937',
  lightGray: '#D1D5DB',
  medGray: '#9CA3AF',
};

const marketSizeData = {
  labels: ['2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028'],
  datasets: [
    {
      type: 'bar',
      label: 'Market Size ($ Trillion)',
      data: [4.8, 5.2, 5.7, 6.1, 6.5, 6.8, 7.1, 7.4, 7.7],
      backgroundColor: palette.primary,
      borderColor: palette.primary,
      borderWidth: 2,
      yAxisID: 'y',
    },
    {
      type: 'line',
      label: 'Y-o-Y Growth (%)',
      data: [null, 8.3, 9.6, 7.0, 6.6, 4.6, 4.4, 4.2, 4.1],
      backgroundColor: palette.complementary,
      borderColor: palette.complementary,
      tension: 0.4,
      fill: false,
      yAxisID: 'y1',
    },
  ],
};
new Chart(document.getElementById('marketSizeChart'), {
  data: marketSizeData,
  options: {
    ...customTooltip,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      ...customTooltip.plugins,
      title: {
        display: true,
        text: 'Market Size & Growth Projections (2020-2028)',
        font: { size: 16, color: 'white' },
      },
      legend: { labels: { color: 'white' } }, // Ensure legend text is visible on dark background
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: 'white' }, // X-axis label color
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: { display: true, text: 'Market Size ($T)', color: 'white' }, // Y-axis title color
        grid: { drawOnChartArea: false },
        ticks: { color: 'white' }, // Y-axis label color
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: { display: true, text: 'Growth (%)', color: 'white' }, // Y1-axis title color
        grid: { display: false },
        ticks: { color: 'white' }, // Y1-axis label color
      },
    },
  },
});

const marketShareData = {
  labels: ['Alpha Corp', 'Beta Solutions', 'Gamma Innovations', 'Nexus Dynamics', 'QuantumLeap Inc.', 'Others'],
  datasets: [
    {
      label: 'Market Share',
      data: [35, 25, 18, 12, 6, 4],
      backgroundColor: [palette.primary, palette.secondary, palette.complementary, '#A78BFA', '#8B5CF6', '#7C3AED'], // Shades of fuchsia, blue, and purple
      hoverOffset: 4,
    },
  ],
};
new Chart(document.getElementById('marketShareChart'), {
  type: 'doughnut',
  data: marketShareData,
  options: {
    ...customTooltip,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      ...customTooltip.plugins,
      title: { display: true, text: 'Market Share Distribution', font: { size: 16, color: 'white' } },
      legend: { position: 'bottom', labels: { color: 'white' } }, // Ensure legend text is visible
    },
    scales: {
      // This is a doughnut chart, so x and y scales are not typically defined here.
      // Chart.js 3.x handles their absence gracefully.
    },
  },
});

const techAdoptionChartElement = document.getElementById('techAdoptionChart');
const techAdoptionChartCheckboxes = document.querySelectorAll('#tech-adoption input[type="checkbox"]');

const techAdoptionRawData = {
  labels: ['2020', '2021', '2022', '2023', '2024'],
  datasets: [
    {
      label: 'AI & Machine Learning',
      data: [25, 35, 50, 68, 85],
      borderColor: palette.complementary,
      backgroundColor: 'rgba(96, 165, 250, 0.1)', // Blue with transparency
      fill: true,
      tension: 0.4,
    },
    {
      label: 'Internet of Things (IoT)',
      data: [40, 48, 55, 62, 70],
      borderColor: palette.primary,
      backgroundColor: 'rgba(192, 38, 211, 0.1)', // Fuchsia with transparency
      fill: true,
      tension: 0.4,
    },
    {
      label: 'Blockchain',
      data: [5, 8, 12, 17, 25],
      borderColor: palette.secondary,
      backgroundColor: 'rgba(232, 121, 249, 0.1)', // Lighter fuchsia with transparency
      fill: true,
      tension: 0.4,
    },
  ],
};

const techAdoptionChart = new Chart(techAdoptionChartElement, {
  type: 'line',
  data: techAdoptionRawData, // Initialize with all data
  options: {
    ...customTooltip,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      ...customTooltip.plugins,
      title: { display: true, text: 'Tech Adoption Rate (%)', font: { size: 16, color: 'white' } },
      legend: { position: 'bottom', labels: { color: 'white' } }, // Ensure legend text is visible
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: 'white' }, // X-axis label color
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Adoption Rate (%)', color: 'white' }, // Y-axis title color
        ticks: { color: 'white' }, // Y-axis label color
      },
    },
  },
});

techAdoptionChartCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener('change', () => {
    const datasetIndex = parseInt(checkbox.value);
    // Toggle dataset visibility
    techAdoptionChart.data.datasets[datasetIndex].hidden =
      !checkbox.checked;
    techAdoptionChart.update();
  });
});

const demographicsData = {
  labels: ['Under 18', '18-24', '25-34', '35-44', '45-54', '55+'].map((l) => wrapLabel(l, 16)),
  datasets: [
    {
      label: 'Customer Base (%)',
      data: [5, 20, 35, 22, 12, 6],
      backgroundColor: [palette.primary, palette.secondary, palette.complementary, '#A78BFA', '#8B5CF6', '#7C3AED'], // Shades of fuchsia, blue, and purple
      borderColor: '#fff',
      borderWidth: 1,
    },
  ],
};
new Chart(document.getElementById('demographicsChart'), {
  type: 'bar',
  data: demographicsData,
  options: {
    ...customTooltip,
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      ...customTooltip.plugins,
      title: { display: true, text: 'Customer Base by Age Group', font: { size: 16, color: 'white' } },
      legend: { display: false },
    },
    scales: {
      x: {
        title: { display: true, text: '% of Customer Base', color: 'white' }, // X-axis title color
        ticks: { color: 'white' }, // X-axis label color
      },
      y: {
        grid: { display: false },
        ticks: { color: 'white' }, // Y-axis label color
      },
    },
  },
});
