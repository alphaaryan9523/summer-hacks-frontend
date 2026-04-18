import { useRef, useState } from "react";
import Upload from "./components/Upload";
import JobCard from "./components/JobCard";
import Interview from "./components/Interview";
import LiveInterview from "./components/LiveInterview";

function InsightsIllustration() {
  return (
    <svg
      viewBox="0 0 280 200"
      style={styles.insightsSvg}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="insightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6c30ff" />
          <stop offset="100%" stopColor="#8d62ff" />
        </linearGradient>
      </defs>

      <circle cx="140" cy="100" r="84" fill="#f4efff" />

      <rect
        x="52"
        y="58"
        width="176"
        height="100"
        rx="20"
        fill="#ffffff"
        stroke="#e4d8ff"
      />
      <rect x="72" y="80" width="56" height="10" rx="5" fill="#ede4ff" />
      <rect x="72" y="100" width="112" height="10" rx="5" fill="#f3ecff" />
      <rect x="72" y="118" width="92" height="10" rx="5" fill="#f3ecff" />

      <path
        d="M78 148 C104 130, 128 118, 152 104 C171 94, 189 82, 208 70"
        fill="none"
        stroke="url(#insightGrad)"
        strokeWidth="7"
        strokeLinecap="round"
      />

      <circle cx="78" cy="148" r="7" fill="#6c30ff" />
      <circle cx="152" cy="104" r="7" fill="#8d62ff" />
      <circle cx="208" cy="70" r="7" fill="#6c30ff" />
    </svg>
  );
}

function EmptyJobsIllustration() {
  return (
    <svg
      viewBox="0 0 280 200"
      style={styles.emptySvg}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="140" cy="100" r="82" fill="#f4efff" />
      <rect
        x="70"
        y="60"
        width="140"
        height="90"
        rx="20"
        fill="#ffffff"
        stroke="#e4d8ff"
      />
      <rect x="92" y="82" width="64" height="10" rx="5" fill="#ede4ff" />
      <rect x="92" y="100" width="96" height="10" rx="5" fill="#f3ecff" />
      <rect x="92" y="118" width="82" height="10" rx="5" fill="#f3ecff" />
      <circle cx="198" cy="76" r="16" fill="#6c30ff" />
      <path
        d="M192 76 L198 82 L206 70"
        fill="none"
        stroke="#fff"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function App() {
  const [jobs, setJobs] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [liveJob, setLiveJob] = useState(null);

  const jobsSectionRef = useRef(null);

  const handleJobsUpdate = (newJobs) => {
    setJobs(newJobs);

    if (newJobs.length > 0) {
      setTimeout(() => {
        jobsSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 120);
    }
  };

  if (liveJob) {
    return (
      <LiveInterview
        selectedJob={liveJob}
        onBack={() => setLiveJob(null)}
      />
    );
  }

  if (selectedJob) {
    return (
      <Interview
        selectedJob={selectedJob}
        onBack={() => setSelectedJob(null)}
      />
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.uploadSection}>
        <Upload setJobs={handleJobsUpdate} setKeywords={setKeywords} />
      </div>

      {(keywords.length > 0 || jobs.length > 0) && (
        <div style={styles.contentArea}>
          <div style={styles.innerContent}>
            <div style={styles.summaryGrid}>
              <div style={styles.summaryCard}>
                <div style={styles.summaryLabel}>Jobs Found</div>
                <div style={styles.summaryValue}>{jobs.length}</div>
              </div>

              <div style={styles.summaryCard}>
                <div style={styles.summaryLabel}>Keywords Extracted</div>
                <div style={styles.summaryValue}>{keywords.length}</div>
              </div>

              <div style={styles.summaryCard}>
                <div style={styles.summaryLabel}>Top Skill</div>
                <div style={styles.summaryValue}>
                  {keywords.length ? keywords[0] : "N/A"}
                </div>
              </div>
            </div>

            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Extracted Keywords</h2>
              <div style={styles.keywordBox}>
                {keywords.length ? (
                  <div style={styles.keywordWrap}>
                    {keywords.map((keyword, index) => (
                      <span key={index} style={styles.keywordTag}>
                        {keyword}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span style={styles.emptyText}>No keywords yet</span>
                )}
              </div>
            </div>

            <div style={styles.section} ref={jobsSectionRef}>
              <h2 style={styles.sectionTitle}>Recommended Jobs</h2>

              <div style={styles.jobsLayout}>
                <aside style={styles.jobsAside}>
                  <div style={styles.jobsAsideCard}>
                    <InsightsIllustration />
                    <h3 style={styles.jobsAsideTitle}>Match Insights</h3>
                    <p style={styles.jobsAsideText}>
                      Focus on roles that align with your strongest extracted
                      keywords first.
                    </p>

                    <div style={styles.insightList}>
                      <div style={styles.insightItem}>
                        <span style={styles.insightKey}>Resume Keywords</span>
                        <span style={styles.insightVal}>{keywords.length}</span>
                      </div>
                      <div style={styles.insightItem}>
                        <span style={styles.insightKey}>Matched Jobs</span>
                        <span style={styles.insightVal}>{jobs.length}</span>
                      </div>
                      <div style={styles.insightItem}>
                        <span style={styles.insightKey}>Best Start</span>
                        <span style={styles.insightVal}>
                          {keywords.length ? keywords[0] : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </aside>

                <div style={styles.jobsGrid}>
                  {jobs.length === 0 ? (
                    <div style={styles.emptyJobsBox}>
                      <EmptyJobsIllustration />
                      <h3 style={styles.emptyJobsTitle}>No jobs yet</h3>
                      <p style={styles.emptyJobsText}>
                        Upload a resume to see matching jobs.
                      </p>
                    </div>
                  ) : (
                    jobs.map((job, index) => (
                      <JobCard
                        key={index}
                        job={job}
                        onStartInterview={setSelectedJob}
                        onStartLiveInterview={setLiveJob}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    width: "100%",
    minHeight: "100vh",
    background: "#f7f5fc",
    fontFamily: "Inter, Arial, sans-serif",
  },

  uploadSection: {
    width: "100%",
    minHeight: "100vh",
  },

  contentArea: {
    width: "100%",
    background: "#f7f5fc",
    padding: "24px 32px 32px 272px",
  },

  innerContent: {
    width: "100%",
  },

  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "14px",
    marginBottom: "22px",
  },

  summaryCard: {
    background: "linear-gradient(180deg, #ffffff 0%, #faf8ff 100%)",
    border: "1px solid #e9e0fb",
    borderRadius: "20px",
    padding: "18px",
    boxShadow: "0 12px 30px rgba(83, 52, 181, 0.06)",
  },

  summaryLabel: {
    fontSize: "12px",
    color: "#8b80a4",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    fontWeight: "800",
    marginBottom: "8px",
  },

  summaryValue: {
    fontSize: "22px",
    fontWeight: "900",
    color: "#24163a",
  },

  section: {
    marginBottom: "28px",
    scrollMarginTop: "30px",
  },

  sectionTitle: {
    margin: "0 0 14px 0",
    fontSize: "24px",
    fontWeight: "800",
    color: "#24163a",
  },

  keywordBox: {
    background: "#ffffff",
    border: "1px solid #e8e0fb",
    borderRadius: "20px",
    padding: "18px",
    boxShadow: "0 10px 30px rgba(83, 52, 181, 0.06)",
    minHeight: "72px",
  },

  keywordWrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },

  keywordTag: {
    background: "#ede4ff",
    color: "#5a1fd8",
    padding: "8px 14px",
    borderRadius: "999px",
    fontWeight: "600",
    fontSize: "13px",
  },

  emptyText: {
    color: "#7c7095",
    fontSize: "14px",
  },

  jobsLayout: {
    display: "grid",
    gridTemplateColumns: "280px 1fr",
    gap: "18px",
    alignItems: "start",
  },

  jobsAside: {
    position: "sticky",
    top: "20px",
  },

  jobsAsideCard: {
    background: "linear-gradient(180deg, #ffffff 0%, #faf8ff 100%)",
    border: "1px solid #e9e0fb",
    borderRadius: "22px",
    padding: "18px",
    boxShadow: "0 12px 30px rgba(83, 52, 181, 0.06)",
  },

  insightsSvg: {
    width: "100%",
    maxWidth: "220px",
    height: "auto",
    display: "block",
    margin: "0 auto 16px auto",
  },

  jobsAsideTitle: {
    margin: "0 0 8px 0",
    fontSize: "18px",
    fontWeight: "850",
    color: "#24163a",
  },

  jobsAsideText: {
    margin: "0 0 16px 0",
    fontSize: "14px",
    color: "#756b8c",
    lineHeight: 1.6,
  },

  insightList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  insightItem: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    padding: "12px 0",
    borderBottom: "1px solid #f0eaff",
  },

  insightKey: {
    fontSize: "13px",
    color: "#7b7093",
    fontWeight: "700",
  },

  insightVal: {
    fontSize: "13px",
    color: "#4f1ec8",
    fontWeight: "900",
  },

  jobsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "16px",
  },

  emptyJobsBox: {
    background: "#ffffff",
    border: "1px solid #e8e0fb",
    borderRadius: "20px",
    padding: "28px",
    color: "#7c7095",
    boxShadow: "0 10px 30px rgba(83, 52, 181, 0.06)",
    textAlign: "center",
  },

  emptySvg: {
    width: "100%",
    maxWidth: "220px",
    height: "auto",
    display: "block",
    margin: "0 auto 14px auto",
  },

  emptyJobsTitle: {
    margin: "0 0 8px 0",
    color: "#24163a",
    fontSize: "20px",
    fontWeight: "850",
  },

  emptyJobsText: {
    margin: 0,
    fontSize: "14px",
    color: "#7c7095",
  },
};

export default App;