document.addEventListener("DOMContentLoaded", () => {
    // Gestion du QR Code (sur la page qr_code.html)
    if (document.getElementById("generate")) {
        const generateButton = document.getElementById("generate");
        const urlInput = document.getElementById("url");
        const colorInput = document.getElementById("color");
        const sizeInput = document.getElementById("size");
        const qrContainer = document.getElementById("qrcode");
        const downloadLink = document.getElementById("downloadLink");

        generateButton.addEventListener("click", () => {
            const url = urlInput.value;
            const color = colorInput.value;
            const size = sizeInput.value * 10; // Taille multipliée pour un meilleur rendu

            if (!url) {
                alert("Veuillez entrer une URL.");
                return;
            }

            qrContainer.innerHTML = ""; // Effacer le QR code précédent

            const qrcode = new QRCode(qrContainer, {
                text: url,
                width: size,
                height: size,
                colorDark: color,
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });

            setTimeout(() => {
                const canvas = qrContainer.querySelector("canvas");
                if (canvas) {
                    const imageUrl = canvas.toDataURL("image/png"); // Convertir en image PNG
                    downloadLink.href = imageUrl;
                    downloadLink.style.display = "block";
                }
            }, 100);
        });
    }

    // Gestion de la prévisualisation et conversion d'image (sur la page image_converter.html)
    if (document.getElementById("imageForm")) {
        const fileInput = document.getElementById("file");
        const formatSelect = document.getElementById("format");
        const messageContainer = document.getElementById("message");
        const previewContainer = document.getElementById("previewContainer");
        const form = document.getElementById("imageForm");

        // Affichage de la prévisualisation de l'image
        fileInput.addEventListener("change", () => {
            const file = fileInput.files[0];
            if (file) {
                const preview = document.createElement("img");
                preview.src = URL.createObjectURL(file);
                preview.style.maxWidth = "100%";
                preview.style.marginTop = "15px";

                previewContainer.innerHTML = ""; // Effacer la prévisualisation précédente
                previewContainer.appendChild(preview);
            }
        });

        // Gestion du formulaire de conversion
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const file = fileInput.files[0];
            if (!file) {
                messageContainer.innerHTML = "<p style='color:red;'>Veuillez sélectionner une image à convertir.</p>";
                return;
            }

            const format = formatSelect.value;
            const reader = new FileReader();

            reader.onload = function (e) {
                const img = new Image();
                img.src = e.target.result;

                img.onload = function () {
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");

                    // Redimensionnement de l'image au besoin
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);

                    // Convertir l'image au format choisi
                    const dataUrl = canvas.toDataURL(`image/${format}`);
                    const convertedImage = new Image();
                    convertedImage.src = dataUrl;

                    // Affichage de l'image convertie
                    previewContainer.innerHTML = ""; // Effacer la prévisualisation précédente
                    previewContainer.appendChild(convertedImage);

                    // Ajout du lien pour télécharger l'image
                    const downloadLink = document.createElement("a");
                    downloadLink.href = dataUrl;
                    downloadLink.download = `converted_image.${format}`;
                    downloadLink.innerText = "Télécharger l'image convertie";
                    previewContainer.appendChild(downloadLink);

                    messageContainer.innerHTML = "<p style='color:green;'>Conversion réussie !</p>";
                };
            };
            
            reader.readAsDataURL(file);
        });
    }
});
