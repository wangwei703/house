export default class sessionStoragePlugin {
    constructor(storageKey) {
        this.storageKey = storageKey;
    }

    get() {
        try {
            let s = sessionStorage.getItem(this.storageKey);
            return JSON.parse(s);
        } catch (e) {
            return;
        }
    }
    set(obj) {
        sessionStorage.setItem(this.storageKey, JSON.stringify(obj));
    }
    isNull() {
        return sessionStorage.getItem(this.storageKey) === null;
    }
}