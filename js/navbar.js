window.addEventListener("scroll", function () {
    let header = document.querySelector(".navbar-container");
	let anchor = document.querySelectorAll(".nav-link-dummy");
    header.classList.toggle("sticky", window.scrollY > 0);
	for(let i = 0; i < anchor.length; i++){
	anchor[i].classList.toggle("nav-link", window.scrollY > 0);
	}
  })