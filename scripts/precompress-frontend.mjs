import { glob } from 'node:fs/promises';
import path from 'node:path';
import fs from 'node:fs';
import zlib from 'node:zlib';
import { pipeline } from 'node:stream/promises';

const targetDir = path.resolve(import.meta.dirname, '../frontend/dist');

const compressions = [
    ['gz', () => zlib.createGzip({ level: zlib.constants.Z_BEST_COMPRESSION })],
    [
        'br',
        () =>
            zlib.createBrotliCompress({
                params: {
                    [zlib.constants.BROTLI_PARAM_QUALITY]: zlib.constants.BROTLI_MAX_QUALITY,
                },
            }),
    ],
    [
        'zstd',
        () =>
            zlib.createZstdCompress({
                params: {
                    [zlib.constants.ZSTD_c_compressionLevel]: 22,
                    [zlib.constants.ZSTD_c_strategy]: zlib.constants.ZSTD_btultra2,
                },
            }),
    ],
];

for await (const file of glob('**/*.{css,js,svg,html,txt,json,webmanifest}', {
    cwd: targetDir,
})) {
    for (const [suffix, method] of compressions) {
        const absoluteFile = path.resolve(targetDir, file);
        await compressFile(absoluteFile, suffix, method);
    }
    if (global.gc) {
        global.gc({
            type: 'major',
            execution: 'sync',
        });
    }
}

/**
 * Compresses a file and writes it to a new file
 * @param {string} inputFilePath - Path to the input file to compress
 * @param {string} suffix - Suffix for the output file
 * @param {() => import('node:stream').Transform} method
 * @returns Promise that resolves when compression is complete
 */
export async function compressFile(inputFilePath, suffix, method) {
    const outputFilePath = `${inputFilePath}.${suffix}`;
    console.log(inputFilePath, '=>', outputFilePath);

    const readStream = fs.createReadStream(inputFilePath);
    const compressionTransform = method();
    const writeStream = fs.createWriteStream(outputFilePath);

    await pipeline(readStream, compressionTransform, writeStream);
}
