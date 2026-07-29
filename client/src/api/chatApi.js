import axiosInstance from "./axiosInstance.js";

export async function getSessions(repoId) {
  const response = await axiosInstance.get(`/repos/${repoId}/sessions`);
  return response.data.data.sessions;
}

export async function createSession(repoId) {
  const response = await axiosInstance.post(`/repos/${repoId}/sessions`);
  return response.data.data.session;
}

export async function renameSession(sessionId, title) {
  const response = await axiosInstance.patch(`/sessions/${sessionId}`, { title });
  return response.data.data.session;
}

export async function deleteSession(sessionId) {
  const response = await axiosInstance.delete(`/sessions/${sessionId}`);
  return response.data;
}

export async function getChatHistory(sessionId) {
  const response = await axiosInstance.get(`/sessions/${sessionId}/messages`);
  return response.data.data.messages;
}

function parseSseBuffer(buffer) {
  const events = [];
  const rawEvents = buffer.split("\n\n");
  const remainder = rawEvents.pop();

  for (const raw of rawEvents) {
    const lines = raw.split("\n");
    const eventLine = lines.find((l) => l.startsWith("event:"));
    const dataLine = lines.find((l) => l.startsWith("data:"));

    if (eventLine && dataLine) {
      const eventType = eventLine.replace("event:", "").trim();
      const dataText = dataLine.replace("data:", "").trim();
      try {
        events.push({ type: eventType, data: JSON.parse(dataText) });
      } catch {
        // skip malformed frame
      }
    }
  }

  return { events, remainder };
}

async function consumeSseStream(response, handlers) {
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || "Failed to get a response.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const { events, remainder } = parseSseBuffer(buffer);
    buffer = remainder;

    for (const event of events) {
      if (event.type === "sources") handlers.onSources?.(event.data.sources);
      if (event.type === "chunk") handlers.onChunk?.(event.data.content);
      if (event.type === "error") handlers.onError?.(event.data.message);
      if (event.type === "done") handlers.onDone?.();
    }
  }
}

export async function streamQuestion(sessionId, question, handlers) {
  const token = localStorage.getItem("token");
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const response = await fetch(`${baseUrl}/sessions/${sessionId}/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ question }),
  });

  await consumeSseStream(response, handlers);
}

export async function streamRegenerate(sessionId, handlers) {
  const token = localStorage.getItem("token");
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const response = await fetch(`${baseUrl}/sessions/${sessionId}/regenerate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  await consumeSseStream(response, handlers);
}