'use strict';

module.exports = class BroadcastProxyRegistry extends Map {
    load(requireFn, rootPath, config = {}) {
        for (const [name, settings] of Object.entries(config)) {
            if (!settings.hasOwnProperty('require')) {
                throw new Error(`BroadcastProxyRegistry [${name}] does not specify a 'require'`);
            }

            if (typeof settings.require !== 'string') {
                throw new TypeError(`BroadcastProxyRegistry [${name}] has an invalid 'require'`);
            }

            const sourceConfig = settings.config || {};

            let proxy;

            // relative path to require
            if (settings.require[0] === '.') {
                proxy = require(rootPath + '/' + settings.require);
            } else if (!settings.require.includes('.')) {
                proxy = require(settings.require);
            } else {
                const [moduleName, exportName] = settings.require.split('.');
                proxy = requireFn(moduleName)[exportName];
            }

            const instance = new proxy();

            if (typeof instance.configure !== 'function') {
                throw new Error(`BroadcastProxyRegistry ${name} requires a 'proxy' method`);
            }

            this.set(name, instance);
        }
    }

    attach(stream) {
        const identifier = stream.identifier;
        if (!stream.identifier) {
            throw new Error("TransportStreams must define a 'identifier' getter.");
        }

        const proxyInstance = this.get(identifier);
        if (!proxyInstance) {
            throw new Error(`No BroadcastProxies are defined for identifier: ${identifier}`);
        }

        Object.assign(stream, {
            broadcastProxy(target, message, options) {
                proxyInstance.proxy(target, message, options);
            }
        });
    }
};