import { useState, useRef, useCallback, useEffect } from "react";

const API = "http://localhost:8000";

// Medical classification metadata with professional styling
const CLASS_META = {
  Glioma: {
    color: "#dc2626",
    bgColor: "#fef2f2",
    borderColor: "#fecaca",
    severity: "High Priority",
    icon: "⚠",
    note: "Gliomas originate in glial cells. This classification requires urgent specialist review and further diagnostic evaluation.",
    recommendations: [
      "Consult oncology specialist immediately",
      "Schedule MRI follow-up in 2-4 weeks",
      "Consider biopsy if not previously performed",
    ],
  },
  Meningioma: {
    color: "#f97316",
    bgColor: "#fff7ed",
    borderColor: "#fed7aa",
    severity: "Moderate",
    icon: "📋",
    note: "Meningiomas arise from the meninges (brain membrane). Usually slow-growing and benign, but require monitoring.",
    recommendations: [
      "Schedule follow-up MRI in 6 months",
      "Consult neuro-oncology for monitoring protocol",
      "Assess symptoms and neurological function",
    ],
  },
  "No Tumor": {
    color: "#16a34a",
    bgColor: "#f0fdf4",
    borderColor: "#bbf7d0",
    severity: "Clear",
    icon: "✓",
    note: "No tumor detected. Brain tissue appears normal with no significant abnormalities.",
    recommendations: [
      "Continue routine check-ups",
      "Monitor for any new symptoms",
      "Follow preventive care guidelines",
    ],
  },
  Pituitary: {
    color: "#7c3aed",
    bgColor: "#faf5ff",
    borderColor: "#e9d5ff",
    severity: "Monitor",
    icon: "●",
    note: "Pituitary adenomas are located at the base of the brain. Typically benign but may require endocrinology evaluation.",
    recommendations: [
      "Refer to endocrinology specialist",
      "Order hormone level testing",
      "Schedule MRI follow-up in 12 months",
    ],
  },
};

/* ─── Confidence visualization component ──────────────────────────────────── */
function ConfidenceBar({ label, probability, color, isTop }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setWidth(probability), 60);
    return () => clearTimeout(t);
  }, [probability]);

  return (
    <div style={{ marginBottom: 18 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 6,
        }}
      >
        <span
          style={{
            fontSize: 14,
            fontWeight: isTop ? 600 : 500,
            color: isTop ? "#1f2937" : "#6b7280",
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontSize: 13,
            color: color,
            fontWeight: isTop ? 700 : 600,
            minWidth: 45,
            textAlign: "right",
            fontFamily: "monospace",
          }}
        >
          {probability.toFixed(1)}%
        </span>
      </div>
      <div
        style={{
          height: 6,
          background: "#e5e7eb",
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "inset 0 1px 2px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${width}%`,
            background: color,
            borderRadius: 3,
            transition: "width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
            opacity: isTop ? 1 : 0.6,
            boxShadow: `0 0 12px ${color}40`,
          }}
        />
      </div>
    </div>
  );
}

/* ─── Medical alert/result badge ─────────────────────────────────────────── */
function ResultBadge({ label, probability, meta }) {
  return (
    <div
      style={{
        background: meta.bgColor,
        border: `2px solid ${meta.color}`,
        borderRadius: 12,
        padding: "20px 24px",
        marginBottom: 20,
        display: "flex",
        gap: 16,
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          fontSize: 32,
          lineHeight: 1,
          minWidth: 40,
          textAlign: "center",
        }}
      >
        {meta.icon}
      </div>
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: meta.color,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: 4,
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          }}
        >
          Classification Result
        </div>
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: meta.color,
            marginBottom: 8,
            lineHeight: 1.1,
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: 13,
            color: "#374151",
            lineHeight: 1.5,
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          }}
        >
          <strong>Confidence: {probability.toFixed(1)}%</strong> • Severity:{" "}
          <strong style={{ color: meta.color }}>{meta.severity}</strong>
        </div>
      </div>
    </div>
  );
}

/* ─── Medical info card ──────────────────────────────────────────────────── */
function InfoCard({ title, content, icon, color }) {
  return (
    <div
      style={{
        background: "#fff",
        border: `1px solid #e5e7eb`,
        borderRadius: 10,
        padding: "16px 18px",
        marginBottom: 12,
        borderLeft: `4px solid ${color}`,
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: color,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          marginBottom: 6,
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        <span>{icon}</span> {title}
      </div>
      <p
        style={{
          fontSize: 13,
          color: "#374151",
          margin: 0,
          lineHeight: 1.6,
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        {content}
      </p>
    </div>
  );
}

/* ─── Main application ─────────────────────────────────────────────────── */
export default function App() {
  const [mode, setMode] = useState("upload");
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [camActive, setCamActive] = useState(false);
  const [captured, setCaptured] = useState(false);

  const fileInputRef = useRef();
  const videoRef = useRef();
  const canvasRef = useRef();
  const streamRef = useRef(null);

  /* Camera handling */
  const startCamera = async () => {
    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      videoRef.current.srcObject = streamRef.current;
      setCamActive(true);
      setCaptured(false);
      setImageFile(null);
      setImageUrl(null);
      setResult(null);
    } catch {
      setError("Camera access denied. Please check browser permissions.");
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCamActive(false);
  };

  const captureFrame = () => {
    const v = videoRef.current;
    const c = canvasRef.current;
    c.width = v.videoWidth;
    c.height = v.videoHeight;
    c.getContext("2d").drawImage(v, 0, 0);
    c.toBlob((blob) => {
      const file = new File([blob], "capture.png", { type: "image/png" });
      setImageFile(file);
      setImageUrl(URL.createObjectURL(blob));
      setCaptured(true);
      setResult(null);
      stopCamera();
    }, "image/png");
  };

  /* File upload handling */
  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }
    setImageFile(file);
    setImageUrl(URL.createObjectURL(file));
    setResult(null);
    setError(null);
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }, []);

  /* Analysis */
  const analyse = async () => {
    if (!imageFile) return;
    setLoading(true);
    setError(null);
    const form = new FormData();
    form.append("file", imageFile);
    try {
      const res = await fetch(`${API}/predict`, { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Server error");
      setResult(data);
    } catch (e) {
      setError(
        e.message.includes("fetch")
          ? "Cannot connect to the analysis server. Please ensure the backend is running."
          : e.message,
      );
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setImageFile(null);
    setImageUrl(null);
    setResult(null);
    setError(null);
    setCaptured(false);
    stopCamera();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const top = result?.top;
  const meta = top ? CLASS_META[top.label] : null;

  /* ─── RENDER ──────────────────────────────────────────────────────────── */
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: "#1f2937",
      }}
    >
      {/* HEADER */}
      <header
        style={{
          background: "#fff",
          borderBottom: "1px solid #e5e7eb",
          backdropFilter: "blur(10px)",
          position: "sticky",
          top: 0,
          zIndex: 100,
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 70,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                background: "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              ⚕
            </div>
            <div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#0f172a",
                  letterSpacing: "-0.5px",
                }}
              >
                NeuroScan Pro
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "#6b7280",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  fontWeight: 500,
                }}
              >
                Brain MRI Analysis
              </div>
            </div>
          </div>
          <div
            style={{
              fontSize: 12,
              color: "#9ca3af",
              fontWeight: 500,
              textAlign: "right",
            }}
          >
            <div>Clinical Analysis Tool</div>
            <div style={{ fontSize: 11, color: "#d1d5db", marginTop: 2 }}>
              Version 1.0 Medical
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "40px 24px",
        }}
      >
        {/* PAGE TITLE */}
        <div style={{ marginBottom: 48 }}>
          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3.2rem)",
              fontWeight: 800,
              color: "#0f172a",
              lineHeight: 1.15,
              marginBottom: 12,
              letterSpacing: "-1px",
            }}
          >
            Brain MRI Analysis
          </h1>
          <p
            style={{
              fontSize: 15,
              color: "#4b5563",
              fontWeight: 400,
              maxWidth: 600,
              lineHeight: 1.7,
            }}
          >
            Upload a brain MRI scan or capture one with your camera. Our AI
            model analyzes the image and classifies potential conditions using
            deep learning.
          </p>
        </div>

        {/* TWO-COLUMN LAYOUT */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 32,
            alignItems: "start",
          }}
        >
          {/* LEFT COLUMN - INPUT */}
          <div>
            {/* MODE TOGGLE */}
            <div
              style={{
                display: "flex",
                gap: 0,
                marginBottom: 24,
                background: "#f3f4f6",
                borderRadius: 10,
                padding: 4,
              }}
            >
              {["upload", "camera"].map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setMode(m);
                    if (m !== "camera") stopCamera();
                  }}
                  style={{
                    flex: 1,
                    padding: "11px 18px",
                    fontSize: 13,
                    fontWeight: mode === m ? 600 : 500,
                    background: mode === m ? "#fff" : "transparent",
                    color: mode === m ? "#0ea5e9" : "#6b7280",
                    border: "none",
                    borderRadius: 8,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    boxShadow:
                      mode === m ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                  }}
                >
                  {m === "upload" ? "📤 Upload File" : "📷 Use Camera"}
                </button>
              ))}
            </div>

            {/* UPLOAD MODE */}
            {mode === "upload" && !imageUrl && (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                onClick={() => fileInputRef.current.click()}
                style={{
                  border: `2px dashed ${dragging ? "#0ea5e9" : "#cbd5e0"}`,
                  borderRadius: 12,
                  padding: "60px 32px",
                  textAlign: "center",
                  cursor: "pointer",
                  background: dragging ? "#f0f9ff" : "#fff",
                  transition: "all 0.2s",
                  boxShadow: dragging
                    ? "0 10px 25px rgba(14, 165, 233, 0.1)"
                    : "0 1px 3px rgba(0,0,0,0.05)",
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => handleFile(e.target.files[0])}
                />
                <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.6 }}>
                  🖼
                </div>
                <p
                  style={{
                    fontSize: 14,
                    color: "#374151",
                    fontWeight: 600,
                    margin: "0 0 6px 0",
                  }}
                >
                  Click to upload or drag and drop
                </p>
                <p
                  style={{
                    fontSize: 12,
                    color: "#9ca3af",
                    margin: 0,
                    fontWeight: 400,
                  }}
                >
                  PNG, JPG, DICOM (up to 100MB)
                </p>
              </div>
            )}

            {/* CAMERA MODE */}
            {mode === "camera" && !captured && (
              <div
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  overflow: "hidden",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.07)",
                }}
              >
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{
                    width: "100%",
                    display: camActive ? "block" : "none",
                    maxHeight: 300,
                    objectFit: "cover",
                    background: "#000",
                  }}
                />
                {!camActive && (
                  <div
                    style={{
                      height: 250,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#9ca3af",
                      fontSize: 13,
                      background: "#f9fafb",
                    }}
                  >
                    Camera is not active. Click "Start Camera" to begin.
                  </div>
                )}
                <div
                  style={{
                    padding: "14px 16px",
                    display: "flex",
                    gap: 10,
                    borderTop: "1px solid #e5e7eb",
                    background: "#f9fafb",
                  }}
                >
                  {!camActive ? (
                    <button
                      onClick={startCamera}
                      style={{
                        flex: 1,
                        padding: "11px 18px",
                        background: "#0ea5e9",
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      📷 Start Camera
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={captureFrame}
                        style={{
                          flex: 1,
                          padding: "11px 18px",
                          background: "#10b981",
                          color: "#fff",
                          border: "none",
                          borderRadius: 8,
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        ✓ Capture
                      </button>
                      <button
                        onClick={stopCamera}
                        style={{
                          flex: 1,
                          padding: "11px 18px",
                          background: "#ef4444",
                          color: "#fff",
                          border: "none",
                          borderRadius: 8,
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        ✕ Stop
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* IMAGE PREVIEW */}
            {imageUrl && (
              <div
                style={{
                  position: "relative",
                  borderRadius: 12,
                  overflow: "hidden",
                  border: "2px solid #e5e7eb",
                  background: "#000",
                  marginBottom: 16,
                  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                }}
              >
                <img
                  src={imageUrl}
                  alt="MRI Scan"
                  style={{
                    width: "100%",
                    display: "block",
                    maxHeight: 320,
                    objectFit: "contain",
                  }}
                />
                <button
                  onClick={reset}
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    background: "rgba(0,0,0,0.6)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "6px 12px",
                    fontSize: 12,
                    cursor: "pointer",
                    fontWeight: 600,
                    backdropFilter: "blur(4px)",
                  }}
                >
                  ✕ Clear
                </button>
              </div>
            )}

            {/* ANALYSE BUTTON */}
            {imageUrl && (
              <button
                onClick={analyse}
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "14px 18px",
                  background: loading
                    ? "#d1d5db"
                    : "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                  opacity: loading ? 0.7 : 1,
                  boxShadow: loading
                    ? "none"
                    : "0 4px 15px rgba(14, 165, 233, 0.3)",
                  letterSpacing: "0.5px",
                }}
              >
                {loading ? (
                  <>
                    <span
                      style={{
                        animation: "spin 1s linear infinite",
                        display: "inline-block",
                      }}
                    >
                      ⟳
                    </span>{" "}
                    Analyzing...
                  </>
                ) : (
                  "▶ Analyze MRI Scan"
                )}
              </button>
            )}

            {/* ERROR MESSAGE */}
            {error && (
              <div
                style={{
                  marginTop: 16,
                  padding: "12px 16px",
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: 8,
                  fontSize: 13,
                  color: "#dc2626",
                  fontWeight: 500,
                  lineHeight: 1.5,
                }}
              >
                ⚠ {error}
              </div>
            )}

            <canvas ref={canvasRef} style={{ display: "none" }} />
          </div>

          {/* RIGHT COLUMN - RESULTS */}
          <div>
            {!result && (
              <div
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  border: "1px solid #e5e7eb",
                  padding: "48px 32px",
                  textAlign: "center",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                }}
              >
                <div style={{ fontSize: 36, marginBottom: 16, opacity: 0.3 }}>
                  📊
                </div>
                <p
                  style={{
                    color: "#9ca3af",
                    fontSize: 14,
                    margin: 0,
                    lineHeight: 1.6,
                    fontWeight: 500,
                  }}
                >
                  Upload an MRI image and click "Analyze" to see classification
                  results here.
                </p>
              </div>
            )}

            {result && meta && (
              <div
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  border: "1px solid #e5e7eb",
                  overflow: "hidden",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                }}
              >
                {/* RESULT BADGE */}
                <div style={{ padding: "24px" }}>
                  <ResultBadge
                    label={top.label}
                    probability={top.probability}
                    meta={meta}
                  />
                </div>

                {/* CLINICAL NOTE */}
                <div
                  style={{
                    padding: "18px 24px",
                    background: meta.bgColor,
                    borderTop: `1px solid ${meta.borderColor}`,
                    borderBottom: `1px solid ${meta.borderColor}`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: meta.color,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      marginBottom: 8,
                    }}
                  >
                    ℹ Clinical Note
                  </div>
                  <p
                    style={{
                      fontSize: 13,
                      color: "#374151",
                      margin: 0,
                      lineHeight: 1.7,
                    }}
                  >
                    {meta.note}
                  </p>
                </div>

                {/* CONFIDENCE BARS */}
                <div style={{ padding: "24px" }}>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#374151",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      marginBottom: 20,
                    }}
                  >
                    Classification Probabilities
                  </div>
                  {result.all.map((c) => (
                    <ConfidenceBar
                      key={c.label}
                      label={c.label}
                      probability={c.probability}
                      color={CLASS_META[c.label].color}
                      isTop={c.label === top.label}
                    />
                  ))}
                </div>

                {/* RECOMMENDATIONS */}
                <div
                  style={{
                    padding: "24px",
                    background: "#f9fafb",
                    borderTop: "1px solid #e5e7eb",
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#374151",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      marginBottom: 14,
                    }}
                  >
                    Next Steps
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    {meta.recommendations.map((rec, i) => (
                      <div
                        key={i}
                        style={{
                          fontSize: 13,
                          color: "#4b5563",
                          display: "flex",
                          gap: 10,
                          lineHeight: 1.5,
                        }}
                      >
                        <span style={{ color: meta.color, fontWeight: 700 }}>
                          →
                        </span>
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* LEGAL DISCLAIMER */}
                <div
                  style={{
                    padding: "16px 24px",
                    background: "#fef3c7",
                    borderTop: "1px solid #fde68a",
                    fontSize: 11,
                    color: "#92400e",
                    lineHeight: 1.6,
                    fontStyle: "italic",
                  }}
                >
                  ⚠ <strong>Medical Disclaimer:</strong> This analysis is
                  generated by an AI model for research and educational purposes
                  only. It does not constitute a medical diagnosis or
                  professional medical advice. Always consult with qualified
                  healthcare professionals for diagnosis and treatment
                  decisions.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER INFO */}
        <div
          style={{
            marginTop: 60,
            padding: "24px",
            background: "#fff",
            borderRadius: 12,
            border: "1px solid #e5e7eb",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: 12,
              color: "#6b7280",
              margin: 0,
              lineHeight: 1.8,
            }}
          >
            <strong>NeuroScan Pro</strong> uses a fine-tuned VGG16 deep learning
            model trained on brain MRI datasets.
            <br />
            <span style={{ color: "#9ca3af" }}>
              Built for clinical demonstration • Not FDA approved • For research
              use only
            </span>
          </p>
        </div>
      </div>

      {/* KEYFRAME ANIMATION */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
