// Dark mode toggle
function toggleDarkMode() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
  const icon = document.querySelector('.theme-icon');
  icon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// Initialize theme from localStorage
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
}

// Copy to clipboard
function copyToClipboard(elementId) {
  const element = document.getElementById(elementId);
  const text = element.innerText;
  
  if (!text || text === 'Your transcript will appear here...' || text === 'AI-generated summary will appear here...') {
    alert('Nothing to copy yet. Please transcribe audio first.');
    return;
  }
  
  navigator.clipboard.writeText(text).then(() => {
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = '✓';
    setTimeout(() => {
      btn.textContent = originalText;
    }, 2000);
  }).catch(err => {
    alert('Failed to copy: ' + err);
  });
}

function processAudio() {
  const fileInput = document.getElementById("audioFile");
  const loading = document.getElementById("loading");
  const transcriptEl = document.getElementById("transcript");
  const summaryEl = document.getElementById("summary");

  if (!fileInput.files.length) {
    alert("Please upload an audio file.");
    return;
  }

  loading.classList.remove("hidden");
  
  const formData = new FormData();
  formData.append("audio", fileInput.files[0]);

  fetch("/upload", {
    method: "POST",
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    loading.classList.add("hidden");
    
    if (data.error) {
      transcriptEl.innerText = "❌ Error: " + data.error;
      summaryEl.innerText = "Please try again.";
    } else {
      transcriptEl.innerText = data.transcript;
      summaryEl.innerText = data.summary;
    }
  })
  .catch(error => {
    loading.classList.add("hidden");
    transcriptEl.innerText = "❌ Error during upload.";
    summaryEl.innerText = "Please try again.";
    console.error('Upload error:', error);
  });
}

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', initTheme);
