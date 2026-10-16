import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";

//#region dist/domain/apple/machoContainer.js
var FAT_MAGIC, FAT_MAGIC_64, FAT_CIGAM, FAT_CIGAM_64, MAX_FAT_ARCHITECTURES, KNOWN_MACHO_CPU_TYPES, MACHO_HEADER_MAGICS, readFatContainerHeader, classifyFatContainerIdentity, readFatSliceDeclarations, validateFatSlice, inspectFatSliceRange, validateFatSliceIdentity, safeNumber;
function init_machoContainer() {
	return (init_machoContainer = __esmMin((() => {
		FAT_MAGIC = 3405691582;
		FAT_MAGIC_64 = 3405691583;
		FAT_CIGAM = 3199925962;
		FAT_CIGAM_64 = 3216703178;
		MAX_FAT_ARCHITECTURES = 128;
		KNOWN_MACHO_CPU_TYPES = [
			7,
			16777223,
			12,
			16777228,
			33554444,
			18,
			16777234
		];
		MACHO_HEADER_MAGICS = [
			4277009102,
			4277009103,
			3472551422,
			3489328638
		];
		readFatContainerHeader = (bytes, fileSize) => {
			if (bytes.byteLength < 4) return { state: "not-fat" };
			const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
			const magic = view.getUint32(0, false);
			if (![
				FAT_MAGIC,
				FAT_MAGIC_64,
				FAT_CIGAM,
				FAT_CIGAM_64
			].includes(magic)) return { state: "not-fat" };
			if (!Number.isSafeInteger(fileSize) || fileSize < bytes.byteLength) return {
				state: "malformed",
				reason: "FAT file size is invalid or contradicts retained bytes"
			};
			if (bytes.byteLength < 8) {
				return fileSize < 8 ? {
					state: "malformed",
					reason: "FAT header is truncated"
				} : {
					state: "needs-data",
					requiredBytes: 8
				};
			}
			const littleEndian = magic === FAT_CIGAM || magic === FAT_CIGAM_64;
			const wide = magic === FAT_MAGIC_64 || magic === FAT_CIGAM_64;
			const count = view.getUint32(4, littleEndian);
			if (count === 0) return {
				state: "malformed",
				reason: "FAT header declares no architectures"
			};
			if (count > MAX_FAT_ARCHITECTURES) return { state: "not-fat" };
			const tableEnd = 8 + count * (wide ? 32 : 20);
			if (tableEnd > fileSize) return { state: "not-fat" };
			if (tableEnd > bytes.byteLength) return {
				state: "needs-data",
				requiredBytes: tableEnd
			};
			const declarations = readFatSliceDeclarations(bytes.subarray(8, tableEnd), {
				count,
				wide,
				littleEndian
			});
			return declarations.status === "parsed" ? {
				state: "parsed",
				magic,
				count,
				wide,
				littleEndian,
				tableEnd,
				slices: declarations.slices,
				rangeIssues: declarations.slices.map((slice) => inspectFatSliceRange(slice, fileSize, tableEnd))
			} : {
				state: "malformed",
				reason: declarations.reason
			};
		};
		classifyFatContainerIdentity = (header, sliceHeaderAt) => {
			const hasKnownCpu = header.slices.some(({ cpuType }) => KNOWN_MACHO_CPU_TYPES.includes(cpuType));
			const invalidRange = header.rangeIssues.find((issue) => issue !== null);
			if (hasKnownCpu) return invalidRange === undefined ? { state: "mach-o" } : {
				state: "malformed",
				...invalidRange
			};
			const validRanges = header.slices.filter((_slice, index) => header.rangeIssues[index] === null);
			const missingHeaders = [];
			let observedMachO = false;
			for (const slice of validRanges) {
				const magic = sliceHeaderAt(slice.offset);
				if (magic === undefined) missingHeaders.push(slice.offset);
				else if (magic !== null && MACHO_HEADER_MAGICS.includes(magic)) observedMachO = true;
			}
			if (observedMachO) {
				return invalidRange === undefined ? { state: "mach-o" } : {
					state: "malformed",
					...invalidRange
				};
			}
			if (missingHeaders.length > 0) return {
				state: "needs-slice-header",
				offsets: missingHeaders
			};
			return { state: "not-mach-o" };
		};
		readFatSliceDeclarations = (tableBytes, options) => {
			const { count, wide, littleEndian } = options;
			const entrySize = wide ? 32 : 20;
			if (tableBytes.byteLength < count * entrySize) return {
				status: "malformed",
				reason: "FAT table is truncated"
			};
			const view = new DataView(tableBytes.buffer, tableBytes.byteOffset, tableBytes.byteLength);
			const slices = [];
			for (let index = 0; index < count; index++) {
				const base = index * entrySize;
				const offset = wide ? safeNumber(view.getBigUint64(base + 8, littleEndian)) : view.getUint32(base + 8, littleEndian);
				const size = wide ? safeNumber(view.getBigUint64(base + 16, littleEndian)) : view.getUint32(base + 12, littleEndian);
				if (offset === null || size === null) return {
					status: "malformed",
					reason: "FAT offset or size exceeds the safe range"
				};
				slices.push({
					index,
					offset,
					size,
					alignmentExponent: view.getUint32(base + (wide ? 24 : 16), littleEndian),
					cpuType: view.getUint32(base, littleEndian),
					cpuSubtype: view.getUint32(base + 4, littleEndian)
				});
			}
			return {
				status: "parsed",
				slices
			};
		};
		validateFatSlice = (declaration, containerSize, tableEnd, embedded) => {
			const rangeIssue = inspectFatSliceRange(declaration, containerSize, tableEnd);
			if (rangeIssue !== null) return rangeIssue.reason;
			return embedded === undefined ? null : validateFatSliceIdentity(declaration, embedded);
		};
		inspectFatSliceRange = (declaration, containerSize, tableEnd) => {
			const { index, offset, size, alignmentExponent } = declaration;
			if (!Number.isSafeInteger(offset) || !Number.isSafeInteger(size) || size <= 0 || offset < tableEnd) return {
				category: "malformed",
				reason: `FAT architecture ${index} has an invalid slice range`
			};
			if (offset > containerSize || size > containerSize - offset) return {
				category: "malformed",
				reason: `FAT architecture ${index} slice range extends beyond the file`
			};
			if (!Number.isInteger(alignmentExponent) || alignmentExponent < 0 || alignmentExponent > 52) return {
				category: "unsupported",
				reason: `FAT architecture ${index} alignment exponent ${alignmentExponent} is unsupported`
			};
			if (offset % 2 ** alignmentExponent !== 0) return {
				category: "malformed",
				reason: `FAT architecture ${index} offset is not aligned to 2^${alignmentExponent}`
			};
			return null;
		};
		validateFatSliceIdentity = (declaration, embedded) => embedded.cpuType === declaration.cpuType && embedded.cpuSubtype === declaration.cpuSubtype ? null : `FAT architecture ${declaration.index} CPU type/subtype disagrees with its Mach-O header`;
		safeNumber = (value) => value > BigInt(Number.MAX_SAFE_INTEGER) ? null : Number(value);
	})))();
}

//#endregion
export { classifyFatContainerIdentity, init_machoContainer, readFatContainerHeader, readFatSliceDeclarations, validateFatSlice, validateFatSliceIdentity };