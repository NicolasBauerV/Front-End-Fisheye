export class MediaController {
    constructor({
        id,
        photographerId,
        title,
        image,
        video,
        likes,
        date,
        price,
    }) {
        this._id = id;
        this._photographerId = photographerId;
        this._title = title;
        this._image = image;
        this._video = video;
        this._likes = likes;
        this._date = date;
        this._price = price;
    }
    get id() {
        return this._id;
    }
    get photographerId() {
        return this._photographerId;
    }
    get title() {
        return this._title;
    }
    get image() {
        return this._image;
    }
    get video() {
        return this._video;
    }
    get likes() {
        return this._likes;
    }
    get date() {
        return this._date;
    }
    get price() {
        return this._price;
    }

    /**
     * @description Generates the DOM element for the media item.
     * @param {string} photographerName - The name of the photographer, used to construct the image/video path.
     * @returns {HTMLElement} - The DOM element representing the media item.
     */
    getMediaCardDOM(photographerName) {
        const article = document.createElement("article");
        article.setAttribute("aria-label", this._title);
        article.setAttribute("tabindex", "0");
        article.classList.add("media-card");
        const mediaElement = this._image
            ? `<img class="photographer-media" src="assets/images/photos/${photographerName}/${this._image}" alt="${this.title}">`
            : `<video class="photographer-media" controls><source src="assets/images/photos/${photographerName}/${this._video}" type="video/mp4"></video>`;

        article.innerHTML = `
            ${mediaElement}
            <div class="media-footer">
                <h2 class="image-title">${this.title}</h2>
                <div class="media-likes">
                    <span class="likes-count">${this.likes}</span>
                    <button class="like-button" aria-label="Like this media" tabindex="0">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.12 3 6.81 3C8.34 3 9.81 3.81 10.75 5.09C11.69 3.81 13.16 3 14.69 3C17.38 3 19.5 5.42 19.5 8.5C19.5 12.28 16.1 15.36 10.95 20L12 21.35Z" fill="#911C1C"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;

        return article;
    }
}
