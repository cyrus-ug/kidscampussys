// Example:
const gradeDistRows = await db.query(
  `SELECT grade, COUNT(*) FROM marks 
   WHERE class_id=$1 AND term_id=$2
   GROUP BY grade`, [classId, term]
);
const gradeDistribution = gradeDistRows.rows.map(r=>({ grade:r.grade, count:+r.count }));

const heatRows = await db.query(
  `SELECT s.name AS subject, t.name AS term,
          AVG((m.mid_term+m.end_term)/2) AS avg
   FROM marks m
   JOIN subjects s ON s.id=m.subject_id
   JOIN terms t ON t.id=m.term_id
   WHERE m.class_id=$1
   GROUP BY subject, term`, [classId]
);
const heatmap = heatRows.rows.map(r=>({ x:r.subject, y:r.term, v:+r.avg }));
const vals = heatmap.map(h=>h.v);
const heatmapMin = Math.min(...vals), heatmapMax = Math.max(...vals);

return {
  ...trendData,
  top, bottom,
  subjects, subjectAverages, subjectTargets,
  gradeDistribution,
  heatmap, heatmapMin, heatmapMax,
  terms: trendData.terms
};
