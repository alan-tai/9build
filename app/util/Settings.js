'use strict';

export default class Settings {
    constructor() {
        this._storage = require('electron-json-storage');
    }

    /**
     * Gets the value associated with the specific key.
     * @param {String} key The key associated with the value to get.
     * @param {object} [defaultValue] The default value to return if no value is associated with the specific key.
     * @returns {Promise}
     */
    get(key, defaultValue) {
        return new Promise((resolve, reject) => {
            this.contains(key)
                .then(hasKey => {
                    if (hasKey) {
                        this._storage.get(key, (error, result) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve(result);
                            }
                        });
                    } else if (defaultValue) {
                        resolve(defaultValue);
                    } else {
                        resolve();
                    }
                }).catch(error => reject(error));
        });
    }

    /**
     * Sets the value associated with the specific key.
     * @param {String} key The key associated with the specific key.
     * @param {object} data The value associated with the specific key to set.
     * @returns {Promise}
     */
    set(key, data) {
        return new Promise((resolve, reject) => {
            this._storage.set(key, data, error => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }

    /**
     * Removes the specific key and value.
     * @param key The specific value to remove.
     * @returns {Promise}
     */
    remove(key) {
        return new Promise((resolve, reject) => {
            this._storage.remove(key, error => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }

    /**
     * Clears all keys.
     * @returns {Promise}
     */
    clear() {
        return new Promise((resolve, reject) => {
            this._storage.clear(error => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }

    /**
     * Determines if the specific key exists.
     * @param key The specific key to check for existence.
     * @returns {Promise}
     */
    contains(key) {
        return new Promise((resolve, reject) => {
            this._storage.has(key, (error, hasKey) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(hasKey);
                }
            });
        });
    }

    /**
     * Gets all the keys.
     * @returns {Promise}
     */
    keys() {
        return new Promise((resolve, reject) => {
            this._storage.keys((error, keys) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(keys);
                }
            });
        });
    }
}

module.exports = new Settings();
