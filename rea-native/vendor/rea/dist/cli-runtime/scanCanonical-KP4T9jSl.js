import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { ZIP_NON_ENTRY_LIMITATION, artifactContradictionId, artifactEdgeId, artifactGraphDigest, artifactIdForContent, artifactInventoryResultSchema, artifactManifestId, compareUnicodeCodePoints, digestCanonicalValue, hasZipSignature, init_artifactGraph, init_artifactIdentity, init_canonicalDigest, init_machoCpuIdentity, init_unicodeCodePointOrder, init_zipPackageFormat, isZipPackageFormat, machoCpuSubtypeBase, occurrenceIdForLocation, zipPackageFormatForPath } from "./reconstructionObligationLedgerSchemas-Bao0xMr-.js";
import { ArtifactReaderFailure, copyArtifactEntry, init_ArtifactReader, sameArtifactEntry, sameArtifactSourceIdentity } from "./ArtifactReader-BXkffc1D.js";
import { NonRegularFileReadError, OwnedFileHandle, RegularFileAdmissionFailure, init_OwnedFileHandle, init_RegularFile, openRegularFile, sameRegularFileState } from "./RegularFile-B_6KPCNQ.js";
import { execFileOutput, execFileOutputFailure, init_ExecFileOutput } from "./ExecFileOutput-BEQs-lDD.js";
import { classifyFatContainerIdentity, init_machoContainer, readFatContainerHeader } from "./machoContainer-C8BIkkq3.js";
import { MAX_XML_PLIST_PROBE_BYTES, createXmlPlistSignatureProbe, hasBinaryPlistSignature, hasXmlPlistSignature, init_appleArchiveFormat, init_dosMz, observeMzWindowsHeader, parseDosMzHeader } from "./appleArchiveFormat-tVoI2ykA.js";
import { ArtifactPathRegistry, OwnedDirectoryHandle, annotateEnglishUnicodeCaseCollisions, init_ArtifactPaths, init_MachoLoadCommandReader, init_OwnedDirectoryHandle, init_StreamBytes, normalizeArtifactPath, readMachoImage, streamChunkToBuffer } from "./MachoLoadCommandReader-C7e074Ze.js";
import { init_readFileHandleChunks, readFileHandleChunks } from "./readFileHandleChunks-dp60iZ6v.js";
import { ZipArtifactReader, init_ZipArtifactReader } from "./ZipArtifactReader-B8ZgNe4D.js";
import { admitAsarHeader, init_AsarHeader } from "./AsarHeader-CnzOzYEH.js";
import { XcrunCommandRunner, init_CommandRunner, init_lipo, parseLipoOutput } from "./lipo-DSWP6fv-.js";
import { z } from "zod";
import { basename, extname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { createHash } from "node:crypto";
import { lstat, mkdtemp, open, opendir, realpath, rm } from "node:fs/promises";
import { constants, createWriteStream } from "node:fs";
import { Readable, Transform } from "node:stream";
import { tmpdir } from "node:os";
import { setImmediate } from "node:timers/promises";
import { pipeline } from "node:stream/promises";
import { parse } from "plist";
import { getRawHeader, uncache } from "@electron/asar";

//#region dist/artifacts/AsarEntryStream.js
var closeAsarHandle, readValidatedAsarEntry, abortIfNeeded$3, asarFailure$1, isFilesystemFailure$1;
function init_AsarEntryStream() {
	return (init_AsarEntryStream = __esmMin((() => {
		init_ArtifactReader();
		closeAsarHandle = async (close, signal) => {
			await close();
			abortIfNeeded$3(signal);
		};
		readValidatedAsarEntry = (source, expectedBytes, entryPath, archivePath, signal) => {
			const output = Readable.from((async function* () {
				let observedBytes = 0;
				const iterator = source[Symbol.asyncIterator]();
				try {
					while (true) {
						abortIfNeeded$3(signal);
						const next = await iterator.next();
						if (next.done) break;
						const chunk = next.value;
						if (!Buffer.isBuffer(chunk) && !(chunk instanceof Uint8Array)) throw new ArtifactReaderFailure("format", `ASAR entry did not return bytes: ${entryPath}`);
						observedBytes += Buffer.isBuffer(chunk) ? chunk.length : chunk.byteLength;
						if (expectedBytes !== undefined && observedBytes > expectedBytes) throw new ArtifactReaderFailure("integrity", `ASAR entry exceeded its declared size: ${entryPath}`);
						yield chunk;
					}
					if (expectedBytes !== undefined && observedBytes !== expectedBytes) throw new ArtifactReaderFailure("integrity", `ASAR entry size disagrees with its header: ${entryPath}`);
				} catch (cause) {
					throw asarFailure$1(archivePath, `read ${entryPath}`, cause);
				} finally {
					try {
						await iterator.return?.();
					} catch {}
					if (!source.destroyed) source.destroy();
				}
			})());
			const closeSource = () => {
				signal?.removeEventListener("abort", onAbort);
				if (!source.destroyed) source.destroy();
			};
			const onAbort = () => {
				closeSource();
				output.destroy(new ArtifactReaderFailure("cancelled", "ASAR operation cancelled"));
			};
			output.once("close", closeSource);
			signal?.addEventListener("abort", onAbort, { once: true });
			if (signal?.aborted === true) onAbort();
			return output;
		};
		abortIfNeeded$3 = (signal) => {
			if (signal?.aborted === true) throw new ArtifactReaderFailure("cancelled", "ASAR operation cancelled");
		};
		asarFailure$1 = (path, operation, cause) => {
			if (cause instanceof ArtifactReaderFailure) return cause;
			if (isFilesystemFailure$1(cause)) return new ArtifactReaderFailure("io", `Could not ${operation} ASAR at ${path}: ${cause.message}`, { cause });
			return new ArtifactReaderFailure("format", `Malformed ASAR during ${operation}: ${path}`, { cause });
		};
		isFilesystemFailure$1 = (cause) => cause instanceof Error && "errno" in cause && typeof cause.errno === "number" && "syscall" in cause && typeof cause.syscall === "string";
	})))();
}

//#endregion
//#region dist/artifacts/AsarListing.js
function* ownChildren(files) {
	for (const name in files) if (Object.hasOwn(files, name)) yield [name, files[name]];
}
var MAX_LISTING_BYTES, nodeSchema, readAsarListing;
function init_AsarListing() {
	return (init_AsarListing = __esmMin((() => {
		init_ArtifactReader();
		init_unicodeCodePointOrder();
		MAX_LISTING_BYTES = 64 * 1024 * 1024;
		nodeSchema = z.looseObject({
			files: z.custom((value) => value !== null && typeof value === "object" && !Array.isArray(value)).optional(),
			link: z.string().optional(),
			size: z.number().nonnegative().safe().optional(),
			offset: z.string().optional(),
			unpacked: z.boolean().optional(),
			executable: z.boolean().optional(),
			integrity: z.looseObject({
				algorithm: z.string(),
				hash: z.string()
			}).optional()
		});
		readAsarListing = async (header, signal) => {
			const root = nodeSchema.parse(header);
			if (root.files === undefined) throw new ArtifactReaderFailure("format", "ASAR root has no files table");
			const entries = [];
			const pending = [{
				parent: "",
				children: ownChildren(root.files)
			}];
			let retainedBytes = 0;
			let examined = 0;
			while (pending.length > 0) {
				if (examined++ % 128 === 0) {
					await setImmediate();
					if (signal?.aborted) throw new ArtifactReaderFailure("cancelled", "ASAR operation cancelled");
				}
				const frame = pending.at(-1);
				if (frame === undefined) break;
				const next = frame.children.next();
				if (next.done) {
					pending.pop();
					continue;
				}
				const [name, raw] = next.value;
				if (name.length === 0 || name === "." || name === ".." || name.includes("/") || name.includes("\0") || process.platform === "win32" && name.includes("\\")) throw new ArtifactReaderFailure("path", "ASAR header has an unsafe path component");
				const units = frame.parent.length + name.length + (frame.parent.length === 0 ? 0 : 1);
				retainedBytes += units * 2 + 256;
				if (retainedBytes > MAX_LISTING_BYTES) throw new ArtifactReaderFailure("limit", "ASAR expanded listing exceeds its 64 MiB representation budget");
				const path = frame.parent.length === 0 ? name : `${frame.parent}/${name}`;
				const metadata = nodeSchema.parse(raw);
				if (metadata.files === undefined && metadata.link === undefined && metadata.size === undefined) throw new ArtifactReaderFailure("format", "ASAR entry has no directory, link or file metadata");
				entries.push({
					path,
					metadata
				});
				if (metadata.files !== undefined) pending.push({
					parent: path,
					children: ownChildren(metadata.files)
				});
			}
			return entries.sort((left, right) => compareUnicodeCodePoints(left.path, right.path));
		};
	})))();
}

//#endregion
//#region dist/artifacts/AsarArtifactReader.js
var AsarArtifactReader, defaultRemoveSnapshot, asarUnpackedEntryFailure, isAsarFileMetadata, parseArchiveOffset, abortIfNeeded$2, waitForOperation, asarFailure, isFilesystemFailure, isMissingFile;
function init_AsarArtifactReader() {
	return (init_AsarArtifactReader = __esmMin((() => {
		init_ArtifactReader();
		init_AsarEntryStream();
		init_AsarHeader();
		init_OwnedFileHandle();
		init_readFileHandleChunks();
		init_AsarListing();
		AsarArtifactReader = class {
			path;
			options;
			format = "asar";
			#archiveSize;
			#headerSize;
			#entries = new Map();
			#ownedHandles = new Map();
			#snapshot;
			#snapshotRoot;
			#snapshotOperation = Promise.resolve();
			constructor(path, options = {}) {
				this.path = path;
				this.options = options;
			}
			async *entries(signal) {
				let paths;
				try {
					await this.prepareContainer(undefined, signal);
					paths = await this.#withSnapshotOperation(async () => {
						const snapshotPath = this.#snapshotPath();
						this.#resetArchiveState();
						this.#entries.clear();
						const admitted = await this.#admitHeader(snapshotPath);
						this.#archiveSize = admitted.archiveBytes;
						this.#headerSize = admitted.headerBytes;
						abortIfNeeded$2(signal);
						const ordered = await readAsarListing(getRawHeader(snapshotPath).header, signal);
						const archiveMetadata = await lstat(snapshotPath);
						if (!archiveMetadata.isFile() || archiveMetadata.isSymbolicLink()) throw new ArtifactReaderFailure("format", "ASAR container is not a regular file");
						this.#archiveSize = archiveMetadata.size;
						return ordered;
					}, signal);
				} catch (cause) {
					throw asarFailure(this.path, "inventory", cause);
				}
				for (const { metadata, path } of paths) {
					abortIfNeeded$2(signal);
					const providerPath = path.split("/").join(sep);
					const kind = metadata.files !== undefined ? "directory" : metadata.link !== undefined ? "symlink" : "file";
					const entry = {
						path,
						kind,
						declaredSize: metadata.size ?? null,
						compressedSize: null,
						executable: metadata.executable === true,
						encrypted: false,
						byteOffset: null,
						declaredSha256: metadata.integrity !== undefined && metadata.integrity.algorithm === "SHA256" && /^[a-f0-9]{64}$/u.test(metadata.integrity.hash) ? metadata.integrity.hash : null,
						unpacked: "unpacked" in metadata && metadata.unpacked === true,
						limitations: kind === "symlink" ? ["ASAR symlink target was not followed or disclosed."] : [],
						adapterKey: providerPath
					};
					if (kind === "file" && isAsarFileMetadata(metadata)) this.#entries.set(providerPath, {
						metadata,
						entry: copyArtifactEntry(entry)
					});
					yield entry;
				}
			}
			async #admitHeader(snapshotPath) {
				const headerHandle = await this.#openOwned(snapshotPath, constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK);
				let admission;
				try {
					admission = {
						ok: true,
						value: await admitAsarHeader(headerHandle)
					};
				} catch (cause) {
					admission = {
						ok: false,
						cause
					};
				}
				try {
					await this.#closeOwnedHandle(headerHandle);
				} catch (cleanupCause) {
					if (!admission.ok) throw ArtifactReaderFailure.withCleanup(admission.cause, ArtifactReaderFailure.cleanupObservation(cleanupCause, snapshotPath));
					throw cleanupCause;
				}
				if (!admission.ok) throw admission.cause;
				return admission.value;
			}
			async open(entry, signal) {
				return this.#withSnapshotOperation(() => this.#openEntry(entry, signal), signal);
			}
			async #openEntry(entry, signal) {
				abortIfNeeded$2(signal);
				const state = this.#entries.get(entry.adapterKey);
				if (state === undefined && entry.kind !== "file") throw new ArtifactReaderFailure("format", "ASAR entry is not a regular file");
				if (state === undefined) throw new ArtifactReaderFailure("integrity", `ASAR entry was not produced by this reader: ${entry.path}`);
				if (!sameArtifactEntry(entry, state.entry)) throw new ArtifactReaderFailure("integrity", `ASAR entry metadata changed since inventory: ${state.entry.path}`);
				if (state.entry.unpacked) return this.#openUnpackedStream(state.entry, signal);
				return this.#openPackedStream(state, signal);
			}
			async #openPackedStream(state, signal) {
				const { metadata, entry: producedEntry } = state;
				const archiveSize = this.#archiveSize;
				const headerSize = this.#headerSize;
				const offset = metadata.offset === undefined ? undefined : parseArchiveOffset(metadata.offset);
				const start = offset === undefined || headerSize === undefined ? undefined : 8 + headerSize + offset;
				if (archiveSize === undefined || start === undefined || !Number.isSafeInteger(start) || metadata.size < 0 || !Number.isSafeInteger(metadata.size) || start > archiveSize || metadata.size > archiveSize - start) throw new ArtifactReaderFailure("format", `ASAR entry range is outside its container: ${producedEntry.path}`);
				const snapshotPath = this.#snapshotPath();
				let handle;
				try {
					const openedHandle = await this.#openOwned(snapshotPath, constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK);
					handle = openedHandle;
					const observed = await openedHandle.stat();
					abortIfNeeded$2(signal);
					if (!observed.isFile() || observed.size !== archiveSize) throw new ArtifactReaderFailure("integrity", `ASAR container changed before read: ${producedEntry.path}`);
					if (metadata.size === 0) {
						handle = undefined;
						await closeAsarHandle(() => this.#closeOwnedHandle(openedHandle), signal);
						return Readable.from([]);
					}
					const source = this.#ownedReadStream(openedHandle, {
						start,
						end: start + metadata.size - 1,
						signal
					});
					handle = undefined;
					const output = readValidatedAsarEntry(source, metadata.size, producedEntry.path, this.path, signal);
					this.#setOwnedOutput(openedHandle, output);
					return output;
				} catch (cause) {
					const failure = asarFailure(this.path, `read ${producedEntry.path}`, cause);
					if (handle !== undefined) {
						try {
							await this.#closeOwnedHandle(handle);
						} catch (cleanupCause) {
							throw ArtifactReaderFailure.withCleanup(failure, ArtifactReaderFailure.cleanupObservation(cleanupCause, snapshotPath));
						}
					}
					throw failure;
				}
			}
			/** Capture once per reader lifetime; bind all interpretation to these exact bytes. */
			async prepareContainer(expectedSha256, signal) {
				await this.#withSnapshotOperation(async () => {
					abortIfNeeded$2(signal);
					if (this.#snapshot === undefined && this.#snapshotRoot !== undefined) await this.#closeSnapshot();
					if (this.#snapshot === undefined) await this.#captureSnapshot(signal);
					if (expectedSha256 !== undefined && this.#snapshot?.sha256 !== expectedSha256) throw new ArtifactReaderFailure("integrity", `ASAR container changed before interpretation: ${this.path}`);
				}, signal);
			}
			/** Read the same captured container that supplies headers and packed members. */
			async openContainer(signal) {
				await this.prepareContainer(undefined, signal);
				return this.#withSnapshotOperation(async () => {
					abortIfNeeded$2(signal);
					const snapshotPath = this.#snapshotPath();
					const handle = await this.#openOwned(snapshotPath, constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK);
					return this.#ownedReadStream(handle, { signal });
				}, signal);
			}
			async close() {
				await this.#withSnapshotOperation(() => this.#closeSnapshot());
			}
			async #captureSnapshot(signal) {
				let inputHandle;
				try {
					this.#snapshotRoot = await mkdtemp(join(tmpdir(), "rea-asar-snapshot-"));
					const snapshotPath = join(this.#snapshotRoot, "container.asar");
					const hash = createHash("sha256");
					inputHandle = await this.#openOwned(this.path, constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK);
					const source = this.#ownedReadStream(inputHandle, {
						signal,
						releaseOnClose: false
					});
					const digesting = new Transform({ transform(chunk, _encoding, callback) {
						hash.update(chunk);
						callback(null, chunk);
					} });
					await pipeline(source, digesting, createWriteStream(snapshotPath, {
						flags: "wx",
						mode: 384
					}), signal === undefined ? {} : { signal });
					const completedInput = inputHandle;
					inputHandle = undefined;
					await this.#closeOwnedHandle(completedInput);
					this.#snapshot = {
						path: snapshotPath,
						sha256: hash.digest("hex")
					};
				} catch (cause) {
					let failure = signal?.aborted === true ? new ArtifactReaderFailure("cancelled", "ASAR operation cancelled", { cause }) : asarFailure(this.path, "snapshot", cause);
					if (inputHandle !== undefined) {
						const failedInput = inputHandle;
						inputHandle = undefined;
						try {
							await this.#closeOwnedHandle(failedInput);
						} catch (cleanupCause) {
							failure = ArtifactReaderFailure.withCleanup(failure, ArtifactReaderFailure.cleanupObservation(cleanupCause, this.path));
						}
					}
					try {
						if (this.#ownedHandles.size === 0) await this.#closeSnapshot();
					} catch (cleanupCause) {
						throw ArtifactReaderFailure.withCleanup(failure, ArtifactReaderFailure.cleanupObservation(cleanupCause, this.#snapshotRoot ?? this.path));
					}
					throw failure;
				}
			}
			async #closeSnapshot() {
				await this.#closeOwnedHandles();
				const root = this.#snapshotRoot;
				if (root !== undefined) {
					try {
						await (this.options.removeSnapshot ?? defaultRemoveSnapshot)(root);
						if (this.#snapshotRoot === root) this.#snapshotRoot = undefined;
					} catch (cause) {
						throw ArtifactReaderFailure.withCleanup(cause, {
							reason: `Could not remove ASAR snapshot: ${root}`,
							resources: [root]
						});
					}
				}
				if (root === undefined || this.#snapshotRoot === undefined) {
					if (this.#snapshot !== undefined) uncache(this.#snapshot.path);
					this.#snapshot = undefined;
					this.#resetArchiveState();
					this.#entries.clear();
				}
			}
			async #withSnapshotOperation(operation, signal) {
				const previous = this.#snapshotOperation;
				let release;
				this.#snapshotOperation = new Promise((resolve) => {
					release = resolve;
				});
				try {
					await waitForOperation(previous, signal);
				} catch (cause) {
					void previous.then(release, release);
					throw cause;
				}
				try {
					abortIfNeeded$2(signal);
					return await operation();
				} finally {
					release();
				}
			}
			#snapshotPath() {
				if (this.#snapshot === undefined) throw new ArtifactReaderFailure("integrity", "ASAR snapshot is not available");
				return this.#snapshot.path;
			}
			provenance() {
				return [];
			}
			async #openUnpackedStream(entry, signal) {
				const unpackedRoot = `${this.path}.unpacked`;
				let handle;
				try {
					const rootMetadata = await lstat(unpackedRoot);
					if (!rootMetadata.isDirectory() || rootMetadata.isSymbolicLink()) throw new ArtifactReaderFailure("path", "ASAR unpacked companion is not a regular directory");
					const canonicalRoot = await realpath(unpackedRoot);
					const candidate = join(unpackedRoot, entry.adapterKey);
					const canonical = await realpath(candidate);
					const relativePath = relative(canonicalRoot, canonical);
					if (relativePath === ".." || relativePath.startsWith(`..${sep}`) || isAbsolute(relativePath)) throw new ArtifactReaderFailure("path", `ASAR unpacked entry escaped its companion directory: ${entry.path}`);
					const pathMetadata = await lstat(candidate);
					if (!pathMetadata.isFile() || pathMetadata.isSymbolicLink()) throw new ArtifactReaderFailure("path", `ASAR unpacked entry is not a regular file: ${entry.path}`);
					handle = await (this.options.openUnpackedFile ?? open)(canonical, constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK);
					const openedHandle = handle;
					this.#adoptHandle(openedHandle, canonical);
					const openedMetadata = await openedHandle.stat();
					if (!openedMetadata.isFile() || openedMetadata.dev !== pathMetadata.dev || openedMetadata.ino !== pathMetadata.ino) {
						throw new ArtifactReaderFailure("integrity", `ASAR unpacked entry changed before read: ${entry.path}`, {}, {
							logicalPath: entry.path,
							declaredSha256: entry.declaredSha256,
							calculatedSha256: null,
							unpacked: true
						});
					}
					abortIfNeeded$2(signal);
					const source = this.#ownedReadStream(openedHandle, { start: 0 });
					handle = undefined;
					const output = readValidatedAsarEntry(source, undefined, entry.path, this.path, signal);
					this.#setOwnedOutput(openedHandle, output);
					return output;
				} catch (cause) {
					let failure = asarUnpackedEntryFailure(this.path, entry, cause);
					if (handle !== undefined && this.#ownedHandles.has(handle)) {
						try {
							await this.#closeOwnedHandle(handle);
						} catch (cleanupCause) {
							failure = ArtifactReaderFailure.withCleanup(failure, ArtifactReaderFailure.cleanupObservation(cleanupCause, this.#ownedHandles.get(handle)?.path ?? entry.path));
						}
					}
					throw failure;
				}
			}
			async #closeOwnedHandle(handle) {
				const owned = this.#ownedHandles.get(handle);
				if (owned === undefined) return;
				owned.output?.destroy();
				owned.source?.destroy();
				try {
					await owned.owner.close();
				} catch (cause) {
					throw ArtifactReaderFailure.withCleanup(cause, ArtifactReaderFailure.cleanupObservation(cause, owned.path));
				}
				this.#ownedHandles.delete(handle);
			}
			async #closeOwnedHandles() {
				let failure;
				for (const [handle, owned] of this.#ownedHandles) {
					try {
						await this.#closeOwnedHandle(handle);
					} catch (cause) {
						failure = ArtifactReaderFailure.withCleanup(failure ?? cause, ArtifactReaderFailure.cleanupObservation(cause, owned.path));
					}
				}
				if (failure !== undefined) throw failure;
			}
			async #openOwned(path, flags) {
				const handle = await (this.options.openFile ?? open)(path, flags);
				this.#adoptHandle(handle, path);
				return handle;
			}
			#adoptHandle(handle, path) {
				this.#ownedHandles.set(handle, {
					path,
					owner: new OwnedFileHandle(handle)
				});
			}
			#ownedReadStream(handle, options) {
				const { releaseOnClose, ...readOptions } = options;
				const source = readFileHandleChunks(handle, readOptions);
				const owned = this.#ownedHandles.get(handle);
				if (owned === undefined) throw new ArtifactReaderFailure("integrity", "ASAR handle has no owner");
				owned.source = source;
				owned.output = source;
				if (releaseOnClose !== false) source.once("close", () => {
					void this.#closeOwnedHandle(handle).catch(() => undefined);
				});
				return source;
			}
			#setOwnedOutput(handle, output) {
				const owned = this.#ownedHandles.get(handle);
				if (owned !== undefined) owned.output = output;
			}
			#resetArchiveState() {
				this.#archiveSize = undefined;
				this.#headerSize = undefined;
			}
		};
		defaultRemoveSnapshot = (path) => rm(path, {
			recursive: true,
			force: true
		});
		asarUnpackedEntryFailure = (archivePath, entry, cause) => {
			if (cause instanceof ArtifactReaderFailure) return cause;
			if (entry.unpacked && isMissingFile(cause)) return new ArtifactReaderFailure("unavailable", `ASAR unpacked entry bytes are unavailable: ${entry.path}`, { cause }, {
				logicalPath: entry.path,
				declaredSha256: entry.declaredSha256,
				calculatedSha256: null,
				unpacked: true
			});
			return asarFailure(archivePath, `read ${entry.path}`, cause);
		};
		isAsarFileMetadata = (metadata) => typeof metadata.size === "number" && metadata.files === undefined && metadata.link === undefined;
		parseArchiveOffset = (value) => {
			if (!/^(?:0|[1-9][0-9]*)$/u.test(value)) return undefined;
			const offset = Number(value);
			return Number.isSafeInteger(offset) ? offset : undefined;
		};
		abortIfNeeded$2 = (signal) => {
			if (signal?.aborted === true) throw new ArtifactReaderFailure("cancelled", "ASAR operation cancelled");
		};
		waitForOperation = async (operation, signal) => {
			if (signal === undefined) return operation;
			abortIfNeeded$2(signal);
			await new Promise((resolve, reject) => {
				const removeAbortListener = () => signal.removeEventListener("abort", onAbort);
				const onAbort = () => {
					removeAbortListener();
					reject(new ArtifactReaderFailure("cancelled", "ASAR operation cancelled"));
				};
				signal.addEventListener("abort", onAbort, { once: true });
				operation.then(() => {
					removeAbortListener();
					resolve();
				}, (cause) => {
					removeAbortListener();
					reject(cause);
				});
			});
		};
		asarFailure = (path, operation, cause) => {
			if (cause instanceof ArtifactReaderFailure) return cause;
			if (isFilesystemFailure(cause)) return new ArtifactReaderFailure("io", `Could not ${operation} ASAR at ${path}: ${cause.message}`, { cause });
			return new ArtifactReaderFailure("format", `Malformed ASAR during ${operation}: ${path}`, { cause });
		};
		isFilesystemFailure = (cause) => cause instanceof Error && "errno" in cause && typeof cause.errno === "number" && "syscall" in cause && typeof cause.syscall === "string";
		isMissingFile = (cause) => typeof cause === "object" && cause !== null && "code" in cause && cause.code === "ENOENT";
	})))();
}

//#endregion
//#region dist/artifacts/hostExecutableMarking.js
var windowsLaunchableExtensions, hostExecutableMarking;
function init_hostExecutableMarking() {
	return (init_hostExecutableMarking = __esmMin((() => {
		windowsLaunchableExtensions = new Set([
			".bat",
			".cmd",
			".com",
			".exe"
		]);
		hostExecutableMarking = (path, metadata, platform = process.platform) => platform === "win32" ? metadata.isFile() && windowsLaunchableExtensions.has(extname(path).toLowerCase()) : typeof metadata.mode === "bigint" ? (metadata.mode & 73n) !== 0n : (metadata.mode & 73) !== 0;
	})))();
}

//#endregion
//#region dist/artifacts/DirectoryArtifactReader.js
var DirectoryArtifactReader, unsupportedEntryKind, artifactEntry, safeArtifactSize, directoryIoFailure, failureMessage$1, mapStableFileRead, withDirectoryIoContext, abortIfNeeded$1, assertContainedDirectory;
function init_DirectoryArtifactReader() {
	return (init_DirectoryArtifactReader = __esmMin((() => {
		init_ArtifactReader();
		init_hostExecutableMarking();
		init_OwnedDirectoryHandle();
		init_OwnedFileHandle();
		init_readFileHandleChunks();
		DirectoryArtifactReader = class {
			format = "directory";
			#rootPromise;
			#rootIdentity;
			#rootPath;
			#directories = new Set();
			#files = new Map();
			constructor(root) {
				this.#rootPath = root;
			}
			/** Enumerate entries, optionally restricting descent while retaining directories. */
			async *entries(signal, selection) {
				const root = await this.#resolveRoot();
				const options = typeof selection === "function" ? { descendInto: selection } : selection;
				const pending = [root];
				while (pending.length > 0) {
					abortIfNeeded$1(signal);
					const directory = pending.pop();
					if (directory === undefined) break;
					await withDirectoryIoContext("inspect directory", directory, () => assertContainedDirectory(root, directory, this.#rootIdentity));
					for await (const entry of this.#readDirectory(directory, pending, signal, options)) yield entry;
					await withDirectoryIoContext("inspect directory", directory, () => assertContainedDirectory(root, directory, this.#rootIdentity));
				}
			}
			async #resolveRoot() {
				return this.#rootPromise ??= (async () => {
					const root = await realpath(this.#rootPath);
					const metadata = await lstat(root, { bigint: true });
					if (metadata.isSymbolicLink() || !metadata.isDirectory()) throw new ArtifactReaderFailure("path", "Artifact root changed during traversal");
					this.#rootIdentity = {
						dev: metadata.dev,
						ino: metadata.ino
					};
					return root;
				})().catch((cause) => {
					if (cause instanceof ArtifactReaderFailure) throw cause;
					throw directoryIoFailure("resolve artifact root", this.#rootPath, cause);
				});
			}
			async *#readDirectory(directory, pending, signal, options) {
				const root = await this.#resolveRoot();
				const handle = new OwnedDirectoryHandle(await opendir(directory).catch((cause) => {
					throw directoryIoFailure("open directory", directory, cause);
				}));
				this.#directories.add(handle);
				const childDirectories = [];
				let traversal = { kind: "complete" };
				try {
					for (;;) {
						await withDirectoryIoContext("inspect directory", directory, () => assertContainedDirectory(root, directory, this.#rootIdentity));
						const child = await handle.handle.read();
						if (child === null) break;
						abortIfNeeded$1(signal);
						const absolute = join(directory, child.name);
						const metadata = await lstat(absolute, { bigint: true }).catch((cause) => {
							throw directoryIoFailure("inspect entry", absolute, cause);
						});
						const path = relative(root, absolute).split(sep).join("/");
						const entry = artifactEntry(path, absolute, metadata);
						if (entry === undefined) {
							options?.onOmission?.({
								path,
								kind: unsupportedEntryKind(metadata)
							});
							continue;
						}
						yield entry;
						if (entry.kind === "directory") {
							if (options?.descendInto?.(path) ?? true) childDirectories.push(absolute);
							else options?.onOmission?.({
								path,
								kind: "directory-descendants"
							});
						}
					}
				} catch (cause) {
					traversal = {
						kind: "failed",
						cause: cause instanceof ArtifactReaderFailure ? cause : directoryIoFailure("read directory", directory, cause)
					};
				} finally {
					await this.#finishDirectory(handle, directory, traversal);
				}
				if (traversal.kind === "failed") throw traversal.cause;
				childDirectories.reverse();
				pending.push(...childDirectories);
			}
			async #finishDirectory(handle, path, traversal) {
				try {
					await handle.close();
					this.#directories.delete(handle);
				} catch (cause) {
					const closeFailure = directoryIoFailure("close directory", path, cause);
					if (traversal.kind === "failed") throw ArtifactReaderFailure.withCleanup(traversal.cause, ArtifactReaderFailure.cleanupObservation(closeFailure, path));
					throw closeFailure;
				}
			}
			async open(entry, signal) {
				abortIfNeeded$1(signal);
				if (entry.kind !== "file") throw new ArtifactReaderFailure("format", "Only regular files can be opened");
				const fileHandle = await open(entry.adapterKey, constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK).catch((cause) => {
					throw directoryIoFailure("open entry", entry.adapterKey, cause);
				});
				const owner = new OwnedFileHandle(fileHandle);
				this.#files.set(owner, entry.adapterKey);
				try {
					const observed = await owner.handle.stat({ bigint: true }).catch((cause) => {
						throw directoryIoFailure("inspect opened entry", entry.adapterKey, cause);
					});
					if (!observed.isFile() || !sameArtifactSourceIdentity(entry.sourceIdentity, observed)) {
						throw new ArtifactReaderFailure("integrity", `Directory entry changed before open: ${entry.path}`);
					}
					abortIfNeeded$1(signal);
					const source = Readable.from(mapStableFileRead(owner.handle, entry, signal), { objectMode: false });
					source.once("close", () => {
						void this.#closeFile(owner).catch(() => undefined);
					});
					return source;
				} catch (cause) {
					try {
						await this.#closeFile(owner);
					} catch (closeCause) {
						throw ArtifactReaderFailure.withCleanup(cause, ArtifactReaderFailure.cleanupObservation(directoryIoFailure("close opened entry", entry.adapterKey, closeCause), entry.adapterKey));
					}
					throw cause;
				}
			}
			async close() {
				const failures = [];
				for (const [owner, path] of this.#files) {
					try {
						await this.#closeFile(owner);
					} catch (cause) {
						failures.push(directoryIoFailure("close opened entry", path, cause));
					}
				}
				for (const owner of this.#directories) {
					try {
						await owner.close();
						this.#directories.delete(owner);
					} catch (cause) {
						failures.push(directoryIoFailure("close directory", owner.handle.path, cause));
					}
				}
				if (failures.length > 0) {
					const reason = failures.map(failureMessage$1).join("; ");
					throw new ArtifactReaderFailure("io", `Directory artifact cleanup failed: ${reason}`, {
						cause: new AggregateError(failures),
						cleanup: {
							reason,
							resources: [...this.#files.values(), ...[...this.#directories].map((owner) => owner.handle.path)]
						}
					});
				}
			}
			async #closeFile(owner) {
				await owner.close();
				this.#files.delete(owner);
			}
			provenance() {
				return [];
			}
		};
		unsupportedEntryKind = (metadata) => metadata.isFIFO() ? "fifo" : metadata.isSocket() ? "socket" : metadata.isBlockDevice() ? "block-device" : metadata.isCharacterDevice() ? "character-device" : "unsupported";
		artifactEntry = (path, absolute, metadata) => {
			const kind = metadata.isSymbolicLink() ? "symlink" : metadata.isDirectory() ? "directory" : metadata.isFile() ? "file" : undefined;
			if (kind === undefined) return undefined;
			return {
				path,
				kind,
				declaredSize: kind === "file" ? safeArtifactSize(metadata.size) : null,
				compressedSize: null,
				executable: hostExecutableMarking(absolute, metadata),
				encrypted: false,
				byteOffset: null,
				declaredSha256: null,
				unpacked: false,
				limitations: kind === "symlink" ? ["Symlink target was not followed or disclosed."] : [],
				adapterKey: absolute,
				...kind === "file" ? { sourceIdentity: {
					device: metadata.dev,
					inode: metadata.ino,
					size: metadata.size,
					mode: metadata.mode,
					mtimeNs: metadata.mtimeNs,
					ctimeNs: metadata.ctimeNs
				} } : {}
			};
		};
		safeArtifactSize = (size) => {
			if (size < 0n || size > BigInt(Number.MAX_SAFE_INTEGER)) return null;
			return Number(size);
		};
		directoryIoFailure = (operation, path, cause) => {
			if (cause instanceof ArtifactReaderFailure) return cause;
			const code = typeof cause === "object" && cause !== null && "code" in cause && typeof cause.code === "string" ? ` (${cause.code})` : "";
			const detail = failureMessage$1(cause);
			return new ArtifactReaderFailure("io", `Could not ${operation} at ${path}${code}: ${detail}`, { cause });
		};
		failureMessage$1 = (cause) => cause instanceof Error ? cause.message : String(cause);
		mapStableFileRead = async function* (handle, entry, signal) {
			let bytes = 0n;
			try {
				const expectedBytes = entry.sourceIdentity?.size;
				if (expectedBytes === undefined) throw new ArtifactReaderFailure("integrity", `Directory entry has no captured file state: ${entry.path}`);
				for await (const chunk of readFileHandleChunks(handle, {
					end: expectedBytes,
					signal
				})) {
					abortIfNeeded$1(signal);
					bytes += BigInt(chunk.length);
					yield chunk;
				}
				abortIfNeeded$1(signal);
				const [opened, current] = await Promise.all([handle.stat({ bigint: true }), lstat(entry.adapterKey, { bigint: true })]);
				abortIfNeeded$1(signal);
				if (!opened.isFile() || !current.isFile() || !sameArtifactSourceIdentity(entry.sourceIdentity, opened) || !sameArtifactSourceIdentity(entry.sourceIdentity, current) || bytes !== expectedBytes) throw new ArtifactReaderFailure("integrity", `Directory entry changed during read: ${entry.path}`);
			} catch (cause) {
				if (signal?.aborted === true) throw new ArtifactReaderFailure("cancelled", "Directory artifact read cancelled", { cause });
				if (cause instanceof Error && "code" in cause && [
					"ENOENT",
					"ENOTDIR",
					"ELOOP"
				].includes(String(cause.code))) throw new ArtifactReaderFailure("integrity", `Directory entry changed during read: ${entry.path}`, { cause });
				if (!(cause instanceof ArtifactReaderFailure)) throw directoryIoFailure("validate read entry", entry.adapterKey, cause);
				throw cause;
			}
		};
		withDirectoryIoContext = async (operation, path, action) => {
			try {
				return await action();
			} catch (cause) {
				throw directoryIoFailure(operation, path, cause);
			}
		};
		abortIfNeeded$1 = (signal) => {
			if (signal?.aborted === true) throw new ArtifactReaderFailure("cancelled", "Artifact traversal cancelled");
		};
		assertContainedDirectory = async (root, directory, rootIdentity) => {
			const canonical = await realpath(directory);
			const fromRoot = relative(root, canonical);
			const metadata = await lstat(directory);
			const currentRoot = await lstat(root, { bigint: true });
			if (rootIdentity === undefined || currentRoot.dev !== rootIdentity.dev || currentRoot.ino !== rootIdentity.ino || metadata.isSymbolicLink() || !metadata.isDirectory() || fromRoot === ".." || fromRoot.startsWith(`..${sep}`) || isAbsolute(fromRoot)) throw new ArtifactReaderFailure("path", "Directory traversal escaped or changed its artifact root");
		};
	})))();
}

//#endregion
//#region dist/artifacts/ArtifactHash.js
var ARTIFACT_CLASSIFICATION_PREFIX_BYTES, abortIfNeeded, hashReadable;
function init_ArtifactHash() {
	return (init_ArtifactHash = __esmMin((() => {
		init_ArtifactReader();
		init_StreamBytes();
		init_appleArchiveFormat();
		ARTIFACT_CLASSIFICATION_PREFIX_BYTES = 8192;
		abortIfNeeded = (signal) => {
			if (signal?.aborted === true) throw new ArtifactReaderFailure("cancelled", "Artifact inventory cancelled");
		};
		hashReadable = async (stream, signal) => {
			const hash = createHash("sha256");
			const prefixes = [];
			let prefixBytes = 0;
			const xmlProbe = createXmlPlistSignatureProbe();
			let bytes = 0;
			for await (const raw of stream) {
				abortIfNeeded(signal);
				const chunk = streamChunkToBuffer(raw);
				bytes += chunk.length;
				hash.update(chunk);
				let chunkOffset = 0;
				while (chunkOffset < chunk.length && (prefixBytes < 8192 || xmlProbe.state === "pending" && prefixBytes < 1048576)) {
					const limit = prefixBytes < 8192 ? ARTIFACT_CLASSIFICATION_PREFIX_BYTES : MAX_XML_PLIST_PROBE_BYTES;
					const selected = chunk.subarray(chunkOffset, Math.min(chunkOffset + limit - prefixBytes, chunk.length));
					prefixes.push(selected);
					prefixBytes += selected.length;
					chunkOffset += selected.length;
					xmlProbe.write(selected);
				}
			}
			return {
				sha256: hash.digest("hex"),
				bytes,
				prefix: Buffer.concat(prefixes)
			};
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptArtifactFiles.js
var isJavaScriptSourcePath;
function init_javascriptArtifactFiles() {
	return (init_javascriptArtifactFiles = __esmMin((() => {
		isJavaScriptSourcePath = (path) => /\.(?:cjs|cts|mjs|mts|js|jsx|ts|tsx)$/iu.test(path);
	})))();
}

//#endregion
//#region dist/artifacts/inventory/ArtifactGraphConstruction.js
var indexOccurrencesByPath, createOccurrence, noteUnreadContainerSuffix, containerSuffixFamily, materializeDirectoryNodes, createRootNode, createArtifactNode, rootOccurrenceFor, rekeyOccurrences, createArtifactEdges, resolveOccurrenceParents, classifyArtifactPath, classifyArtifactContent, hasAsarHeader, artifactRoleForFormat, classifyArtifactBytes, classifyFatArtifact, relationFor, depth;
function init_ArtifactGraphConstruction() {
	return (init_ArtifactGraphConstruction = __esmMin((() => {
		init_unicodeCodePointOrder();
		init_javascriptArtifactFiles();
		init_canonicalDigest();
		init_appleArchiveFormat();
		init_artifactIdentity();
		init_zipPackageFormat();
		init_dosMz();
		init_machoContainer();
		indexOccurrencesByPath = (occurrences) => {
			const byPath = new Map();
			for (const occurrence of occurrences) {
				const matches = byPath.get(occurrence.logical_path);
				if (matches === undefined) byPath.set(occurrence.logical_path, [occurrence]);
				else matches.push(occurrence);
			}
			return byPath;
		};
		createOccurrence = (entry, path, parent, duplicateOrdinal = 0) => {
			const role = entry.kind === "directory" ? {
				kind: path.toLowerCase().endsWith(".framework") ? "framework" : "container",
				format: "directory"
			} : containerSuffixFamily(path) === undefined ? classifyArtifactPath(path) : {
				kind: "unknown",
				format: "unknown"
			};
			return {
				occurrence_id: `occ_${digestCanonicalValue(duplicateOrdinal === 0 ? {
					path,
					kind: entry.kind
				} : {
					path,
					kind: entry.kind,
					duplicate_ordinal: duplicateOrdinal
				}, "Artifact")}`,
				artifact_id: null,
				parent_occurrence_id: parent,
				logical_path: path,
				entry_kind: entry.kind,
				artifact_kind: role.kind,
				artifact_format: role.format,
				declared_size: entry.declaredSize,
				compressed_size: entry.compressedSize,
				executable: entry.executable,
				encrypted: entry.encrypted,
				hash_status: entry.encrypted ? "unavailable" : "not-hashed",
				source_location: entry.byteOffset === null || entry.declaredSize === null ? null : {
					offset: entry.byteOffset,
					length: entry.declaredSize
				},
				limitations: [...entry.limitations]
			};
		};
		noteUnreadContainerSuffix = (occurrence) => {
			if (occurrence.entry_kind === "directory") return;
			const family = containerSuffixFamily(occurrence.logical_path);
			if (family === undefined) return;
			occurrence.limitations.push(`The path suffix suggests ${family.toUpperCase()}, but these bytes were not read, so the container family is unknown.`);
		};
		containerSuffixFamily = (path) => {
			const lower = path.toLowerCase();
			return lower.endsWith(".asar") ? "asar" : zipPackageFormatForPath(lower);
		};
		materializeDirectoryNodes = (occurrences, nodes) => {
			const directories = occurrences.filter(({ entry_kind: kind, hash_status }) => kind === "directory" && hash_status !== "unavailable").sort((left, right) => depth(right.logical_path) - depth(left.logical_path));
			const childrenByParent = new Map();
			for (const occurrence of occurrences) {
				if (occurrence.parent_occurrence_id === null) continue;
				const children = childrenByParent.get(occurrence.parent_occurrence_id);
				if (children === undefined) childrenByParent.set(occurrence.parent_occurrence_id, [occurrence]);
				else children.push(occurrence);
			}
			for (const directory of directories) {
				const children = (childrenByParent.get(directory.occurrence_id) ?? []).map(({ logical_path, artifact_id, entry_kind }) => ({
					name: logical_path.slice(directory.logical_path.length + 1),
					artifact_id,
					entry_kind
				})).sort((left, right) => compareUnicodeCodePoints(left.name, right.name));
				const node = createArtifactNode({
					sha256: digestCanonicalValue({
						kind: "directory",
						children
					}, "Artifact"),
					size: 0,
					format: "directory",
					contentState: "virtual"
				});
				nodes.set(node.artifact_id, node);
				directory.artifact_id = node.artifact_id;
				directory.hash_status = "verified";
			}
		};
		createRootNode = (input) => createArtifactNode({
			sha256: input.digest?.sha256 ?? digestCanonicalValue({
				kind: "directory-root",
				children: input.occurrences.map(({ logical_path, artifact_id }) => ({
					logical_path,
					artifact_id
				})).sort((left, right) => compareUnicodeCodePoints(left.logical_path, right.logical_path))
			}, "Artifact"),
			size: input.digest?.bytes ?? 0,
			format: input.digest === null ? "directory" : classifyArtifactBytes(input.digest.prefix, input.digest.bytes),
			contentState: "materialized"
		});
		createArtifactNode = (input) => ({
			artifact_id: artifactIdForContent(input.sha256),
			format: input.format,
			sha256: input.sha256,
			size: input.size,
			media_type: null,
			architecture: null,
			content_state: input.contentState,
			limitations: []
		});
		rootOccurrenceFor = (node, metadata) => ({
			occurrence_id: occurrenceIdForLocation({
				rootArtifactId: node.artifact_id,
				logicalPath: ".",
				entryKind: metadata.format === "directory" ? "directory" : "file"
			}),
			artifact_id: node.artifact_id,
			parent_occurrence_id: null,
			logical_path: ".",
			entry_kind: metadata.format === "directory" ? "directory" : "file",
			artifact_kind: metadata.format === "directory" || isZipPackageFormat(metadata.format) || [
				"asar",
				"dmg",
				"pkg"
			].includes(metadata.format) ? "container" : artifactRoleForFormat(metadata.path, metadata.format).kind,
			artifact_format: metadata.format,
			declared_size: metadata.size,
			compressed_size: null,
			executable: metadata.executable,
			encrypted: false,
			hash_status: "verified",
			source_location: null,
			limitations: []
		});
		rekeyOccurrences = (rootArtifactId, occurrences) => {
			const replacements = new Map();
			const ordinalByPath = new Map();
			for (const occurrence of occurrences) {
				const ordinal = ordinalByPath.get(occurrence.logical_path) ?? 0;
				ordinalByPath.set(occurrence.logical_path, ordinal + 1);
				replacements.set(occurrence.occurrence_id, occurrenceIdForLocation({
					rootArtifactId,
					logicalPath: occurrence.logical_path,
					entryKind: occurrence.entry_kind,
					...ordinal === 0 ? {} : { duplicateOrdinal: ordinal }
				}));
			}
			for (const occurrence of occurrences) {
				occurrence.occurrence_id = replacements.get(occurrence.occurrence_id) ?? occurrence.occurrence_id;
				if (occurrence.parent_occurrence_id !== null) occurrence.parent_occurrence_id = replacements.get(occurrence.parent_occurrence_id) ?? occurrence.parent_occurrence_id;
			}
		};
		createArtifactEdges = (rootArtifactId, occurrences, producer) => {
			const byId = new Map(occurrences.map((item) => [item.occurrence_id, item]));
			const byPath = indexOccurrencesByPath(occurrences);
			const edges = [];
			const limitations = [];
			for (const occurrence of occurrences) {
				const isSourceMap = occurrence.logical_path.toLowerCase().endsWith(".map");
				const sourcePath = isSourceMap ? occurrence.logical_path.slice(0, -".map".length) : undefined;
				const sourceCandidates = sourcePath === undefined ? [] : byPath.get(sourcePath) ?? [];
				const mappedSource = sourceCandidates.length === 1 && sourceCandidates[0]?.artifact_id !== null ? sourceCandidates[0] : undefined;
				if (sourcePath !== undefined) {
					const unknownMapping = sourceCandidates.length > 1 ? {
						occurrence: `Source-map target is unknown because multiple occurrences share ${JSON.stringify(sourcePath)}.`,
						coverage: `Source-map relationships are unknown because multiple occurrences share ${JSON.stringify(sourcePath)}.`
					} : sourceCandidates.length === 1 && mappedSource === undefined ? {
						occurrence: `Source-map target identity is unknown because the matching occurrence at ${JSON.stringify(sourcePath)} has no content identity.`,
						coverage: `Source-map relationships are unknown because the matching occurrence at ${JSON.stringify(sourcePath)} has no content identity.`
					} : undefined;
					if (unknownMapping !== undefined) {
						occurrence.limitations.push(unknownMapping.occurrence);
						limitations.push(unknownMapping.coverage);
					}
				}
				if (occurrence.parent_occurrence_id === null || occurrence.artifact_id === null) continue;
				const parentArtifactId = mappedSource?.artifact_id ?? byId.get(occurrence.parent_occurrence_id)?.artifact_id ?? rootArtifactId;
				const semantic = {
					parent_artifact_id: parentArtifactId,
					relation: occurrence.entry_kind === "slice" ? "slice-of" : isSourceMap && mappedSource === undefined ? "contains" : relationFor(occurrence.logical_path),
					occurrence_id: occurrence.occurrence_id
				};
				edges.push({
					edge_id: artifactEdgeId(semantic, occurrence),
					...semantic,
					producer: occurrence.entry_kind === "slice" ? producer ?? null : null,
					ordinal: edges.length
				});
			}
			return {
				edges,
				limitations
			};
		};
		resolveOccurrenceParents = (occurrences, byPath, expandedContainerIds) => {
			const root = { children: new Map() };
			for (const matches of byPath.values()) {
				const parents = matches.filter((occurrence) => occurrence.entry_kind === "directory" || expandedContainerIds.has(occurrence.occurrence_id));
				if (parents.length === 0) continue;
				if (parents.length > 1) {
					for (const parent of parents) if (parent.entry_kind === "directory") {
						parent.artifact_id = null;
						parent.hash_status = "unavailable";
						parent.limitations.push("This directory occurrence cannot be materialized because multiple directory entries share its logical path.");
					}
				}
				const path = matches[0]?.logical_path;
				if (path === undefined) continue;
				let branch = root;
				for (const segment of path.split("/")) {
					let child = branch.children.get(segment);
					if (child === undefined) {
						child = { children: new Map() };
						branch.children.set(segment, child);
					}
					branch = child;
				}
				branch.occurrences = parents;
			}
			const limitations = new Set();
			const unknownParentOccurrences = new Set();
			for (const occurrence of occurrences) {
				const path = occurrence.logical_path;
				let branch = root;
				let parent;
				let ambiguousParentPath;
				let prefix = "";
				for (let start = 0;;) {
					const slash = path.indexOf("/", start);
					if (slash < 0) break;
					const segment = path.slice(start, slash);
					const child = branch.children.get(segment);
					if (child === undefined) break;
					branch = child;
					prefix = prefix.length === 0 ? segment : `${prefix}/${segment}`;
					const candidates = branch.occurrences ?? [];
					if (candidates.length === 1) {
						parent = candidates[0];
						ambiguousParentPath = undefined;
					} else if (candidates.length > 1) {
						parent = undefined;
						ambiguousParentPath = prefix;
					}
					start = slash + 1;
				}
				occurrence.parent_occurrence_id = parent?.occurrence_id ?? null;
				if (ambiguousParentPath !== undefined) {
					const limitation = `The parent occurrence for ${JSON.stringify(path)} is unknown because multiple observed directory or container occurrences share ${JSON.stringify(ambiguousParentPath)}.`;
					occurrence.limitations.push(limitation);
					limitations.add(limitation);
					unknownParentOccurrences.add(occurrence);
				}
			}
			return {
				limitations: [...limitations].sort(compareUnicodeCodePoints),
				unknownParentOccurrences
			};
		};
		classifyArtifactPath = (path) => {
			const lower = path.toLowerCase();
			if (lower.endsWith(".map")) return {
				kind: "source-map",
				format: "source-map"
			};
			if (isJavaScriptSourcePath(path)) return {
				kind: "javascript",
				format: "javascript-bundle"
			};
			if (/\.framework(?:\/|$)/u.test(lower)) return {
				kind: "framework",
				format: "file"
			};
			if (/\.(?:node|dylib|so)$/u.test(lower)) return {
				kind: lower.endsWith(".node") ? "native-addon" : "dynamic-library",
				format: "file"
			};
			if (lower.endsWith(".plist")) return {
				kind: "plist",
				format: "plist"
			};
			if (lower.endsWith(".entitlements")) return {
				kind: "entitlements",
				format: "entitlements"
			};
			return {
				kind: "resource",
				format: "file"
			};
		};
		classifyArtifactContent = (path, prefix, fileSize = prefix.length) => {
			const format = classifyArtifactBytes(prefix, fileSize);
			const byPath = classifyArtifactPath(path);
			if (format === "plist" && !hasBinaryPlistSignature(prefix) && ([
				"javascript",
				"source-map",
				"entitlements"
			].includes(byPath.kind) || path.toLowerCase().endsWith(".asar"))) return byPath;
			if (format === "file" && path.toLowerCase().endsWith(".asar") && hasAsarHeader(prefix)) return {
				kind: "container",
				format: "asar"
			};
			return artifactRoleForFormat(path, format);
		};
		hasAsarHeader = (prefix) => {
			if (prefix.length < 17 || prefix.readUInt32LE(0) !== 4) return false;
			const headerSize = prefix.readUInt32LE(4);
			const payloadSize = prefix.readUInt32LE(8);
			if (headerSize < 16 || payloadSize !== headerSize - 4) return false;
			const stringLength = prefix.readUInt32LE(12);
			return stringLength >= 2 && stringLength <= payloadSize - 4 && prefix[16] === 123;
		};
		artifactRoleForFormat = (path, format) => {
			const byPath = classifyArtifactPath(path);
			if (format === "file" || format === byPath.format) return byPath;
			if (format === "unknown") return {
				kind: "unknown",
				format
			};
			if (format === "zip") return {
				kind: "container",
				format: zipPackageFormatForPath(path) ?? format
			};
			if (format === "plist") return {
				kind: "plist",
				format
			};
			return {
				kind: ["native-addon", "dynamic-library"].includes(byPath.kind) ? byPath.kind : "executable",
				format
			};
		};
		classifyArtifactBytes = (prefix, fileSize = prefix.length) => {
			if (hasZipSignature(prefix)) return "zip";
			if (hasBinaryPlistSignature(prefix)) return "plist";
			if (hasXmlPlistSignature(prefix)) return "plist";
			const fatFormat = classifyFatArtifact(prefix, fileSize);
			if (fatFormat !== null) return fatFormat;
			if (prefix.length >= 4) {
				const magic = prefix.readUInt32BE(0);
				if ([
					4277009102,
					4277009103,
					3472551422,
					3489328638
				].includes(magic)) return "mach-o";
				if (prefix.subarray(0, 4).equals(Buffer.from([
					127,
					69,
					76,
					70
				]))) return "elf";
			}
			if (prefix.length >= 2 && prefix[0] === 77 && prefix[1] === 90) {
				if (!Number.isSafeInteger(fileSize) || fileSize < prefix.length || prefix.length < Math.min(fileSize, 64)) return "unknown";
				const windowsHeader = observeMzWindowsHeader(prefix, fileSize);
				if (windowsHeader.state === "signature-needed") return "unknown";
				if (windowsHeader.state === "declared") {
					const windowsOffset = windowsHeader.offset;
					if (windowsHeader.signature === "PE" && windowsOffset >= 64 && windowsOffset <= prefix.length - 4) return "pe";
					return "unknown";
				}
				if (parseDosMzHeader(prefix, fileSize).ok) return "dos-mz";
				return "unknown";
			}
			return "file";
		};
		classifyFatArtifact = (prefix, fileSize) => {
			const fatHeader = readFatContainerHeader(prefix, fileSize);
			if (fatHeader.state === "needs-data" || fatHeader.state === "malformed") return "unknown";
			if (fatHeader.state === "not-fat") return null;
			const identity = classifyFatContainerIdentity(fatHeader, (offset) => {
				if (offset >= prefix.length) return undefined;
				if (offset + 4 > prefix.length) return null;
				return prefix.readUInt32BE(offset);
			});
			return identity.state === "mach-o" ? "mach-o-universal" : "unknown";
		};
		relationFor = (path) => {
			const lower = path.toLowerCase();
			if (lower.endsWith(".map")) return "maps-source";
			if (lower.includes(".framework/")) return "embeds";
			return "contains";
		};
		depth = (path) => path.split("/").length;
	})))();
}

//#endregion
//#region dist/artifacts/inventory/hashStableRootArtifact.js
var openRootArtifact, hashStableRootArtifact, hashStableRootArtifactHandle;
function init_hashStableRootArtifact() {
	return (init_hashStableRootArtifact = __esmMin((() => {
		init_readFileHandleChunks();
		init_OwnedFileHandle();
		init_ArtifactReader();
		init_RegularFile();
		init_ArtifactHash();
		openRootArtifact = async (path, resourceScope, signal) => {
			try {
				return new OwnedFileHandle(await openRegularFile(path, {
					symlinks: "reject",
					signal
				}));
			} catch (cause) {
				const primary = cause instanceof RegularFileAdmissionFailure ? cause.cause : cause;
				const failure = primary instanceof NonRegularFileReadError ? new ArtifactReaderFailure("format", `Artifact root is not a regular file: ${path}`, { cause: primary }) : primary;
				if (cause instanceof RegularFileAdmissionFailure) {
					const resource = `root artifact descriptor for ${path}`;
					const cleanup = await resourceScope.release({
						kind: "file-handle",
						resource,
						handle: cause.owner
					});
					if (cleanup.kind === "failed") throw ArtifactReaderFailure.withCleanup(failure, ArtifactReaderFailure.cleanupObservation(cleanup.cause, resource));
				}
				throw failure;
			}
		};
		hashStableRootArtifact = async (path, resourceScope, signal) => {
			const owner = await openRootArtifact(path, resourceScope, signal);
			const handle = owner.handle;
			let outcome;
			try {
				const initial = await handle.stat();
				outcome = {
					kind: "completed",
					value: await hashStableRootArtifactHandle(path, handle, initial, signal)
				};
			} catch (cause) {
				outcome = {
					kind: "failed",
					cause
				};
			}
			const resource = `root artifact descriptor for ${path}`;
			const cleanup = await resourceScope.release({
				kind: "file-handle",
				resource,
				handle: owner
			});
			if (cleanup.kind === "failed") throw ArtifactReaderFailure.withCleanup(outcome.kind === "failed" ? outcome.cause : cleanup.cause, ArtifactReaderFailure.cleanupObservation(cleanup.cause, resource));
			if (outcome.kind === "failed") throw outcome.cause;
			return outcome.value;
		};
		hashStableRootArtifactHandle = async (path, handle, initial, signal) => {
			const digest = await hashReadable(readFileHandleChunks(handle, {
				start: 0,
				end: initial.size
			}), signal);
			abortIfNeeded(signal);
			const [opened, currentPath] = await Promise.all([handle.stat(), lstat(path)]);
			if (!sameRegularFileState(initial, opened) || !sameRegularFileState(initial, currentPath) || digest.bytes !== initial.size) throw new ArtifactReaderFailure("integrity", `Root artifact changed during inventory: ${path}`);
			return digest;
		};
	})))();
}

//#endregion
//#region dist/artifacts/inventory/classify.js
var classifyAndHashRoot, classifyAndHashRootForInventory, classifyRootFormat, zipRootPackageFormat, hasKolyTrailer;
function init_classify() {
	return (init_classify = __esmMin((() => {
		init_RegularFile();
		init_ArtifactGraphConstruction();
		init_ArtifactHash();
		init_appleArchiveFormat();
		init_zipPackageFormat();
		init_ArtifactReader();
		init_hashStableRootArtifact();
		classifyAndHashRoot = async (path, directory, expectedMetadata, options) => {
			return options.resourceScope.run(async () => {
				const result = await classifyAndHashRootForInventory(path, directory, expectedMetadata, options);
				const rootSource = result.rootSource;
				if (rootSource !== undefined) {
					const owner = {
						kind: "file-handle",
						handle: rootSource.owner,
						resource: `root artifact descriptor for ${path}`
					};
					const cleanupAttempt = await options.resourceScope.release(owner);
					if (cleanupAttempt.kind === "failed") throw ArtifactReaderFailure.withCleanup(cleanupAttempt.cause, ArtifactReaderFailure.cleanupObservation(cleanupAttempt.cause, owner.resource));
				}
				return {
					format: result.format,
					digest: result.digest
				};
			});
		};
		classifyAndHashRootForInventory = async (path, directory, expectedMetadata, options) => {
			if (directory) return {
				format: "directory",
				digest: null,
				rootSource: undefined
			};
			const ownedHandle = await openRootArtifact(path, options.resourceScope, options.signal);
			const handle = ownedHandle.handle;
			const owner = {
				kind: "file-handle",
				handle: ownedHandle,
				resource: `root artifact descriptor for ${path}`
			};
			let outcome;
			try {
				const initial = await handle.stat();
				if (!sameRegularFileState(expectedMetadata, initial)) throw new ArtifactReaderFailure("integrity", `Root artifact changed before inventory: ${path}`);
				const format = await classifyRootFormat(path, handle, options.signal);
				const digest = await hashStableRootArtifactHandle(path, handle, initial, options.signal);
				const retainSource = isZipPackageFormat(format) || format === "mach-o-universal";
				outcome = {
					kind: "completed",
					value: {
						format,
						digest,
						rootSource: retainSource ? {
							handle,
							initial,
							owner: ownedHandle
						} : undefined
					}
				};
			} catch (cause) {
				outcome = {
					kind: "failed",
					cause
				};
			}
			if (outcome.kind === "failed" || outcome.value.rootSource === undefined) {
				const cleanupAttempt = await options.resourceScope.release(owner);
				if (cleanupAttempt.kind === "failed") throw ArtifactReaderFailure.withCleanup(outcome.kind === "failed" ? outcome.cause : cleanupAttempt.cause, ArtifactReaderFailure.cleanupObservation(cleanupAttempt.cause, owner.resource));
			}
			if (outcome.kind === "failed") throw outcome.cause;
			return outcome.value;
		};
		classifyRootFormat = async (path, handle, signal) => {
			const magic = Buffer.alloc(ARTIFACT_CLASSIFICATION_PREFIX_BYTES);
			const observed = await handle.read(magic, 0, magic.length, 0);
			let prefix = magic.subarray(0, observed.bytesRead);
			const lower = path.toLowerCase();
			if (hasZipSignature(prefix)) return zipRootPackageFormat(lower);
			if (lower.endsWith(".pkg") && prefix.subarray(0, 4).equals(Buffer.from("xar!"))) return "pkg";
			if (lower.endsWith(".dmg") && await hasKolyTrailer(handle)) return "dmg";
			const xmlProbe = createXmlPlistSignatureProbe();
			xmlProbe.write(prefix);
			const chunks = [prefix];
			let prefixBytes = prefix.length;
			while (xmlProbe.state === "pending" && prefixBytes < 1048576) {
				abortIfNeeded(signal);
				const chunk = Buffer.alloc(Math.min(64 * 1024, MAX_XML_PLIST_PROBE_BYTES - prefixBytes));
				const read = await handle.read(chunk, 0, chunk.length, prefixBytes);
				abortIfNeeded(signal);
				if (read.bytesRead === 0) break;
				const selected = chunk.subarray(0, read.bytesRead);
				chunks.push(selected);
				prefixBytes += selected.length;
				xmlProbe.write(selected);
			}
			prefix = Buffer.concat(chunks);
			return classifyArtifactContent(path, prefix, (await handle.stat()).size).format;
		};
		zipRootPackageFormat = (lower) => lower.endsWith(".app") ? "app-pack" : zipPackageFormatForPath(lower) ?? "zip";
		hasKolyTrailer = async (handle) => {
			const size = (await handle.stat()).size;
			if (size < 512) return false;
			const trailer = Buffer.alloc(4);
			const read = await handle.read(trailer, 0, trailer.length, size - 512);
			return read.bytesRead === 4 && trailer.equals(Buffer.from("koly"));
		};
	})))();
}

//#endregion
//#region dist/artifacts/MachOSliceArtifactReader.js
var MachOSliceArtifactReader, readStructuralSlices, lipoMatchesSlice, lipoSubtypeMatches, lipoNameMatches;
function init_MachOSliceArtifactReader() {
	return (init_MachOSliceArtifactReader = __esmMin((() => {
		init_CommandRunner();
		init_lipo();
		init_machoCpuIdentity();
		init_OwnedFileHandle();
		init_MachoLoadCommandReader();
		init_ArtifactReader();
		init_StreamBytes();
		init_RegularFile();
		init_readFileHandleChunks();
		MachOSliceArtifactReader = class {
			path;
			runner;
			format = "file";
			#command;
			#source;
			#ownedSource;
			#pendingSource;
			#entries = new Map();
			#pendingCommands = new Set();
			#ownsSource;
			#closed = false;
			#closePromise;
			constructor(path, environment, runner = new XcrunCommandRunner(environment), source) {
				this.path = path;
				this.runner = runner;
				this.#source = source;
				this.#ownsSource = source === undefined;
			}
			async *entries(signal) {
				this.#entries.clear();
				const source = await this.#ensureSource();
				await this.#verifySource(source);
				if (this.#closed) throw new ArtifactReaderFailure("unavailable", "Universal Mach-O reader is closed");
				const command = this.runner.run("lipo", ["-detailed_info", this.path], signal === undefined ? {} : { signal });
				this.#pendingCommands.add(command);
				let captured;
				try {
					captured = await command;
				} finally {
					this.#pendingCommands.delete(command);
				}
				if (!captured.ok) throw new ArtifactReaderFailure(captured.error.reason === "cancelled" ? "cancelled" : "unavailable", captured.error.detail === null ? "lipo could not enumerate universal Mach-O slices" : `lipo could not enumerate universal Mach-O slices: ${captured.error.detail}`, {
					cause: captured.error,
					...captured.error.cleanupFailure === null && captured.error.cleanupResources.length === 0 ? {} : { cleanup: {
						reason: captured.error.cleanupFailure ?? "Native command cleanup remains unverified",
						resources: [...captured.error.cleanupResources]
					} }
				});
				if (this.#closed) throw new ArtifactReaderFailure("unavailable", "Universal Mach-O reader closed during slice discovery");
				this.#command = {
					tool: captured.value.tool,
					arguments: ["-detailed_info", "$ARTIFACT"],
					tool_version: captured.value.toolVersion,
					executable_sha256: captured.value.executableSha256,
					exit_code: captured.value.exitCode,
					effects: ["read"]
				};
				await this.#verifySource(source);
				const fileSize = source.initial.size;
				const { architectures } = parseLipoOutput(captured.value.stdout, this.path);
				const structural = await readStructuralSlices(source.handle, fileSize);
				await this.#verifySource(source);
				if (structural.status === "malformed") throw new ArtifactReaderFailure("integrity", `Mach-O structural slice index is malformed: ${structural.reason}`);
				if (structural.status === "unsupported" && architectures.some(({ file_offset, size }) => file_offset === null || size === null)) throw new ArtifactReaderFailure("unavailable", `Mach-O structural slice index is unsupported: ${structural.reason}`);
				const slices = structural.status === "parsed" ? structural.slices : null;
				const matchingSlices = new Map();
				if (slices !== null) {
					if (slices.length !== architectures.length) throw new ArtifactReaderFailure("integrity", "lipo architecture count disagrees with the Mach-O FAT table");
					const unmatched = [...slices];
					for (const reported of architectures) {
						const match = unmatched.findIndex((observed) => lipoMatchesSlice(reported, observed, slices.length === 1));
						if (match < 0) throw new ArtifactReaderFailure("integrity", `lipo slice metadata disagrees with the Mach-O FAT table: ${reported.name} (cputype=${reported.cpu_type ?? "unknown"}, cpusubtype=${reported.cpu_subtype ?? "unknown"}, offset=${reported.file_offset ?? "unknown"}, size=${reported.size ?? "unknown"}, alignment=${reported.alignment ?? "unknown"})`);
						const [observed] = unmatched.splice(match, 1);
						if (observed !== undefined) matchingSlices.set(reported, observed);
					}
				}
				for (const architecture of architectures) {
					const structuralSlice = matchingSlices.get(architecture);
					const offset = architecture.file_offset ?? structuralSlice?.slice_offset;
					const sliceSize = architecture.size ?? structuralSlice?.slice_size;
					if (offset === undefined || sliceSize === undefined) throw new ArtifactReaderFailure("integrity", "lipo omitted a universal slice byte range");
					if (!Number.isSafeInteger(offset) || !Number.isSafeInteger(sliceSize) || offset < 0 || sliceSize <= 0 || !Number.isSafeInteger(offset + sliceSize) || offset + sliceSize > fileSize) throw new ArtifactReaderFailure("integrity", `lipo reported an out-of-bounds Mach-O slice: ${architecture.name}`);
					const entry = {
						path: `slices/${architecture.name}`,
						kind: "slice",
						declaredSize: sliceSize,
						compressedSize: null,
						executable: true,
						encrypted: false,
						byteOffset: offset,
						declaredSha256: null,
						unpacked: false,
						limitations: [
							...structural.status === "not-mach-o" ? ["Structural Mach-O facts were unavailable; slice range is based on lipo output."] : structural.status === "unsupported" ? [`Structural Mach-O facts were unsupported (${structural.reason}); slice range is based on lipo output.`] : [],
							...architecture.file_offset === null || architecture.size === null ? ["Slice range was derived from structural Mach-O facts because lipo omitted it."] : [],
							...architecture.cpu_type !== null && architecture.cpu_type_code === null ? [`lipo CPU type is retained as unnormalized source text: ${architecture.cpu_type}`] : [],
							...architecture.cpu_subtype !== null && architecture.cpu_subtype_code === null ? [`lipo CPU subtype is retained as unnormalized source text: ${architecture.cpu_subtype}${architecture.capabilities === null ? "" : `; capabilities ${architecture.capabilities}`}`] : []
						],
						adapterKey: `${String(offset)}:${String(sliceSize)}`
					};
					this.#entries.set(entry.adapterKey, copyArtifactEntry(entry));
					yield entry;
				}
			}
			async open(entry, signal) {
				if (signal?.aborted === true) return Promise.reject(new ArtifactReaderFailure("cancelled", "Mach-O slice read cancelled"));
				const produced = this.#entries.get(entry.adapterKey);
				if (produced === undefined || !sameArtifactEntry(entry, produced)) throw new ArtifactReaderFailure("integrity", "Mach-O slice entry metadata does not match this reader's inventory");
				const offset = produced.byteOffset;
				const size = produced.declaredSize;
				if (offset === null || size === null || !Number.isSafeInteger(offset) || !Number.isSafeInteger(size) || offset < 0 || size <= 0) throw new ArtifactReaderFailure("integrity", "Invalid Mach-O slice byte range");
				const source = await this.#ensureSource();
				await this.#verifySource(source);
				if (!Number.isSafeInteger(offset + size) || offset + size > source.initial.size) throw new ArtifactReaderFailure("integrity", `Mach-O slice range is outside the artifact: ${entry.path}`);
				const sourceStream = readFileHandleChunks(source.handle, {
					start: offset,
					end: offset + size - 1,
					...signal === undefined ? {} : { signal }
				});
				const verifySource = () => this.#verifySource(source);
				return Readable.from((async function* () {
					let observedBytes = 0;
					try {
						for await (const raw of sourceStream) {
							const chunk = streamChunkToBuffer(raw);
							observedBytes += chunk.byteLength;
							if (observedBytes > size) throw new ArtifactReaderFailure("integrity", `Mach-O slice exceeded its reported size: ${entry.path}`);
							yield chunk;
						}
					} catch (cause) {
						if (cause instanceof ArtifactReaderFailure) throw cause;
						if (signal?.aborted === true) throw new ArtifactReaderFailure("cancelled", "Mach-O slice read cancelled", { cause });
						throw new ArtifactReaderFailure("integrity", `Could not read Mach-O slice range: ${entry.path}`, { cause });
					}
					if (observedBytes !== size) throw new ArtifactReaderFailure("integrity", `Mach-O slice size disagrees with lipo metadata: ${entry.path}`);
					await verifySource();
				})());
			}
			provenance() {
				return this.#command === undefined ? [] : [structuredClone(this.#command)];
			}
			async close() {
				this.#closed = true;
				this.#closePromise ??= this.#releaseResources().catch((cause) => {
					this.#closePromise = undefined;
					throw cause;
				});
				return this.#closePromise;
			}
			async #releaseResources() {
				await Promise.allSettled(this.#pendingCommands);
				let cleanup;
				try {
					const failures = await this.runner.retryCleanup?.() ?? [];
					if (failures.length > 0) cleanup = {
						reason: failures.map(({ reason, resources }) => `${resources.join(", ")}: ${reason}`).join("; "),
						resources: [...new Set(failures.flatMap(({ resources }) => resources))]
					};
				} catch (cause) {
					cleanup = ArtifactReaderFailure.cleanupObservation(cause, "native-command-process-cleanup");
				}
				try {
					await this.#closeSource();
				} catch (cause) {
					if (cleanup === undefined) throw cause;
					throw ArtifactReaderFailure.withCleanup(cause, cleanup);
				}
				if (cleanup !== undefined) throw new ArtifactReaderFailure("unavailable", "Native command process cleanup remains incomplete", { cleanup });
			}
			async #ensureSource() {
				if (this.#closed) throw new ArtifactReaderFailure("unavailable", "Universal Mach-O reader is closed");
				if (this.#source !== undefined) return this.#source;
				this.#pendingSource ??= this.#acquireSource();
				const source = await this.#pendingSource;
				if (this.#closed) throw new ArtifactReaderFailure("unavailable", "Universal Mach-O reader closed during source acquisition");
				return source;
			}
			async #acquireSource() {
				let handle;
				try {
					handle = await openRegularFile(this.path, { symlinks: "reject" });
				} catch (cause) {
					if (!(cause instanceof RegularFileAdmissionFailure)) throw cause;
					this.#ownedSource = cause.owner;
					const primary = cause.cause instanceof NonRegularFileReadError ? new ArtifactReaderFailure("format", `Universal Mach-O source is not a regular file: ${this.path}`, { cause: cause.cause }) : cause.cause;
					throw ArtifactReaderFailure.withCleanup(primary, ArtifactReaderFailure.cleanupObservation(cause.cleanupCause, this.path));
				}
				const owner = new OwnedFileHandle(handle);
				this.#ownedSource = owner;
				try {
					const initial = await handle.stat();
					const source = {
						handle,
						initial
					};
					this.#source = source;
					return source;
				} catch (cause) {
					try {
						await owner.close();
						this.#ownedSource = undefined;
					} catch (cleanupCause) {
						throw ArtifactReaderFailure.withCleanup(cause, ArtifactReaderFailure.cleanupObservation(cleanupCause, this.path));
					}
					throw cause;
				}
			}
			async #closeSource() {
				await this.#pendingSource?.catch(() => undefined);
				if (!this.#ownsSource || this.#ownedSource === undefined) return;
				await this.#ownedSource.close();
				this.#ownedSource = undefined;
				this.#source = undefined;
			}
			async #verifySource(source) {
				const [opened, currentPath] = await Promise.all([source.handle.stat(), lstat(this.path)]);
				if (!sameRegularFileState(source.initial, opened) || !sameRegularFileState(source.initial, currentPath)) throw new ArtifactReaderFailure("integrity", `Universal Mach-O source changed during inventory: ${this.path}`);
			}
		};
		readStructuralSlices = async (file, size) => {
			const readAt = async (offset, length) => {
				const bytes = Buffer.alloc(length);
				const { bytesRead } = await file.read(bytes, 0, length, offset);
				return bytes.subarray(0, bytesRead);
			};
			return readMachoImage(readAt, size);
		};
		lipoMatchesSlice = (reported, observed, structurallyUnique) => {
			const observedCpuType = observed.fat_cpu_type ?? observed.cpu_type;
			const observedCpuSubtype = observed.fat_cpu_subtype ?? observed.cpu_subtype;
			const hasPhysicalIdentity = reported.file_offset !== null || reported.size !== null || reported.cpu_type_code !== null || reported.cpu_subtype_code !== null;
			return (hasPhysicalIdentity || structurallyUnique) && lipoNameMatches(reported.name, observed.architecture) && (reported.file_offset === null || reported.file_offset === observed.slice_offset) && (reported.size === null || reported.size === observed.slice_size) && (reported.cpu_type_code === null || reported.cpu_type_code === observedCpuType) && lipoSubtypeMatches(reported, observedCpuSubtype) && (reported.alignment === null || observed.fat_alignment_exponent === null || reported.alignment === 2 ** observed.fat_alignment_exponent);
		};
		lipoSubtypeMatches = (reported, observedCpuSubtype) => {
			if (reported.cpu_subtype_code !== null) return reported.cpu_subtype_code === observedCpuSubtype;
			return reported.cpu_subtype_base === null || reported.cpu_subtype_base === machoCpuSubtypeBase(observedCpuSubtype);
		};
		lipoNameMatches = (reported, observed) => reported === observed || observed === "arm64e" && /^arm64e\.[A-Za-z0-9_]+$/u.test(reported);
	})))();
}

//#endregion
//#region dist/artifacts/NativeDmgOwnership.js
var systemEntitySchema, attachOutputSchema, infoOutputSchema, parseNativeDmgInfo, parseNativeDmgAttachOutput, resolveNativeDmgOwnership, ownershipFromAttachOutput, topLevelDevices, isBelowRoot;
function init_NativeDmgOwnership() {
	return (init_NativeDmgOwnership = __esmMin((() => {
		systemEntitySchema = z.object({
			"dev-entry": z.string().startsWith("/dev/"),
			"mount-point": z.string().optional()
		});
		attachOutputSchema = z.object({ "system-entities": z.array(systemEntitySchema) });
		infoOutputSchema = z.object({ images: z.array(z.object({ "system-entities": z.array(systemEntitySchema) })) });
		parseNativeDmgInfo = (stdout) => infoOutputSchema.parse(parse(stdout));
		parseNativeDmgAttachOutput = (stdout) => attachOutputSchema.parse(parse(stdout));
		resolveNativeDmgOwnership = (input) => {
			const rootedImages = input.info.images.filter((image) => image["system-entities"].some(({ "mount-point": mountPoint }) => mountPoint !== undefined && isBelowRoot(input.mountRoot, mountPoint)));
			if (rootedImages.length > 1) return {
				status: "unknown",
				reason: "multiple hdiutil image groups report mounts beneath the owned root"
			};
			const rootedImage = rootedImages[0];
			if (rootedImage !== undefined) {
				const hasOutsideMount = rootedImage["system-entities"].some(({ "mount-point": mountPoint }) => mountPoint !== undefined && !isBelowRoot(input.mountRoot, mountPoint));
				const groupDevices = rootedImage["system-entities"].map(({ "dev-entry": device }) => device);
				const devices = topLevelDevices(groupDevices);
				const overlapsBaseline = groupDevices.some((device) => input.baselineDevices.has(device));
				if (hasOutsideMount || overlapsBaseline || devices.length === 0) return {
					status: "unknown",
					reason: hasOutsideMount ? "the image group contains a mount outside the owned root" : overlapsBaseline ? "the image group includes a device present before attachment" : "the owned mount group contains no detachable device"
				};
				return {
					status: "owned",
					devices,
					source: "info"
				};
			}
			if (input.attachOutputReturned) {
				const attachOwnership = ownershipFromAttachOutput(input.attachOutput, input.mountRoot, input.baselineDevices);
				if (attachOwnership.status === "owned") {
					return attachOwnership;
				}
				if (attachOwnership.status === "unknown") return attachOwnership;
			}
			const newlyListedDevice = input.info.images.some((image) => image["system-entities"].some(({ "dev-entry": device }) => !input.baselineDevices.has(device)));
			if (newlyListedDevice) return {
				status: "unknown",
				reason: "hdiutil lists devices absent from the pre-attach baseline, but none is tied uniquely to the owned root; ownership is unknown"
			};
			return { status: "none" };
		};
		ownershipFromAttachOutput = (output, mountRoot, baselineDevices) => {
			if (output === undefined) return {
				status: "unknown",
				reason: "hdiutil attach succeeded but its ownership facts were malformed"
			};
			const entities = output["system-entities"];
			const hasRootMount = entities.some(({ "mount-point": mountPoint }) => mountPoint !== undefined && isBelowRoot(mountRoot, mountPoint));
			const hasOutsideMount = entities.some(({ "mount-point": mountPoint }) => mountPoint !== undefined && !isBelowRoot(mountRoot, mountPoint));
			const devices = entities.map(({ "dev-entry": device }) => device);
			const uniqueDevices = topLevelDevices(devices);
			const overlapsBaseline = devices.some((device) => baselineDevices.has(device));
			if (hasRootMount) {
				if (hasOutsideMount || overlapsBaseline || uniqueDevices.length === 0) return {
					status: "unknown",
					reason: hasOutsideMount ? "the attach result includes a mount outside the owned root" : overlapsBaseline ? "the attach result includes a device present before attachment" : "the attach result's owned mount has no detachable device"
				};
				return {
					status: "owned",
					devices: uniqueDevices,
					source: "attach"
				};
			}
			if (devices.length === 0) return {
				status: "unknown",
				reason: "hdiutil attach succeeded without reporting device ownership facts"
			};
			if (devices.some((device) => !baselineDevices.has(device))) return {
				status: "unknown",
				reason: "the attach result reports new devices without a mount beneath the owned root"
			};
			return { status: "none" };
		};
		topLevelDevices = (devices) => {
			const unique = [...new Set(devices)];
			return unique.filter((device) => !unique.some((parent) => /^\/dev\/disk\d+$/u.test(parent) && device.startsWith(`${parent}s`) && /^\d+$/u.test(device.slice(parent.length + 1))));
		};
		isBelowRoot = (root, path) => {
			const child = relative(root, resolve(path));
			return child !== "" && child !== "." && child !== ".." && !child.startsWith(`..${sep}`);
		};
	})))();
}

//#endregion
//#region dist/artifacts/NativeDmgArtifactReader.js
var HDIUTIL_COMMAND_TIMEOUT_MS, VERIFY_SETTLE_DELAYS_MS, DETACH_SETTLE_DELAYS_MS, delay, NativeDmgCommandFailure, createSystemHost, NativeDmgArtifactReader, failureMessage, processNotStarted, runChecked, describeCommandFailure, processExitCode, processOutput, classifyCommandFailure, verifyFailureReason, verifyFailureDiagnostic, command;
function init_NativeDmgArtifactReader() {
	return (init_NativeDmgArtifactReader = __esmMin((() => {
		init_ArtifactReader();
		init_DirectoryArtifactReader();
		init_ExecFileOutput();
		init_NativeDmgOwnership();
		HDIUTIL_COMMAND_TIMEOUT_MS = 12e4;
		VERIFY_SETTLE_DELAYS_MS = [250, 500];
		DETACH_SETTLE_DELAYS_MS = [
			250,
			500,
			1e3
		];
		delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
		NativeDmgCommandFailure = class extends ArtifactReaderFailure {
			stdout;
			processNotStarted;
			verifyDiagnostic;
			exitCode;
			constructor(failure, message, stdout, options) {
				super(failure.reason, message, options?.cause === undefined ? undefined : { cause: options.cause });
				this.stdout = stdout;
				this.processNotStarted = options?.processNotStarted ?? false;
				this.verifyDiagnostic = failure.verifyDiagnostic;
				this.exitCode = options?.exitCode ?? null;
			}
		};
		createSystemHost = (environment) => ({
			delay,
			async run(arguments_, signal, options) {
				try {
					const { stdout, stderr } = await execFileOutput("/usr/bin/hdiutil", [...arguments_], {
						env: environment,
						stopSignal: "SIGTERM",
						...options === undefined ? {} : { timeout: options.timeoutMs },
						...signal === undefined ? {} : { signal }
					});
					return {
						stdout,
						stderr,
						exitCode: 0
					};
				} catch (cause) {
					const output = execFileOutputFailure(cause);
					if (cause instanceof Error && cause.name === "AbortError") throw new NativeDmgCommandFailure({ reason: "cancelled" }, "DMG operation cancelled", output?.stdout ?? "", { cause });
					const exitCode = typeof output?.code === "number" ? output.code : processExitCode(cause);
					if (exitCode !== undefined) return {
						stdout: output?.stdout ?? processOutput(cause, "stdout"),
						stderr: output?.stderr ?? processOutput(cause, "stderr"),
						exitCode,
						cause
					};
					throw new NativeDmgCommandFailure(classifyCommandFailure(cause, arguments_[0]), `hdiutil ${arguments_[0] ?? "operation"} failed: ${describeCommandFailure(cause, arguments_)}`, output?.stdout ?? "", {
						cause,
						processNotStarted: processNotStarted(cause)
					});
				}
			}
		});
		NativeDmgArtifactReader = class {
			path;
			format = "file";
			host;
			#provenance = [];
			#initialization;
			#directory;
			#devices = [];
			#inventoryConfirmedDevices = new Set();
			#mountRoot;
			#baselineDevices = new Set();
			#attachOutput;
			#attachOutputReturned = false;
			#attachMayHaveMounted = false;
			#ownershipUncertainty;
			#closed = false;
			#closePromise;
			#activeDirectoryOperations = new Set();
			constructor(path, environment, host) {
				this.path = path;
				if (process.platform !== "darwin" && host === undefined) throw new ArtifactReaderFailure("unavailable", "Native DMG traversal is available only on macOS");
				this.host = host ?? createSystemHost(environment);
			}
			async *entries(signal, options) {
				await this.#ensureAttached(signal);
				const directory = this.#directory;
				if (directory === undefined) throw new ArtifactReaderFailure("unavailable", "DMG is not attached");
				const prefix = basename(this.path);
				const entries = directory.entries(signal, { onOmission: (omission) => options?.onOmission?.({
					...omission,
					path: `${prefix}/${omission.path}`
				}) })[Symbol.asyncIterator]();
				try {
					for (;;) {
						if (this.#closed) return;
						const next = await this.#trackDirectoryOperation(() => entries.next());
						if (this.#closed) return;
						if (next.done) return;
						yield {
							...next.value,
							path: `${prefix}/${next.value.path}`
						};
					}
				} finally {
					await entries.return?.();
				}
			}
			async open(entry, signal) {
				await this.#ensureAttached(signal);
				const directory = this.#directory;
				if (directory === undefined) throw new ArtifactReaderFailure("unavailable", "DMG is not attached");
				return this.#trackDirectoryOperation(() => directory.open(entry, signal));
			}
			provenance() {
				return structuredClone(this.#provenance);
			}
			close() {
				this.#closed = true;
				this.#closePromise ??= this.#closeOwnedResources().catch((cause) => {
					this.#closePromise = undefined;
					throw cause;
				});
				return this.#closePromise;
			}
			async #closeOwnedResources() {
				await this.#initialization?.catch(() => undefined);
				await Promise.allSettled(this.#activeDirectoryOperations);
				await this.#closeMountedDirectory();
				let detachFailure = await this.#detachOwnedDevices();
				if (this.#devices.length === 0 && this.#mountRoot !== undefined && !this.#attachMayHaveMounted) await rm(this.#mountRoot, {
					recursive: true,
					force: true
				}).then(() => {
					this.#mountRoot = undefined;
					this.#directory = undefined;
				}, (cause) => {
					detachFailure ??= cause;
				});
				if (this.#attachMayHaveMounted) {
					detachFailure ??= new Error(this.#ownershipUncertainty ?? "hdiutil attachment ownership remains unknown");
				}
				if (detachFailure !== undefined) throw new ArtifactReaderFailure("unavailable", `DMG detach or mount-root cleanup failed for ${JSON.stringify(this.path)}: ${failureMessage(detachFailure)}`, {
					cause: detachFailure,
					cleanup: {
						reason: failureMessage(detachFailure),
						resources: [
							...this.#devices.map((device) => `DMG device ${device}`),
							...this.#attachMayHaveMounted ? [`DMG attachment ownership unknown at mount root ${this.#mountRoot ?? this.path}`] : [],
							...this.#mountRoot === undefined ? [] : [`DMG mount root ${this.#mountRoot}`]
						]
					}
				});
			}
			async #detachOwnedDevices() {
				let detachFailure = await this.#reconcileAttachState();
				let remainingDevices = [];
				for (const device of [...this.#devices].reverse()) {
					const failure = await this.#detach(device);
					if (failure !== undefined) {
						remainingDevices.push(device);
						detachFailure ??= failure;
					}
				}
				for (const delayMs of DETACH_SETTLE_DELAYS_MS) {
					if (remainingDevices.length === 0) break;
					await (this.host.delay ?? delay)(delayMs);
					const stillAttached = [];
					for (const device of remainingDevices) {
						if (!await this.#isAttached(device)) continue;
						const failure = await this.#detach(device);
						if (failure !== undefined) {
							stillAttached.push(device);
							detachFailure = failure;
						}
					}
					remainingDevices = stillAttached;
				}
				if (remainingDevices.length === 0) detachFailure = undefined;
				this.#devices = remainingDevices.reverse();
				return detachFailure;
			}
			async #closeMountedDirectory() {
				if (this.#directory !== undefined) {
					try {
						await this.#directory.close();
						this.#directory = undefined;
					} catch (cause) {
						const mountRoot = this.#mountRoot ?? this.path;
						throw ArtifactReaderFailure.withCleanup(cause, {
							reason: `DMG mounted directory remains owned: ${failureMessage(cause)}`,
							resources: [
								`DMG mounted directory at ${mountRoot}`,
								`DMG mount root ${mountRoot}`,
								...this.#devices.map((device) => `DMG device ${device}`)
							]
						});
					}
				}
			}
			/** Detach one device; return the failure only while it remains attached. */
			async #detach(device) {
				try {
					await runChecked(this.host, ["detach", device], undefined, { timeoutMs: HDIUTIL_COMMAND_TIMEOUT_MS });
					this.#provenance.push(command(["detach", device], ["mount"]));
					return undefined;
				} catch (cause) {
					return await this.#isAttached(device) ? cause : undefined;
				}
			}
			async #reconcileAttachState() {
				if (!this.#attachMayHaveMounted) return undefined;
				try {
					await this.#resolveAttachOwnership();
					return undefined;
				} catch (cause) {
					this.#ownershipUncertainty = failureMessage(cause);
					return cause;
				}
			}
			/** Treat unknown hdiutil state as attached during cleanup. */
			async #isAttached(device) {
				try {
					const parsed = await this.#readInfo();
					const isListed = parsed.images.some((image) => image["system-entities"].some((entity) => entity["dev-entry"] === device));
					if (isListed) {
						this.#inventoryConfirmedDevices.add(device);
						return true;
					}
					return !this.#inventoryConfirmedDevices.has(device);
				} catch {
					return true;
				}
			}
			async #ensureAttached(signal) {
				if (this.#closed) throw new ArtifactReaderFailure("unavailable", "DMG reader is closed");
				this.#initialization ??= this.#attach(signal);
				await this.#initialization;
				if (this.#closed) throw new ArtifactReaderFailure("unavailable", "DMG reader is closed");
			}
			async #trackDirectoryOperation(operation) {
				if (this.#closed) throw new ArtifactReaderFailure("unavailable", "DMG reader is closed");
				const running = Promise.resolve().then(operation);
				this.#activeDirectoryOperations.add(running);
				try {
					return await running;
				} finally {
					this.#activeDirectoryOperations.delete(running);
				}
			}
			async #attach(signal) {
				await this.#verify(signal);
				const baseline = await this.#readInfo();
				this.#baselineDevices = new Set(baseline.images.flatMap((image) => image["system-entities"].map(({ "dev-entry": device }) => device)));
				const mountRoot = await realpath(await mkdtemp(join(tmpdir(), "rea-dmg-")));
				this.#mountRoot = mountRoot;
				try {
					this.#attachMayHaveMounted = true;
					const attached = await runChecked(this.host, [
						"attach",
						"-readonly",
						"-nobrowse",
						"-plist",
						"-mountroot",
						mountRoot,
						this.path
					], signal, { timeoutMs: HDIUTIL_COMMAND_TIMEOUT_MS });
					this.#attachOutputReturned = true;
					let parsed;
					try {
						parsed = parseNativeDmgAttachOutput(attached.stdout);
					} catch (cause) {
						throw new ArtifactReaderFailure("format", "hdiutil returned a malformed attachment plist", { cause });
					}
					if (parsed["system-entities"].length === 0) throw new ArtifactReaderFailure("format", "hdiutil returned no attached devices");
					this.#attachOutput = parsed;
					const ownership = await this.#resolveAttachOwnership();
					if (ownership !== "owned") throw new ArtifactReaderFailure(ownership === "unknown" ? "unavailable" : "path", ownership === "unknown" ? `DMG attachment ownership is uncertain: ${this.#ownershipUncertainty ?? "no unique mount under the owned root"}` : "hdiutil did not mount a new image beneath the owned root");
					this.#provenance.push(command([
						"attach",
						"-readonly",
						"-nobrowse",
						"-plist",
						"-mountroot",
						mountRoot,
						this.path
					], ["read", "mount"]));
					this.#directory = new DirectoryArtifactReader(mountRoot);
				} catch (cause) {
					if (cause instanceof NativeDmgCommandFailure && cause.stdout !== "") {
						try {
							this.#attachOutput = parseNativeDmgAttachOutput(cause.stdout);
							this.#attachOutputReturned = true;
						} catch {}
					}
					if (cause instanceof NativeDmgCommandFailure && cause.processNotStarted) {
						this.#attachMayHaveMounted = false;
						this.#ownershipUncertainty = undefined;
					}
					throw cause;
				}
			}
			async #verify(signal) {
				const arguments_ = ["verify", this.path];
				const deadline = performance.now() + HDIUTIL_COMMAND_TIMEOUT_MS;
				for (let attempt = 0;; attempt += 1) {
					if (signal?.aborted === true) throw new NativeDmgCommandFailure({ reason: "cancelled" }, "DMG operation cancelled", "", { cause: signal.reason });
					try {
						await runChecked(this.host, arguments_, signal, { timeoutMs: Math.max(1, Math.ceil(deadline - performance.now())) });
						this.#provenance.push(command(arguments_, ["read"]));
						return;
					} catch (cause) {
						if (!(cause instanceof NativeDmgCommandFailure)) throw cause;
						this.#provenance.push(command(arguments_, ["read"], cause.exitCode));
						const delayMs = VERIFY_SETTLE_DELAYS_MS[attempt];
						if (cause.verifyDiagnostic !== "Resource temporarily unavailable" || delayMs === undefined || deadline - performance.now() <= delayMs) throw cause;
						await (this.host.delay ?? delay)(delayMs);
						if (performance.now() >= deadline) throw cause;
					}
				}
			}
			async #readInfo() {
				const info = await runChecked(this.host, ["info", "-plist"], undefined, { timeoutMs: HDIUTIL_COMMAND_TIMEOUT_MS });
				return parseNativeDmgInfo(info.stdout);
			}
			async #resolveAttachOwnership() {
				const mountRoot = this.#mountRoot;
				if (mountRoot === undefined) throw new Error("DMG mount root is unavailable for ownership discovery");
				const ownership = resolveNativeDmgOwnership({
					info: await this.#readInfo(),
					...this.#attachOutput === undefined ? {} : { attachOutput: this.#attachOutput },
					attachOutputReturned: this.#attachOutputReturned,
					mountRoot,
					baselineDevices: this.#baselineDevices
				});
				if (ownership.status === "owned") {
					this.#devices = [...ownership.devices];
					if (ownership.source === "info") for (const device of ownership.devices) this.#inventoryConfirmedDevices.add(device);
					this.#attachMayHaveMounted = false;
					this.#ownershipUncertainty = undefined;
					return "owned";
				}
				if (ownership.status === "unknown") {
					this.#ownershipUncertainty = ownership.reason;
					return "unknown";
				}
				this.#attachMayHaveMounted = false;
				this.#ownershipUncertainty = undefined;
				this.#devices = [];
				return "none";
			}
		};
		failureMessage = (cause) => cause instanceof Error ? cause.message : String(cause);
		processNotStarted = (cause) => {
			if (!(cause instanceof Error)) return false;
			const syscall = Reflect.get(cause, "syscall");
			const code = Reflect.get(cause, "code");
			const errno = Reflect.get(cause, "errno");
			return typeof syscall === "string" && syscall.startsWith("spawn ") && (typeof code === "string" || typeof code === "number" || typeof errno === "number");
		};
		runChecked = async (host, arguments_, signal, options) => {
			let result;
			try {
				result = await host.run(arguments_, signal, options);
			} catch (cause) {
				if (cause instanceof ArtifactReaderFailure) throw cause;
				if (cause instanceof Error && cause.name === "AbortError") throw new NativeDmgCommandFailure({ reason: "cancelled" }, "DMG operation cancelled", execFileOutputFailure(cause)?.stdout ?? "", { cause });
				const output = execFileOutputFailure(cause);
				throw new NativeDmgCommandFailure(classifyCommandFailure(cause, arguments_[0]), `hdiutil ${arguments_[0] ?? "operation"} failed: ${describeCommandFailure(cause, arguments_)}`, output?.stdout ?? "", {
					cause,
					processNotStarted: processNotStarted(cause)
				});
			}
			if (result.exitCode !== 0) {
				const failure = {
					command: "/usr/bin/hdiutil",
					exitCode: result.exitCode,
					...result.cause === undefined ? {} : { code: processExitCode(result.cause) },
					stdout: result.stdout,
					...result.stderr === undefined ? {} : { stderr: result.stderr }
				};
				const classification = classifyCommandFailure(failure, arguments_[0]);
				const details = describeCommandFailure(failure, arguments_);
				const unknownVerifyFailure = arguments_[0] === "verify" && classification.reason === "unavailable";
				throw new NativeDmgCommandFailure(classification, unknownVerifyFailure ? `hdiutil verify failed; captured diagnostics do not establish the failure cause: ${details}` : `hdiutil ${arguments_[0] ?? "operation"} failed: ${details}`, result.stdout, {
					cause: result.cause ?? failure,
					exitCode: result.exitCode
				});
			}
			return {
				stdout: result.stdout,
				exitCode: 0
			};
		};
		describeCommandFailure = (cause, arguments_) => {
			const fields = {
				command: "/usr/bin/hdiutil",
				arguments: [...arguments_]
			};
			if (typeof cause === "object" && cause !== null) {
				for (const key of [
					"code",
					"exitCode",
					"errno",
					"syscall",
					"signal",
					"stdout",
					"stderr"
				]) {
					const value = Reflect.get(cause, key);
					if (typeof value === "string" || typeof value === "number") fields[key] = value;
				}
				const code = Reflect.get(cause, "code");
				if (typeof code === "number") fields.exitCode = code;
			}
			if (cause instanceof ArtifactReaderFailure) fields.message = cause.message;
			else if (cause instanceof Error) fields.message = cause.message;
			return JSON.stringify(fields);
		};
		processExitCode = (cause) => {
			if (typeof cause !== "object" || cause === null) return undefined;
			const exitCode = Reflect.get(cause, "exitCode");
			if (typeof exitCode === "number") return exitCode;
			const code = Reflect.get(cause, "code");
			return typeof code === "number" ? code : undefined;
		};
		processOutput = (cause, field) => {
			if (typeof cause !== "object" || cause === null) return "";
			const value = Reflect.get(cause, field);
			return typeof value === "string" ? value : "";
		};
		classifyCommandFailure = (cause, operation) => {
			if (typeof cause !== "object" || cause === null) return { reason: "unavailable" };
			const code = Reflect.get(cause, "code");
			const exitCode = Reflect.get(cause, "exitCode");
			if (typeof code === "number" || typeof exitCode === "number") {
				if (operation !== "verify") return { reason: "unavailable" };
				const diagnostic = verifyFailureDiagnostic(processOutput(cause, "stdout"), processOutput(cause, "stderr"));
				return {
					reason: verifyFailureReason(diagnostic),
					...diagnostic === undefined ? {} : { verifyDiagnostic: diagnostic }
				};
			}
			if (code === "ENOENT") {
				const syscall = Reflect.get(cause, "syscall");
				return { reason: typeof syscall === "string" && syscall.startsWith("spawn") ? "unavailable" : "io" };
			}
			if (code === "EACCES" || code === "EPERM" || code === "EIO" || code === "ENOTDIR" || code === "EISDIR" || code === "ENODEV" || code === "EROFS" || code === "EMFILE" || code === "ENFILE") return { reason: "io" };
			return { reason: "unavailable" };
		};
		verifyFailureReason = (diagnostic) => {
			switch (diagnostic) {
				case "image not recognized":
				case "image not recognised": return "format";
				case "invalid checksum":
				case "image data corrupted": return "integrity";
				case "No such file or directory":
				case "Permission denied":
				case "Input/output error": return "io";
				default: return "unavailable";
			}
		};
		verifyFailureDiagnostic = (stdout, stderr) => {
			const prefix = "hdiutil: verify failed - ";
			return `${stdout}\n${stderr}`.split(/\r?\n/u).map((line) => line.trim()).find((line) => line.startsWith(prefix))?.slice(prefix.length);
		};
		command = (arguments_, effects, exitCode = 0) => ({
			tool: "/usr/bin/hdiutil",
			arguments: [...arguments_],
			tool_version: null,
			executable_sha256: null,
			exit_code: exitCode,
			effects
		});
	})))();
}

//#endregion
//#region dist/artifacts/inventory/reader.js
var createReader, inventoryCoverage;
function init_reader() {
	return (init_reader = __esmMin((() => {
		init_AsarArtifactReader();
		init_DirectoryArtifactReader();
		init_MachOSliceArtifactReader();
		init_NativeDmgArtifactReader();
		init_ZipArtifactReader();
		init_zipPackageFormat();
		createReader = (path, format, environment, rootSource) => {
			if (isZipPackageFormat(format)) return new ZipArtifactReader(path, format, undefined, rootSource);
			switch (format) {
				case "directory": return new DirectoryArtifactReader(path);
				case "asar": return new AsarArtifactReader(path);
				case "mach-o-universal": return process.platform === "darwin" ? new MachOSliceArtifactReader(path, environment, undefined, rootSource) : undefined;
				case "dmg":
					if (process.platform !== "darwin") return undefined;
					return new NativeDmgArtifactReader(path, environment);
				default: return undefined;
			}
		};
		inventoryCoverage = (format, reader, traversal) => {
			if (reader !== undefined) return {
				coverage: {
					scope: "container-entries",
					status: traversal.status
				},
				limitations: [...isZipPackageFormat(reader.format) ? [ZIP_NON_ENTRY_LIMITATION] : [], ...traversal.limitations]
			};
			if (format === "dmg" || format === "pkg") return {
				coverage: {
					scope: "container-entries",
					status: "unknown"
				},
				limitations: [`${format.toUpperCase()} root hash is observed; child inventory requires a native macOS adapter.`]
			};
			if (format === "mach-o-universal") return {
				coverage: {
					scope: "container-entries",
					status: "unknown"
				},
				limitations: ["Universal Mach-O slices require the native macOS lipo adapter."]
			};
			if (isZipPackageFormat(format) || format === "directory" || format === "asar") return {
				coverage: {
					scope: "container-entries",
					status: "unknown"
				},
				limitations: [`${format} child inventory reader is unavailable.`]
			};
			return {
				coverage: {
					scope: "root",
					status: "complete"
				},
				limitations: ["Artifact has no child container entries."]
			};
		};
	})))();
}

//#endregion
//#region dist/artifacts/inventory/types.js
var STRICT_INTEGRITY_POLICY;
function init_types() {
	return (init_types = __esmMin((() => {
		STRICT_INTEGRITY_POLICY = { mode: "fail" };
	})))();
}

//#endregion
//#region dist/artifacts/inventory/scanReader.js
var UNAVAILABLE_UNPACKED_LIMITATION, emptyScan, scanReader, inventoryEntries, visitArtifactEntries, digestArtifactEntry, isExpandableAsar, isUnavailableUnpackedEntry;
function init_scanReader() {
	return (init_scanReader = __esmMin((() => {
		init_ArtifactPaths();
		init_ArtifactReader();
		init_AsarArtifactReader();
		init_unicodeCodePointOrder();
		init_ArtifactGraphConstruction();
		init_types();
		init_ArtifactHash();
		UNAVAILABLE_UNPACKED_LIMITATION = "ASAR unpacked companion bytes were unavailable; no content hash or child artifact was produced.";
		emptyScan = () => ({
			nodes: new Map(),
			occurrences: [],
			pendingContradictions: []
		});
		scanReader = async (reader, ownedReaders, signal, integrity = STRICT_INTEGRITY_POLICY) => {
			const { nodes, occurrences, pendingContradictions } = emptyScan();
			if (reader === undefined) return {
				nodes,
				occurrences,
				pendingContradictions,
				caseCollisionLimitation: undefined,
				unknownParentOccurrences: new Set(),
				traversal: {
					status: "complete",
					limitations: []
				}
			};
			const context = {
				reader,
				signal,
				integrity,
				nodes,
				occurrences,
				pendingContradictions,
				occurrenceCountByPath: new Map(),
				registry: new ArtifactPathRegistry(),
				expandedContainerIds: new Set(),
				ownedReaders,
				omissions: []
			};
			await visitArtifactEntries(context, reader, "");
			const byPath = indexOccurrencesByPath(occurrences);
			const parentResolution = resolveOccurrenceParents(occurrences, byPath, context.expandedContainerIds);
			const structuralLimitations = [...parentResolution.limitations];
			return {
				nodes,
				occurrences,
				pendingContradictions,
				caseCollisionLimitation: annotateEnglishUnicodeCaseCollisions(occurrences),
				unknownParentOccurrences: parentResolution.unknownParentOccurrences,
				traversal: {
					status: context.omissions.length === 0 && structuralLimitations.length === 0 ? "complete" : "unknown",
					limitations: [...new Set([...context.omissions.map(({ path, kind }) => `Artifact traversal omitted ${kind} at ${JSON.stringify(path)}.`), ...structuralLimitations])].sort(compareUnicodeCodePoints)
				}
			};
		};
		inventoryEntries = (context, reader, prefix) => reader.entries(context.signal, { onOmission: (omission) => context.omissions.push({
			...omission,
			path: normalizeArtifactPath(prefix.length === 0 ? omission.path : `${prefix}/${omission.path}`)
		}) })[Symbol.asyncIterator]();
		visitArtifactEntries = async (context, currentReader, prefix) => {
			const stack = [{
				reader: currentReader,
				prefix,
				iterator: inventoryEntries(context, currentReader, prefix)
			}];
			let failure;
			try {
				while (stack.length > 0) {
					const frame = stack.at(-1);
					if (frame === undefined) break;
					const next = await frame.iterator.next();
					if (next.done) {
						stack.pop();
						continue;
					}
					const entry = next.value;
					const logicalPath = normalizeArtifactPath(frame.prefix.length === 0 ? entry.path : `${frame.prefix}/${entry.path}`);
					const expandableAsar = isExpandableAsar(entry, logicalPath);
					context.registry.add(logicalPath, expandableAsar ? "directory" : entry.kind);
					const duplicateOrdinal = context.occurrenceCountByPath.get(logicalPath) ?? 0;
					context.occurrenceCountByPath.set(logicalPath, duplicateOrdinal + 1);
					const occurrence = createOccurrence(entry, logicalPath, null, duplicateOrdinal);
					let digested;
					try {
						digested = await digestArtifactEntry(context, frame.reader, entry, logicalPath, occurrence);
					} catch (cause) {
						if (!isUnavailableUnpackedEntry(cause, entry)) throw cause;
						occurrence.hash_status = "unavailable";
						occurrence.limitations.push(UNAVAILABLE_UNPACKED_LIMITATION);
					}
					if (digested === undefined) noteUnreadContainerSuffix(occurrence);
					else {
						context.nodes.set(digested.node.artifact_id, digested.node);
						occurrence.artifact_id = digested.node.artifact_id;
						occurrence.artifact_kind = digested.classification.kind;
						occurrence.artifact_format = digested.classification.format;
						occurrence.hash_status = digested.mismatched ? "mismatched" : "verified";
						if (digested.mismatched) occurrence.limitations.push("Declared integrity metadata contradicts observed bytes.");
					}
					context.occurrences.push(occurrence);
					if (expandableAsar && digested !== undefined && digested.classification.format === "asar" && !digested.mismatched) {
						const nested = new AsarArtifactReader(entry.adapterKey);
						context.ownedReaders.push(nested);
						await nested.prepareContainer(digested.node.sha256, context.signal);
						context.expandedContainerIds.add(occurrence.occurrence_id);
						stack.push({
							reader: nested,
							prefix: logicalPath,
							iterator: inventoryEntries(context, nested, logicalPath)
						});
					}
				}
			} catch (cause) {
				failure = { cause };
			} finally {
				for (const { iterator, prefix, reader } of stack.reverse()) {
					try {
						await iterator.return?.();
					} catch (cause) {
						failure = { cause: ArtifactReaderFailure.withCleanup(failure === undefined ? cause : failure.cause, ArtifactReaderFailure.cleanupObservation(cause, `artifact traversal for ${prefix || reader.format}`)) };
					}
				}
			}
			if (failure !== undefined) throw failure.cause;
		};
		digestArtifactEntry = async (context, currentReader, entry, logicalPath, occurrence) => {
			if (entry.kind !== "file" && entry.kind !== "slice" || entry.encrypted) return undefined;
			const digest = await hashReadable(await currentReader.open(entry, context.signal), context.signal);
			const mismatched = entry.declaredSha256 !== null && entry.declaredSha256 !== digest.sha256;
			if (mismatched && entry.declaredSha256 !== null) {
				if (context.integrity.mode === "fail") throw new ArtifactReaderFailure("integrity", `Artifact integrity metadata disagrees with content: ${logicalPath}`, undefined, {
					logicalPath,
					declaredSha256: entry.declaredSha256,
					calculatedSha256: digest.sha256,
					unpacked: entry.unpacked
				});
				context.pendingContradictions.push({
					occurrence,
					declaredSha256: entry.declaredSha256,
					observedSha256: digest.sha256,
					entryKind: entry.kind,
					unpacked: entry.unpacked
				});
			}
			const classified = entry.kind === "slice" ? {
				kind: "universal-slice",
				format: "mach-o"
			} : classifyArtifactContent(logicalPath, digest.prefix, digest.bytes);
			return {
				node: createArtifactNode({
					sha256: digest.sha256,
					size: digest.bytes,
					format: classifyArtifactBytes(digest.prefix, digest.bytes),
					contentState: "embedded"
				}),
				mismatched,
				classification: classified
			};
		};
		isExpandableAsar = (entry, logicalPath) => entry.kind === "file" && logicalPath.toLowerCase().endsWith(".asar") && isAbsolute(entry.adapterKey);
		isUnavailableUnpackedEntry = (cause, entry) => entry.unpacked && cause instanceof ArtifactReaderFailure && cause.reason === "unavailable";
	})))();
}

//#endregion
//#region dist/artifacts/inventory/scanCanonical.js
var scanCanonicalArtifactInventory, scanCanonicalArtifactInventoryInScope, cleanupInventoryOwners, buildInventorySnapshot, buildIntegrityContradictions, verifyRootDigest, sortNodes, sortOccurrences, sortEdges, buildManifest, buildLimitations;
function init_scanCanonical() {
	return (init_scanCanonical = __esmMin((() => {
		init_unicodeCodePointOrder();
		init_AsarArtifactReader();
		init_ArtifactReader();
		init_artifactGraph();
		init_ArtifactGraphConstruction();
		init_artifactIdentity();
		init_classify();
		init_hostExecutableMarking();
		init_hashStableRootArtifact();
		init_reader();
		init_scanReader();
		init_types();
		scanCanonicalArtifactInventory = async (path, options, readerFactory = createReader) => options.resourceScope.run(() => scanCanonicalArtifactInventoryInScope(path, options, readerFactory));
		scanCanonicalArtifactInventoryInScope = async (path, options, readerFactory = createReader) => {
			const integrity = options.integrity ?? STRICT_INTEGRITY_POLICY;
			const metadata = await lstat(path);
			const { format: rootFormat, digest: rootDigest, rootSource } = await classifyAndHashRootForInventory(path, metadata.isDirectory(), metadata, options);
			let reader;
			let readerCreationFailure;
			try {
				reader = readerFactory(path, rootFormat, options.environment ?? {}, rootSource);
			} catch (cause) {
				readerCreationFailure = { cause };
			}
			const ownedReaders = reader === undefined ? [] : [reader];
			let outcome;
			try {
				if (readerCreationFailure !== undefined) throw readerCreationFailure.cause;
				if (reader instanceof AsarArtifactReader) await reader.prepareContainer(rootDigest?.sha256, options.signal);
				const { nodes, occurrences, pendingContradictions, caseCollisionLimitation, unknownParentOccurrences, traversal } = await scanReader(reader, ownedReaders, options.signal, integrity);
				outcome = {
					kind: "completed",
					snapshot: await buildInventorySnapshot({
						path,
						metadata,
						rootFormat,
						rootDigest,
						rootSource,
						resourceScope: options.resourceScope,
						reader,
						signal: options.signal,
						nodes,
						occurrences,
						pendingContradictions,
						caseCollisionLimitation,
						unknownParentOccurrences,
						traversal
					})
				};
			} catch (cause) {
				outcome = {
					kind: "failed",
					cause
				};
			}
			const cleanupFailure = await cleanupInventoryOwners({
				path,
				options,
				rootSource,
				ownedReaders,
				outcome
			});
			if (cleanupFailure !== undefined) throw cleanupFailure;
			if (outcome.kind === "failed") throw outcome.cause;
			return outcome.snapshot;
		};
		cleanupInventoryOwners = async ({ path, options, rootSource, ownedReaders, outcome }) => {
			let cleanupFailure;
			const owners = [...ownedReaders].reverse().map((reader) => ({
				kind: "reader",
				reader,
				resource: `artifact reader for ${path}`
			}));
			if (rootSource !== undefined) owners.push({
				kind: "file-handle",
				handle: rootSource.owner,
				resource: `root artifact descriptor for ${path}`
			});
			for (const owner of owners) {
				const attempt = await options.resourceScope.release(owner);
				if (attempt.kind === "released") continue;
				const primary = cleanupFailure ?? (outcome.kind === "failed" ? outcome.cause : attempt.cause);
				cleanupFailure = ArtifactReaderFailure.withCleanup(primary, ArtifactReaderFailure.cleanupObservation(attempt.cause, owner.resource), outcome.kind === "completed" ? {
					kind: "artifact-inventory",
					inventory: outcome.snapshot
				} : undefined);
			}
			return cleanupFailure;
		};
		buildInventorySnapshot = async (input) => {
			const { path, metadata, rootFormat, rootDigest, rootSource, reader, signal } = input;
			materializeDirectoryNodes(input.occurrences, input.nodes);
			const rootNode = createRootNode({
				digest: rootDigest,
				occurrences: input.occurrences
			});
			input.nodes.set(rootNode.artifact_id, rootNode);
			rekeyOccurrences(rootNode.artifact_id, input.occurrences);
			const rootOccurrence = rootOccurrenceFor(rootNode, {
				size: metadata.size,
				executable: hostExecutableMarking(path, metadata),
				format: rootFormat,
				path
			});
			for (const occurrence of input.occurrences) if (occurrence.parent_occurrence_id === null && !input.unknownParentOccurrences.has(occurrence)) occurrence.parent_occurrence_id = rootOccurrence.occurrence_id;
			input.occurrences.unshift(rootOccurrence);
			const occurrenceById = new Map(input.occurrences.map((occurrence) => [occurrence.occurrence_id, occurrence]));
			const integrityContradictions = buildIntegrityContradictions(input.pendingContradictions, occurrenceById, rootNode);
			const edgeResult = createArtifactEdges(rootNode.artifact_id, input.occurrences, reader?.provenance()[0]);
			const { edges } = edgeResult;
			const orderedNodes = sortNodes([...input.nodes.values()]);
			const orderedOccurrences = sortOccurrences(input.occurrences);
			const orderedEdges = sortEdges(edges).map((edge, ordinal) => ({
				...edge,
				ordinal
			}));
			await verifyRootDigest(path, rootDigest, rootSource, input.resourceScope, signal);
			const graphSha256 = artifactGraphDigest({
				nodes: orderedNodes,
				occurrences: orderedOccurrences,
				edges: orderedEdges,
				contradictions: integrityContradictions
			});
			const manifest = buildManifest({
				rootNode,
				rootFormat,
				graphSha256,
				orderedNodes,
				orderedOccurrences,
				orderedEdges
			});
			const traversal = inventoryCoverage(rootFormat, reader, input.traversal);
			const coverage = edgeResult.limitations.length === 0 ? traversal.coverage : {
				...traversal.coverage,
				status: "unknown"
			};
			return {
				manifest,
				nodes: orderedNodes,
				occurrences: orderedOccurrences,
				edges: orderedEdges,
				provenance: reader?.provenance() ?? [],
				integrity_contradictions: integrityContradictions,
				coverage,
				coverage_status: coverage.status === "complete" ? "complete" : "partial",
				limitations: buildLimitations([...traversal.limitations, ...edgeResult.limitations], integrityContradictions, input.caseCollisionLimitation)
			};
		};
		buildIntegrityContradictions = (pending, occurrenceById, rootNode) => pending.map((contradiction) => {
			const occurrence = contradiction.occurrence;
			const parent = occurrence.parent_occurrence_id === null ? undefined : occurrenceById.get(occurrence.parent_occurrence_id);
			const parentArtifactId = parent?.artifact_id ?? rootNode.artifact_id;
			return {
				contradiction_id: artifactContradictionId({
					rootArtifactId: rootNode.artifact_id,
					logicalPath: occurrence.logical_path,
					declaredSha256: contradiction.declaredSha256,
					observedSha256: contradiction.observedSha256
				}),
				occurrence_id: occurrence.occurrence_id,
				parent_artifact_id: parentArtifactId,
				logical_path: occurrence.logical_path,
				declared_sha256: contradiction.declaredSha256,
				observed_sha256: contradiction.observedSha256,
				entry_kind: contradiction.entryKind,
				unpacked: contradiction.unpacked,
				trust: "observed-untrusted",
				provenance: "container-integrity-metadata-versus-observed-bytes",
				limitations: ["Observed bytes contradict declared integrity metadata and cannot support equivalence."]
			};
		});
		verifyRootDigest = async (path, rootDigest, rootSource, resourceScope, signal) => {
			if (rootDigest === null) return;
			const verified = rootSource === undefined ? await hashStableRootArtifact(path, resourceScope, signal) : await hashStableRootArtifactHandle(path, rootSource.handle, rootSource.initial, signal);
			if (verified.sha256 !== rootDigest.sha256 || verified.bytes !== rootDigest.bytes) throw new ArtifactReaderFailure("integrity", "Root artifact changed during inventory");
		};
		sortNodes = (nodes) => nodes.sort((left, right) => compareUnicodeCodePoints(left.artifact_id, right.artifact_id));
		sortOccurrences = (occurrences) => occurrences.sort((left, right) => compareUnicodeCodePoints(left.logical_path, right.logical_path));
		sortEdges = (edges) => edges.sort((left, right) => compareUnicodeCodePoints(left.edge_id, right.edge_id));
		buildManifest = ({ rootNode, rootFormat, graphSha256, orderedNodes, orderedOccurrences, orderedEdges }) => artifactInventoryResultSchema.shape.manifest.parse({
			manifest_id: artifactManifestId(rootNode.artifact_id, graphSha256),
			root_artifact_id: rootNode.artifact_id,
			root_sha256: rootNode.sha256,
			root_format: rootFormat,
			graph_sha256: graphSha256,
			node_count: orderedNodes.length,
			occurrence_count: orderedOccurrences.length,
			edge_count: orderedEdges.length
		});
		buildLimitations = (scopeLimitations, integrityContradictions, caseCollisionLimitation) => [
			...scopeLimitations,
			...caseCollisionLimitation === undefined ? [] : [caseCollisionLimitation],
			...integrityContradictions.length === 0 ? [] : [`${String(integrityContradictions.length)} integrity contradiction(s) were recorded; mismatched content is observed-untrusted.`]
		];
	})))();
}

//#endregion
export { AsarArtifactReader, DirectoryArtifactReader, MachOSliceArtifactReader, abortIfNeeded, hashReadable, init_ArtifactHash, init_AsarArtifactReader, init_DirectoryArtifactReader, init_MachOSliceArtifactReader, init_javascriptArtifactFiles, init_scanCanonical, isJavaScriptSourcePath, scanCanonicalArtifactInventoryInScope };