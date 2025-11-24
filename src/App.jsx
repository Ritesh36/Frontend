import { useState, useEffect } from "react";
import "prismjs/themes/prism-tomorrow.css";
import prism from "prismjs";
import Editor from "react-simple-code-editor";
import axios from "axios";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/atom-one-dark.css";
import { Loader2, Copy, Check, Trash2, Code2, Sparkles } from "lucide-react";
import "./App.css";

function App() {
  const [code, setCode] = useState(`function sum() {
  return 1 + 1
}`);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    prism.highlightAll();
  }, []);

  async function reviewCode() {
    if (!code) return;
    setLoading(true);
    setReview("");
    try {
      const apiUrl =
        import.meta.env.VITE_API_URL ||
        "https://ai-code-reviewer-kl4u.onrender.com";
      const response = await axios.post(`${apiUrl}/ai/review`, { code });
      setReview(response.data);
    } catch (error) {
      setReview("### ⚠️ Error\nFailed to generate review. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(review);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearEditor = () => {
    setCode("");
    setReview("");
  };

  return (
    <main>
      <div className="container">
        <div className="left">
          <div className="panel-header">
            <div className="title">
              <Code2 className="icon" />
              <span>Code Editor</span>
            </div>
            <button
              onClick={clearEditor}
              className="icon-btn"
              title="Clear Editor"
            >
              <Trash2 size={18} />
            </button>
          </div>
          <div className="code-wrapper">
            <Editor
              value={code}
              onValueChange={setCode}
              highlight={(code) =>
                prism.highlight(code, prism.languages.javascript, "javascript")
              }
              padding={20}
              className="editor"
              style={{
                fontFamily: '"Fira Code", "Fira Mono", monospace',
                fontSize: 16,
                height: "100%",
                width: "100%",
              }}
            />
          </div>
          <button
            onClick={reviewCode}
            disabled={loading}
            className="review-btn"
          >
            {loading ? (
              <>
                <Loader2 className="spinner" /> Reviewing...
              </>
            ) : (
              <>
                <Sparkles size={18} /> Review Code
              </>
            )}
          </button>
        </div>

        <div className="right">
          <div className="panel-header">
            <div className="title">
              <Sparkles className="icon" />
              <span>AI Review</span>
            </div>
            {review && (
              <button
                onClick={copyToClipboard}
                className="icon-btn"
                title="Copy Review"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </button>
            )}
          </div>
          <div className="review-content">
            {loading ? (
              <div className="loader-container">
                <div className="skeleton-line" style={{ width: "60%" }}></div>
                <div className="skeleton-line" style={{ width: "80%" }}></div>
                <div className="skeleton-line" style={{ width: "40%" }}></div>
              </div>
            ) : review ? (
              <Markdown rehypePlugins={[rehypeHighlight]}>{review}</Markdown>
            ) : (
              <div className="placeholder">
                <Code2 size={48} opacity={0.2} />
                <p>Enter code and click review to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
