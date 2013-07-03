exports.facesKey = function () {
    var keyName = "faces-key"
    return { get: getKey, set: setKey }

    function getKey () {
        var rawKey = sessionStorage.getItem(keyName)
        if (rawKey === null) {
            return {
                value: null, dateCached: null
            }
        }
        else {
            return JSON.parse(rawKey)
        }
    }
    
    function setKey (key) {
        sessionStorage.setItem(keyName, JSON.stringify(key))
    }
}

