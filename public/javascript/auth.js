import {makeRequest} from "./utils.js";

export const isLoggedIn = async () => {
    // Make call to ensure that the user is logged in.
    return await makeRequest("auth").then(d => !("error" in d))
};
