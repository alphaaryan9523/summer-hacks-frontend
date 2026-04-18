export default function JobCard({
  job,
  onStartInterview,
  onStartLiveInterview,
}) {
  const score = job?.score ?? "N/A";
  const skills = job?.matched_keywords?.length ? job.matched_keywords : [];

  return (
    <div style={styles.card}>
      <div style={styles.cardGlow} />

      <div style={styles.topRow}>
        <div style={styles.titleBlock}>
          <div style={styles.companyBadge}>
            {(job.company || "C").slice(0, 1).toUpperCase()}
          </div>

          <div style={styles.titleContent}>
            <h3 style={styles.title}>{job.title || "Untitled Role"}</h3>
            <div style={styles.metaRow}>
              <span style={styles.metaText}>
                {job.company || "Unknown Company"}
              </span>
              <span style={styles.metaDot}>•</span>
              <span style={styles.metaText}>{job.location || "Remote"}</span>
            </div>
          </div>
        </div>

        <div style={styles.matchBadge}>
          <span style={styles.matchLabel}>Match</span>
          <span style={styles.matchValue}>{score}</span>
        </div>
      </div>

      <div style={styles.skillsSection}>
        <div style={styles.skillsLabel}>Matched Skills</div>

        <div style={styles.skillsWrap}>
          {skills.length > 0 ? (
            skills.map((skill, index) => (
              <span key={index} style={styles.skillTag}>
                {skill}
              </span>
            ))
          ) : (
            <span style={styles.noSkill}>No matched skills</span>
          )}
        </div>
      </div>

      <div style={styles.bottomRow}>
        <div style={styles.jobHint}>Use interview mode to validate your fit.</div>

        <div style={styles.actions}>
          <a
            href={job.redirect_url}
            target="_blank"
            rel="noreferrer"
            style={styles.linkReset}
          >
            <button style={styles.primaryBtn}>Apply</button>
          </a>

          <button
            style={styles.outlineBtn}
            onClick={() => onStartInterview(job)}
          >
            Structured
          </button>

          <button
            style={styles.liveBtn}
            onClick={() => onStartLiveInterview(job)}
          >
            Live
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    position: "relative",
    overflow: "hidden",
    background: "linear-gradient(180deg, #ffffff 0%, #faf8ff 100%)",
    borderRadius: "22px",
    padding: "20px",
    border: "1px solid #e9e0fb",
    boxShadow: "0 18px 40px rgba(83, 52, 181, 0.08)",
    transition:
      "transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease",
  },

  cardGlow: {
    position: "absolute",
    top: "-56px",
    right: "-44px",
    width: "170px",
    height: "170px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(110,65,255,0.13), transparent 68%)",
    pointerEvents: "none",
  },

  topRow: {
    position: "relative",
    zIndex: 2,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "14px",
    marginBottom: "16px",
  },

  titleBlock: {
    display: "flex",
    gap: "12px",
    minWidth: 0,
    alignItems: "center",
    flex: 1,
  },

  companyBadge: {
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #6c30ff 0%, #8d62ff 100%)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    fontWeight: "900",
    flexShrink: 0,
    boxShadow: "0 14px 30px rgba(93, 46, 220, 0.20)",
  },

  titleContent: {
    minWidth: 0,
  },

  title: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "850",
    color: "#24163a",
    letterSpacing: "-0.3px",
    lineHeight: 1.3,
  },

  metaRow: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    flexWrap: "wrap",
    marginTop: "5px",
  },

  metaText: {
    fontSize: "13px",
    color: "#756b8c",
    fontWeight: "600",
  },

  metaDot: {
    color: "#b8afcc",
    fontSize: "12px",
  },

  matchBadge: {
    minWidth: "84px",
    padding: "8px 10px",
    borderRadius: "16px",
    background: "#f2ecff",
    border: "1px solid #e0d4ff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
    flexShrink: 0,
  },

  matchLabel: {
    fontSize: "11px",
    color: "#8169b2",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  matchValue: {
    fontSize: "16px",
    color: "#5a1fd8",
    fontWeight: "900",
  },

  skillsSection: {
    position: "relative",
    zIndex: 2,
    marginBottom: "16px",
  },

  skillsLabel: {
    fontSize: "13px",
    color: "#6d6287",
    fontWeight: "800",
    marginBottom: "10px",
  },

  skillsWrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },

  skillTag: {
    background: "#f3efff",
    color: "#5a1fd8",
    padding: "8px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "800",
    border: "1px solid #e5d9ff",
  },

  noSkill: {
    fontSize: "13px",
    color: "#9b91b3",
    fontWeight: "600",
  },

  bottomRow: {
    position: "relative",
    zIndex: 2,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "14px",
    flexWrap: "wrap",
  },

  jobHint: {
    fontSize: "12px",
    color: "#8b80a4",
    fontWeight: "600",
  },

  actions: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    alignItems: "center",
  },

  linkReset: {
    textDecoration: "none",
  },

  primaryBtn: {
    border: "none",
    background: "linear-gradient(135deg, #6c30ff 0%, #551ed6 100%)",
    color: "#fff",
    padding: "11px 15px",
    borderRadius: "14px",
    fontSize: "13px",
    fontWeight: "900",
    cursor: "pointer",
    boxShadow: "0 14px 30px rgba(93, 46, 220, 0.18)",
  },

  outlineBtn: {
    border: "1px solid #d8cbff",
    background: "#fff",
    color: "#5a1fd8",
    padding: "11px 15px",
    borderRadius: "14px",
    fontSize: "13px",
    fontWeight: "900",
    cursor: "pointer",
  },

  liveBtn: {
    border: "none",
    background: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
    color: "#fff",
    padding: "11px 15px",
    borderRadius: "14px",
    fontSize: "13px",
    fontWeight: "900",
    cursor: "pointer",
    boxShadow: "0 14px 30px rgba(109, 40, 217, 0.18)",
  },
};

if (
  typeof document !== "undefined" &&
  !document.getElementById("job-card-next-level-style")
) {
  const style = document.createElement("style");
  style.id = "job-card-next-level-style";
  style.innerHTML = `
    button {
      transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
    }

    button:hover {
      transform: translateY(-1px);
    }
  `;
  document.head.appendChild(style);
}