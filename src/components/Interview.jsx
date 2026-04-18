import { useState } from "react";
import Editor from "@monaco-editor/react";

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL;

function InterviewHeroIllustration() {
  return (
    <svg
      viewBox="0 0 320 220"
      style={styles.illustrationSvg}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="160" cy="110" r="94" fill="#f4efff" />
      <rect
        x="74"
        y="58"
        width="172"
        height="112"
        rx="24"
        fill="#fff"
        stroke="#e6dbff"
      />
      <rect x="92" y="76" width="76" height="14" rx="7" fill="#ede4ff" />
      <rect x="92" y="98" width="116" height="12" rx="6" fill="#f4efff" />
      <rect x="92" y="116" width="96" height="12" rx="6" fill="#f4efff" />
      <circle cx="220" cy="92" r="22" fill="#6c30ff" />
      <path
        d="M212 92 L218 98 L230 86"
        fill="none"
        stroke="#fff"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="108"
        y="138"
        width="104"
        height="18"
        rx="9"
        fill="#8d62ff"
        opacity="0.2"
      />
    </svg>
  );
}

function SidebarInterviewIllustration() {
  return (
    <svg
      viewBox="0 0 240 170"
      style={styles.sidebarSvg}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="120" cy="85" r="70" fill="rgba(255,255,255,0.12)" />
      <rect
        x="42"
        y="46"
        width="156"
        height="82"
        rx="20"
        fill="rgba(255,255,255,0.92)"
      />
      <rect x="62" y="64" width="54" height="10" rx="5" fill="#e8dcff" />
      <rect x="62" y="82" width="88" height="8" rx="4" fill="#f1eaff" />
      <rect x="62" y="96" width="72" height="8" rx="4" fill="#f1eaff" />
      <circle cx="168" cy="82" r="18" fill="#6c30ff" />
      <path
        d="M162 82 L167 87 L176 76"
        fill="none"
        stroke="#fff"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CodingIllustration() {
  return (
    <svg
      viewBox="0 0 280 180"
      style={styles.sidePanelSvg}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="42"
        y="32"
        width="196"
        height="116"
        rx="20"
        fill="#fff"
        stroke="#e4d8ff"
      />
      <rect x="58" y="50" width="164" height="18" rx="9" fill="#f2ebff" />
      <path
        d="M82 96 L68 108 L82 120"
        fill="none"
        stroke="#6c30ff"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M112 90 L100 126"
        fill="none"
        stroke="#8d62ff"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M130 120 L144 108 L130 96"
        fill="none"
        stroke="#6c30ff"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="166" y="92" width="40" height="8" rx="4" fill="#ede4ff" />
      <rect x="166" y="108" width="28" height="8" rx="4" fill="#ede4ff" />
    </svg>
  );
}

function FinalReportIllustration() {
  return (
    <svg
      viewBox="0 0 280 180"
      style={styles.sidePanelSvg}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="140" cy="90" r="72" fill="#f4efff" />
      <rect
        x="78"
        y="44"
        width="124"
        height="92"
        rx="18"
        fill="#fff"
        stroke="#e4d8ff"
      />
      <rect x="96" y="62" width="52" height="10" rx="5" fill="#ede4ff" />
      <rect x="96" y="80" width="72" height="8" rx="4" fill="#f2ebff" />
      <rect x="96" y="94" width="62" height="8" rx="4" fill="#f2ebff" />
      <circle cx="176" cy="94" r="20" fill="#6c30ff" />
      <path
        d="M169 94 L175 100 L184 88"
        fill="none"
        stroke="#fff"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Interview({ selectedJob, onBack }) {
  const [stage, setStage] = useState("intro");
  const [loading, setLoading] = useState(false);

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [evaluation, setEvaluation] = useState(null);
  const [techScores, setTechScores] = useState([]);

  const [codingProblem, setCodingProblem] = useState(null);
  const [code, setCode] = useState(`def solve(s):
    # write your code here
    pass`);
  const [codeEval, setCodeEval] = useState(null);

  const [designQuestion, setDesignQuestion] = useState("");
  const [designAnswer, setDesignAnswer] = useState("");
  const [designEval, setDesignEval] = useState(null);

  const safeJobPayload = {
    title: selectedJob?.title || "",
    description: selectedJob?.description || "",
    matched_keywords: selectedJob?.matched_keywords || [],
  };

  const parseJsonResponse = async (res) => {
    const text = await res.text();

    let data = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      throw new Error("Backend did not return valid JSON");
    }

    if (!res.ok) {
      throw new Error(data.detail || "Request failed");
    }

    return data;
  };

  const speakText = (text) => {
    if (!window.speechSynthesis) {
      alert("Text to speech is not supported in this browser");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const startListening = (setter) => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setter((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      alert(`Voice input error: ${event.error}`);
    };

    recognition.start();
  };

  const getProgress = () => {
    if (stage === "intro") return 10;
    if (stage === "technical") return 35;
    if (stage === "codingIntro") return 55;
    if (stage === "coding") return 70;
    if (stage === "designIntro") return 82;
    if (stage === "design") return 92;
    if (stage === "completed") return 100;
    return 0;
  };

  const startInterview = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${BACKEND_URL}/start-interview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(safeJobPayload),
      });

      const data = await parseJsonResponse(res);
      setQuestions(data.questions || []);
      setCurrentIndex(0);
      setAnswer("");
      setEvaluation(null);
      setTechScores([]);
      setStage("technical");
    } catch (err) {
      console.error("startInterview error:", err);
      alert(err.message || "Failed to start interview");
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) {
      alert("Please type your answer first");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${BACKEND_URL}/evaluate-answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: questions[currentIndex],
          answer,
          ...safeJobPayload,
        }),
      });

      const data = await parseJsonResponse(res);
      setEvaluation(data);
      setTechScores((prev) => [...prev, Number(data.score) || 0]);
    } catch (err) {
      console.error("submitAnswer error:", err);
      alert(err.message || "Failed to evaluate answer");
    } finally {
      setLoading(false);
    }
  };

  const nextQuestion = () => {
    setAnswer("");
    setEvaluation(null);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setStage("codingIntro");
    }
  };

  const startCodingRound = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${BACKEND_URL}/coding-round`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(safeJobPayload),
      });

      const data = await parseJsonResponse(res);
      setCodingProblem(data);
      setCode(`def solve(s):
    # write your code here
    pass`);
      setCodeEval(null);
      setStage("coding");
    } catch (err) {
      console.error("startCodingRound error:", err);
      alert(err.message || "Failed to start coding round");
    } finally {
      setLoading(false);
    }
  };

  const submitCode = async () => {
    if (!code.trim()) {
      alert("Please write your code first");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${BACKEND_URL}/evaluate-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problem: codingProblem?.problem || "",
          code,
          ...safeJobPayload,
        }),
      });

      const data = await parseJsonResponse(res);
      setCodeEval(data);
      setStage("designIntro");
    } catch (err) {
      console.error("submitCode error:", err);
      alert(err.message || "Failed to evaluate code");
    } finally {
      setLoading(false);
    }
  };

  const startDesignRound = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${BACKEND_URL}/design-round`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(safeJobPayload),
      });

      const data = await parseJsonResponse(res);
      setDesignQuestion(data.question || "");
      setDesignAnswer("");
      setDesignEval(null);
      setStage("design");
    } catch (err) {
      console.error("startDesignRound error:", err);
      alert(err.message || "Failed to start design round");
    } finally {
      setLoading(false);
    }
  };

  const submitDesign = async () => {
    if (!designAnswer.trim()) {
      alert("Please type your design answer first");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${BACKEND_URL}/evaluate-design`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: designQuestion,
          answer: designAnswer,
          ...safeJobPayload,
        }),
      });

      const data = await parseJsonResponse(res);
      setDesignEval(data);
      setStage("completed");
    } catch (err) {
      console.error("submitDesign error:", err);
      alert(err.message || "Failed to evaluate design answer");
    } finally {
      setLoading(false);
    }
  };

  const calculateFinalScores = () => {
    const techAvg =
      techScores.length > 0
        ? techScores.reduce((sum, s) => sum + s, 0) / techScores.length
        : 0;

    const codingScore = Number(codeEval?.score) || 0;
    const designScore = Number(designEval?.score) || 0;

    const total = ((techAvg + codingScore + designScore) / 3).toFixed(1);

    let verdict = "Needs Improvement";
    let recommendation =
      "Focus on fundamentals, coding practice, and clearer structured answers.";

    if (Number(total) >= 8) {
      verdict = "Strong Candidate 🔥";
      recommendation =
        "You are performing well. You look ready for strong internship interviews.";
    } else if (Number(total) >= 6) {
      verdict = "Good Candidate";
      recommendation =
        "You have a solid base. Improve depth, edge cases, and design clarity.";
    }

    return {
      techAvg,
      codingScore,
      designScore,
      total,
      verdict,
      recommendation,
    };
  };

  const finalScores = calculateFinalScores();

  return (
    <div style={styles.page}>
      <aside style={styles.sidebar}>
        <div>
          <div style={styles.logoWrap}>
            <div style={styles.logo}>J</div>
            <div>
              <h1 style={styles.brand}>Jobie</h1>
              <p style={styles.brandSub}>Interview Studio</p>
            </div>
          </div>

          <div style={styles.sidebarBlock}>
            <div style={styles.sidebarItemActive}>Interview Flow</div>
            <div style={styles.sidebarMini}>Technical → Coding → Design</div>
          </div>
        </div>

        <div style={styles.sidebarBottomStack}>
          <div style={styles.sidebarCard}>
            <SidebarInterviewIllustration />
            <div style={styles.sidebarCardTitle}>Current Role</div>
            <div style={styles.sidebarCardText}>
              {selectedJob?.title || "Selected Job"}
            </div>
          </div>

          <div style={styles.sidebarCard}>
            <div style={styles.sidebarMetricLabel}>Company</div>
            <div style={styles.sidebarMetricValue}>
              {selectedJob?.company || "N/A"}
            </div>
            <div style={styles.sidebarMetricLabel}>Matched Skills</div>
            <div style={styles.sidebarMetricValueSmall}>
              {selectedJob?.matched_keywords?.length
                ? selectedJob.matched_keywords.join(", ")
                : "None"}
            </div>
          </div>
        </div>
      </aside>

      <main style={styles.main}>
        <div style={styles.topbar}>
          <button onClick={onBack} style={styles.backBtn}>
            ← Back to Jobs
          </button>

          <div style={styles.stagePill}>Progress {getProgress()}%</div>
        </div>

        <section style={styles.hero}>
          <div>
            <div style={styles.heroBadge}>AI Interview Workspace</div>
            <h2 style={styles.heroTitle}>{selectedJob?.title || "Interview"}</h2>
            <p style={styles.heroText}>
              Structured technical, coding, and design rounds in one workflow.
            </p>
          </div>
        </section>

        <section style={styles.progressCard}>
          <div style={styles.progressOuter}>
            <div
              style={{ ...styles.progressInner, width: `${getProgress()}%` }}
            />
          </div>

          <div style={styles.stageLabel}>
            <span>Technical</span>
            <span>Coding</span>
            <span>Design</span>
            <span>Final</span>
          </div>
        </section>

        {stage === "intro" && (
          <div style={styles.card}>
            <div style={styles.cardCenter}>
              <InterviewHeroIllustration />
              <h3 style={styles.cardTitle}>Start AI Interview</h3>
              <p style={styles.cardText}>
                AI will generate technical, coding, and design rounds based on
                the selected role and your matched skills.
              </p>

              <button onClick={startInterview} style={styles.primaryBtn}>
                {loading ? "Starting..." : "Start Interview"}
              </button>
            </div>
          </div>
        )}

        {stage === "technical" && questions.length > 0 && (
          <div style={styles.card}>
            <div style={styles.sectionHeader}>
              <div>
                <h3 style={styles.cardTitle}>Technical Round</h3>
                <p style={styles.sectionSub}>
                  Question {currentIndex + 1} of {questions.length}
                </p>
              </div>
            </div>

            <div style={styles.questionBox}>
              <p style={styles.question}>{questions[currentIndex]}</p>
            </div>

            <div style={styles.voiceRow}>
              <button
                onClick={() => speakText(questions[currentIndex])}
                style={styles.secondaryBtn}
              >
                Speak Question
              </button>
              <button
                onClick={() => startListening(setAnswer)}
                style={styles.secondaryBtn}
              >
                Voice Answer
              </button>
            </div>

            <textarea
              rows="7"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              style={styles.textarea}
              placeholder="Type your answer here..."
            />

            {!evaluation ? (
              <button onClick={submitAnswer} style={styles.primaryBtn}>
                {loading ? "Evaluating..." : "Submit Answer"}
              </button>
            ) : (
              <div style={styles.resultBox}>
                <p><b>Score:</b> {evaluation.score}/10</p>
                <p><b>Feedback:</b> {evaluation.feedback}</p>
                <p><b>Strengths:</b> {evaluation.strengths?.join(", ")}</p>
                <p><b>Weaknesses:</b> {evaluation.weaknesses?.join(", ")}</p>
                <p><b>Ideal Answer:</b> {evaluation.ideal_answer_summary}</p>

                <button onClick={nextQuestion} style={styles.primaryBtn}>
                  {currentIndex < questions.length - 1
                    ? "Next Question"
                    : "Go to Coding Round"}
                </button>
              </div>
            )}
          </div>
        )}

        {stage === "codingIntro" && (
          <div style={styles.cardWithAside}>
            <div style={styles.cardMain}>
              <h3 style={styles.cardTitle}>Coding Round</h3>
              <p style={styles.cardText}>
                Generate a coding problem tailored to this role and your skill match.
              </p>

              <button onClick={startCodingRound} style={styles.primaryBtn}>
                {loading ? "Generating..." : "Start Coding Round"}
              </button>
            </div>

            <aside style={styles.sideHelperCard}>
              <CodingIllustration />
              <h4 style={styles.sideHelperTitle}>Code Signal</h4>
              <p style={styles.sideHelperText}>
                Focus on clarity, correctness, and edge cases before optimizing.
              </p>
            </aside>
          </div>
        )}

        {stage === "coding" && codingProblem && (
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Coding Round</h3>

            <div style={styles.questionBox}>
              <p style={styles.question}>{codingProblem.problem}</p>
              {codingProblem.hints?.length > 0 && (
                <p style={styles.hintText}>
                  <b>Hints:</b> {codingProblem.hints.join(", ")}
                </p>
              )}
            </div>

            <div style={styles.editorWrap}>
              <Editor
                height="420px"
                defaultLanguage="python"
                value={code}
                onChange={(value) => setCode(value || "")}
                theme="vs-dark"
              />
            </div>

            <button onClick={submitCode} style={styles.primaryBtn}>
              {loading ? "Evaluating..." : "Submit Code"}
            </button>
          </div>
        )}

        {stage === "designIntro" && (
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Design Round</h3>
            <p style={styles.cardText}>
              Now answer one system or application design question for this role.
            </p>

            <button onClick={startDesignRound} style={styles.primaryBtn}>
              {loading ? "Generating..." : "Start Design Round"}
            </button>
          </div>
        )}

        {stage === "design" && designQuestion && (
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Design Round</h3>

            <div style={styles.questionBox}>
              <p style={styles.question}>{designQuestion}</p>
            </div>

            <div style={styles.voiceRow}>
              <button
                onClick={() => speakText(designQuestion)}
                style={styles.secondaryBtn}
              >
                Speak Question
              </button>
              <button
                onClick={() => startListening(setDesignAnswer)}
                style={styles.secondaryBtn}
              >
                Voice Answer
              </button>
            </div>

            <textarea
              rows="9"
              value={designAnswer}
              onChange={(e) => setDesignAnswer(e.target.value)}
              style={styles.textarea}
              placeholder="Explain your design here..."
            />

            <button onClick={submitDesign} style={styles.primaryBtn}>
              {loading ? "Evaluating..." : "Submit Design"}
            </button>
          </div>
        )}

        {stage === "completed" && (
          <div style={styles.cardWithAside}>
            <div style={styles.cardMain}>
              <h3 style={styles.cardTitle}>Final Report</h3>

              <div style={styles.scoreGrid}>
                <div style={styles.scoreItem}>
                  <h4 style={styles.scoreNumber}>{finalScores.techAvg.toFixed(1)}</h4>
                  <p style={styles.scoreText}>Technical Avg</p>
                </div>
                <div style={styles.scoreItem}>
                  <h4 style={styles.scoreNumber}>{finalScores.codingScore}</h4>
                  <p style={styles.scoreText}>Coding</p>
                </div>
                <div style={styles.scoreItem}>
                  <h4 style={styles.scoreNumber}>{finalScores.designScore}</h4>
                  <p style={styles.scoreText}>Design</p>
                </div>
                <div style={styles.scoreItem}>
                  <h4 style={styles.scoreNumber}>{finalScores.total}</h4>
                  <p style={styles.scoreText}>Final Score</p>
                </div>
              </div>

              <div style={styles.finalVerdictBox}>
                <h4 style={styles.finalVerdict}>{finalScores.verdict}</h4>
                <p style={styles.cardText}>{finalScores.recommendation}</p>
              </div>

              {codeEval && (
                <div style={styles.resultBox}>
                  <h4 style={styles.resultTitle}>Coding Feedback</h4>
                  <p><b>Feedback:</b> {codeEval.feedback}</p>
                  <p><b>Strengths:</b> {codeEval.strengths?.join(", ")}</p>
                  <p><b>Weaknesses:</b> {codeEval.weaknesses?.join(", ")}</p>
                  <p><b>Readability:</b> {codeEval.readability}</p>
                  <p><b>Correctness:</b> {codeEval.correctness}</p>
                  <p><b>Edge Cases:</b> {codeEval.edge_cases}</p>
                  <p><b>Better Solution:</b> {codeEval.improved_solution_summary}</p>

                  {codeEval.execution && (
                    <>
                      <p><b>Execution STDOUT:</b></p>
                      <pre style={styles.pre}>
                        {codeEval.execution.stdout || "No stdout"}
                      </pre>
                      <p><b>Execution STDERR:</b></p>
                      <pre style={styles.pre}>
                        {codeEval.execution.stderr || "No stderr"}
                      </pre>
                    </>
                  )}
                </div>
              )}

              {designEval && (
                <div style={styles.resultBox}>
                  <h4 style={styles.resultTitle}>Design Feedback</h4>
                  <p><b>Feedback:</b> {designEval.feedback}</p>
                  <p><b>Strengths:</b> {designEval.strengths?.join(", ")}</p>
                  <p><b>Weaknesses:</b> {designEval.weaknesses?.join(", ")}</p>
                  <p><b>Architecture:</b> {designEval.architecture}</p>
                  <p><b>Scalability:</b> {designEval.scalability}</p>
                  <p><b>Database Choice:</b> {designEval.database_choice}</p>
                  <p><b>Better Design:</b> {designEval.improved_solution_summary}</p>
                </div>
              )}

              <button onClick={onBack} style={styles.primaryBtn}>
                Back to Jobs
              </button>
            </div>

            <aside style={styles.sideHelperCard}>
              <FinalReportIllustration />
              <h4 style={styles.sideHelperTitle}>Result Snapshot</h4>
              <p style={styles.sideHelperText}>
                Use the feedback to improve fundamentals, structure, and depth for the next round.
              </p>
            </aside>
          </div>
        )}
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
    fontSize: "14px",
    color: "#fff",
    fontWeight: "800",
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

  stagePill: {
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

  progressCard: {
    background: "#fff",
    border: "1px solid #e9e0fb",
    borderRadius: "20px",
    padding: "18px 20px",
    boxShadow: "0 12px 30px rgba(83, 52, 181, 0.06)",
  },

  progressOuter: {
    width: "100%",
    height: "12px",
    background: "#eee8ff",
    borderRadius: "999px",
    overflow: "hidden",
  },

  progressInner: {
    height: "100%",
    background: "linear-gradient(90deg, #6c30ff 0%, #8d62ff 100%)",
    transition: "width 0.3s ease",
  },

  stageLabel: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "13px",
    color: "#6f6488",
    marginTop: "10px",
    gap: "10px",
    flexWrap: "wrap",
    fontWeight: "700",
  },

  card: {
    background: "linear-gradient(180deg, #ffffff 0%, #faf8ff 100%)",
    border: "1px solid #e9e0fb",
    borderRadius: "24px",
    padding: "24px",
    boxShadow: "0 18px 40px rgba(83, 52, 181, 0.08)",
  },

  cardWithAside: {
    display: "grid",
    gridTemplateColumns: "1fr 290px",
    gap: "18px",
    alignItems: "start",
  },

  cardMain: {
    background: "linear-gradient(180deg, #ffffff 0%, #faf8ff 100%)",
    border: "1px solid #e9e0fb",
    borderRadius: "24px",
    padding: "24px",
    boxShadow: "0 18px 40px rgba(83, 52, 181, 0.08)",
  },

  sideHelperCard: {
    background: "linear-gradient(180deg, #ffffff 0%, #faf8ff 100%)",
    border: "1px solid #e9e0fb",
    borderRadius: "24px",
    padding: "18px",
    boxShadow: "0 18px 40px rgba(83, 52, 181, 0.08)",
    position: "sticky",
    top: "20px",
    textAlign: "center",
  },

  sidePanelSvg: {
    width: "100%",
    maxWidth: "220px",
    height: "auto",
    display: "block",
    margin: "0 auto 14px auto",
  },

  sideHelperTitle: {
    margin: "0 0 8px 0",
    fontSize: "18px",
    fontWeight: "850",
    color: "#24163a",
  },

  sideHelperText: {
    margin: 0,
    fontSize: "14px",
    lineHeight: 1.6,
    color: "#756b8c",
  },

  cardCenter: {
    textAlign: "center",
    padding: "8px 0",
  },

  illustrationSvg: {
    width: "100%",
    maxWidth: "230px",
    height: "auto",
    display: "block",
    margin: "0 auto 18px auto",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "14px",
    marginBottom: "12px",
    flexWrap: "wrap",
  },

  cardTitle: {
    margin: 0,
    fontSize: "24px",
    fontWeight: "850",
    color: "#24163a",
  },

  sectionSub: {
    margin: "6px 0 0 0",
    fontSize: "13px",
    color: "#7c7095",
    fontWeight: "700",
  },

  cardText: {
    margin: "8px 0 0 0",
    color: "#756b8c",
    lineHeight: 1.7,
    fontSize: "14px",
  },

  questionBox: {
    background: "#f7f3ff",
    border: "1px solid #e3d8ff",
    borderRadius: "18px",
    padding: "18px",
    marginBottom: "16px",
  },

  question: {
    fontSize: "17px",
    lineHeight: 1.7,
    margin: 0,
    color: "#2a2140",
    fontWeight: "600",
  },

  hintText: {
    marginTop: "12px",
    marginBottom: 0,
    color: "#6f6488",
    fontSize: "14px",
  },

  voiceRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: "14px",
  },

  primaryBtn: {
    marginTop: "14px",
    padding: "12px 18px",
    border: "none",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #6c30ff 0%, #551ed6 100%)",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "800",
    boxShadow: "0 14px 30px rgba(93, 46, 220, 0.18)",
  },

  secondaryBtn: {
    padding: "10px 14px",
    border: "1px solid #ddd0ff",
    borderRadius: "12px",
    background: "#fff",
    color: "#5a1fd8",
    cursor: "pointer",
    fontWeight: "700",
  },

  textarea: {
    width: "100%",
    marginTop: "4px",
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
  },

  editorWrap: {
    overflow: "hidden",
    borderRadius: "18px",
    border: "1px solid #ddd4f7",
    marginTop: "10px",
  },

  resultBox: {
    marginTop: "18px",
    background: "#f3efff",
    border: "1px solid #ddd0ff",
    borderRadius: "16px",
    padding: "18px",
    color: "#2a2140",
    lineHeight: 1.7,
  },

  resultTitle: {
    marginTop: 0,
    marginBottom: "10px",
    fontSize: "18px",
    color: "#24163a",
  },

  scoreGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: "14px",
    marginBottom: "20px",
    marginTop: "18px",
  },

  scoreItem: {
    background: "#f7f3ff",
    borderRadius: "18px",
    padding: "18px",
    textAlign: "center",
    border: "1px solid #e3d8ff",
  },

  scoreNumber: {
    margin: 0,
    fontSize: "26px",
    color: "#5a1fd8",
    fontWeight: "900",
  },

  scoreText: {
    margin: "8px 0 0 0",
    color: "#756b8c",
    fontWeight: "700",
    fontSize: "13px",
  },

  finalVerdictBox: {
    background: "#fff",
    border: "1px solid #e5dcff",
    borderRadius: "18px",
    padding: "18px",
    marginBottom: "18px",
  },

  finalVerdict: {
    margin: 0,
    fontSize: "20px",
    color: "#24163a",
  },

  pre: {
    background: "#111827",
    color: "#f9fafb",
    padding: "14px",
    borderRadius: "12px",
    overflowX: "auto",
    fontSize: "13px",
    lineHeight: 1.5,
  },
};

if (
  typeof document !== "undefined" &&
  !document.getElementById("interview-svg-style")
) {
  const style = document.createElement("style");
  style.id = "interview-svg-style";
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