const DROPDOWN = document.getElementById('dropdown')
const DROPDOWNS = document.getElementsByClassName("dropdown-content")

/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function dropdown() {
    if (DISABLEUSERACTIVITY) { return }
    DROPDOWN.classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function (event) {
    if (!event.target.matches('.dropbtn')) {
        for (let i = 0; i < DROPDOWNS.length; i++) {
            if (DROPDOWNS[i].classList.contains('show')) {
                DROPDOWNS[i].classList.remove('show');
            }
        }
    }
}