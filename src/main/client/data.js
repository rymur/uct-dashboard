var keyName = "faces-key"

exports.getKey = function (ss) {
    var rawKey = ss.getItem(keyName)
    if (rawKey === null) {
        return {
            value: null, dateCached: null
        }
    }
    else {
        return JSON.parse(rawKey)
    }
}

exports.setKey = function (ss, key) {
    ss.setItem(keyName, JSON.stringify(key))
}

exports.facesAuth = function (ajaxGet, getKey, setKey) {

    return function (fn) {

        var key = getKey()

        if (needsRefresh(key)) {
            ajaxGet("/facesAuth", function (pk) {
                setKey({ value: pk, dateCached: Date.now() })
                fn(pk)
            })
        }
        else {
            fn(key.value)
        }
    }

    function needsRefresh (key) {
        if (key.value === null) {
            return true
        } 
        else if (key.dateCached === null) {
            return true
        }
        else {
            return ((Date.now() - key.dateCached) > (1000 * 60 * 5))
        }
    }
}

