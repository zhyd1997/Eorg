import { mergeSortedRanges } from '../utils'

// TODO random data for Jest.

test('mergeSortedRanges', () => {
	const a = [
		{ offset: 1, length: 1, style: 'BOLD' },
		{ offset: 9, length: 2, style: 'ITALIC' },
	]

	const b = [
		{ offset: 4, length: 1, key: 0 },
		{ offset: 12, length: 1, key: 1 },
		{ offset: 13, length: 1, key: 2 },
	]

	const ranges = mergeSortedRanges(a, b)

	const result = [
		{ offset: 1, length: 1, style: 'BOLD' },
		{ offset: 4, length: 1, key: 0 },
		{ offset: 9, length: 2, style: 'ITALIC' },
		{ offset: 12, length: 1, key: 1 },
		{ offset: 13, length: 1, key: 2 },
	]

	expect(ranges).toStrictEqual(result)
})
