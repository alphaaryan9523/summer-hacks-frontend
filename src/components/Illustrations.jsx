export function UploadIllustration() {
    return (
      <svg viewBox="0 0 320 240" style={styles.svg}>
        <circle cx="160" cy="120" r="100" fill="#f3efff" />
  
        <rect x="90" y="70" width="140" height="100" rx="20" fill="#fff" stroke="#e4d8ff"/>
  
        <rect x="110" y="90" width="80" height="10" rx="6" fill="#ede4ff"/>
        <rect x="110" y="110" width="100" height="10" rx="6" fill="#ede4ff"/>
  
        <circle cx="160" cy="150" r="22" fill="#6c30ff"/>
        <path d="M160 138 L160 160 M150 150 L160 138 L170 150" stroke="#fff" strokeWidth="3" fill="none"/>
      </svg>
    );
  }
  
  export function InterviewIllustration() {
    return (
      <svg viewBox="0 0 320 240" style={styles.svg}>
        <circle cx="160" cy="120" r="100" fill="#f3efff" />
  
        {/* Person */}
        <circle cx="130" cy="100" r="14" fill="#6c30ff"/>
        <rect x="120" y="115" width="20" height="40" rx="8" fill="#8d62ff"/>
  
        {/* AI */}
        <rect x="180" y="90" width="60" height="40" rx="10" fill="#fff" stroke="#e4d8ff"/>
        <circle cx="200" cy="110" r="4" fill="#6c30ff"/>
        <circle cx="215" cy="110" r="4" fill="#6c30ff"/>
  
        {/* Chat bubble */}
        <rect x="140" y="150" width="80" height="30" rx="10" fill="#ede4ff"/>
      </svg>
    );
  }
  
  export function LiveIllustration() {
    return (
      <svg viewBox="0 0 320 240" style={styles.svg}>
        <circle cx="160" cy="120" r="100" fill="#f3efff" />
  
        {/* Chat bubbles */}
        <rect x="90" y="100" width="80" height="40" rx="12" fill="#fff" stroke="#e4d8ff"/>
        <rect x="150" y="130" width="80" height="40" rx="12" fill="#6c30ff"/>
  
        {/* Mic */}
        <rect x="145" y="70" width="30" height="40" rx="10" fill="#8d62ff"/>
        <rect x="150" y="110" width="20" height="10" rx="4" fill="#6c30ff"/>
      </svg>
    );
  }
  
  const styles = {
    svg: {
      width: "100%",
      maxWidth: "240px",
      display: "block",
      margin: "0 auto",
    },
  };