import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props){ super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error){ return { hasError: true, error }; }
  componentDidCatch(error, info){ console.error("ErrorBoundary caught:", error, info); }
  render(){
    if(this.state.hasError){
      return (
        <div className="container-page py-10">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <h2 className="text-xl font-bold text-red-700">Something went wrong on this page.</h2>
            <p className="mt-2 text-sm text-red-700/90">
              {String(this.state.error?.message || this.state.error || "Unknown error")}
            </p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
