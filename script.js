function initializeFormHandling() {
  const talkBackForm = document.querySelector('form[name="contact"]');
  if (talkBackForm) {
    talkBackForm.addEventListener('submit', async function(event) {
      event.preventDefault();

      if (!validateForm()) {
        return;
      }

      const formData = new FormData(talkBackForm);
      const formBody = new URLSearchParams(formData).toString();

      try {
        const response = await fetch('/.netlify/functions/hello', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formBody,
        });

        // Get the full debug data from the function
        const debugData = await response.json();

        // Log the debug data to the browser console
        console.log("DEBUGGING RESPONSE FROM FUNCTION:", debugData);

        // Check if Turnstile was successful and act accordingly
        if (debugData.success) {
          window.location.href = '/thank-you.html';
        } else {
          // Display error codes if they exist
          const errorInfo = debugData['error-codes'] ? debugData['error-codes'].join(', ') : 'Verification failed.';
          showMessage(`Submission failed: ${errorInfo}`);
        }

      } catch (error) {
        console.error('Error submitting form:', error);
        showMessage('An error occurred. Please try again later.');
      }
    });
  }
}