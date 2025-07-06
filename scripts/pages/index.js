import { PhotographerFactory } from "../factory/PhotographerFactory.js";
import { PhotographerController } from "../controller/PhotographerController.js"; 

/**
 * 
 * @param {Array<PhotographerController>} photographers 
 */
function displayData(photographers) {
    const photographersSection = document.querySelector(
        ".photographer_section"
    );

    photographersSection.innerHTML = ""; // Clear existing content
    photographers.forEach((photographer) => {
        const photographerCard = photographer.getUserCardDOM();
        photographersSection.appendChild(photographerCard);
    });
}

async function init() {
    // Récupère les datas des photographes
    try {
        const dataFile = await fetch(`data/photographers.json`);
        if (!dataFile.ok) {
            throw new Error(`HTTP error! status: ${dataFile.status}`);
        }
        const data = await dataFile.json();
        const photographersTab = data.photographers.map((photographerData) =>
            PhotographerFactory.create(photographerData, "photographer")
        );
        displayData(photographersTab);
    } catch (error) {
        throw new Error(
            `Error fetching photographer data: ${error.message}`
        );
    }

}

init();
