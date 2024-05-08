import {loginUrl} from "../oauth_1.js";

export const loginPage = (content) => {
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
    mainSection.appendChild(aTag)
    content.appendChild(mainSection)

    let image = document.createElement("img");
    // image.src =
    content.appendChild(image)
    return mainSection;
};