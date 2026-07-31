(() => {
  const form = document.getElementById("ask-form");
  const input = document.getElementById("ask-input");
  const status = document.getElementById("ask-status");
  const submit = document.getElementById("ask-submit");

  if (!form || !input || !status || !submit) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const question = input.value.trim();

    if (!question) {
      status.textContent = "Speak, twin. The Hydra needs a question.";
      input.focus();
      return;
    }

    submit.disabled = true;
    status.textContent =
      "No coach endpoint yet. Your question is noted locally - API lands in Phase 1.";
    status.classList.add("is-live");

    window.setTimeout(() => {
      submit.disabled = false;
    }, 600);
  });
})();
