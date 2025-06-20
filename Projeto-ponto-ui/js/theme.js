document.addEventListener("DOMContentLoaded", function () {
    const themeToggle = document.getElementById("themeToggle");
    const body = document.body;

    function setTheme(theme) {
        body.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
        if (themeToggle) {
            themeToggle.innerHTML = theme === "dark"
                ? '<i class="fas fa-sun"></i>'
                : '<i class="fas fa-moon"></i>';
        }
    }

    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const current = body.getAttribute("data-theme");
            setTheme(current === "dark" ? "light" : "dark");
        });
    }
});
