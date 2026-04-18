import { useEffect, useMemo, useRef, useState } from "react";

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL;

function LiveHeroIllustration() {
  return (
    <svg
      viewBox="0 0 320 220"
      style={styles.illustrationSvg}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="160" cy="110" r="92" fill="#f4efff" />
      <rect
        x="78"
        y="74"
        width="86"
        height="52"
        rx="18"
        fill="#fff"
        stroke="#e6dbff"
      />
      <rect
        x="156"
        y="116"
        width="88"
        height="52"
        rx="18"
        fill="#6c30ff"
      />
      <rect
        x="144"
        y="52"
        width="32"
        height="50"
        rx="16"
        fill="#8d62ff"
      />
      <rect x="150" y="100" width="20" height="12" rx="6" fill="#6c30ff" />
      <circle cx="100" cy="100" r="5" fill="#8d62ff" />
      <circle cx="116" cy="100" r="5" fill="#8d62ff" />
      <circle cx="132" cy="100" r="5" fill="#8d62ff" />
      <circle cx="184" cy="142" r="5" fill="#fff" />
      <circle cx="200" cy="142" r="5" fill="#fff" />
      <circle cx="216" cy="142" r="5" fill="#fff" />
    </svg>
  );
}

function SidebarLiveIllustration() {
  return (
    <svg
      viewBox="0 0 240 170"
      style={styles.sidebarSvg}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="120" cy="84" r="68" fill="rgba(255,255,255,0.12)" />
      <rect
        x="42"
        y="48"
        width="66"
        height="42"
        rx="16"
        fill="rgba(255,255,255,0.96)"
      />
      <rect
        x="126"
        y="82"
        width="74"
        height="44"
        rx="16"
        fill="rgba(255,255,255,0.26)"
      />
      <rect x="106" y="34" width="28" height="42" rx="14" fill="#ffffff" />
      <rect x="111" y="74" width="18" height="8" rx="4" fill="#e8dcff" />
    </svg>
  );
}

function EmptyChatIllustration() {
  return (
    <svg
      viewBox="0 0 300 210"
      style={styles.sidePanelSvg}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="150" cy="105" r="88" fill="#f4efff" />
      <rect
        x="64"
        y="74"
        width="84"
        height="46"
        rx="16"
        fill="#fff"
        stroke="#e4d8ff"
      />
      <rect
        x="146"
        y="112"
        width="92"
        height="50"
        rx="18"
        fill="#6c30ff"
      />
      <circle cx="88" cy="97" r="5" fill="#8d62ff" />
      <circle cx="102" cy="97" r="5" fill="#8d62ff" />
      <circle cx="116" cy="97" r="5" fill="#8d62ff" />
      <circle cx="176" cy="137" r="5" fill="#fff" />
      <circle cx="192" cy="137" r="5" fill="#fff" />
      <circle cx="208" cy="137" r="5" fill="#fff" />
    </svg>
  );
}

function FeedbackIllustration() {
  return (
    <svg
      viewBox="0 0 280 180"
      style={styles.sidePanelSvg}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="140" cy="90" r="72" fill="#f4efff" />
      <rect
        x="72"
        y="46"
        width="136"
        height="88"
        rx="18"
        fill="#fff"
        stroke="#e4d8ff"
      />
      <rect x="92" y="64" width="52" height="10" rx="5" fill="#ede4ff" />
      <rect x="92" y="84" width="84" height="8" rx="4" fill="#f2ebff" />
      <rect x="92" y="98" width="72" height="8" rx="4" fill="#f2ebff" />
      <circle cx="176" cy="90" r="18" fill="#6c30ff" />
      <path
        d="M170 90 L175 95 L184 84"
        fill="none"
        stroke="#fff"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function LiveInterview({ selectedJob, onBack }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [turnScores, setTurnScores] = useState([]);
  const [lastFeedback, setLastFeedback] = useState(null);
  const [finalReport, setFinalReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  const chatRef = useRef(null);

  const safeJobPayload = useMemo(
    () => ({
      title: selectedJob?.title || "",
      description: selectedJob?.description || "",
      matched_keywords: selectedJob?.matched_keywords || [],
    }),
    [selectedJob]
  );

  const parseJsonResponse = async (res) => {
    const text = await res.text();
    let data = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      throw new Error("Invalid JSON from backend");
    }
    if (!res.ok) throw new Error(data.detail || "Request failed");
    return data;
  };

  const playVoice = async (text) => {
    try {
      const res = await fetch(`${BACKEND_URL}/text-to-speech`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.play();
    } catch (err) {
      console.error("TTS error:", err);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const recorder = new MediaRecorder(stream);
      let chunks = [];

      recorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: "audio/webm" });

        const formData = new FormData();
        formData.append("audio", blob, "voice.webm");

        try {
          setLoading(true);
          const res = await fetch(`${BACKEND_URL}/speech-to-text`, {
            method: "POST",
            body: formData,
          });

          const data = await res.json();
          setInput(data.text || "");
        } catch (err) {
          console.error(err);
          alert("Failed to convert speech to text");
        } finally {
          setLoading(false);
        }
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err) {
      console.error(err);
      alert("Mic permission denied");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const startSession = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${BACKEND_URL}/live-interview/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(safeJobPayload),
      });

      const data = await parseJsonResponse(res);

      const aiMsg = { role: "assistant", content: data.reply };

      setMessages([aiMsg]);
      setLastFeedback({
        score: data.score,
        feedback: data.feedback,
      });

      playVoice(data.reply);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    startSession();
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const sendAnswer = async () => {
    if (!input.trim()) {
      alert("Enter answer");
      return;
    }

    try {
      setLoading(true);

      const userMsg = { role: "user", content: input };
      const updated = [...messages, userMsg];

      setMessages(updated);
      setInput("");

      const res = await fetch(`${BACKEND_URL}/live-interview/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...safeJobPayload,
          history: updated,
          answer: userMsg.content,
        }),
      });

      const data = await parseJsonResponse(res);

      const aiMsg = { role: "assistant", content: data.reply };

      setMessages((prev) => [...prev, aiMsg]);
      setTurnScores((prev) => [...prev, data.score || 0]);
      setLastFeedback(data);

      playVoice(data.reply);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const endSession = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${BACKEND_URL}/live-interview/end`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...safeJobPayload,
          history: messages,
        }),
      });

      const data = await parseJsonResponse(res);
      setFinalReport(data);
    } catch (err) {
      alert(err.message || "Failed to end interview");
    } finally {
      setLoading(false);
    }
  };

  const avgScore = turnScores.length
    ? (turnScores.reduce((a, b) => a + b, 0) / turnScores.length).toFixed(1)
    : "0";

  return (
    <div style={styles.page}>
      <aside style={styles.sidebar}>
        <div>
          <div style={styles.logoWrap}>
            <div style={styles.logo}>J</div>
            <div>
              <h1 style={styles.brand}>Jobie</h1>
              <p style={styles.brandSub}>Live Interview</p>
            </div>
          </div>

          <div style={styles.sidebarBlock}>
            <div style={styles.sidebarItemActive}>Voice Session</div>
            <div style={styles.sidebarMini}>Real-time AI conversation</div>
          </div>
        </div>

        <div style={styles.sidebarBottomStack}>
          <div style={styles.sidebarCard}>
            <SidebarLiveIllustration />
            <div style={styles.sidebarCardTitle}>Role</div>
            <div style={styles.sidebarCardText}>
              {selectedJob?.title || "Selected Job"}
            </div>
          </div>

          <div style={styles.sidebarCard}>
            <div style={styles.sidebarMetricLabel}>Average Score</div>
            <div style={styles.sidebarMetricValue}>{avgScore}</div>
            <div style={styles.sidebarMetricLabel}>Mode</div>
            <div style={styles.sidebarMetricValueSmall}>
              {isRecording ? "Voice Recording Active" : "Ready for Response"}
            </div>
          </div>
        </div>
      </aside>

      <main style={styles.main}>
        <div style={styles.topbar}>
          <button onClick={onBack} style={styles.backBtn}>
            ← Back to Jobs
          </button>

          <div style={styles.topStats}>
            <div style={styles.statPill}>Avg Score: {avgScore}</div>
            <div style={styles.statPill}>
              {isRecording ? "Recording..." : "Ready"}
            </div>
          </div>
        </div>

        <section style={styles.hero}>
          <div style={styles.heroContent}>
            <div>
              <div style={styles.heroBadge}>Live AI Interview</div>
              <h2 style={styles.heroTitle}>
                {selectedJob?.title || "Live Round"}
              </h2>
              <p style={styles.heroText}>
                Speak or type your answers and continue the interview in real time.
              </p>
            </div>

            <LiveHeroIllustration />
          </div>
        </section>

        <div style={styles.grid}>
          <section style={styles.chatCard}>
            <div style={styles.chatHeader}>
              <div>
                <h3 style={styles.cardTitle}>Conversation</h3>
                <p style={styles.cardSub}>
                  AI asks, you answer, feedback updates live.
                </p>
              </div>

              <button
                style={styles.repeatBtn}
                onClick={() =>
                  messages.length &&
                  playVoice(messages[messages.length - 1].content)
                }
              >
                Repeat Last
              </button>
            </div>

            <div ref={chatRef} style={styles.chatWindow}>
              {messages.length === 0 ? (
                <div style={styles.emptyStateWrap}>
                  <EmptyChatIllustration />
                  <p style={styles.emptyStateText}>
                    Starting your live AI interview...
                  </p>
                </div>
              ) : (
                messages.map((m, i) => (
                  <div
                    key={i}
                    style={{
                      ...styles.messageRow,
                      justifyContent:
                        m.role === "user" ? "flex-end" : "flex-start",
                    }}
                  >
                    <div
                      style={
                        m.role === "user" ? styles.userBubble : styles.aiBubble
                      }
                    >
                      <div style={styles.messageRole}>
                        {m.role === "user" ? "You" : "AI Interviewer"}
                      </div>
                      <div style={styles.messageText}>{m.content}</div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {!finalReport && (
              <>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  rows={5}
                  style={styles.textarea}
                  placeholder="Type your answer here or use voice recording..."
                />

                <div style={styles.controls}>
                  {!isRecording ? (
                    <button onClick={startRecording} style={styles.secondaryBtn}>
                      Start Recording
                    </button>
                  ) : (
                    <button onClick={stopRecording} style={styles.recordingBtn}>
                      Stop Recording
                    </button>
                  )}

                  <button onClick={sendAnswer} style={styles.primaryBtn}>
                    {loading ? "Sending..." : "Send Answer"}
                  </button>

                  <button onClick={endSession} style={styles.outlineBtn}>
                    End Interview
                  </button>
                </div>
              </>
            )}
          </section>

          <aside style={styles.sidePanel}>
            {!finalReport ? (
              <>
                <div style={styles.feedbackCard}>
                  <FeedbackIllustration />
                  <h3 style={styles.sideTitle}>Latest Feedback</h3>

                  {lastFeedback ? (
                    <>
                      <div style={styles.scoreBadge}>
                        Score: {lastFeedback.score ?? "N/A"}
                      </div>
                      <p style={styles.feedbackText}>
                        {lastFeedback.feedback || "No feedback yet."}
                      </p>
                    </>
                  ) : (
                    <p style={styles.mutedText}>Waiting for feedback...</p>
                  )}
                </div>

                <div style={styles.feedbackCard}>
                  <h3 style={styles.sideTitle}>Session Tips</h3>
                  <ul style={styles.tipList}>
                    <li>Keep answers structured and concise.</li>
                    <li>Explain reasoning, not just the conclusion.</li>
                    <li>Use voice for natural mock interview flow.</li>
                  </ul>
                </div>
              </>
            ) : (
              <div style={styles.feedbackCard}>
                <FinalReportVisual />
                <h3 style={styles.sideTitle}>Final Report</h3>

                <div style={styles.finalScoreBox}>
                  <div style={styles.finalScoreNumber}>
                    {finalReport.overall_score || "N/A"}
                  </div>
                  <div style={styles.finalScoreLabel}>Overall Score</div>
                </div>

                <p style={styles.finalVerdict}>
                  {finalReport.verdict || "No verdict"}
                </p>
                <p style={styles.feedbackText}>
                  {finalReport.summary || "No summary available."}
                </p>

                <button onClick={onBack} style={styles.primaryBtnFull}>
                  Back to Jobs
                </button>
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}

function FinalReportVisual() {
  return (
    <svg
      viewBox="0 0 280 180"
      style={styles.sidePanelSvg}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="140" cy="90" r="72" fill="#f4efff" />
      <rect
        x="72"
        y="46"
        width="136"
        height="88"
        rx="18"
        fill="#fff"
        stroke="#e4d8ff"
      />
      <rect x="92" y="64" width="52" height="10" rx="5" fill="#ede4ff" />
      <rect x="92" y="84" width="84" height="8" rx="4" fill="#f2ebff" />
      <rect x="92" y="98" width="72" height="8" rx="4" fill="#f2ebff" />
      <circle cx="176" cy="90" r="18" fill="#6c30ff" />
      <path
        d="M170 90 L175 95 L184 84"
        fill="none"
        stroke="#fff"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
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
    maxWidth: "170px",
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

  sidebarMetricLabel: {
    fontSize: "11px",
    color: "rgba(255,255,255,0.62)",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    fontWeight: "700",
    marginBottom: "4px",
  },

  sidebarMetricValue: {
    fontSize: "22px",
    color: "#fff",
    fontWeight: "900",
    marginBottom: "10px",
  },

  sidebarMetricValueSmall: {
    fontSize: "12px",
    color: "rgba(255,255,255,0.82)",
    lineHeight: 1.6,
    fontWeight: "700",
  },

  main: {
    flex: 1,
    minHeight: "100vh",
    padding: "28px 30px",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },

  topbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "14px",
    flexWrap: "wrap",
  },

  backBtn: {
    padding: "12px 16px",
    border: "1px solid #ded2ff",
    borderRadius: "14px",
    background: "#fff",
    color: "#4a16c4",
    cursor: "pointer",
    fontWeight: "800",
    boxShadow: "0 8px 24px rgba(90, 31, 216, 0.06)",
  },

  topStats: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },

  statPill: {
    padding: "10px 14px",
    borderRadius: "999px",
    background: "#efe7ff",
    color: "#5f22d9",
    fontWeight: "800",
    fontSize: "13px",
  },

  hero: {
    background: "rgba(255,255,255,0.72)",
    border: "1px solid #e7defb",
    borderRadius: "26px",
    padding: "24px",
    boxShadow: "0 18px 40px rgba(90, 31, 216, 0.06)",
    backdropFilter: "blur(10px)",
  },

  heroContent: {
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
    marginBottom: "12px",
  },

  heroTitle: {
    margin: 0,
    fontSize: "38px",
    fontWeight: "900",
    letterSpacing: "-1px",
    color: "#22163a",
  },

  heroText: {
    margin: "8px 0 0 0",
    fontSize: "14px",
    color: "#756b8c",
    lineHeight: 1.7,
  },

  illustrationSvg: {
    width: "100%",
    maxWidth: "220px",
    height: "auto",
    display: "block",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1.4fr 0.8fr",
    gap: "20px",
    alignItems: "start",
  },

  chatCard: {
    background: "linear-gradient(180deg, #ffffff 0%, #faf8ff 100%)",
    border: "1px solid #e9e0fb",
    borderRadius: "24px",
    padding: "22px",
    boxShadow: "0 18px 40px rgba(83, 52, 181, 0.08)",
  },

  chatHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "14px",
    flexWrap: "wrap",
    marginBottom: "16px",
  },

  cardTitle: {
    margin: 0,
    fontSize: "24px",
    fontWeight: "850",
    color: "#24163a",
  },

  cardSub: {
    margin: "6px 0 0 0",
    fontSize: "13px",
    color: "#7c7095",
    fontWeight: "700",
  },

  repeatBtn: {
    padding: "10px 14px",
    border: "1px solid #ddd0ff",
    borderRadius: "12px",
    background: "#fff",
    color: "#5a1fd8",
    cursor: "pointer",
    fontWeight: "700",
  },

  chatWindow: {
    height: "420px",
    overflowY: "auto",
    border: "1px solid #e3d8ff",
    borderRadius: "18px",
    padding: "16px",
    background: "#f8f5ff",
    marginBottom: "16px",
  },

  emptyStateWrap: {
    textAlign: "center",
    padding: "28px 10px",
  },

  emptyStateText: {
    color: "#8b80a4",
    fontSize: "14px",
    marginTop: "12px",
  },

  sidePanelSvg: {
    width: "100%",
    maxWidth: "210px",
    height: "auto",
    display: "block",
    margin: "0 auto 14px auto",
  },

  messageRow: {
    display: "flex",
    marginBottom: "12px",
  },

  aiBubble: {
    maxWidth: "78%",
    background: "#ffffff",
    border: "1px solid #ddd0ff",
    borderRadius: "18px 18px 18px 6px",
    padding: "14px",
    boxShadow: "0 8px 20px rgba(90, 31, 216, 0.05)",
  },

  userBubble: {
    maxWidth: "78%",
    background: "linear-gradient(135deg, #6c30ff 0%, #551ed6 100%)",
    color: "#fff",
    borderRadius: "18px 18px 6px 18px",
    padding: "14px",
    boxShadow: "0 12px 28px rgba(93, 46, 220, 0.16)",
  },

  messageRole: {
    fontSize: "11px",
    fontWeight: "800",
    marginBottom: "6px",
    opacity: 0.8,
    textTransform: "uppercase",
    letterSpacing: "0.4px",
  },

  messageText: {
    fontSize: "14px",
    lineHeight: 1.7,
    whiteSpace: "pre-wrap",
  },

  textarea: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "16px",
    border: "1px solid #ddd4f7",
    resize: "vertical",
    fontFamily: "Inter, sans-serif",
    fontSize: "14px",
    lineHeight: 1.6,
    boxSizing: "border-box",
    outline: "none",
    background: "#fff",
    marginBottom: "14px",
  },

  controls: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },

  primaryBtn: {
    padding: "12px 18px",
    border: "none",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #6c30ff 0%, #551ed6 100%)",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "800",
    boxShadow: "0 14px 30px rgba(93, 46, 220, 0.18)",
  },

  primaryBtnFull: {
    width: "100%",
    padding: "12px 18px",
    border: "none",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #6c30ff 0%, #551ed6 100%)",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "800",
    boxShadow: "0 14px 30px rgba(93, 46, 220, 0.18)",
    marginTop: "10px",
  },

  secondaryBtn: {
    padding: "12px 16px",
    border: "1px solid #ddd0ff",
    borderRadius: "12px",
    background: "#fff",
    color: "#5a1fd8",
    cursor: "pointer",
    fontWeight: "700",
  },

  recordingBtn: {
    padding: "12px 16px",
    border: "none",
    borderRadius: "12px",
    background: "#dc2626",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "800",
  },

  outlineBtn: {
    padding: "12px 16px",
    border: "1px solid #ddd0ff",
    borderRadius: "12px",
    background: "#f7f3ff",
    color: "#5a1fd8",
    cursor: "pointer",
    fontWeight: "800",
  },

  sidePanel: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  feedbackCard: {
    background: "linear-gradient(180deg, #ffffff 0%, #faf8ff 100%)",
    border: "1px solid #e9e0fb",
    borderRadius: "24px",
    padding: "20px",
    boxShadow: "0 18px 40px rgba(83, 52, 181, 0.08)",
    textAlign: "center",
  },

  sideTitle: {
    margin: "0 0 14px 0",
    fontSize: "20px",
    fontWeight: "850",
    color: "#24163a",
  },

  scoreBadge: {
    display: "inline-block",
    padding: "10px 14px",
    borderRadius: "999px",
    background: "#efe7ff",
    color: "#5f22d9",
    fontWeight: "900",
    fontSize: "13px",
    marginBottom: "12px",
  },

  feedbackText: {
    margin: 0,
    color: "#756b8c",
    lineHeight: 1.7,
    fontSize: "14px",
    textAlign: "left",
  },

  mutedText: {
    color: "#8b80a4",
    fontSize: "14px",
    margin: 0,
  },

  tipList: {
    margin: 0,
    paddingLeft: "18px",
    color: "#756b8c",
    lineHeight: 1.8,
    fontSize: "14px",
    textAlign: "left",
  },

  finalScoreBox: {
    background: "#f7f3ff",
    border: "1px solid #e3d8ff",
    borderRadius: "18px",
    padding: "18px",
    textAlign: "center",
    marginBottom: "14px",
  },

  finalScoreNumber: {
    fontSize: "34px",
    fontWeight: "900",
    color: "#5a1fd8",
    lineHeight: 1,
  },

  finalScoreLabel: {
    marginTop: "8px",
    fontSize: "13px",
    fontWeight: "700",
    color: "#756b8c",
  },

  finalVerdict: {
    fontSize: "18px",
    fontWeight: "850",
    color: "#24163a",
    margin: "0 0 10px 0",
  },
};

if (
  typeof document !== "undefined" &&
  !document.getElementById("live-interview-svg-style")
) {
  const style = document.createElement("style");
  style.id = "live-interview-svg-style";
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

    textarea:focus {
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