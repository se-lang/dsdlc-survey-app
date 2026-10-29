import {fileURLToPath} from "node:url";
import fsp from "node:fs/promises";
import path from 'node:path';
import {loadConfig} from "graphql-config";
import {loadSchema} from "@graphql-tools/load";
import {UrlLoader} from "@graphql-tools/url-loader";
import {printSchemaWithDirectives} from "@graphql-tools/utils";

const config = await loadConfig({
    rootDir: fileURLToPath(new URL('..', import.meta.url)),
});
const source = process.argv[2] || 'Local API';

/**
 * @type {Map<string, string>}
 */
const cache = new Map();

for (const project of Object.values(config.projects)) {
    const url = project.extension('endpoints')?.[source]?.url;
    if (!url) {
        throw new Error('Invalid configuration');
    }
    if (typeof project.schema !== 'string') {
        throw new Error('Invalid schema config, cannot write file.');
    }
    let printed = cache.get(url);
    if (!printed) {
        const schema = await loadSchema(url, {
            loaders: [new UrlLoader()],
            inputValueDeprecation: true,
            oneOf: true,
        });
        printed = printSchemaWithDirectives(schema);
        cache.set(url, printed);
    }
    await fsp.writeFile(path.join(config.dirpath, project.schema), printed);
}
