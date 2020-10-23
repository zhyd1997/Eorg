import { mergeSortedRanges } from '../utils'

// TODO random data for Jest.
// Case 1: inlineRanges.length = EntityRanges.length

const inline1 = [
	{ offset: 1, length: 1, style: 'BOLD' },
	{ offset: 9, length: 2, style: 'ITALIC' },
]

const entity1 = [
	{ offset: 4, length: 1, key: 0 },
	{ offset: 12, length: 1, key: 1 },
]

const result1 = [
	{ offset: 1, length: 1, style: 'BOLD' },
	{ offset: 4, length: 1, key: 0 },
	{ offset: 9, length: 2, style: 'ITALIC' },
	{ offset: 12, length: 1, key: 1 },
]

// Case 2: inlineRanges.length > EntityRanges.length

const inline2 = [
	{ offset: 1, length: 1, style: 'BOLD' },
	{ offset: 9, length: 2, style: 'ITALIC' },
	{ offset: 10, length: 2, style: 'ITALIC' },
]

const entity2 = [
	{ offset: 4, length: 1, key: 0 },
	{ offset: 12, length: 1, key: 1 },
]

const result2 = [
	{ offset: 1, length: 1, style: 'BOLD' },
	{ offset: 4, length: 1, key: 0 },
	{ offset: 9, length: 2, style: 'ITALIC' },
	{ offset: 10, length: 2, style: 'ITALIC' },
	{ offset: 12, length: 1, key: 1 },
]

// Case 3: inlineRanges.length < EntityRanges.length

const inline3 = [
	{ offset: 1, length: 1, style: 'BOLD' },
	{ offset: 9, length: 2, style: 'ITALIC' },
]

const entity3 = [
	{ offset: 4, length: 1, key: 0 },
	{ offset: 12, length: 1, key: 1 },
	{ offset: 13, length: 1, key: 1 },
]

const result3 = [
	{ offset: 1, length: 1, style: 'BOLD' },
	{ offset: 4, length: 1, key: 0 },
	{ offset: 9, length: 2, style: 'ITALIC' },
	{ offset: 12, length: 1, key: 1 },
	{ offset: 13, length: 1, key: 1 },
]

test('mergeSortedRanges: inlineRanges.length = EntityRanges.length', () => {
	const ranges = mergeSortedRanges(inline1, entity1)

	expect(ranges).toStrictEqual(result1)
})

test('mergeSortedRanges: inlineRanges.length > EntityRanges.length', () => {
	const ranges = mergeSortedRanges(inline2, entity2)

	expect(ranges).toStrictEqual(result2)
})

test('mergeSortedRanges: inlineRanges.length < EntityRanges.length', () => {
	const ranges = mergeSortedRanges(inline3, entity3)

	expect(ranges).toStrictEqual(result3)
})
