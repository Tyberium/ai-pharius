(() => {
  const form = document.getElementById("ask-form");
  const input = document.getElementById("ask-input");
  const status = document.getElementById("ask-status");
  const submit = document.getElementById("ask-submit");
  const chatLog = document.getElementById("chat-log");
  const chatEmpty = document.getElementById("chat-empty");

  if (!form || !input || !status || !submit || !chatLog) {
    return;
  }

  const SLEEPING_REPLY =
    "You dare disturb the Hydra while it sleeps? " +
    "No head is awake — the coach API has not hatched yet. " +
    "Your question dissolves into the void, unheard by bolt, blade, or stratagem. " +
    "Return when Phase 1 lands; until then, split your fire the hard way. " +
    "I am Alpharius. This is also a lie.";

  function escapeHtml(text) {
    return text
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function appendMessage(role, text) {
    if (chatEmpty) {
      chatEmpty.hidden = true;
    }

    const item = document.createElement("article");
    item.className = `chat-msg chat-msg--${role}`;

    const label = document.createElement("p");
    label.className = "chat-msg-label";
    label.textContent = role === "user" ? "You" : "Hydra";

    const body = document.createElement("p");
    body.className = "chat-msg-body";
    body.textContent = text;

    item.append(label, body);
    chatLog.append(item);
    item.scrollIntoView({ behavior: "smooth", block: "nearest" });
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
    status.textContent = "One head stirs… then remembers it is asleep.";
    status.classList.add("is-live");

    appendMessage("user", question);
    input.value = "";

    window.setTimeout(() => {
      appendMessage("hydra", SLEEPING_REPLY);
      status.textContent = "Still sleeping. Phase 1 brings the real counsel.";
      submit.disabled = false;
      input.focus();
    }, 900);
  });
})();
