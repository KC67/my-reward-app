import { beforeEach, describe, expect, it, vi, afterEach } from "vitest";
import { Logger, setLogLevel } from "../../utils/logger";

const FIXED_DATE = "2025-11-23T18:00:00.000Z";

describe("Logger utility", () => {
  let originalDate;

  beforeEach(() => {
    vi.spyOn(console, "debug").mockImplementation(() => {});
    vi.spyOn(console, "info").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "log").mockImplementation(() => {});

    originalDate = Date;
    globalThis.Date = class extends Date {
      constructor() {
        super(FIXED_DATE);
      }
      static now() {
        return new originalDate(FIXED_DATE).getTime();
      }
      static toISOString() {
        return FIXED_DATE;
      }
    };

    setLogLevel("DEBUG");
  });

  afterEach(() => {
    globalThis.Date = originalDate;
    vi.restoreAllMocks();
  });

  it("logs debug messages when level is DEBUG", () => {
    Logger.debug("test debug");
    expect(console.debug).toHaveBeenCalledWith(
      `[${FIXED_DATE}] [DEBUG]`,
      "test debug"
    );
  });

  it("logs info messages", () => {
    Logger.info("hello");
    expect(console.info).toHaveBeenCalledWith(
      `[${FIXED_DATE}] [INFO]`,
      "hello"
    );
  });

  it("logs warn messages", () => {
    Logger.warn("something");
    expect(console.warn).toHaveBeenCalledWith(
      `[${FIXED_DATE}] [WARN]`,
      "something"
    );
  });

  it("logs error messages", () => {
    Logger.error("boom");
    expect(console.error).toHaveBeenCalledWith(
      `[${FIXED_DATE}] [ERROR]`,
      "boom"
    );
  });

  it("suppresses lower-level logs when log level is higher", () => {
    setLogLevel("ERROR");

    Logger.debug("debug msg");
    Logger.info("info msg");
    Logger.warn("warn msg");

    expect(console.debug).not.toHaveBeenCalled();
    expect(console.info).not.toHaveBeenCalled();
    expect(console.warn).not.toHaveBeenCalled();

    Logger.error("err msg");
    expect(console.error).toHaveBeenCalledWith(
      `[${FIXED_DATE}] [ERROR]`,
      "err msg"
    );
  });

  it("falls back to console.log when console method is missing", () => {
    console.info = undefined;
    vi.spyOn(console, "log").mockImplementation(() => {});

    Logger.info("fallback test");

    expect(console.log).toHaveBeenCalledWith(
      `[${FIXED_DATE}] [INFO]`,
      "fallback test"
    );
  });

  it("setLogLevel updates the log level", () => {
    setLogLevel("WARN");

    Logger.info("should not log");
    expect(console.info).not.toHaveBeenCalled();

    Logger.error("should log");
    expect(console.error).toHaveBeenCalledWith(
      `[${FIXED_DATE}] [ERROR]`,
      "should log"
    );
  });

  it("setLogLevel warns on invalid log levels", () => {
    setLogLevel("INVALID_LEVEL");
    expect(console.warn).toHaveBeenCalledWith(
      "Invalid log level: INVALID_LEVEL"
    );
  });

  it("logs multiple arguments correctly", () => {
    Logger.info("a", 123, { x: 1 });

    expect(console.info).toHaveBeenCalledWith(
      `[${FIXED_DATE}] [INFO]`,
      "a",
      123,
      { x: 1 }
    );
  });
});
