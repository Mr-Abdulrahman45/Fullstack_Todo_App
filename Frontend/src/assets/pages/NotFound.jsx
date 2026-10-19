import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div style={styles.container}>
      {" "}
      <h1 style={styles.code}>404</h1>
      <h2 style={styles.heading}>Page Not Found</h2>
      <p style={styles.text}>
        Sorry! The page you're looking for doesn't exist or may have been moved.
      </p>
      <Link to="/" style={styles.button}>
        Go to Home
      </Link>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a",
    color: "#ffffff",
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
    padding: "20px",
    boxSizing: "border-box",
  },
  code: {
    fontSize: "100px",
    fontWeight: "bold",
    color: "#38bdf8",
    margin: "0",
  },
  heading: {
    fontSize: "30px",
    margin: "10px 0",
  },
  text: {
    color: "#94a3b8",
    fontSize: "16px",
    maxWidth: "400px",
    lineHeight: "1.6",
  },
  button: {
    marginTop: "20px",
    padding: "12px 24px",
    background: "#38bdf8",
    color: "#0f172a",
    textDecoration: "none",
    borderRadius: "8px",
    fontWeight: "bold",
  },
};
