import { PhotographerFactory } from "../factory/PhotographerFactory.js";
import { PhotographerController } from "../controller/PhotographerController.js";
import { MediaController } from "../controller/MediaController.js";
import { Lightbox } from "../utils/Lightbox.js";
import { ContactForm } from "../utils/ContactForm.js";
import { SelectComponent } from "../utils/SelectComponent.js";

// après avoir généré tes mediaCards
const mediaEls = document.querySelectorAll(".media-card img, .media-card video");
new Lightbox(".lightbox-modal .lightbox", mediaEls);
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
    static async photographersMedia(id) {
        try {
            const fetchMedia = await fetch("data/photographers.json");
            if (!fetchMedia.ok) {
                throw new Error(`HTTP error! status: ${fetchMedia.status}`);
            }
            const data = await fetchMedia.json();
            const medias = data.media.map(mediaData =>
                PhotographerFactory.create(mediaData, "media")
            );

            // Associate medias with their respective photographers
            return medias.filter(media => media.photographerId === id);
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
        const photographerDatas = await PhotographerController.getPhotographerById(photographerId);
        const { name, city, country, tagline, price, portrait } = photographerDatas;
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
        const mediaSection = document.querySelector(".media-list");
        photographerDatas.medias.forEach(media => {
            const mediaCard = media.getMediaCardDOM(name.split(" ")[0].replace("-", "_"));
            // Set tabindex for accessibility
            mediaCard.children[0].setAttribute("tabindex", "0");
            mediaCard.setAttribute("id", media.id);
            mediaCard.setAttribute("aria-label", `Media card for ${media.title}`);
            mediaCard.setAttribute("role", "button");
            mediaSection.appendChild(mediaCard);
        });

        // Set the total likes in the footer
        const totalLikes = photographerDatas.medias.reduce((sum, media) => sum + media.likes, 0);
        const totalLikesElement = document.querySelector(".likes-number");
        if (totalLikesElement) {
            totalLikesElement.textContent = totalLikes;
        }

        // Set the price in the footer
        const pricePerDayElement = document.querySelector(".price");
        if (pricePerDayElement) {
            pricePerDayElement.textContent = `${price}`;
        }

        PhotographerApp.attachLikeListeners(photographerDatas, totalLikesElement);
        const mediaEls = document.querySelectorAll(".media-card img, .media-card video");
        new Lightbox(".lightbox-modal .lightbox", mediaEls);

        // Initialize the select component
        const selectComponent = new SelectComponent(photographerDatas, totalLikesElement);
        selectComponent.init();

        // Initialize the contact form
        const contactForm = new ContactForm();
        contactForm.init();
    }

    /**
     * @description Attaches event listeners to the like buttons of media cards.
     * @param {Object} photographerDatas - The photographer data containing media items.
     * @param {HTMLElement} totalLikesElement - The element displaying the total likes.
     * @returns
     */
    static attachLikeListeners(photographerDatas, totalLikesElement) {
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

PhotographerApp.init();
