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
     * @async
     * Fetches a photographer by their ID.
     * @param {number} id
     * @returns {Promise<Object>} A promise that resolves to the photographer data.
     */
    static async getPhotographerById(id) {
        try {
            const photographers = await fetch("data/photographers.json");
            if (!photographers.ok) {
                throw new Error(`HTTP error! status: ${photographers.status}`);
            }
            const data = await photographers.json();
            return data.photographers.find(photographer => photographer.id === id);
        } catch (error) {
            console.error("Error fetching photographer by ID:", error);
            throw error;
        }
    }

    // Function to create the photographer card DOM element
    getUserCardDOM() {
        const article = document.createElement("article");
        article.classList.add("photographer_card");
        // Header card
        article.setAttribute("aria-label", `Vous êtes sur le Photographe ${this._name}`);

        const img = document.createElement("img");
        img.setAttribute("src", `assets/images/photos/Photographers_ID/${this._portrait}`);
        img.setAttribute("alt", `${this._name} portrait`);
        img.setAttribute("loading", "lazy");
        img.classList.add("photographer_portrait");
        img.setAttribute("aria-label", `Portrait du photographe : ${this._name}`);
        img.setAttribute("tabindex", "0");

        const h2 = document.createElement("h2");
        h2.textContent = this._name;
        h2.setAttribute("aria-label", `Nom du photographe ${this._name}`);
        h2.setAttribute("tabindex", "0");

        const link = document.createElement("a");
        link.setAttribute("href", `photographer.html?id=${this._id}`);
        link.setAttribute("aria-label", `Lien vers la page du photographe ${this._name}`);
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
        divInfoCard.setAttribute("aria-label", `Informations sur ${this._name}`);
        divInfoCard.setAttribute("role", "contentinfo");
        divInfoCard.setAttribute("tabindex", "0");

        const location = document.createElement("p");
        location.classList.add("photographer_location");
        location.setAttribute("aria-label", `Localisation du photographe : ${this._name} - ${this._city}, ${this._country}`);
        location.textContent = `${this._city}, ${this._country}`;
        location.setAttribute("tabindex", "0");

        const tagline = document.createElement("p");
        tagline.classList.add("photographer_tagline");
        tagline.setAttribute("aria-label", `Description du photographe ${this._name} : ${this._tagline}`);
        tagline.textContent = this._tagline;
        tagline.setAttribute("tabindex", "0");

        const price = document.createElement("p");
        price.classList.add("photographer_price");
        price.setAttribute("aria-label", `Prix par jour du photographe ${this._name} : ${this._price}€ par jour`);
        price.textContent = `${this._price}€/jour`;
        price.setAttribute("tabindex", "0");

        article.appendChild(divHeaderCard);
        article.appendChild(location);
        article.appendChild(tagline);
        article.appendChild(price);

        return article;
    }
}
