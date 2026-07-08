/**
 * VAANI AI - Centralized Error Handler
 * Standardizes errors across Backend API, Ollama, and loopback daemons.
 */

/**
 * Standardized Error Response Model
 * @typedef {Object} ServiceError
 * @property {string} message - User-friendly error message
 * @property {string} type - Error category (e.g. BACKEND_OFFLINE, OLLAMA_UNAVAILABLE, REQUEST_TIMEOUT, INVALID_RESPONSE, UNKNOWN)
 * @property {string} technicalDetails - Raw stack trace or error log
 * @property {string} timestamp - Occurrence timestamp
 */

/**
 * Intercepts and parses exceptions into standardized error objects
 * @param {Error} error - Captured exception
 * @returns {ServiceError} Standardized error payload
 */
export function handleServiceError(error) {
  console.error("[VAANI AI Central Handler] Exception Caught:", error);
  
  const parsed = {
    message: error.message || "An unexpected system exception occurred during secure processing.",
    type: "UNKNOWN",
    technicalDetails: error.stack || error.toString(),
    timestamp: new Date().toLocaleTimeString()
  };

  const errorMsg = error.message ? error.message.toLowerCase() : '';

  // Identify specific backend issues based on error trace or status codes
  if (errorMsg.includes("(401)") || errorMsg.includes("401") || errorMsg.includes("unauthorized") || errorMsg.includes("session expired")) {
    parsed.type = "401_UNAUTHORIZED";
    parsed.message = "Login Required / Session Expired.";
  } else if (errorMsg.includes("(403)") || errorMsg.includes("403") || errorMsg.includes("forbidden") || errorMsg.includes("denied")) {
    parsed.type = "403_FORBIDDEN";
    parsed.message = "Access Denied (403).";
  } else if (errorMsg.includes("(404)") || errorMsg.includes("404") || errorMsg.includes("not found") || errorMsg.includes("missing")) {
    parsed.type = "404_NOT_FOUND";
    parsed.message = "API Missing / Route Not Found (404).";
  } else if (errorMsg.includes("(500)") || errorMsg.includes("500") || errorMsg.includes("internal server error")) {
    parsed.type = "500_INTERNAL_ERROR";
    parsed.message = "Internal Server Error (500).";
  } else if (errorMsg.includes("cannot connect") || errorMsg.includes("backend is not running") || errorMsg.includes("fetch") || errorMsg.includes("network")) {
    parsed.type = "BACKEND_UNAVAILABLE";
    parsed.message = "Backend Offline. Cannot reach local Flask server.";
  } else {
    // Prevent generic UNKNOWN by attempting to display the raw message
    parsed.type = "BACKEND_ERROR";
    parsed.message = error.message || "An error occurred during communication.";
  }

  return parsed;
}
