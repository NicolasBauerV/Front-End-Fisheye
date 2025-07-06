import { PhotographerController } from "../controller/PhotographerController.js";
import { MediaController } from "../controller/MediaController.js";

export class PhotographerFactory {
    constructor() {
        throw new Error("This class cannot be instantiated directly.");
    }
    /**
     * @description Create a instance of PhotographerController or MediaController based on the type.
     * @param {Object} data - The data to create the instance.
     * @param {string} type - The type of instance to create ("photographer" or "media").
     * @returns {PhotographerController|MediaController} - An instance of PhotographerController or MediaController.
     * @throws {Error} - If the type is unknown.
     */
    static create(data, type) {
            switch(type) {
            case "photographer":
                return new PhotographerController(data);
            case "media":
                return new MediaController(data);
            default:
                throw new Error("Unknown type for PhotographerFactory");
        }
    }
}