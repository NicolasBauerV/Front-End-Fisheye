import { PhotographerFactory } from "../factory/PhotographerFactory.js";
import { PhotographerController } from "../controller/PhotographerController.js";
import { MediaController } from "../controller/MediaController.js";
class PhotographerApp {
    constructor() {
        // Initialize the photographer app
    }

    /**
     * @async
     * @param {number} id id of the photographer
     * @description Fetches the media elements associated with a photographer by their ID.
     * @return {Promise<Array<MediaController>>} A promise that resolves to an array of media elements.
     * @throws {Error} If there is an error fetching the media data.
     * @example
     * const mediaElements = await PhotographerApp.getMediaElement(1);
     * console.log(mediaElements); // Logs the media elements for photographer with ID 1
     */
    static async photographersMedia (id) {
        try {
            const fetchMedia = await fetch("data/photographers.json");
            if (!fetchMedia.ok) {
                throw new Error(`HTTP error! status: ${fetchMedia.status}`);
            }
            const data = await fetchMedia.json();
            const medias = data.media.map((mediaData) =>
                PhotographerFactory.create(mediaData, "media")
            );

            // Associate medias with their respective photographers
            return medias.filter(
                (media) => media.photographerId === id
            );
            
        } catch (error) {
            console.error("Error fetching media data:", error);
            throw new Error(`Error fetching media data: ${error.message}`);
        }
    }

    static async init() {

        // Récupère les datas des photographes via le paramètre ID
        const urlParams = new URLSearchParams(window.location.search);
        if (!urlParams.has("id")) {
            console.error("Photographer ID not found in URL parameters");
            window.location.href = "index.html"; // Redirect to index if ID is missing
            return;
        }

        // Parse the photographer ID from the URL parameters
        const photographerId = parseInt(urlParams.get("id"), 10);
        if (isNaN(photographerId)) {
            console.error("Invalid photographer ID");
            window.location.href = "index.html"; // Redirect to index if ID is invalid
            return;
        }

        // Fetch photographer data by ID
        const photographerDatas =
            await PhotographerController.getPhotographerById(photographerId);
        const { id, name, city, country, tagline, price, portrait } = photographerDatas;
        if (!photographerDatas) {
            console.error("Photographer not found");
            window.location.href = "index.html"; // Redirect to index if photographer not found
            return;
        }

        // Change the title and subtitle and tagline of the page by the photographer's name and city
        const titleName = document.querySelector(".photographer-name");
        const location = document.querySelector(".location");
        const taglineElement = document.querySelector(".tagline");
        if (titleName && location && taglineElement) {
            titleName.textContent = `${name}`;
            location.textContent = `${city}, ${country}`;
            taglineElement.textContent = `${tagline}`;
        }

        // Change profile picture 
        const profilePicture = document.querySelector(".photograph-portrait");
        if (profilePicture) {
            profilePicture.src = `assets/images/photos/Photographers_ID/${portrait}`;
            profilePicture.alt = `Portrait de ${name}`;
        }

        // Get Portfolio section
        const getPhotographersMedias = await PhotographerApp.photographersMedia(photographerId);
        // Display the photographer's media
        photographerDatas.medias = getPhotographersMedias;  
        const mediaSection = document.querySelector(".portfolio");
        photographerDatas.medias.forEach((media) => {
            const mediaCard = media.getMediaCardDOM(name.split(" ")[0].replace("-", "_"));
            mediaSection.appendChild(mediaCard);
        });
    }
}

PhotographerApp.init();
