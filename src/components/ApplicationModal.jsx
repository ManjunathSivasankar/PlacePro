import React from "react";

export default function ApplicationModal({
  job,
  onClose,
  onSubmit,
  resumeFile,
  setResumeFile,
  applying,
}) {
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        alert("Only PDF files are allowed");
        return;
      }
      if (file.size > 1 * 1024 * 1024) {
        alert("File size exceeds 1MB limit for Firestore storage");
        return;
      }
      setResumeFile(file);
    }
  };

  return (
    <div className="modal show">
      <div className="modal-content">
        <span className="modal-close" onClick={onClose}>
          &times;
        </span>
        <h2>Apply for {job.title}</h2>

        <div style={{ marginTop: "20px" }}>
          <p>
            <strong>Location:</strong> {job.location}
          </p>
          <p>
            <strong>Eligibility:</strong> {job.eligibility}
          </p>
        </div>

        <div className="form-group" style={{ marginTop: "30px" }}>
          <label htmlFor="resume">Upload Resume (PDF)</label>
          <input
            type="file"
            id="resume"
            accept=".pdf"
            onChange={handleFileChange}
            required
          />
          {resumeFile && (
            <p style={{ color: "#28a745", marginTop: "5px" }}>
              ✓ {resumeFile.name} ({(resumeFile.size / 1024).toFixed(2)} KB)
            </p>
          )}
        </div>

        <div className="btn-group" style={{ marginTop: "20px" }}>
          <button
            onClick={onSubmit}
            className="btn btn-success"
            disabled={applying || !resumeFile}
          >
            {applying ? "Submitting..." : "Submit Application"}
          </button>
          <button
            onClick={onClose}
            className="btn btn-primary"
            disabled={applying}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
