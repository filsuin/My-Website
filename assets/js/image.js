document.getElementById('convertForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const fileInput = document.getElementById('file');
    const formatSelect = document.getElementById('format');
    const previewContainer = document.getElementById('previewContainer');
    const downloadLink = document.getElementById('downloadLink');

    const file = fileInput.files[0];
    const format = formatSelect.value;

    if (!file) {
        alert('Veuillez télécharger une image.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            let mimeType;
            switch (format) {
                case 'jpeg':
                case 'jpg':
                    mimeType = 'image/jpeg';
                    break;
                case 'png':
                    mimeType = 'image/png';
                    break;
                case 'bmp':
                    mimeType = 'image/bmp';
                    break;
                case 'gif':
                    mimeType = 'image/gif';
                    break;
                case 'tiff':
                    mimeType = 'image/tiff';
                    break;
                case 'ico':
                    mimeType = 'image/x-icon';
                    break;
                case 'webp':
                    mimeType = 'image/webp';
                    break;
                default:
                    mimeType = 'image/png';
            }

            canvas.toBlob(function(blob) {
                const url = URL.createObjectURL(blob);
                downloadLink.href = url;
                downloadLink.download = `converted_image.${format}`;
                downloadLink.style.display = 'block';
                previewContainer.innerHTML = '';
                const imgPreview = document.createElement('img');
                imgPreview.src = url;
                imgPreview.alt = 'Image convertie';
                previewContainer.appendChild(imgPreview);
            }, mimeType);
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});