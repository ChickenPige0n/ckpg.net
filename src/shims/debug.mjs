/**
 * No-op ESM shim for the 'debug' npm package.
 *
 * The real debug@4.x uses CommonJS (module.exports = ...) which crashes in
 * Cloudflare Workers V8 isolates where `module` is not a global.
 * @iconify/utils imports 'debug' as a side-effect for its internal logging,
 * so replacing it with a harmless no-op keeps icon rendering intact.
 */

function createDebug(namespace) {
	const fn = () => {};
	fn.enabled = false;
	fn.namespace = namespace;
	fn.log = () => {};
	fn.extend = (prefix, delimiter) =>
		createDebug(namespace + (delimiter ?? ":") + prefix);
	fn.destroy = () => true;
	return fn;
}

createDebug.enable = () => {};
createDebug.disable = () => "";
createDebug.enabled = () => false;
createDebug.selectColor = () => "";
createDebug.formatters = {};
createDebug.names = [];
createDebug.skips = [];
createDebug.humanize = (ms) => `${ms}ms`;

export default createDebug;
export { createDebug as debug };
