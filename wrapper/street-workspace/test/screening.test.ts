import test from "node:test";
import assert from "node:assert/strict";
import { formatRange, interval, product, runoffVolume, shadeShare, storageVolume } from "../src/fieldbook/screening.ts";
import { evidence, futures, runoffScenario } from "../src/fieldbook/data/issue01.ts";
import { en } from "../src/fieldbook/data/copy.en.ts";

const close = (a: number, b: number) => assert.ok(Math.abs(a - b) < 1e-9, `${a} != ${b}`);

test("runoff range for the stated 30 mm scenario", () => {
  const r = runoffVolume({ rainfallMm: interval(30), sealedAreaM2: interval(320, 470), runoffCoefficient: interval(0.7, 0.95) });
  close(r.min, 6.72);
  close(r.max, 13.395);
  assert.equal(formatRange(runoffScenario), "6.7–13.4 m³");
});

test("storage range for a 12 m² intervention", () => {
  const s = storageVolume({ areaM2: interval(12), activeDepthM: interval(0.25, 0.45), voidFraction: interval(0.2, 0.35) });
  close(s.min, 0.6);
  close(s.max, 1.89);
  assert.equal(formatRange(futures[0].scenarioEffects[0]), "0.6–1.9 m³");
});

test("ranges are ordered and inputs are validated", () => {
  assert.throws(() => interval(2, 1), RangeError);
  assert.throws(() => interval(-1, 1), RangeError);
  assert.throws(() => interval(Number.NaN), RangeError);
  assert.throws(() => runoffVolume({ rainfallMm: interval(30), sealedAreaM2: interval(1), runoffCoefficient: interval(0.5, 1.2) }), RangeError);
  assert.throws(() => storageVolume({ areaM2: interval(1), activeDepthM: interval(1), voidFraction: interval(0.5, 1.5) }), RangeError);
  const p = product(interval(1, 2), interval(3, 4));
  assert.deepEqual(p, { min: 3, max: 8 });
  for (const f of futures) for (const e of f.scenarioEffects) assert.ok(e.minimum <= e.maximum, `${f.id} ${e.label}`);
});

test("shade share is capped and geometric", () => {
  const s = shadeShare(interval(3.5, 10), 7);
  close(s.min, 0.5);
  close(s.max, 1);
  assert.throws(() => shadeShare(interval(1), 0), RangeError);
});

test("every scenario states its limits and no score is published", () => {
  for (const f of futures) {
    assert.ok(f.mustVerify.length > 0);
    for (const e of f.scenarioEffects) assert.ok(e.limitation.length > 0 && e.basis.length > 0);
  }
  const text = JSON.stringify({ en, evidence, futures }).toLowerCase();
  assert.ok(!/\bscore\b/.test(text), "Fieldbook must not publish a sponge score");
  for (const item of evidence.filter((i) => i.status === "unknown")) assert.ok(item.nextAction, item.id);
});
