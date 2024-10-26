/**
 * Populate claims table with appropriate description
 * @param {Object} claims ID token claims
 * @returns claimsObject
 */
export const createClaimsTable = (claims) => {
    let claimsObj = {};
    let index = 0;

    Object.keys(claims).forEach((key) => {
        if (typeof claims[key] !== 'string' && typeof claims[key] !== 'number') return;
        switch (key) {
            case 'name':
                populateClaim(key, claims[key], index, claimsObj);
                index++;
                break;
            case 'preferred_username':
                populateClaim(key, claims[key], index, claimsObj);
                index++;
                break;
        }
    });

    return claimsObj;
};


/**
 * Populates claim and value into a claimsObject without description
 * @param {String} claim
 * @param {String} value
 * @param {Number} index
 * @param {Object} claimsObject
 */
const populateClaim = (claim, value, index, claimsObject) => {
    let claimsArray = [];
    claimsArray[0] = claim;
    claimsArray[1] = value;
    claimsObject[index] = claimsArray;
};


/**
 * Transforms Unix timestamp to date and returns a string value of that date
 * @param {String} date Unix timestamp
 * @returns
 */
const changeDateFormat = (date) => {
    let dateObj = new Date(date * 1000);
    return `${date} - [${dateObj.toString()}]`;
};

/**
 * Extracts the 'name' and 'preferred_username' claims from the claims object
 * @param {Object} claims ID token claims
 * @returns {Object} An object with name and preferred_username, or a default message if not present
 */
export const getNameAndUsername = (claims) => {
    return {
        name: claims.name || "Nombre no disponible",
        preferred_username: claims.preferred_username || "Correo no disponible"
    };
};


