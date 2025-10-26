import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google"; // ✅ Add this line

import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./state/AuthContext.jsx";

// ✅ Replace YOUR_CLIENT_ID with your actual one
const GOOGLE_CLIENT_ID =
  "403503264257-e0ribvgugac2d4quckrd93arthkrdus2.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* ✅ Wrap entire app inside GoogleOAuthProvider */}
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
