import { useState } from "react";
import SwipeCard from "./SwipeCard";

export default function SwipeDeck({ jobs, onSelect }) {
  const [index, setIndex] = useState(0);

  const handleSwipe = (direction, job) => {
    if (direction === "right") {
      onSelect(job); // go to interview
    }
    setIndex((prev) => prev + 1);
  };

  if (index >= jobs.length) {
    return <h2 style={{ textAlign: "center" }}>No more jobs 😭</h2>;
  }

  return (
    <div style={{
      height: "500px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      {jobs.slice(index).map((job, i) => (
        <SwipeCard
          key={i}
          job={job}
          onSwipe={handleSwipe}
        />
      ))}
    </div>
  );
}