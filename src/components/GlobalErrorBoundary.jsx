import React from "react";

class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Global Error Caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Redirect to 404 page using window.location for a full reload 
      // to ensure state is cleared if the error was state-related
      window.location.href = "/404";
      return null;
    }

    return this.props.children;
  }
}

export default GlobalErrorBoundary;
