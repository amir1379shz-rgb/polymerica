import React from "react";
import ReactDOM from "react-dom/client";
import PolymerMarket from "./App.jsx";
import "./index.css";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    this.setState({ info });
  }
  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            padding: 20,
            fontFamily: "monospace",
            direction: "ltr",
            textAlign: "left",
            background: "#fff",
            color: "#c00",
            whiteSpace: "pre-wrap",
          }}
        >
          <h2>خطای واقعی برنامه:</h2>
          <div>{String(this.state.error && this.state.error.message)}</div>
          <div style={{ marginTop: 10, fontSize: 12, opacity: 0.8 }}>
            {this.state.error && this.state.error.stack}
          </div>
          <div style={{ marginTop: 10, fontSize: 12, opacity: 0.6 }}>
            {this.state.info && this.state.info.componentStack}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <ErrorBoundary>
    <PolymerMarket />
  </ErrorBoundary>
);
