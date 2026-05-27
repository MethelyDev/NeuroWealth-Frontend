import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

test("Modal delegates open-state focus management to useFocusTrap", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/components/ui/Modal.tsx"),
    "utf8",
  );

  assert.match(source, /const containerRef = useRef<HTMLDivElement>\(null\);/);
  assert.match(source, /useFocusTrap\(containerRef, isOpen\);/);
});
