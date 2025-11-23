/**
 * Extract user-friendly error message from API error
 */
export function getErrorMessage(error: any): string {
  if (error.response) {
    // Server responded with error
    return (
      error.response.data?.message || "An error occurred. Please try again."
    );
  } else if (error.request) {
    // Request made but no response
    return "Unable to connect to the server. Please check your internet connection.";
  } else {
    // Something else happened
    return error.message || "An unexpected error occurred.";
  }
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: any): boolean {
  return !error.response && error.request;
}

/**
 * Check if error is a 404 Not Found
 */
export function isNotFoundError(error: any): boolean {
  return error.response?.status === 404;
}

/**
 * Check if error is an authentication error
 */
export function isAuthError(error: any): boolean {
  return error.response?.status === 401 || error.response?.status === 403;
}
