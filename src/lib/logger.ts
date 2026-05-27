export type LogLevel = "info" | "warn" | "error";

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: any;
}

// Simple event bus for logs
type LogListener = (entry: LogEntry) => void;
const listeners: LogListener[] = [];

export const subscribeToLogs = (listener: LogListener) => {
  listeners.push(listener);
  return () => {
    const index = listeners.indexOf(listener);
    if (index > -1) listeners.splice(index, 1);
  };
};

const notifyListeners = (entry: LogEntry) => {
  listeners.forEach((l) => l(entry));
};

export const scrubPII = (data: any): any => {
  if (!data) return data;
  const sensitiveKeys = [
    "email", "address", "phone", "password", "secret", "key",
    "name", "token", "userid", "ip", "ssn", "dob", "dateofbirth",
    "creditcard", "cardnumber", "accountnumber",
  ];
  if (typeof data === "object") {
    const scrubbed = Array.isArray(data) ? [...data] : { ...data };
    for (const key in scrubbed) {
      if (sensitiveKeys.some((sk) => key.toLowerCase().includes(sk))) {
        scrubbed[key] = "***REDACTED***";
      } else if (typeof scrubbed[key] === "object") {
        scrubbed[key] = scrubPII(scrubbed[key]);
      }
    }
    return scrubbed;
  }
  return data;
};

const createEntry = (level: LogLevel, message: string, context?: any): LogEntry => ({
  id: Math.random().toString(36).substring(7),
  timestamp: new Date().toISOString(),
  level,
  message,
  context: scrubPII(context),
});

export const logger = {
  info: (message: string, context?: any) => {
    const entry = createEntry("info", message, context);
    console.log(`[INFO] ${message}`, entry.context || "");
    notifyListeners(entry);
  },
  warn: (message: string, context?: any) => {
    const entry = createEntry("warn", message, context);
    console.warn(`[WARN] ${message}`, entry.context || "");
    notifyListeners(entry);
  },
  error: (message: string, error?: any) => {
    const entry = createEntry("error", message, {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
    });
    console.error(`[ERROR] ${message}`, entry.context || "");
    notifyListeners(entry);
  },
};
