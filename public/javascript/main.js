import {mainPage} from "./pages/mainPage.js";
import {loginPage} from "./pages/loginPage.js";
import {authUrlRipper, isLoggedIn, logout} from "./oauth_1.js";
import {historyPage} from "./pages/historyPage.js";

authUrlRipper();

// Check the login status
let isUserLoggedIn = await isLoggedIn();
console.log(isUserLoggedIn);

let contentElement = document.getElementById("content");

if (isUserLoggedIn) {
    // Add the items to the nav bar.s
    let navElement = document.getElementById("nav-comp");
    let navReport = document.createElement("a");
    navReport.text = "Report";
    navReport.href = "#"
    navReport.addEventListener("click", () => {
        //TODO: make the page replace.
    });
    navElement.appendChild(navReport);

    let navHistory = document.createElement("a");
    navHistory.text = "History";
    navHistory.href = "#"
    navHistory.addEventListener("click", async (event) => {
        event.preventDefault();
        return historyPage(contentElement);
    });
    navElement.appendChild(navHistory);
    // TODO: main page

    let logoutButton = document.createElement("button");
    logoutButton.text = "Logout";
    logoutButton.addEventListener("click", logout);
    navElement.appendChild(logoutButton);

    mainPage(contentElement);
} else {
    loginPage(contentElement);

}