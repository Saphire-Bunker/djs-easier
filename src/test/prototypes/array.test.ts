import assert from "node:assert";
import test, { describe } from "node:test";
import { SArray } from "../../prototypes/array";

new SArray();

describe("Testing Array#edit", () => {
  test("simple edit", () => {
    const actual = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];

    actual.edit((value) => value === "b", () => "k");

    assert(actual[1] === "k");
    assert(actual.length === 10);
  });

  test("simple push", () => {
    const actual = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];

    actual.edit((value) => value === "k", () => "l", () => "m");

    assert(actual[10] === "m");
    assert(actual.length === 11);
  });

  test("complex edit", () => {
    const actual = Array.from(Array(10).keys()).map((_, i) => ({ name: `name${i}`, value: `value${i}` }));

    actual.edit((value) => value.name === "name0", ({ value }) => ({ name: "edited", value }));

    assert(actual[0].name === "edited");
    assert(actual[0].value === "value0");
    assert(actual.length === 10);
  });

  test("complex push", () => {
    const actual = Array.from(Array(10).keys()).map((_, i) => ({ name: `name${i}`, value: `value${i}` }));

    actual.edit(
      (value) => value.name === "name10",
      ({ value }) => ({ name: "edited", value }),
      () => ({ name: "name10", value: "pushed" }),
    );

    assert(actual[10].name === "name10");
    assert(actual[10].value === "pushed");
    assert(actual.length === 11);
  });
});

describe("Testing Array#random", () => {
  const array = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];

  test("random", () => {
    const actual = array.random();

    assert(array.includes(actual));
    assert([].random() === undefined);
  });

  test("random(number)", () => {
    const actual = array.random(array.length);

    assert(actual.every(v => array.includes(v)));
    assert.deepStrictEqual(actual.map(v => actual.lastIndexOf(v)).sort(), Array.from(Array(array.length).keys()));
  });

  test("random(NaN)", () => {
    assert.deepStrictEqual(array.random(NaN), []);
    assert.deepStrictEqual(array.random(0), []);
    assert.deepStrictEqual(array.random(-1), []);
  });
});

describe("Testing Array#shuffle", () => {
  const array = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];

  test("shuffle", () => {
    const actual = Array.from(array).shuffle();

    assert.notDeepStrictEqual(actual, array);
    assert(actual.every(v => array.includes(v)));
    assert.strictEqual(actual.length, array.length);
    assert.deepStrictEqual(actual, actual.shuffle());
    assert.strictEqual(actual, actual.shuffle());
  });
});
