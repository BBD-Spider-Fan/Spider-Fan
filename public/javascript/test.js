function runClick() {
    const element = document.getElementById("html");
    element.classList.toggle("dark");
    element.classList.toggle("light");
}

document.getElementById("test_btn").addEventListener("click", runClick)


