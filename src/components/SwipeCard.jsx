import { motion, useMotionValue, useTransform } from "framer-motion";

export default function SwipeCard({ job, onSwipe }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-12, 12]);

  const likeOpacity = useTransform(x, [50, 150], [0, 1]);
  const nopeOpacity = useTransform(x, [-150, -50], [1, 0]);

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      style={{
        x,
        rotate,
        position: "absolute",
        width: "100%",
        maxWidth: "350px",
        margin: "auto",
        left: 0,
        right: 0,
      }}
      onDragEnd={(e, info) => {
        if (info.offset.x > 120) {
          onSwipe("right", job);
        } else if (info.offset.x < -120) {
          onSwipe("left", job);
        }
      }}
    >
      <div style={{
        background: "#181818",
        padding: 20,
        borderRadius: 20,
        height: 420,
        boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
        border: "1px solid #2a2a2a",
        position: "relative",
      }}>

        {/* LIKE */}
        <motion.div style={{
          position: "absolute",
          top: 20,
          left: 20,
          color: "#00ff88",
          fontSize: 24,
          opacity: likeOpacity
        }}>
          💚 HIRE ME
        </motion.div>

        {/* NOPE */}
        <motion.div style={{
          position: "absolute",
          top: 20,
          right: 20,
          color: "#ff4d4d",
          fontSize: 24,
          opacity: nopeOpacity
        }}>
          ❌ NAH
        </motion.div>

        <h2>{job.title}</h2>
        <p style={{ opacity: 0.6 }}>{job.company}</p>

        <p style={{ marginTop: 10 }}>
          📍 {job.location}
        </p>

        <p style={{
          marginTop: 15,
          fontSize: 14,
          opacity: 0.7,
          height: 100,
          overflow: "hidden"
        }}>
          {job.description?.slice(0, 150)}...
        </p>

        <p style={{ marginTop: 10 }}>
          ⭐ Match: {job.score}
        </p>

        <div style={{
          marginTop: 20,
          fontSize: 13,
          opacity: 0.6
        }}>
          Skills: {job.matched_keywords?.join(", ")}
        </div>

        <div style={{
          position: "absolute",
          bottom: 20,
          left: 20,
          right: 20
        }}>
          <a href={job.redirect_url} target="_blank">
            <button style={{
              width: "100%",
              padding: 10,
              borderRadius: 10,
              border: "none",
              background: "#2563eb",
              color: "white"
            }}>
              Apply 🚀
            </button>
          </a>
        </div>
      </div>
    </motion.div>
  );
}