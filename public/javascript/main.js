import {isLoggedIn} from "./auth.js";
import {mainPage} from "./pages/mainPage.js";
import {loginPage} from "./pages/loginPage.js";
import {authUrlRipper, loginUrl} from "./oauth_1.js";


authUrlRipper();

// Check the login status
let isUserLoggedIn = await isLoggedIn();
let contentElement = document.getElementById("content");

let node = document.createElement("a");
node.text = "hello world "
node.href = loginUrl();
contentElement.appendChild(node)

if (isUserLoggedIn) {
    // Add the items to the nav bar.
    let navElement = document.getElementById("nav-items");
    let navList = document.createElement("ul");
    let navItem = document.createElement("li");
    navList.appendChild(navItem);

    let navItemLogout = document.createElement("li");
    navList.appendChild(navItemLogout);
    navElement.appendChild(navList);

    // TODO: main page
    contentElement.appendChild(mainPage);
} else {
    contentElement.appendChild(loginPage)

}