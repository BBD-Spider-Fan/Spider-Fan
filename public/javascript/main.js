import {mainPage} from "./pages/mainPage.js";
import {loginPage} from "./pages/loginPage.js";
import {authUrlRipper, isLoggedIn, logout} from "./oauth.js";
import {historyPage} from "./pages/historyPage.js";

authUrlRipper();

let contentElement = document.getElementById("content");

// Check the login status
const spinner = document.createElement('spider-spinner');

contentElement.appendChild(spinner);

let isUserLoggedIn = await isLoggedIn();

spinner.remove();

if (isUserLoggedIn) {
    // Add the items to the nav bar.
    let navElement = document.getElementById("nav-comp");
    let navHome = document.createElement("a");
    navHome.text = "Home";
    navHome.href = "";
    navHome.addEventListener("click", async e => {
        e.preventDefault();
        return mainPage(contentElement);
    });
    navElement.appendChild(navHome);

    let navHistory = document.createElement("a");
    navHistory.text = "History";
    navHistory.href = "";
    navHistory.addEventListener("click", async (event) => {
        event.preventDefault();
        return historyPage(contentElement);
    });
    navElement.appendChild(navHistory);
    let logoutButton = document.createElement("button");
    logoutButton.classList.add("logout-button");
    logoutButton.innerText = "Logout";
    logoutButton.addEventListener("click", logout);
    navElement.appendChild(logoutButton);

    mainPage(contentElement);
} else {
    loginPage(contentElement);

}