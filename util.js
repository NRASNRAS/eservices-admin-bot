const { apiurl } = require("./config.json");

function postFlags(flags, token) {
    return {
        method: "post",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            "token": token,
            ...flags
        })
    }
}

function apiFetch(url, flags, callback, callbackString) {
    fetch(apiurl + url, flags)
    .then((res) => res.text())
    .then((res) => {
        if (res.startsWith("{") || res.startsWith("[")) {
            return JSON.parse(res);
        }
        return res;
    })
    .then((res) => {
        if (typeof res === "string") {
            callbackString(res);
        } else {
            callback(res);
        }
    })
}

module.exports = {
    postFlags,
    apiFetch
}
