class MobileMenu {
	constructor() {
		this.isOpen = false;
		this.init();
	}

	init() {
		this.createHamburger();
		this.createOverlay();
		this.attachEventListeners();
		this.handleResize();
		this.addKeyboardSupport();
		this.addEasterEgg();
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

	createOverlay() {
		const overlay = document.createElement("div");
		overlay.className = "menu-overlay";
		document.body.appendChild(overlay);
		this.overlay = overlay;
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
                justify-content: space-around;
                width: 30px;
                height: 25px;
                background: transparent;
                border: none;
                cursor: pointer;
                padding: 0;
                z-index: 1001;
                margin-left: 15px;
                transition: transform 0.3s ease;
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
            body.menu-open nav {
                transform: translateX(0) !important;
                box-shadow: 2px 0 10px rgba(0, 0, 0, 0.3);
            }

            body.menu-open {
                overflow: hidden;
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
                }
            }
        `;
		document.head.appendChild(style);
	}

	attachEventListeners() {
		this.hamburger.addEventListener("click", () => this.toggle());
		this.overlay.addEventListener("click", () => this.close());
		window.addEventListener("resize", () => this.handleResize());
		document.addEventListener("keydown", (e) => {
			if (e.key === "Escape" && this.isOpen) {
				this.close();
			}
		});
	}

	toggle() {
		this.isOpen = !this.isOpen;
		this.hamburger.classList.toggle("active");
		this.hamburger.setAttribute("aria-expanded", this.isOpen);
		document.body.classList.toggle("menu-open");
		this.overlay.classList.toggle("active");

		const nav = document.querySelector("nav");
		if (nav && this.isOpen && window.innerWidth <= 768) {
			nav.style.display = "block";
		}
	}

	close() {
		if (!this.isOpen) return;
		this.isOpen = false;
		this.hamburger.classList.remove("active");
		this.hamburger.setAttribute("aria-expanded", "false");
		document.body.classList.remove("menu-open");
		this.overlay.classList.remove("active");
	}

	handleResize() {
		const nav = document.querySelector("nav");
		if (window.innerWidth <= 768) {
			if (nav) {
				nav.style.position = "fixed";
				nav.style.top = "0";
				nav.style.left = "0";
				nav.style.width = "250px";
				nav.style.height = "100%";
				nav.style.transform = "translateX(-100%)";
				nav.style.transition = "transform 0.3s ease";
				nav.style.zIndex = "1000";
				nav.style.overflowY = "auto";
				nav.style.display = "block";
			}
			this.hamburger.style.display = "flex";
		} else {
			if (nav) {
				nav.style.position = "";
				nav.style.top = "";
				nav.style.left = "";
				nav.style.width = "";
				nav.style.height = "";
				nav.style.transform = "";
				nav.style.transition = "";
				nav.style.zIndex = "";
				nav.style.display = "";
			}
			this.hamburger.style.display = "none";
			this.close();
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

				logo.style.transform = "scale(1.1)";
				setTimeout(() => {
					logo.style.transform = "scale(1)";
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
		const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8", "#F7DC6F", "#BB8FCE"];
		let colorIndex = 0;

		const rainbowInterval = setInterval(() => {
			if (nav) {
				nav.style.borderRight = `3px solid ${colors[colorIndex]}`;
				colorIndex = (colorIndex + 1) % colors.length;
			}
		}, 200);

		setTimeout(() => {
			badge.classList.remove("show");
			clearInterval(rainbowInterval);
			if (nav) nav.style.borderRight = "";

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
	document.body.style.opacity = "0";
	document.body.style.transition = "opacity 0.3s ease";
	setTimeout(() => {
		document.body.style.opacity = "1";
	}, 50);
});
