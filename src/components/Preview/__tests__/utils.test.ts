import { RawDraftEntityRange, RawDraftInlineStyleRange } from "draft-js";

import { mergeSortedRanges, RangesType } from "../utils";

// TODO random data for Jest.
// Case 1: inlineRanges.length = EntityRanges.length

const inline1: RawDraftInlineStyleRange[] = [
  { offset: 1, length: 1, style: "BOLD" },
  { offset: 9, length: 2, style: "ITALIC" }
];

const entity1: RawDraftEntityRange[] = [
  { offset: 4, length: 1, key: 0 },
  { offset: 12, length: 1, key: 1 }
];

const result1: RangesType[] = [
  { offset: 1, length: 1, style: "BOLD" },
  { offset: 4, length: 1, key: 0 },
  { offset: 9, length: 2, style: "ITALIC" },
  { offset: 12, length: 1, key: 1 }
];

// Case 2: inlineRanges.length > EntityRanges.length

const inline2: RawDraftInlineStyleRange[] = [
  { offset: 1, length: 1, style: "BOLD" },
  { offset: 9, length: 2, style: "ITALIC" },
  { offset: 10, length: 2, style: "ITALIC" }
];

const entity2: RawDraftEntityRange[] = [
  { offset: 4, length: 1, key: 0 },
  { offset: 12, length: 1, key: 1 }
];

const result2: RangesType[] = [
  { offset: 1, length: 1, style: "BOLD" },
  { offset: 4, length: 1, key: 0 },
  { offset: 9, length: 2, style: "ITALIC" },
  { offset: 10, length: 2, style: "ITALIC" },
  { offset: 12, length: 1, key: 1 }
];

// Case 3: inlineRanges.length < EntityRanges.length

const inline3: RawDraftInlineStyleRange[] = [
  { offset: 1, length: 1, style: "BOLD" },
  { offset: 9, length: 2, style: "ITALIC" }
];

const entity3: RawDraftEntityRange[] = [
  { offset: 4, length: 1, key: 0 },
  { offset: 12, length: 1, key: 1 },
  { offset: 13, length: 1, key: 1 }
];

const result3: RangesType[] = [
  { offset: 1, length: 1, style: "BOLD" },
  { offset: 4, length: 1, key: 0 },
  { offset: 9, length: 2, style: "ITALIC" },
  { offset: 12, length: 1, key: 1 },
  { offset: 13, length: 1, key: 1 }
];

describe("mergeSortedRanges", () => {
  test("mergeSortedRanges: inlineRanges.length = EntityRanges.length", () => {
    const ranges = mergeSortedRanges(inline1, entity1);

    expect(ranges).toStrictEqual(result1);
  });

  test("mergeSortedRanges: inlineRanges.length > EntityRanges.length", () => {
    const ranges = mergeSortedRanges(inline2, entity2);

    expect(ranges).toStrictEqual(result2);
  });

  test("mergeSortedRanges: inlineRanges.length < EntityRanges.length", () => {
    const ranges = mergeSortedRanges(inline3, entity3);

    expect(ranges).toStrictEqual(result3);
  });
});

/**
 * Do not use cross-level lists.
 */
const blocks = [
  { depth: 0, text: "hello", type: "unordered-list-item" },
  { depth: 0, text: "world", type: "unordered-list-item" }
];

const blocks1 = [
  { depth: 0, text: "hello", type: "unordered-list-item" },
  { depth: 1, text: "Mai", type: "unordered-list-item" },
  { depth: 1, text: "Mai", type: "unordered-list-item" },
  { depth: 0, text: "world", type: "unordered-list-item" }
];

const blocks2 = [{ depth: 0, text: "hello", type: "unordered-list-item" }];

const blocks3 = [
  { depth: 0, text: "hello", type: "unordered-list-item" },
  { depth: 1, text: "Mai", type: "unordered-list-item" },
  { depth: 0, text: "world", type: "unordered-list-item" }
];

const blocks4 = [
  { depth: 0, text: "hello", type: "unordered-list-item" },
  { depth: 1, text: "Mai", type: "unordered-list-item" },
  { depth: 2, text: "world", type: "unordered-list-item" }
];

// TODO
const blocks5 = [
  { depth: 0, text: "hello", type: "unordered-list-item" },
  { depth: 1, text: "world", type: "unordered-list-item" },
  { depth: 2, text: "Mai", type: "unordered-list-item" },
  { depth: 0, text: "hello", type: "unordered-list-item" }
];

const single5 = "\\begin{itemize}"
  + "\\item hello"
  + "\\begin{itemize}"
  + "\\item world"
  + "\\begin{itemize}"
  + "\\item Mai"
  + "\\end{itemize}"
  + "\\end{itemize}"
  + "\\begin{itemize}"
  + "\\item hello"
  + "\\end{itemize}";

const result = "\\begin{itemize}" + "\\item hello" + "\\item world" + "\\end{itemize}";
const single = "\\begin{itemize}"
  + "\\item hello"
  + "\\begin{itemize}"
  + "\\item Mai"
  + "\\item Mai"
  + "\\end{itemize}"
  + "\\item world"
  + "\\end{itemize}";
const single1 = "\\begin{itemize}" + "\\item hello" + "\\end{itemize}";
const single2 = "\\begin{itemize}"
  + "\\item hello"
  + "\\begin{itemize}"
  + "\\item Mai"
  + "\\end{itemize}"
  + "\\item world"
  + "\\end{itemize}";

const single3 = "\\begin{itemize}"
  + "\\item hello"
  + "\\begin{itemize}"
  + "\\item Mai"
  + "\\begin{itemize}"
  + "\\item world"
  + "\\end{itemize}"
  + "\\end{itemize}"
  + "\\end{itemize}";

function parseItems(
  items: { type: string; text: string; depth: number }[]
): string {
  let tex = "";
  let previousDepth = 0;
  let beginCount = 0;
  items.forEach((item, index) => {
    const { text, depth } = item;
    /**
     * check if depth is in paris.
     * when inserting \begin(up), and when inserting \end(down)
     * how to compute the number of end.
     */
    if (index === 0) {
      // the first list item.
      tex += "\\begin{itemize}";
      previousDepth = depth;
      beginCount += 1;
    }
    if (previousDepth < depth) {
      tex += "\\begin{itemize}";
      previousDepth = depth;
      beginCount += 1;
    }
    if (previousDepth > depth) {
      tex += "\\end{itemize}";
      beginCount -= 1;
    }
    tex += `\\item ${text}`;
    if (index === items.length - 1) {
      // current list is exhausted.
      tex += "\\end{itemize}".repeat(beginCount);
    }
  });
  return tex;
}

describe("test list-items", () => {
  test("list-items", () => {
    const tex = parseItems(blocks);
    expect(tex).toBe(result);
  });

  test("list-items-1", () => {
    const tex = parseItems(blocks1);
    expect(tex).toBe(single);
  });

  test("list-items-2", () => {
    const tex = parseItems(blocks2);
    expect(tex).toBe(single1);
  });

  test("list-items-3", () => {
    const tex = parseItems(blocks3);
    expect(tex).toBe(single2);
  });

  test("list-items-4", () => {
    const tex = parseItems(blocks4);
    expect(tex).toBe(single3);
  });
});
