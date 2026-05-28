import assert from "node:assert/strict";
import test from "node:test";

import { SESSION_COOKIE_NAME, SESSION_STORAGE_KEY } from "./auth-constants";

test("SESSION_STORAGE_KEY and SESSION_COOKIE_NAME are defined and non-empty", () => {
  assert.equal(typeof SESSION_STORAGE_KEY, "string");
  assert.ok(SESSION_STORAGE_KEY.length > 0);

  assert.equal(typeof SESSION_COOKIE_NAME, "string");
  assert.ok(SESSION_COOKIE_NAME.length > 0);
});
