import {
  startSessionQuery,
  regenerateLastAnswer,
  saveAssistantMessage,
} from "../services/chatSession.service.js";

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

function streamToClient(res, pythonStream, sessionId) {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();

  pythonStream.pipe(res);

  let sseBuffer = "";
  let answerText = "";
  let sources = [];

  pythonStream.on("data", (chunk) => {
    sseBuffer += chunk.toString("utf8");
    const { events, remainder } = parseSseBuffer(sseBuffer);
    sseBuffer = remainder;

    for (const event of events) {
      if (event.type === "sources") sources = event.data.sources;
      if (event.type === "chunk") answerText += event.data.content;
    }
  });

  pythonStream.on("end", async () => {
    await saveAssistantMessage(sessionId, answerText, sources);
  });

  pythonStream.on("error", () => {
    res.end();
  });
}

export async function askSession(req, res, next) {
  try {
    const { question } = req.body;
    const sessionId = req.params.sessionId;

    const { pythonStream } = await startSessionQuery(
      req.user.id,
      sessionId,
      question
    );

    streamToClient(res, pythonStream, sessionId);

    req.on("close", () => pythonStream.destroy());
  } catch (error) {
    next(error);
  }
}

export async function regenerateSession(req, res, next) {
  try {
    const sessionId = req.params.sessionId;

    const { pythonStream } = await regenerateLastAnswer(req.user.id, sessionId);

    streamToClient(res, pythonStream, sessionId);

    req.on("close", () => pythonStream.destroy());
  } catch (error) {
    next(error);
  }
}