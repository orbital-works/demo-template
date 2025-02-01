class FileUploader extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                .uploader {
                    border: 2px dashed #ccc;
                    padding: 20px;
                    text-align: center;
                    cursor: pointer;
                }
                .uploader input {
                    display: none;
                }
                img {
                    height: 128px;
                    order: 1;
                }
            </style>
            <div class="uploader">
                <label for="fileInput">
                    Drag and drop a file here or click to select an image to upload (PNG, JPG)
                </label>
                <input type="file"
                       id="fileInput"
                       accept=".jpg, .jpeg, .png"
                       multiple />
            </div>
            <div class="preview">
                <p>No files currently selected for upload</p>
            </div>
        `;

        //
        // Sample shown here:
        // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file
        //

        this.fileInput = this.shadowRoot.querySelector('#fileInput');
        this.uploader = this.shadowRoot.querySelector('.uploader');
        this.preview = this.shadowRoot.querySelector('.preview');

        //this.uploader.addEventListener('click', () => this.fileInput.click());
        this.fileInput.addEventListener('change', (e) => this.handleFiles(e.target.files));
        //this.uploader.addEventListener('dragover', (e) => this.handleDragOver(e));
        //this.uploader.addEventListener('drop', (e) => this.handleDrop(e));
    }

    validFileType(file) {
        const fileTypes = [
            "image/apng",
            "image/bmp",
            "image/gif",
            "image/jpeg",
            "image/pjpeg",
            "image/png",
            "image/svg+xml",
            "image/tiff",
            "image/webp",
            "image/x-icon",
        ];
        return fileTypes.includes(file.type);
    }

    returnFileSize(number) {
        if (number < 1e3) {
            return `${number} bytes`;
        } else if (number >= 1e3 && number < 1e6) {
            return `${(number / 1e3).toFixed(1)} KB`;
        } else {
            return `${(number / 1e6).toFixed(1)} MB`;
        }
    }

    handleFiles(files) {
        const file = files[0];
        if (file) {
            console.log('File selected:', file.name);
            // Handle the file upload logic here
        }
        this.updateImageDisplay();
    }

    handleDragOver(event) {
        event.preventDefault();
        event.stopPropagation();
        this.uploader.classList.add('dragover');
    }

    handleDrop(event) {
        event.preventDefault();
        event.stopPropagation();
        this.uploader.classList.remove('dragover');
        const files = event.dataTransfer.files;
        this.handleFiles(files);
    }


    // For more info see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file
    updateImageDisplay() {
        while (this.preview.firstChild) {
            this.preview.removeChild(this.preview.firstChild);
        }

        const curFiles = this.fileInput.files;
        if (curFiles.length === 0) {
            const para = document.createElement("p");
            para.textContent = "No files currently selected for upload";
            this.preview.appendChild(para);
        } else {
            const list = document.createElement("ol");
            this.preview.appendChild(list);

            for (const file of curFiles) {
                const listItem = document.createElement("li");
                const para = document.createElement("p");
                if (this.validFileType(file)) {
                    para.textContent = `File name ${file.name}, file size ${this.returnFileSize(
                        file.size,
                    )}.`;
                    const image = document.createElement("img");
                    image.src = URL.createObjectURL(file);
                    image.alt = image.title = file.name;

                    listItem.appendChild(image);
                    listItem.appendChild(para);
                } else {
                    para.textContent = `File name ${file.name}: Not a valid file type. Update your selection.`;
                    listItem.appendChild(para);
                }

                list.appendChild(listItem);
            }
        }
    }

}

customElements.define('file-uploader', FileUploader);