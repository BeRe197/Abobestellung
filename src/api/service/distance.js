const {pressCompanyInfos, plzToCoordinates} = require("../assets/constants");

module.exports = {
    checkDatabaseDistance: function (plzDestination) {
        //Check distance
        if (pressCompanyInfos.plz === plzDestination) {
            return new Promise((res, rej) => {
                res({"distance": 0, "plzDestination": plzDestination});
            })
        } else {
            let plzArray = Object.values(plzToCoordinates)
            let companyCoord = plzArray.find((element) => element.zipcode === pressCompanyInfos.plz)
            let destinationCoord = plzArray.find((element) => element.zipcode === plzDestination)

            if (companyCoord && destinationCoord) {
                let distanceResult = getDistanceFromLatLonInKm(companyCoord.latitude, companyCoord.longitude, destinationCoord.latitude, destinationCoord.longitude)
                return new Promise((res, rej) => {
                    res({"distance": distanceResult, "plzDestination": plzDestination});
                })
            } else {
                return new Promise((res, rej) => {
                    console.log("No plz found with:" + plzDestination);
                    res({"distance": 0, "plzDestination": plzDestination});
                })
            }
        }
    }
};

//*************************************/
//Helper functions
//*************************************/
const getDistanceFromLatLonInKm = function (lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);  // deg2rad below
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
}

const deg2rad = function (deg) {
    return deg * (Math.PI / 180)
}


