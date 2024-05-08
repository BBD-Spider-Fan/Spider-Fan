import {mainPage} from "./pages/mainPage.js";
import {loginPage} from "./pages/loginPage.js";
import {authUrlRipper, isLoggedIn} from "./oauth_1.js";

authUrlRipper();

// Check the login status
let isUserLoggedIn = await isLoggedIn();
console.log(isUserLoggedIn);

let contentElement = document.getElementById("content");

if (isUserLoggedIn) {
    // Add the items to the nav bar.s
    let navElement = document.getElementById("nav-items");
    let navReport = document.createElement("a");
    navReport.text = "Report";
    navReport.addEventListener("click", () => {
        //TODO: make the page replace.
    });
    navElement.appendChild(navReport);

    let navHistory = document.createElement("a");
    navHistory.text = "History";
    navHistory.addEventListener("click", () => {
        //TODO: make the page replace.
    });
    navElement.appendChild(navHistory);


    // TODO: main page
    mainPage(contentElement);
} else {
    loginPage(contentElement);

}