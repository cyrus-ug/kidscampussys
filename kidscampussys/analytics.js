document.addEventListener('DOMContentLoaded', () => {
  const termSelect = document.getElementById('termSelect');
  const classSelect = document.getElementById('classSelect');
  const genderSelect = document.getElementById('genderSelect');
  const sectionSelect = document.getElementById('sectionSelect');
  const loadBtn = document.getElementById('loadAnalytics');
  const downloadBtn = document.getElementById('downloadCsv');

  const lineCtx = document.getElementById('lineChart').getContext('2d');
  const barCtx = document.getElementById('barChart').getContext('2d');
  const radarCtx = document.getElementById('radarChart').getContext('2d');

  let lineChart, barChart, radarChart, rawData;

  // Load filter options
  async function loadFilters() {
    const [terms, classes, sections] = await Promise.all([
      fetch('/api/terms').then(r => r.json()),
      fetch('/api/classes').then(r => r.json()),
      fetch('/api/sections').then(r => r.json())
    ]);
    terms.forEach(t => termSelect.add(new Option(t.name, t.id)));
    classes.forEach(c => classSelect.add(new Option(c.name, c.id)));
    sections.forEach(s => sectionSelect.add(new Option(s.name, s.id)));
  }

  // Fetch analytics data
  async function loadAnalytics() {
    const params = new URLSearchParams({
      term: termSelect.value,
      class: classSelect.value,
      gender: genderSelect.value,
      section: sectionSelect.value
    });
    const res = await fetch(`/api/analytics?${params}`, { credentials:'include' });
    rawData = await res.json();
    renderCharts(rawData);
    renderTables(rawData);
  }

  // Render charts
  function renderCharts(data) {
    // Line Chart
    const lineData = {
      labels: data.trend.terms,
      datasets: [{ label: 'Class Average', data: data.trend.averages, borderColor:'#4e73df', fill:false }]
    };
    lineChart?.destroy();
    lineChart = new Chart(lineCtx, { type:'line', data:lineData });

    // Bar Chart
    const barData = {
      labels: data.top.concat(data.bottom).map(p => p.name),
      datasets: [{ label:'Avg Score', data: data.top.concat(data.bottom).map(p => p.avg), backgroundColor:['#1cc88a','#e74a3b'] }]
    };
    barChart?.destroy();
    barChart = new Chart(barCtx, { type:'bar', data:barData });

    // Radar Chart
    const radarData = {
      labels: data.subjects,
      datasets: [
        { label:'Average', data:data.subjectAverages, backgroundColor:'rgba(78,115,223,0.2)', borderColor:'#4e73df' },
        { label:'Target', data:data.subjectTargets, backgroundColor:'rgba(28,200,138,0.2)', borderColor:'#1cc88a' }
      ]
    };
    radarChart?.destroy();
    radarChart = new Chart(radarCtx, { type:'radar', data:radarData });
  }

  // Render summary tables
  function renderTables(data) {
    const topBody = document.querySelector('#topTable tbody');
    const bottomBody = document.querySelector('#bottomTable tbody');
    topBody.innerHTML = '';
    bottomBody.innerHTML = '';

    data.top.forEach((p, i) => {
      topBody.insertAdjacentHTML('beforeend', `<tr>
        <td>${i+1}</td><td>${p.name}</td><td>${p.avg}</td><td>${p.grade}</td>
      </tr>`);
    });
    data.bottom.forEach((p, i) => {
      bottomBody.insertAdjacentHTML('beforeend', `<tr>
        <td>${i+1}</td><td>${p.name}</td><td>${p.avg}</td><td>${p.grade}</td>
      </tr>`);
    });
  }

  // CSV download
  downloadBtn.addEventListener('click', () => {
    if (!rawData) return alert('Load data first');
    const csvRows = [];
    csvRows.push(['Name','Avg Score','Grade'].join(','));
    rawData.top.concat(rawData.bottom).forEach(p => {
      csvRows.push([p.name,p.avg,p.grade].join(','));
    });
    const blob = new Blob([csvRows.join('\n')], { type:'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'analytics.csv'; a.click();
    URL.revokeObjectURL(url);
  });

  loadFilters();
  loadBtn.addEventListener('click', loadAnalytics);
});
// After existing Chart.js import
import 'chartjs-chart-matrix';  // for heatmap

document.addEventListener('DOMContentLoaded', () => {
  // … existing selectors …
  const pieCtx     = document.getElementById('pieChart').getContext('2d');
  const heatmapCtx = document.getElementById('heatmapChart').getContext('2d');
  const statusEl   = document.getElementById('refreshStatus');

  let lineChart, barChart, radarChart, pieChart, heatmapChart, rawData;

  // Fetch & render analytics
  async function loadAnalytics() {
    const params = new URLSearchParams({
      term:    termSelect.value,
      class:   classSelect.value,
      gender:  genderSelect.value,
      section: sectionSelect.value
    });
    rawData = await fetch(`/api/analytics?${params}`, { credentials:'include' })
                   .then(r => r.json());

    const now = new Date().toLocaleTimeString();
    statusEl.textContent = `Last updated: ${now}`;

    renderCharts(rawData);
    renderTables(rawData);
  }

  function renderCharts(data) {
    // 1. Line Chart (unchanged)
    // 2. Bar Chart (unchanged)
    // 3. Radar Chart (unchanged)

    // 4. Pie Chart: Grade Distribution
    const pieData = {
      labels: data.gradeDistribution.map(d => d.grade),
      datasets: [{
        data: data.gradeDistribution.map(d => d.count),
        backgroundColor: ['#4e73df','#1cc88a','#36b9cc','#f6c23e','#e74a3b']
      }]
    };
    pieChart?.destroy();
    pieChart = new Chart(pieCtx, {
      type: 'pie',
      data: pieData,
      options: { plugins: { legend:{ position:'bottom' } } }
    });

    // 5. Heatmap: Subject x Term Performance
    const hmMin = data.heatmapMin, hmMax = data.heatmapMax;
    heatmapChart?.destroy();
    heatmapChart = new Chart(heatmapCtx, {
      type: 'matrix',
      data: {
        datasets: [{
          label: 'Avg Score',
          data: data.heatmap,
          backgroundColor(ctx) {
            const v = ctx.dataset.data[ctx.dataIndex].v;
            const alpha = (v - hmMin) / (hmMax - hmMin);
            return Chart.helpers.color('#4e73df').alpha(alpha).rgbString();
          },
          width: ({ chart }) => (chart.chartArea.width / data.subjects.length) - 2,
          height:({ chart }) => (chart.chartArea.height / data.terms.length) - 2
        }]
      },
      options: {
        scales: {
          x: { type:'category', labels: data.subjects },
          y: { type:'category', labels: data.terms }
        },
        plugins: {
          tooltip: {
            callbacks: {
              title: ctx => `${ctx[0].raw.x} — ${ctx[0].raw.y}`,
              label: ctx => `Avg: ${ctx.raw.v.toFixed(1)}`
            }
          }
        }
      }
    });
  }

  // Auto‐refresh every 60s
  loadAnalytics();
  setInterval(loadAnalytics, 60000);

  loadFilters();
  loadBtn.addEventListener('click', loadAnalytics);
});
const intervalInput   = document.getElementById('refreshInterval');
const toggleBtn       = document.getElementById('toggleRefresh');

let refreshTimerId;
let isRefreshing = true;

function heatmapColor(value) {
  if (value < 50)    return '#e74a3b'; // red
  if (value < 70)    return '#f6c23e'; // yellow
  if (value < 90)    return '#1cc88a'; // green
                     return '#4e73df'; // blue
}

heatmapChart = new Chart(heatmapCtx, {
  type: 'matrix',
  data: {
    datasets: [{
      label: 'Avg Score',
      data: data.heatmap,
      backgroundColor(ctx) {
        const v = ctx.dataset.data[ctx.dataIndex].v;
        return heatmapColor(v);
      },
      width:  ({ chart }) => (chart.chartArea.width / data.subjects.length) - 2,
      height: ({ chart }) => (chart.chartArea.height / data.terms.length) - 2
    }]
  },
  options: { /* same as before */ }
});

// Wrap the fetch+render in a named function
async function fetchAndRender() {
  // existing loadAnalytics body
}

// Start auto-refresh
function startAutoRefresh() {
  const secs = parseInt(intervalInput.value, 10) || 60;
  if (refreshTimerId) clearInterval(refreshTimerId);
  refreshTimerId = setInterval(fetchAndRender, secs * 1000);
}

// Pause or resume
toggleBtn.addEventListener('click', () => {
  if (isRefreshing) {
    clearInterval(refreshTimerId);
    toggleBtn.textContent = 'Resume';
  } else {
    startAutoRefresh();
    toggleBtn.textContent = 'Pause';
  }
  isRefreshing = !isRefreshing;
});

// When interval changes, restart timer
intervalInput.addEventListener('change', () => {
  if (isRefreshing) startAutoRefresh();
});
loadFilters();
fetchAndRender();
startAutoRefresh();

loadBtn.addEventListener('click', fetchAndRender);
