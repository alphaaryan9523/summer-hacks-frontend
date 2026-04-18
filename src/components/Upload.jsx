import { useState } from "react";

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL;

function JobMatchIllustration() {
  return (
    <svg
      viewBox="0 0 320 260"
      style={styles.illustrationSvg}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6c30ff" />
          <stop offset="100%" stopColor="#8d62ff" />
        </linearGradient>
        <linearGradient id="softCard" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f6f1ff" />
        </linearGradient>
      </defs>

      <circle cx="160" cy="130" r="108" fill="#f4efff" />
      <circle cx="250" cy="58" r="14" fill="#e7dbff" />
      <circle cx="65" cy="78" r="10" fill="#ebe3ff" />
      <circle cx="244" cy="178" r="8" fill="#e7dbff" />

      <rect
        x="70"
        y="66"
        rx="20"
        ry="20"
        width="168"
        height="122"
        fill="url(#softCard)"
        stroke="#e4d8ff"
      />
      <rect x="88" y="86" rx="10" ry="10" width="76" height="12" fill="#efe8ff" />
      <rect x="88" y="106" rx="8" ry="8" width="130" height="10" fill="#f5f0ff" />
      <rect x="88" y="122" rx="8" ry="8" width="118" height="10" fill="#f5f0ff" />
      <rect x="88" y="138" rx="8" ry="8" width="92" height="10" fill="#f5f0ff" />

      <rect x="92" y="154" rx="12" ry="12" width="74" height="20" fill="url(#purpleGrad)" />
      <rect x="173" y="154" rx="12" ry="12" width="44" height="20" fill="#ede4ff" />

      <path
        d="M112 186 C132 170, 155 154, 182 138 C205 124, 226 113, 248 98"
        fill="none"
        stroke="url(#purpleGrad)"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M240 88 L253 96 L244 109"
        fill="none"
        stroke="#6c30ff"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle cx="112" cy="170" r="8" fill="#6c30ff" />
      <circle cx="180" cy="140" r="8" fill="#8d62ff" />
      <circle cx="248" cy="98" r="8" fill="#6c30ff" />

      <circle cx="245" cy="150" r="26" fill="#ffffff" stroke="#e4d8ff" />
      <circle cx="245" cy="150" r="14" fill="#f3ecff" />
      <path
        d="M243 144 L243 150 L249 154"
        fill="none"
        stroke="#6c30ff"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <rect x="40" y="184" rx="14" ry="14" width="84" height="44" fill="#ffffff" stroke="#e4d8ff" />
      <rect x="56" y="198" rx="6" ry="6" width="52" height="10" fill="#ede4ff" />

      <rect x="208" y="34" rx="14" ry="14" width="64" height="44" fill="#ffffff" stroke="#e4d8ff" />
      <circle cx="228" cy="56" r="8" fill="#6c30ff" />
      <rect x="240" y="51" rx="5" ry="5" width="16" height="10" fill="#ede4ff" />
    </svg>
  );
}

function SidebarProgressIllustration() {
  return (
    <svg
      viewBox="0 0 240 160"
      style={styles.sidebarSvg}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="sideGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#e9dcff" stopOpacity="0.95" />
        </linearGradient>
      </defs>

      <rect x="22" y="34" width="196" height="94" rx="22" fill="url(#sideGrad)" />
      <rect x="42" y="56" width="70" height="12" rx="6" fill="#d9c7ff" />
      <rect x="42" y="78" width="128" height="10" rx="5" fill="#eadfff" />
      <rect x="42" y="96" width="100" height="10" rx="5" fill="#eadfff" />
      <rect x="42" y="114" width="82" height="10" rx="5" fill="#eadfff" />

      <circle cx="184" cy="76" r="22" fill="#6c30ff" />
      <path
        d="M176 76 L182 82 L193 70"
        fill="none"
        stroke="#fff"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Upload({ setJobs, setKeywords }) {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [keyword, setKeyword] = useState("Software Developer");
  const [location, setLocation] = useState("Mumbai");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!file) {
      alert("Please upload your resume PDF first.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("keyword", keyword.trim() || "Software Developer");
    formData.append("location", location.trim() || "Mumbai");

    try {
      setLoading(true);

      const res = await fetch(`${BACKEND_URL}/match-jobs`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Failed to match jobs");
      }

      setJobs(data.recommended_jobs || []);
      setKeywords(data.resume_keywords || []);
    } catch (error) {
      console.error("Match error:", error);
      alert(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setFileName("");
  };

  return (
    <div style={styles.page}>
      <aside style={styles.sidebar}>
        <div>
          <div style={styles.logoWrap}>
            <div style={styles.logo}>J</div>
            <div>
              <h1 style={styles.brand}>Jobie</h1>
              <p style={styles.brandSub}>AI Job Matcher</p>
            </div>
          </div>

          <div style={styles.sidebarBlock}>
            <div style={styles.sidebarItemActive}>Applications</div>
            <div style={styles.sidebarMini}>Resume → Match → Interview</div>
          </div>
        </div>

        <div style={styles.sidebarBottomStack}>
          <div style={styles.sidebarCard}>
            <SidebarProgressIllustration />
            <div style={styles.sidebarCardTitle}>Sharper results</div>
            <div style={styles.sidebarCardText}>
              Use a focused resume, target the exact role, and keep location realistic
              for better matches.
            </div>
          </div>

          <div style={styles.profileMiniCard}>
            <div style={styles.profileMiniTop}>
              <div style={styles.profileMiniAvatar}>A</div>
              <div>
                <div style={styles.profileMiniName}>Aryan Singh</div>
                <div style={styles.profileMiniRole}>Candidate Mode</div>
              </div>
            </div>

            <div style={styles.profileMiniStats}>
              <div style={styles.profileMiniStat}>
                <span style={styles.profileMiniStatLabel}>Focus</span>
                <span style={styles.profileMiniStatValue}>AI + Full Stack</span>
              </div>
              <div style={styles.profileMiniStat}>
                <span style={styles.profileMiniStatLabel}>Status</span>
                <span style={styles.profileMiniStatValue}>Active</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main style={styles.main}>
        <section style={styles.hero}>
          <div>
            <div style={styles.heroBadge}>Premium AI workflow</div>
            <h2 style={styles.heroTitle}>Upload once. Match better.</h2>
            <p style={styles.heroText}>
              Turn your resume into job-ready recommendations with a cleaner,
              faster matching workflow.
            </p>
          </div>

          <div style={styles.heroStats}>
            <div style={styles.statCard}>
              <span style={styles.statLabel}>Mode</span>
              <span style={styles.statValue}>Smart Match</span>
            </div>
            <div style={styles.statCard}>
              <span style={styles.statLabel}>Output</span>
              <span style={styles.statValue}>Jobs + Keywords</span>
            </div>
          </div>
        </section>

        <section style={styles.panel}>
          <div style={styles.panelGlow} />

          <div style={styles.panelTop}>
            <div>
              <h3 style={styles.panelTitle}>Resume Upload</h3>
              <p style={styles.panelText}>
                Upload your PDF and refine your target role before matching.
              </p>
            </div>

            <div style={styles.readyBadge}>
              <span style={styles.readyDot} />
              Ready
            </div>
          </div>

          <div style={styles.contentGrid}>
            <div style={styles.leftColumn}>
              <div>
                <label style={styles.label}>Resume</label>

                {!fileName ? (
                  <div style={styles.uploadShell}>
                    <input
                      id="resume-upload"
                      type="file"
                      accept=".pdf"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const selectedFile = e.target.files[0];
                        if (selectedFile) {
                          setFile(selectedFile);
                          setFileName(selectedFile.name);
                        }
                      }}
                    />

                    <label htmlFor="resume-upload" style={styles.uploadArea}>
                      <div style={styles.uploadOrb}>
                        <div style={styles.uploadArrow}>↑</div>
                      </div>

                      <div style={styles.uploadTitle}>Drop your resume here</div>
                      <div style={styles.uploadSubtext}>
                        Or click to browse from your device
                      </div>
                      <div style={styles.uploadHint}>PDF only</div>

                      <div style={styles.uploadButton}>Choose File</div>
                    </label>
                  </div>
                ) : (
                  <div style={styles.fileCard}>
                    <div style={styles.fileLeft}>
                      <div style={styles.fileIcon}>PDF</div>
                      <div>
                        <div style={styles.fileName}>{fileName}</div>
                        <div style={styles.fileMeta}>
                          {file ? `${(file.size / 1024).toFixed(0)} KB` : "PDF"}
                        </div>
                      </div>
                    </div>

                    <button style={styles.removeButton} onClick={removeFile}>
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div style={styles.formGrid}>
                <div>
                  <label style={styles.label}>Job Title / Keyword</label>
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="e.g. Frontend Developer, ML Engineer"
                    style={styles.input}
                  />
                </div>

                <div>
                  <label style={styles.label}>Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Mumbai, Pune, Remote"
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.buttonWrap}>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  style={{
                    ...styles.primaryButton,
                    ...(loading ? styles.primaryButtonDisabled : {}),
                  }}
                >
                  <span style={styles.buttonGlow} />
                  {loading ? "Matching Jobs..." : "Find Matches"}
                </button>
              </div>
            </div>

            <div style={styles.rightColumn}>
              <div style={styles.visualCard}>
                <JobMatchIllustration />
                <h3 style={styles.visualTitle}>Smart Matching</h3>
                <p style={styles.visualText}>
                  AI scans your resume, understands your intent, and surfaces more
                  relevant roles faster.
                </p>
              </div>

              <div style={styles.infoCard}>
                <div style={styles.infoNumber}>01</div>
                <div>
                  <div style={styles.infoTitle}>Upload a clean PDF</div>
                  <div style={styles.infoText}>
                    Avoid cluttered formatting and keep the resume readable.
                  </div>
                </div>
              </div>

              <div style={styles.infoCard}>
                <div style={styles.infoNumber}>02</div>
                <div>
                  <div style={styles.infoTitle}>Be precise with role</div>
                  <div style={styles.infoText}>
                    Specific job titles improve match quality significantly.
                  </div>
                </div>
              </div>

              <div style={styles.infoCard}>
                <div style={styles.infoNumber}>03</div>
                <div>
                  <div style={styles.infoTitle}>Start interview flows</div>
                  <div style={styles.infoText}>
                    Use structured or live interviews directly from matched jobs.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    background:
      "radial-gradient(circle at top left, rgba(122, 87, 255, 0.10), transparent 25%), linear-gradient(180deg, #f7f5fc 0%, #f2eefc 100%)",
    fontFamily:
      'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: "#1e1733",
  },

  sidebar: {
    width: "260px",
    minHeight: "100vh",
    background: "linear-gradient(180deg, #6a2cff 0%, #4f1ec8 50%, #34108e 100%)",
    color: "#fff",
    padding: "28px 20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    flexShrink: 0,
    boxShadow: "14px 0 40px rgba(90, 38, 214, 0.16)",
  },

  logoWrap: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  logo: {
    width: "54px",
    height: "54px",
    borderRadius: "18px",
    background: "rgba(255,255,255,0.96)",
    color: "#5f22d9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    fontWeight: "900",
  },

  brand: {
    margin: 0,
    fontSize: "28px",
    fontWeight: "900",
    letterSpacing: "-0.8px",
  },

  brandSub: {
    margin: "4px 0 0 0",
    fontSize: "13px",
    color: "rgba(255,255,255,0.76)",
  },

  sidebarBlock: {
    marginTop: "34px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  sidebarItemActive: {
    background: "#fff",
    color: "#4a16c4",
    padding: "15px 18px",
    borderRadius: "18px",
    fontWeight: "800",
    fontSize: "15px",
  },

  sidebarMini: {
    padding: "0 6px",
    fontSize: "13px",
    color: "rgba(255,255,255,0.74)",
  },

  sidebarBottomStack: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  sidebarCard: {
    background: "rgba(255,255,255,0.10)",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: "20px",
    padding: "16px",
    backdropFilter: "blur(10px)",
  },

  sidebarSvg: {
    width: "100%",
    maxWidth: "180px",
    height: "auto",
    display: "block",
    margin: "0 auto 12px auto",
  },

  sidebarCardTitle: {
    fontSize: "14px",
    fontWeight: "800",
    marginBottom: "6px",
  },

  sidebarCardText: {
    fontSize: "12px",
    lineHeight: 1.6,
    color: "rgba(255,255,255,0.75)",
  },

  profileMiniCard: {
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: "20px",
    padding: "16px",
    backdropFilter: "blur(10px)",
  },

  profileMiniTop: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "14px",
  },

  profileMiniAvatar: {
    width: "42px",
    height: "42px",
    borderRadius: "14px",
    background: "#ffffff",
    color: "#5f22d9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
    fontSize: "16px",
  },

  profileMiniName: {
    fontSize: "14px",
    fontWeight: "800",
    color: "#fff",
  },

  profileMiniRole: {
    fontSize: "12px",
    color: "rgba(255,255,255,0.72)",
    marginTop: "3px",
  },

  profileMiniStats: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  profileMiniStat: {
    display: "flex",
    flexDirection: "column",
    gap: "3px",
  },

  profileMiniStatLabel: {
    fontSize: "11px",
    color: "rgba(255,255,255,0.62)",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    fontWeight: "700",
  },

  profileMiniStatValue: {
    fontSize: "13px",
    color: "#fff",
    fontWeight: "700",
  },

  main: {
    flex: 1,
    minHeight: "100vh",
    padding: "28px 30px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  hero: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
  },

  heroBadge: {
    display: "inline-block",
    padding: "8px 12px",
    borderRadius: "999px",
    background: "#ece5ff",
    color: "#5f22d9",
    fontSize: "12px",
    fontWeight: "900",
    marginBottom: "14px",
  },

  heroTitle: {
    margin: 0,
    fontSize: "42px",
    fontWeight: "900",
    letterSpacing: "-1.4px",
    color: "#22163a",
  },

  heroText: {
    maxWidth: "760px",
    margin: "10px 0 0 0",
    fontSize: "15px",
    lineHeight: 1.7,
    color: "#756b8c",
  },

  heroStats: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },

  statCard: {
    background: "rgba(255,255,255,0.82)",
    border: "1px solid #e7defb",
    borderRadius: "18px",
    padding: "14px 16px",
    minWidth: "150px",
    boxShadow: "0 12px 28px rgba(90, 31, 216, 0.06)",
    backdropFilter: "blur(8px)",
  },

  statLabel: {
    display: "block",
    fontSize: "11px",
    fontWeight: "800",
    color: "#8a7dab",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "6px",
  },

  statValue: {
    fontSize: "14px",
    fontWeight: "800",
    color: "#2b2140",
  },

  panel: {
    position: "relative",
    overflow: "hidden",
    flex: 1,
    background: "rgba(255,255,255,0.78)",
    border: "1px solid rgba(230,220,255,0.95)",
    borderRadius: "28px",
    padding: "26px",
    boxShadow: "0 24px 60px rgba(83, 52, 181, 0.10)",
    backdropFilter: "blur(14px)",
  },

  panelGlow: {
    position: "absolute",
    top: "-80px",
    right: "-70px",
    width: "250px",
    height: "250px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(110,65,255,0.16), transparent 68%)",
    pointerEvents: "none",
  },

  panelTop: {
    position: "relative",
    zIndex: 2,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
    marginBottom: "22px",
  },

  panelTitle: {
    margin: 0,
    fontSize: "28px",
    fontWeight: "850",
    letterSpacing: "-0.8px",
    color: "#24163a",
  },

  panelText: {
    margin: "8px 0 0 0",
    fontSize: "14px",
    color: "#7b6f94",
    lineHeight: 1.6,
  },

  readyBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 14px",
    borderRadius: "999px",
    background: "#f2ecff",
    color: "#5f22d9",
    border: "1px solid #e2d7ff",
    fontSize: "13px",
    fontWeight: "800",
  },

  readyDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#6c30ff",
  },

  contentGrid: {
    position: "relative",
    zIndex: 2,
    display: "grid",
    gridTemplateColumns: "1.45fr 0.75fr",
    gap: "20px",
    alignItems: "stretch",
  },

  leftColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },

  rightColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    justifyContent: "space-between",
  },

  label: {
    display: "block",
    marginBottom: "10px",
    fontSize: "14px",
    fontWeight: "800",
    color: "#2a2140",
  },

  uploadShell: {
    border: "1.5px dashed #d9c9ff",
    borderRadius: "24px",
    background:
      "linear-gradient(180deg, rgba(246,241,255,0.92) 0%, rgba(252,250,255,0.98) 100%)",
  },

  uploadArea: {
    minHeight: "260px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "34px 20px",
    cursor: "pointer",
  },

  uploadOrb: {
    width: "74px",
    height: "74px",
    borderRadius: "24px",
    background: "linear-gradient(135deg, #6c30ff 0%, #8d62ff 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "18px",
    boxShadow: "0 20px 40px rgba(106, 50, 255, 0.24)",
  },

  uploadArrow: {
    color: "#fff",
    fontSize: "28px",
    fontWeight: "900",
    lineHeight: 1,
  },

  uploadTitle: {
    fontSize: "24px",
    fontWeight: "850",
    color: "#24163a",
    marginBottom: "8px",
    letterSpacing: "-0.5px",
  },

  uploadSubtext: {
    fontSize: "14px",
    color: "#7a6e91",
    marginBottom: "8px",
  },

  uploadHint: {
    fontSize: "12px",
    color: "#9c91b3",
    marginBottom: "22px",
  },

  uploadButton: {
    background: "linear-gradient(135deg, #6c30ff 0%, #551ed6 100%)",
    color: "#fff",
    padding: "13px 22px",
    borderRadius: "14px",
    fontWeight: "800",
    fontSize: "14px",
    boxShadow: "0 14px 30px rgba(93, 46, 220, 0.24)",
  },

  fileCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    padding: "18px 20px",
    background: "linear-gradient(180deg, #fbf9ff 0%, #f7f2ff 100%)",
    border: "1px solid #e6dbff",
    borderRadius: "20px",
    flexWrap: "wrap",
  },

  fileLeft: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },

  fileIcon: {
    width: "54px",
    height: "54px",
    borderRadius: "16px",
    background: "linear-gradient(135deg, #6c30ff 0%, #8d62ff 100%)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    fontWeight: "900",
    letterSpacing: "0.5px",
  },

  fileName: {
    fontSize: "15px",
    fontWeight: "800",
    color: "#24163a",
  },

  fileMeta: {
    marginTop: "4px",
    fontSize: "13px",
    color: "#7c7095",
  },

  removeButton: {
    background: "#fff",
    border: "1px solid #d9c9ff",
    color: "#5a1fd8",
    padding: "10px 16px",
    borderRadius: "12px",
    fontWeight: "800",
    cursor: "pointer",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
    alignItems: "end",
  },

  input: {
    width: "100%",
    height: "56px",
    padding: "0 18px",
    borderRadius: "16px",
    border: "1px solid #e4daf9",
    outline: "none",
    fontSize: "14px",
    color: "#1f1831",
    background: "#fff",
    boxSizing: "border-box",
    boxShadow: "0 8px 18px rgba(90,31,216,0.04)",
  },

  buttonWrap: {
    display: "flex",
    justifyContent: "center",
    marginTop: "4px",
    paddingTop: "4px",
  },

  primaryButton: {
    position: "relative",
    overflow: "hidden",
    border: "none",
    background: "linear-gradient(135deg, #6c30ff 0%, #551ed6 100%)",
    color: "#fff",
    padding: "16px 32px",
    borderRadius: "16px",
    fontSize: "15px",
    fontWeight: "900",
    cursor: "pointer",
    minWidth: "220px",
    boxShadow: "0 20px 36px rgba(93, 46, 220, 0.26)",
    letterSpacing: "0.2px",
  },

  buttonGlow: {
    position: "absolute",
    top: 0,
    left: "-35%",
    width: "32%",
    height: "100%",
    transform: "skewX(-24deg)",
    background: "rgba(255,255,255,0.18)",
    pointerEvents: "none",
  },

  primaryButtonDisabled: {
    opacity: 0.7,
    cursor: "not-allowed",
  },

  visualCard: {
    background: "linear-gradient(180deg, #ffffff 0%, #faf8ff 100%)",
    border: "1px solid #ece3ff",
    borderRadius: "24px",
    padding: "20px",
    textAlign: "center",
    boxShadow: "0 18px 40px rgba(94, 50, 200, 0.05)",
  },

  illustrationSvg: {
    width: "100%",
    maxWidth: "250px",
    height: "auto",
    display: "block",
    margin: "0 auto 14px auto",
  },

  visualTitle: {
    margin: "0 0 8px 0",
    fontSize: "18px",
    fontWeight: "800",
    color: "#24163a",
  },

  visualText: {
    margin: 0,
    fontSize: "14px",
    lineHeight: 1.6,
    color: "#7c7095",
  },

  infoCard: {
    background: "rgba(255,255,255,0.9)",
    border: "1px solid #ece3ff",
    borderRadius: "20px",
    padding: "18px",
    display: "flex",
    gap: "14px",
    alignItems: "flex-start",
    boxShadow: "0 14px 28px rgba(90, 31, 216, 0.05)",
  },

  infoNumber: {
    minWidth: "40px",
    height: "40px",
    borderRadius: "14px",
    background: "#efe7ff",
    color: "#5f22d9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
    fontSize: "13px",
  },

  infoTitle: {
    fontSize: "15px",
    fontWeight: "800",
    color: "#24163a",
    marginBottom: "4px",
  },

  infoText: {
    fontSize: "13px",
    color: "#7c7095",
    lineHeight: 1.6,
  },
};

if (
  typeof document !== "undefined" &&
  !document.getElementById("upload-svg-style")
) {
  const style = document.createElement("style");
  style.id = "upload-svg-style";
  style.innerHTML = `
    * {
      box-sizing: border-box;
    }

    html, body, #root {
      margin: 0;
      width: 100%;
      min-height: 100%;
    }

    body {
      overflow-x: hidden;
    }

    input::placeholder {
      color: #9b8fb3;
    }

    input:focus {
      border-color: #6a32ff !important;
      box-shadow: 0 0 0 4px rgba(106, 50, 255, 0.08) !important;
    }

    button {
      transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
    }

    button:hover {
      transform: translateY(-1px);
    }
  `;
  document.head.appendChild(style);
}