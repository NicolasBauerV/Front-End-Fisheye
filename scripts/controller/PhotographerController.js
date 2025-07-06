export class PhotographerController {
    constructor({ id, name, city, country, tagline, price, portrait }) {
        this._id = id;
        this._name = name;
        this._city = city;
        this._country = country;
        this._tagline = tagline;
        this._price = price;
        this._portrait = portrait;
        this._medias = [];
    }

    // Getters for photographer properties
    get id() {
        return this._id;
    }
    get name() {
        return this._name;
    }
    get city() {
        return this._city;
    }
    get country() {
        return this._country;
    }
    get tagline() {
        return this._tagline;
    }
    get price() {
        return this._price;
    }
    get portrait() {
        return this._portrait;
    }
    get medias() {
        return this._medias;
    }

    // Setter for medias
    set medias(medias) {
        this._medias = medias;
    }

    /**
     * @description Fetches a photographer by their ID.
     * @async
     * @param {number} id
     * @returns
     */
    static async getPhotographerById(id) {
        try {
            const photographers = await fetch("data/photographers.json");
            if (!photographers.ok) {
                throw new Error(`HTTP error! status: ${photographers.status}`);
            }
            const data = await photographers.json();
            return data.photographers.find((photographer) => photographer.id === id);
        } catch (error) {
            console.error("Error fetching photographer by ID:", error);
            throw error;
        }
    }


    // Function to create the photographer card DOM element
    getUserCardDOM() {
        const article = document.createElement("article");
        // Header card
        article.setAttribute("aria-label", `Photographer ${this._name}`);
        const img = document.createElement("img");
        img.setAttribute("src", `assets/images/photos/Photographers_ID/${this._portrait}`);
        img.setAttribute("alt", `${this._name} portrait`);
        img.setAttribute("loading", "lazy");
        img.classList.add("photographer_portrait");
        img.setAttribute("aria-label", `Portrait of photographer ${this._name}`);

        const h2 = document.createElement("h2");
        h2.textContent = this._name;
        h2.setAttribute("aria-label", `Name of photographer ${this._name}`);

        const link = document.createElement("a");
        link.setAttribute("href", `photographer.html?id=${this._id}`);
        link.setAttribute("aria-label", `Link to photographer ${this._name} page`);
        link.appendChild(img);
        link.appendChild(h2);
        link.classList.add("photographer_link");
        link.setAttribute("tabindex", "0");

        const divHeaderCard = document.createElement("div");
        divHeaderCard.classList.add("photographer_header_card");
        divHeaderCard.appendChild(link);

        // Location, tagline and price
        const divInfoCard = document.createElement("div");
        divInfoCard.classList.add("photographer_info_card");
        divInfoCard.setAttribute("aria-label", `Information about ${this._name}`);
        divInfoCard.setAttribute("role", "contentinfo");

        const location = document.createElement("p");
        location.textContent = `${this._city}, ${this._country}`;

        const tagline = document.createElement("p");
        tagline.textContent = this._tagline;

        const price = document.createElement("p");
        price.textContent = `${this._price}€/jour`;

        article.appendChild(divHeaderCard);
        article.appendChild(location);
        article.appendChild(tagline);
        article.appendChild(price);

        return article;
    }
}
