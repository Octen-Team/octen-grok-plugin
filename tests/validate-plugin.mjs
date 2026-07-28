import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));

const manifest = await readJson(".grok-plugin/plugin.json");
const mcpConfig = await readJson(".mcp.json");

assert.equal(manifest.name, "octen");
assert.equal(manifest.version, "1.0.0");
assert.equal(manifest.license, "MIT");
assert.equal(manifest.repository, "https://github.com/Octen-Team/octen-grok-plugin");
assert.equal(manifest.homepage, "https://octen.ai");

assert.deepEqual(Object.keys(mcpConfig.mcpServers), ["octen"]);
const octen = mcpConfig.mcpServers.octen;
assert.equal(octen.command, "npx");
assert.deepEqual(octen.args, ["-y", "octen-mcp"]);
assert.equal(octen.env.OCTEN_API_KEY, "${OCTEN_API_KEY}");
assert.equal(JSON.stringify(mcpConfig).includes("sk-"), false);

console.log("Plugin manifest and MCP configuration are valid.");
