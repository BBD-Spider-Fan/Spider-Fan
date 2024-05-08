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
    let navList = document.createElement("ul");
    let navItem = document.createElement("li");
    navList.appendChild(navItem);

    let navItemLogout = document.createElement("li");
    navList.appendChild(navItemLogout);
    navElement.appendChild(navList);

    // TODO: main page
    mainPage(contentElement);
} else {
    loginPage(contentElement);

}