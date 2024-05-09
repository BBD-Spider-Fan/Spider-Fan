import {loginUrl} from "../oauth.js";

export const loginPage = (contentElement) => {
    let mainSection = document.createElement("section");
    let heading1 = document.createElement("h1");
    heading1.textContent = 'Spiderfan';
    mainSection.appendChild(heading1);
    let heading2 = document.createElement("h2");
    heading2.textContent = 'Untangle the web';
    mainSection.appendChild(heading2);
    //TODO Style this correctly
    let aTag = document.createElement("a");
    aTag.text = "Continue with Google";
    aTag.href = loginUrl();
    aTag.classList.add('login-button');
    mainSection.appendChild(aTag)
    contentElement.appendChild(mainSection)

    let spiderImage = document.createElement("img");
    let webImage = document.createElement("img");
    spiderImage.setAttribute('src', '/assets/images/spider-i.png');
    webImage.setAttribute('src', '/assets/images/web-i.png');
    spiderImage.setAttribute('id', 'spider-i');
    webImage.setAttribute('id', 'web-i');
    contentElement.appendChild(spiderImage);
    contentElement.appendChild(webImage);
    contentElement.className = '';
    contentElement.classList.add('auth-page');

    return mainSection;
};