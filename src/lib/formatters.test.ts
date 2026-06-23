import assert from "node:assert/strict";
import test from "node:test";

import { setActiveLocale } from "@/lib/i18n/locale-state";
import {
  formatApy,
  formatCompactCurrency,
  formatCompactNumber,
  formatCurrency,
  formatCurrencyPrecise,
  formatPercent,
  formatSignedCurrency,
  formatSignedPercent,
  formatSyncLabel,
  numericSign,
} from "@/lib/formatters";

test("formatCurrency and formatSignedCurrency follow the active locale", () => {
  setActiveLocale("en");
  assert.equal(formatCurrency(1234.5), "$1,234.50");
  assert.equal(formatSignedCurrency(1234.5), "+$1,234.50");
  assert.equal(formatSignedCurrency(-1234.5), "-$1,234.50");

  setActiveLocale("fr");
  assert.equal(
    formatCurrency(1234.5),
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(1234.5),
  );
});

test("formatPercent helpers keep signs stable", () => {
  setActiveLocale("en");
  assert.equal(formatPercent(8.44), "8.4%");
  assert.equal(formatSignedPercent(8.44), "+8.4%");
  assert.equal(formatSignedPercent(-8.44), "-8.4%");
  assert.equal(formatSignedPercent(0), "0.0%");
});

test("numericSign classifies positive, negative, and zero", () => {
  assert.equal(numericSign(12.5), "positive");
  assert.equal(numericSign(-0.01), "negative");
  assert.equal(numericSign(0), "zero");
});

test("formatApy keeps 2–4 dp and is locale aware", () => {
  setActiveLocale("en");
  assert.equal(formatApy(8.4), "8.40%");
  assert.equal(formatApy(8.4125), "8.4125%");
  assert.equal(formatApy(8.41255), "8.4126%"); // capped at 4 dp

  setActiveLocale("fr");
  // fr-FR uses a comma decimal separator
  assert.equal(formatApy(8.4), "8,40%");
});

test("formatCompactNumber and formatCompactCurrency shorten large values", () => {
  setActiveLocale("en");
  assert.equal(formatCompactNumber(12345), "12.3K");
  assert.equal(formatCompactNumber(1_200_000), "1.2M");
  assert.equal(formatCompactCurrency(12345), "$12.3K");
});

test("formatCurrencyPrecise preserves fractional precision for tooltips", () => {
  setActiveLocale("en");
  assert.equal(formatCurrencyPrecise(1234.5), "$1,234.50");
  assert.equal(formatCurrencyPrecise(0.12345678), "$0.12345678");
});

test("formatSyncLabel switches its prefix with the active locale", () => {
  const value = "2026-01-02T15:04:00.000Z";

  setActiveLocale("en");
  assert.match(formatSyncLabel(value), /^Updated /);

  setActiveLocale("fr");
  assert.match(formatSyncLabel(value), /^Mis à jour /);
});
