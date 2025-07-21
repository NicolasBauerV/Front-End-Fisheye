export class ContactForm {
    constructor() {
        this.modal = document.getElementById("contact_modal");
        this.closeButton = this.modal.querySelector(".close-button");
        this.contactButton = document.getElementById("contact_button");
        this.submitButton = document.getElementById("submit-button");
    }

    init() {
        const form = this.modal.querySelector("form");
        const formTitle = this.modal.querySelector(".modal-title");
        formTitle.innerHTML = `Contactez-moi <br> ${document.querySelector(".photographer-name").textContent}`;
        formTitle.setAttribute("aria-label", `Titre de la fenêtre de contact : Contactez-moi ${document.querySelector(".photographer-name").textContent}`);
        this.contactButton.addEventListener("click", () => this.displayModal());
        this.closeButton.addEventListener("click", () => this.closeModal());
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            const data = this.getFormData(form);
            console.log("Form submitted with data:", data);
            this.closeModal();
        });
        // Add keyboard accessibility
        this.closeButton.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                this.closeModal();
            }
        });
        this.contactButton.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                this.displayModal();
            }
        });
        this.submitButton.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                const formData = this.getFormData();
                console.log("Form submitted with data:", formData);
                this.closeModal();
            }
        });
    }

    displayModal() {
        this.modal.style.display = "block";
        document.querySelector("#main").style.display = "none";
    }

    closeModal() {
        this.modal.style.display = "none";
        document.querySelector("#main").style.display = "block";
    }

    getFormData(form) {
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        return data;
    }
}
