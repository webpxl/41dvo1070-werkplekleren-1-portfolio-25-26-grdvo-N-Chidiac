class MobileMenu {
	constructor() {
		this.isOpen = false;
		this.init();
	}

	init() {
		this.loadTheme();
		this.createHamburger();
		this.createOverlay();
		this.createThemeToggle();
		this.attachEventListeners();
		this.handleResize();
		this.addKeyboardSupport();
		this.addEasterEgg();
		this.setActivePage();
	}

	loadTheme() {
		const savedTheme = localStorage.getItem("theme");
		if (savedTheme) {
			document.documentElement.setAttribute("data-theme", savedTheme);
		}
	}

	setActivePage() {
		const currentPath = window.location.pathname.toLowerCase();
		const links = document.querySelectorAll("nav a");

		links.forEach((link) => {
			let linkHref = link.getAttribute("href").toLowerCase().replace("./", "");

			link.classList.remove("active");
			const li = link.closest("li");
			if (li) li.classList.remove("active");

			const isHomePage = (currentPath === "/" || currentPath.endsWith("index.html") || currentPath === "") && linkHref.includes("index");
			const isOtherPage =
				(linkHref !== "index.html" && linkHref !== "" && currentPath.endsWith(linkHref.replace(".html", ""))) || currentPath.endsWith(linkHref);

			if (isHomePage || isOtherPage) {
				link.classList.add("active");
				if (li) li.classList.add("active");
			}
		});
	}
	createHamburger() {
		const hamburger = document.createElement("div");
		hamburger.className = "hamburger";
		hamburger.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;
		hamburger.setAttribute("aria-label", "Menu");
		hamburger.setAttribute("aria-expanded", "false");

		const header = document.querySelector("header");
		header.insertBefore(hamburger, header.firstChild);

		this.hamburger = hamburger;
		this.addStyles();
	}

	addStyles() {
		if (document.getElementById("mobile-menu-styles")) return;

		const style = document.createElement("style");
		style.id = "mobile-menu-styles";
		style.textContent = `
            /* Hamburger Button */
            .hamburger {
                display: none;
                flex-direction: column;
                justify-content: space-between;
                width: 30px;
                height: 25px;
                background: transparent;
                border: none;
                cursor: pointer;
                padding: 0;
                z-index: 1001;
                margin: 8px 10px;
                transition: transform 0.3s ease;
                flex-shrink: 0;
            }

            .hamburger:hover {
                transform: scale(1.1);
            }

            .hamburger span {
                width: 100%;
                height: 3px;
                background: var(--text-primary);
                border-radius: 10px;
                transition: all 0.3s ease;
                transform-origin: center;
            }

            .hamburger.active span:nth-child(1) {
                transform: translateY(11px) rotate(45deg);
            }

            .hamburger.active span:nth-child(2) {
                opacity: 0;
                transform: translateX(-20px);
            }

            .hamburger.active span:nth-child(3) {
                transform: translateY(-11px) rotate(-45deg);
            }

            /* Overlay */
            .menu-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                z-index: 999;
                backdrop-filter: blur(4px);
            }

            .menu-overlay.active {
                opacity: 1;
                visibility: visible;
            }

            /* Mobile Navigation */
            @media (max-width: 768px) {
                nav {
                    transform: translateX(-100%);
                    transition: transform 0.3s ease-in-out;
                }
            }

            body.menu-open nav {
                transform: translateX(0) !important;
                box-shadow: 2px 0 10px rgba(0, 0, 0, 0.3);
            }

            body.menu-open {
                overflow: hidden;
            }

            nav.mobile-open {
                padding-top: 60px;
            }

            nav.mobile-open ul {
                padding-bottom: 30px;
            }

            /* Easter Egg Badge */
            .secret-badge {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: var(--bg-secondary);
                color: var(--text-primary);
                padding: 10px 20px;
                border-radius: 5px;
                opacity: 0;
                transition: opacity 0.3s ease;
                z-index: 1002;
                white-space: nowrap;
                font-size: 14px;
                max-width: 90vw;
                text-align: center;
            }

            .secret-badge.show {
                opacity: 1;
            }

            @media (max-width: 768px) {
                .secret-badge {
                    font-size: 12px;
                    padding: 8px 16px;
					bottom: 80px;
					left: 50%;
					transform: translateX(-50%);
                }
            }

            @media (max-width: 480px) {
                .hamburger {
                    margin-left: 5px;
                    margin-right: 5px;
                }
            }
        `;
		document.head.appendChild(style);
	}

	createOverlay() {
		const overlay = document.createElement("div");
		overlay.className = "menu-overlay";
		document.body.appendChild(overlay);
		this.overlay = overlay;
	}

	createThemeToggle() {
		const toggle = document.createElement("button");
		toggle.className = "theme-toggle";
		toggle.setAttribute("aria-label", "Toggle theme");
		toggle.innerHTML = `
			<svg class="sun-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
				<path d="M12 18C8.68629 18 6 15.3137 6 12C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12C18 15.3137 15.3137 18 12 18ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16ZM11 1H13V4H11V1ZM11 20H13V23H11V20ZM3.51472 4.92893L4.92893 3.51472L7.05025 5.63604L5.63604 7.05025L3.51472 4.92893ZM16.9497 18.364L18.364 16.9497L20.4853 19.0711L19.0711 20.4853L16.9497 18.364ZM19.0711 3.51472L20.4853 4.92893L18.364 7.05025L16.9497 5.63604L19.0711 3.51472ZM5.63604 16.9497L7.05025 18.364L4.92893 20.4853L3.51472 19.0711L5.63604 16.9497ZM23 11V13H20V11H23ZM4 11V13H1V11H4Z"/>
			</svg>
			<svg class="moon-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
				<path d="M10 7C10 10.866 13.134 14 17 14C18.9584 14 20.729 13.1957 21.9995 11.8995C22 11.933 22 11.9665 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C12.0335 2 12.067 2 12.1005 2.00049C10.8043 3.27098 10 5.04157 10 7ZM4 12C4 16.4183 7.58172 20 12 20C15.0583 20 17.7159 18.2839 19.062 15.7621C18.3945 15.9187 17.7035 16 17 16C12.0294 16 8 11.9706 8 7C8 6.29652 8.08133 5.60547 8.2379 4.938C5.71611 6.2841 4 8.9417 4 12Z"/>
			</svg>
		`;
		document.body.appendChild(toggle);
		this.themeToggle = toggle;
	}

	attachEventListeners() {
		this.hamburger.addEventListener("click", () => this.toggle());
		this.overlay.addEventListener("click", () => this.close());
		this.themeToggle.addEventListener("click", () => {
			const newTheme = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";

			document.documentElement.setAttribute("data-theme", newTheme);
			localStorage.setItem("theme", newTheme);
		});

		window.addEventListener("resize", () => this.handleResize());
		window.addEventListener("keydown", (e) => {
			if (e.key === "Escape" && this.isOpen) {
				this.close();
			}
		});
	}

	handleResize() {
		if (window.innerWidth > 768) {
			this.close();
			this.hamburger.style.display = "none";
		} else {
			this.hamburger.style.display = "flex";
		}
	}

	open() {
		if (this.isOpen) return;
		this.isOpen = true;
		this.hamburger.classList.add("active");
		this.hamburger.setAttribute("aria-expanded", "true");
		document.querySelector("nav").classList.add("mobile-open");
		this.overlay.classList.add("active");
		document.body.classList.add("menu-open");
		document.body.style.overflow = "hidden";

		// this.hamburger.style.position = "absolute";
		// this.hamburger.style.left = "10px";
		// this.hamburger.style.top = "10px";
		// this.hamburger.style.zIndex = "1001";
		// this.hamburger.style.margin = "0";
		this.hamburger.classList.add("floating");
	}

	close() {
		if (!this.isOpen) return;
		this.isOpen = false;
		this.hamburger.classList.remove("active");
		this.hamburger.setAttribute("aria-expanded", "false");
		document.querySelector("nav").classList.remove("mobile-open");
		this.overlay.classList.remove("active");
		document.body.classList.remove("menu-open");
		document.body.style.overflow = "";

		this.hamburger.classList.remove("floating");
	}

	toggle() {
		if (this.isOpen) {
			this.close();
		} else {
			this.open();
		}
	}

	addKeyboardSupport() {
		let keySequence = [];
		const konamiCode = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

		document.addEventListener("keydown", (e) => {
			if (e.altKey && e.key === "m") {
				e.preventDefault();
				this.toggle();
			}

			keySequence.push(e.key);
			if (keySequence.length > konamiCode.length) {
				keySequence.shift();
			}

			if (JSON.stringify(keySequence) === JSON.stringify(konamiCode)) {
				this.activateEasterEgg();
				keySequence = [];
			}
		});
	}

	addEasterEgg() {
		let clickCount = 0;
		const logo = document.querySelector(".file-name");
		if (logo) {
			logo.addEventListener("click", () => {
				clickCount++;

				if (clickCount === 7) {
					this.activateEasterEgg();
					clickCount = 0;
				}

				logo.classList.add("file-name-bounce");
				setTimeout(() => {
					logo.classList.remove("file-name-bounce");
				}, 100);
			});
		}
	}

	activateEasterEgg() {
		const badge = document.createElement("div");
		badge.className = "secret-badge";
		badge.textContent = "🎉 You found the secret! Keep coding!";
		document.body.appendChild(badge);

		setTimeout(() => badge.classList.add("show"), 100);

		const nav = document.querySelector("nav");
		if (nav) {
			nav.classList.add("rainbow-border");
		}

		setTimeout(() => {
			badge.classList.remove("show");
			if (nav) nav.classList.remove("rainbow-border");
			setTimeout(() => badge.remove(), 500);
		}, 5000);

		console.log(
			`
%c 🎨 EASTER EGG UNLOCKED! 🎨
%c
You found it! Here are some shortcuts:
- Alt + M: Toggle menu
- Escape: Close menu
- Click logo 7 times or use Konami code: ↑↑↓↓←→←→BA

Keep exploring and happy coding! 💻
        `,
			"color: #007acc; font-size: 20px; font-weight: bold;",
			"color: #4ec9b0; font-size: 14px;"
		);
	}
}

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", () => {
		new MobileMenu();
	});
} else {
	new MobileMenu();
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
	anchor.addEventListener("click", function (e) {
		const href = this.getAttribute("href");
		if (href !== "#" && document.querySelector(href)) {
			e.preventDefault();
			document.querySelector(href).scrollIntoView({
				behavior: "smooth",
			});
		}
	});
});

window.addEventListener("load", () => {
	document.body.classList.add("page-loaded");
});
