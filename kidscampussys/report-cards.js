import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Chart from 'chart.js/auto';

document.addEventListener('DOMContentLoaded', () => {
  const termSelect = document.getElementById('termSelect');
  const classSelect = document.getElementById('classSelect');
  const loadBtn = document.getElementById('loadBtn');
  const tableBody = document.querySelector('#pupilsTable tbody');
  const chartCanvas = document.getElementById('performanceChart');

  // Load filters
  Promise.all([
    fetch('/api/terms').then(r => r.json()),
    fetch('/api/classes').then(r => r.json())
  ]).then(([terms, classes]) => {
    terms.forEach(t => termSelect.add(new Option(t.name, t.id)));
    classes.forEach(c => classSelect.add(new Option(c.name, c.id)));
  });

  // Load pupils
  loadBtn.addEventListener('click', async () => {
    tableBody.innerHTML = '';
    const termId = termSelect.value;
    const classId = classSelect.value;
    if (!termId || !classId) return alert('Select term and class');
    const pupils = await fetch(`/api/report-cards?term=${termId}&class=${classId}`, { credentials:'include' }).then(r => r.json());
    pupils.forEach((p, i) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${i+1}</td>
        <td>${p.fullName}</td>
        <td><button class="gen-btn" data-id="${p.id}">Generate</button></td>
        <td><button class="email-btn" data-id="${p.id}" data-email="${p.parentEmail}">Email</button></td>`;
      tableBody.append(row);
    });

    // Attach handlers
    document.querySelectorAll('.gen-btn').forEach(btn => btn.addEventListener('click', generatePDF));
    document.querySelectorAll('.email-btn').forEach(btn => btn.addEventListener('click', emailReport));
  });

  // Fetch data and build PDF
async function generatePDF(e) {
  const pupilId = e.target.dataset.id;
  const termId = termSelect.value;

  // Include attendance & remarks
  const query = `?term=${termId}&includeAttendance=true&includeRemarks=true`;
  const { details, marks, conduct, comments, performance, attendanceSummary, remarks } =
    await fetch(`/api/report-cards/${pupilId}${query}`, { credentials:'include' })
      .then(r => r.json());


    // Render chart
    new Chart(chartCanvas, {
      type: 'bar',
      data: {
        labels: performance.subjects,
        datasets: [{ label: 'Average', data: performance.averages, backgroundColor: '#4e73df' }]
      }
    });
    const chartImg = chartCanvas.toDataURL('image/png');

    const doc = new jsPDF({ unit:'pt', format:'A4' });
    doc.addImage('/assets/logo.png', 'PNG', 40, 30, 60, 60);
    doc.setFontSize(16).text('Report Card', 300, 60, { align:'center' });

    // Pupil details
    doc.setFontSize(12).text(`Name: ${details.fullName}`, 40, 110);
    doc.text(`Class: ${details.className}`, 40, 130);
    doc.text(`Term: ${details.termName}`, 40, 150);
    if (details.photoUrl) doc.addImage(details.photoUrl, 'JPEG', 450, 110, 80, 100);

    // Marks table
    doc.autoTable({
      startY: 180,
      head: [['Subject', 'Mid-Term', 'End-Term', 'Average']],
      body: marks.map(m => [m.subject, m.midTerm, m.endTerm, m.average]),
      styles: { fontSize:10 }
    });

    // Conduct & comments
    let y = doc.lastAutoTable.finalY + 20;
    doc.setFontSize(12).text('Conduct Summary:', 40, y);
    doc.setFontSize(10).text(`Attendance: ${conduct.attendance}`, 40, y+15);
    doc.text(`Behavior: ${conduct.behavior}`, 200, y+15);
    doc.text(`Comments: ${comments || 'None'}`, 40, y+35);

    // Chart
    doc.addImage(chartImg, 'PNG', 40, y+60, 520, 200);

  doc.save(`ReportCard_${details.fullName.replace(' ','_')}_${details.termName}.pdf`);
}

// Email PDF via backend
const emailTemplateSelect = document.getElementById('emailTemplateSelect');
async function emailReport(e) {
    const pupilId = e.target.dataset.id;
    const to = e.target.dataset.email;
    const templateId = emailTemplateSelect.value;
    if (!to || !templateId) {
      return alert('Select both a parent email and an email template.');
    }
    try {
      const res = await fetch('/api/report-cards/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ pupilId, termId: termSelect.value, to, templateId })
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      alert('Email sent successfully.');
    } catch (err) {
      alert(err.message);
    }
  }

  async function loadEmailTemplates() {
    const templates = await fetch('/api/email-templates', { credentials: 'include' })
      .then(r => r.json());
    templates.forEach(t => {
      emailTemplateSelect.add(new Option(t.name, t.id));
    });
  }

});
