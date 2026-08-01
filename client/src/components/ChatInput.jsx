import { useState } from "react";
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input.jsx";

const EXAMPLE_PROMPTS = [
  "What does this repository do?",
  "Where is authentication handled?",
  "Explain the main data flow",
  "What are the API endpoints?",
  "How is the database structured?",
];

function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState("");

  function handleChange(e) {
    setValue(e.target.value);
  }

  function handleSubmit() {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  }

  return (
    <PlaceholdersAndVanishInput
      placeholders={EXAMPLE_PROMPTS}
      onChange={handleChange}
      onSubmit={handleSubmit}
      disabled={disabled}
    />
  );
}

export default ChatInput;