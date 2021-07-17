const {localpaperversions} = require("../assets/constants");

module.exports = {
    getLocalVersionsForPlz: function (plz) {
        return new Promise((res, rej) => {
            if (!plz) {
                res({})
            } else {
                let startnumber = plz.toString().charAt(0)
                let localversions = {}
                switch (startnumber) {
                    case '0':
                    case '1':
                    case '2':
                        localversions = Object.values(localpaperversions).filter((version) => version.id !== 3)
                        break;
                    case '3':
                    case '4':
                    case '5': {
                        localversions = Object.values(localpaperversions).filter((version) => version.id !== 3 && version.id !== 2)
                    }
                        break;
                    default: {
                        localversions = localpaperversions
                    }
                }
                res(localversions)
            }
        })
    }
};