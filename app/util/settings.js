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
        let self = this;

        return new Promise(function(resolve, reject) {
            self.contains(key)
                .then(hasKey => {
                    if (hasKey) {
                        self._storage.get(key, function(error, result) {
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
                }).catch(error => {
                reject(error);
            });
        });
    }

    /**
     * Sets the value associated with the specific key.
     * @param {String} key The key associated with the specific key.
     * @param {object} data The value associated with the specific key to set.
     * @returns {Promise}
     */
    set(key, data) {
        let self = this;

        return new Promise(function(resolve, reject) {
            self._storage.set(key, data, function(error) {
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
        let self = this;

        return new Promise(function(resolve, reject) {
            self._storage.remove(key, function(error) {
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
        let self = this;

        return new Promise(function(resolve, reject) {
            self._storage.clear(function(error) {
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
        let self = this;

        return new Promise(function(resolve, reject) {
            self._storage.has(key, function(error, hasKey) {
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
        let self = this;

        return new Promise(function(resolve, reject) {
            self._storage.keys(function(error, keys) {
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
