const currentPage = location.pathname
const menuItems = document.querySelectorAll("header .links a")

/* Adiciona a classe active conforme a página que está */
for (let item of menuItems) {
    if (currentPage.includes(item.getAttribute("href"))) {
        item.classList.add("active")
    }
}