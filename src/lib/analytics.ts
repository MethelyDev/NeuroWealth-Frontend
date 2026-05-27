import { logger, scrubPII } from "./logger";

export interface AnalyticsEvent {
  id: string;
  name: string;
  timestamp: string;
  params?: Record<string, any>;
}

type EventListener = (event: AnalyticsEvent) => void;
const listeners: EventListener[] = [];

export const subscribeToEvents = (listener: EventListener) => {
  listeners.push(listener);
  return () => {
    const index = listeners.indexOf(listener);
    if (index > -1) listeners.splice(index, 1);
  };
};

const notifyListeners = (event: AnalyticsEvent) => {
  listeners.forEach((l) => l(event));
};

export const analytics = {
  track: (name: string, params?: Record<string, any>) => {
    const safeParams = params ? scrubPII(params) : undefined;
    const event: AnalyticsEvent = {
      id: Math.random().toString(36).substring(7),
      name,
      timestamp: new Date().toISOString(),
      params: safeParams,
    };

    logger.info(`Analytics [${name}]`, safeParams);

    notifyListeners(event);

    // In a real app, this would send to Segment, Mixpanel, etc.
    if (process.env.NODE_ENV === "production") {
      // Send to real endpoint
    }
  },
};
