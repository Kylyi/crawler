type LogMeta = Record<string, unknown>;

function formatMeta(meta?: LogMeta): string {
  if (!meta || Object.keys(meta).length === 0) return "";
  const parts = Object.entries(meta).map(
    ([key, value]) => `${key}=${typeof value === "string" ? value : JSON.stringify(value)}`,
  );
  return ` (${parts.join(", ")})`;
}

export type CrawlLogger = {
  start: (message: string, meta?: LogMeta) => void;
  info: (message: string, meta?: LogMeta) => void;
  progress: (message: string, meta?: LogMeta) => void;
  warn: (message: string, meta?: LogMeta) => void;
  error: (message: string, meta?: LogMeta) => void;
  finish: (message: string, meta?: LogMeta) => void;
};

export function createCrawlLogger(scope: string): CrawlLogger {
  const prefix = `[crawl:${scope}]`;

  const write = (level: "info" | "warn" | "error") => (message: string, meta?: LogMeta) => {
    const line = `${prefix} ${message}${formatMeta(meta)}`;
    if (level === "warn") console.warn(line);
    else if (level === "error") console.error(line);
    else console.info(line);
  };

  const info = write("info");

  return {
    start: (message, meta) => info(`start: ${message}`, meta),
    info,
    progress: (message, meta) => info(`progress: ${message}`, meta),
    warn: write("warn"),
    error: write("error"),
    finish: (message, meta) => info(`finish: ${message}`, meta),
  };
}
