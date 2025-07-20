import { MediaController } from "../controller/MediaController.js";
import { Lightbox } from "../utils/Lightbox.js";
export class SelectComponent {
    constructor(photographerDatas, totalLikesElement) {
        this._selectElement = document.getElementById("sort-select");
        this._options = Array.from(this._selectElement.querySelectorAll(".option"));
        this._photographerDatas = photographerDatas;
        this._medias = photographerDatas.medias;
        this._totalLikesElement = totalLikesElement;
    }

    init() {
        this.close();

        this._selectElement.addEventListener("click", e => {
            if (!this._selectElement.classList.contains("open")) {
                this.open(this._selectElement, this._options);
            } else if (e.target.classList.contains("option")) {
                this.choose(e.target, this._selectElement, this._options);
            } else {
                this.close();
            }
        });

        this._selectElement.addEventListener("keydown", e => {
            const key = e.key;
            if (key === " " || key === "Enter") {
                if (!this._selectElement.classList.contains("open")) {
                    this.open(this._selectElement, this._options);
                } else if (e.target.classList.contains("option")) {
                    this.choose(e.target, this._selectElement, this._options);
                }
                e.preventDefault();
            }
            if (key === "Escape") {
                this.close();
            }
            if (key === "ArrowDown" || key === "ArrowUp") {
                if (!this._selectElement.classList.contains("open")) {
                    this.open(this._selectElement, this._options);
                }
                let idx = this._options.indexOf(document.activeElement);
                if (idx < 0) {
                    idx = this._options.findIndex(o => o.classList.contains("selected"));
                }
                idx =
                    key === "ArrowDown"
                        ? (idx + 1) % this._options.length
                        : (idx - 1 + this._options.length) % this._options.length;
                this._options[idx].focus();
                e.preventDefault();
            }
        });

        this._selectElement.addEventListener("change", e => {
            const selectedValue = e.detail;
            let sortedMedias = [];
            switch (selectedValue) {
                case "date":
                    sortedMedias = MediaController.sortByDate(this._medias);
                    break;
                case "likes":
                    sortedMedias = MediaController.sortByPopularity(this._medias);
                    break;
                case "title":
                    sortedMedias = MediaController.sortByName(this._medias);
                    break;
            }
            // Update the media cards in the DOM
            this.updateDom(sortedMedias);
        });

        document.addEventListener("click", e => {
            if (!this._selectElement.contains(e.target)) {
                this.close();
            }
        });
    }

    close() {
        const select = this._selectElement;
        const options = this._options;

        select.classList.remove("open");
        select.setAttribute("aria-expanded", "false");
        options.forEach(o => {
            if (!o.classList.contains("selected")) {
                o.style.display = "none";
            }
            o.setAttribute("tabindex", "-1");
        });
        select.setAttribute("tabindex", "0");
    }

    open(select, options) {
        options.forEach(o => {
            o.classList.remove("selected");
            o.setAttribute("aria-selected", "false");
        });
        select.classList.add("open");
        select.setAttribute("aria-expanded", "true");
        options.forEach(o => {
            o.style.display = "block";
            o.setAttribute("tabindex", "0");
        });
    }

    choose(el, select, options) {
        options.forEach(o => {
            o.classList.remove("selected");
            o.setAttribute("aria-selected", "false");
        });
        el.classList.add("selected");
        el.setAttribute("aria-selected", "true");
        this.close();
        select.dispatchEvent(new CustomEvent("change", { detail: el.dataset.value }));
    }

    updateDom(sortedMedias) {
        const mediaSection = document.querySelector(".media-list");
        mediaSection.innerHTML = ""; // Clear existing media cards
        sortedMedias.forEach(media => {
            const mediaCard = media.getMediaCardDOM(
                this._photographerDatas.name.split(" ")[0].replace("-", "_")
            );
            // Set tabindex for accessibility
            mediaCard.children[0].setAttribute("tabindex", "0");
            mediaSection.appendChild(mediaCard);
        });
        // Re-attach like listeners after sorting
        this.reAttachLikeListeners(this._photographerDatas, this._totalLikesElement);
        const mediaEls = document.querySelectorAll(".media-card img, .media-card video");
        new Lightbox(".lightbox-modal .lightbox", mediaEls);
    }

    reAttachLikeListeners(photographerDatas, totalLikesElement) {
        const mediaCards = document.querySelectorAll(".media-card");
        mediaCards.forEach(mediaCard => {
            const likeButton = mediaCard.querySelector(".like-button");
            const likesCountElement = mediaCard.querySelector(".likes-count");
            if (likeButton && likesCountElement) {
                likeButton.addEventListener("click", () => {
                    const currentLikes = parseInt(likesCountElement.textContent, 10);
                    likesCountElement.textContent = currentLikes + 1;
                    const mediaId = parseInt(mediaCard.getAttribute("id"), 10);
                    const media = photographerDatas.medias.find(m => m.id === mediaId);
                    media.likes = currentLikes + 1;
                    if (totalLikesElement) {
                        const totalLikes = photographerDatas.medias.reduce(
                            (sum, m) => sum + m.likes,
                            0
                        );
                        totalLikesElement.textContent = totalLikes;
                    }
                });
            }
        });
    }
}
