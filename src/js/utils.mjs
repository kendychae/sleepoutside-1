// Wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

// Retrieve data from localStorage, returns null if not found
export function getLocalStorage(key) {
  const data = localStorage.getItem(key);
  try {
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error("Error parsing localStorage data for key:", key, e);
    return null;
  }
}

// Save data to localStorage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Set a listener for both touchend and click, avoiding duplicate calls
export function setClick(selector, callback) {
  const element = qs(selector);
  if (!element) return;

  let called = false;
  element.addEventListener("touchend", (event) => {
    event.preventDefault();
    if (!called) {
      called = true;
      callback(event);
      setTimeout(() => { called = false; }, 300);
    }
  });
  element.addEventListener("click", (event) => {
    if (!called) {
      called = true;
      callback(event);
      setTimeout(() => { called = false; }, 300);
    }
  });
}

// Get parameter from URL
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

// Load header and footer (placeholder for now)
export function loadHeaderFooter() {
  // This would load header and footer if needed
  // For now, it's just a placeholder
}