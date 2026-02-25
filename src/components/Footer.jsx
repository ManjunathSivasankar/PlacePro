export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid #edf2f7", background: "white" }}>
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <p style={{ margin: 0 }}>
          &copy; {new Date().getFullYear()} <strong>PlacePro</strong>.
          Empowering careers.
        </p>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          <span className="text-muted">Documentation</span>
          <span className="text-muted">Support</span>
          <span className="text-muted">Privacy</span>
        </div>
      </div>
    </footer>
  );
}
