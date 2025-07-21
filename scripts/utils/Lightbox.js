export class Lightbox {
    /**
     * Initializes the Lightbox with a modal selector and media elements.
     * The modal will display media items (images or videos) in a fullscreen overlay.
     * @param {string} modalSelector - The CSS selector for the lightbox modal.
     * @param {NodeList} mediaEls - A NodeList of media elements (images or videos) to be displayed in the lightbox.
     */
    constructor(modalSelector, mediaEls) {
        this._modal = document.querySelector(modalSelector);
        this._items = Array.from(mediaEls);
        this._currentIndex = 0;
        this._bindEvents();
    }

    /**
     * Binds click and keyboard events to the media elements and modal controls.
     * This allows users to open the lightbox by clicking on media items
     * or using keyboard navigation (Enter key).
     * Also binds close, next, and previous actions to the modal controls.
     */
    _bindEvents() {
        this._items.forEach((el, idx) => {
            el.addEventListener("click", () => this.open(idx));
            el.addEventListener("keydown", e => {
                if (e.key === "Enter") {
                    this.open(idx);
                }
            });
        });
        this._modal.querySelector(".close-button").addEventListener("click", () => this.close());
        this._modal.querySelector(".previous-button").addEventListener("click", () => this.prev());
        this._modal.querySelector(".previous-button").addEventListener("keydown", e => {
            if (e.key === "ArrowLeft") {
                this.prev();
            }
        });
        this._modal.querySelector(".next-button").addEventListener("click", () => this.next());

        document.addEventListener("keydown", e => {
            if (!this._modal.parentElement.classList.contains("open")) {
                return;
            }
            switch (e.key) {
                case "Escape":
                    this.close();
                    break;
                case "ArrowLeft":
                    this.prev();
                    break;
                case "ArrowRight":
                    this.next();
                    break;
                case "Tab":
                    this._trapFocus(e);
                    break;
            }
        });
    }

    open(index) {
        this._currentIndex = index;
        this._show();
        this._modal.parentElement.classList.add("open");
    }

    close() {
        this._modal.parentElement.classList.remove("open");
        this._clear();
    }

    next() {
        this._currentIndex = (this._currentIndex + 1) % this._items.length;
        this._show();
    }
    prev() {
        this._currentIndex = (this._currentIndex - 1 + this._items.length) % this._items.length;
        this._show();
    }

    _show() {
        this._clear();
        // Set attributes for accessibility
        this._modal.setAttribute("aria-hidden", "true");
        this._modal.setAttribute("role", "dialog");
        this._modal.setAttribute("aria-modal", "true");

        if (this._items[this._currentIndex] !== undefined) {            
            // Clone the current media item to display
            const media = this._items[this._currentIndex].cloneNode(true);
            
            media.setAttribute("aria-label", `Média ${this._currentIndex + 1} sur ${this._items.length}`);
            media.classList.add("lightbox-media");
            
            if (media.tagName === "VIDEO") {
                media.setAttribute("controls", "true");
            }
            this._modal.appendChild(media);
            document.querySelector("#main").style = "display: none;";
        }
    }

    _clear() {
        const old = this._modal.querySelector(".lightbox-media");
        if (old) {
            old.remove();
        }
        this._modal.setAttribute("aria-hidden", "false");
        document.querySelector("#main").style = "display: block;";
    }

    /**
     * Traps focus within the lightbox modal to ensure accessibility.
     * This prevents focus from moving outside the modal when using Tab or Shift+Tab.
     * @param {KeyboardEvent} e - The keyboard event triggered by Tab or Shift+Tab.
     */
    /*_trapFocus(e) {
        const focusableSelectors = [".close-button", ".previous-button", ".next-button", ".lightbox-media"];
        const focusables = focusableSelectors
            .map(sel => this._modal.querySelector(sel))
            .filter(el => el);

        if (!focusables.length) {
            return;
        }

        const firstEl = focusables[0];
        const lastEl = focusables[focusables.length - 1];
        const activeEl = document.activeElement;

        if (e.shiftKey) {
            // Shift+Tab
            if (activeEl === firstEl) {
                e.preventDefault();
                lastEl.focus();
            }
        } else {
            // Tab
            if (activeEl === lastEl) {
                e.preventDefault();
                firstEl.focus();
            }
        }
    }
        */
}
