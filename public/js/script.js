const fileInput = document.getElementById("fileInput");
const uploadButton = document.getElementById("uploadButton");
const runButton = document.getElementById("runButton");
const fileInfo = document.getElementById("fileInfo");
const fileName = document.getElementById("fileName");
const removeButton = document.getElementById("removeButton");
const dropText = document.getElementById("dropText");

const carImage = document.getElementById("carImage");
const carMake = document.getElementById("carMake");
const carModel = document.getElementById("carModel");
const carColor = document.getElementById("carColor");
const carYear = document.getElementById("carYear");
const carMakeLogo = document.getElementById("carMakeLogo");

const errorMessage = document.getElementById("errorMessage");

const dropZone = document.getElementById('dropZone');
const uploadForm = document.getElementById('uploadForm');

let isRunning = false; // Flag variable
let dragCounter = 0;
let dragTimer;

fileInput.addEventListener("change", updateFileInfo);

removeButton.addEventListener("click", function () {
    fileInput.value = "";
    uploadButton.style.display = "inline-block";
    runButton.style.display = "none";
    fileInfo.style.display = "none";
    dropText.style.display = "block"; // Show the drop text again
    isRunning = false; // Reset the flag when removing the file
    errorMessage.style.display = "none"; // Clear error message
});

function formatCarMakeForLogo(make) {
    return make.toLowerCase().replace(/ /g, "%20");
}

async function checkLogoExists(url) {
    try {
        const response = await fetch(url, { method: "HEAD" });
        return response.ok;
    } catch (error) {
        console.error("Error checking logo existence:", error);
        return false;
    }
}

runButton.addEventListener("click", function (event) {
    event.preventDefault();
    if (!isRunning) {
        isRunning = true;
        runButton.textContent = "Running...";
        runButton.classList.add("generating");

        const formData = new FormData();
        formData.append("image", fileInput.files[0]);

        fetch("/upload", {
            method: "POST",
            body: formData,
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((data) => {
                        throw new Error(data.error);
                    });
                }
                return response.json();
            })
            .then(async (data) => {
                if (data.carInfo) {
                    // Update car card with the new data
                    carImage.src =
                        "data:image/jpeg;base64," + data.carInfo.imageBase64;
                    const make = data.carInfo.vehicle.manufacturer;
                    carMake.textContent = make;
                    carModel.textContent = data.carInfo.vehicle.model;
                    carColor.textContent = data.carInfo.vehicle.color;
                    carYear.textContent = data.carInfo.vehicle.year;

                    // Update car make logo
                    const logoUrl = `https://raw.githubusercontent.com/dangnelson/car-makes-icons/2a7f574ce813e1eeddcca955c87847bc5baa28b6/svgs/${formatCarMakeForLogo(
                        make
                    )}.svg`;
                    const logoExists = await checkLogoExists(logoUrl);
                    if (logoExists) {
                        carMakeLogo.src = logoUrl;
                        carMakeLogo.style.display = "block";
                    } else {
                        carMakeLogo.style.display = "none";
                    }

                    errorMessage.style.display = "none"; // Clear error message
                } else {
                    // Handle unexpected response format
                    throw new Error("Unexpected response from the server.");
                }
                resetUploadForm();
                scrollToDetails();
            })
            .catch((error) => {
                console.error("Error:", error);
                errorMessage.textContent = error.message; // Display error message
                errorMessage.style.display = "block"; // Show error message
                resetUploadForm();
                scrollToDetails();
            });
    }
});

function resetUploadForm() {
    fileInput.value = "";
    uploadButton.style.display = "inline-block";
    runButton.style.display = "none";
    fileInfo.style.display = "none";
    dropText.style.display = "block"; // Show the drop text again
    runButton.textContent = "Run";
    runButton.classList.remove("generating");
    isRunning = false;
}

function scrollToDetails() {
    const element = document.querySelector(".car-color");
    if (element.scrollIntoView) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
        // Fallback for older browsers
        const top = element.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({ top, behavior: "smooth" });
    }
}

function showDropZone() {
    clearTimeout(dragTimer);
    dropZone.style.display = 'flex';
}

function hideDropZone() {
    dragTimer = setTimeout(() => {
        dropZone.style.display = 'none';
    }, 100); // Small delay to prevent flashing
}

document.body.addEventListener('dragenter', function(e) {
    dragCounter++;
    showDropZone();
});

document.body.addEventListener('dragleave', function(e) {
    dragCounter--;
    if (dragCounter === 0) {
        hideDropZone();
    }
});

document.body.addEventListener('drop', function(e) {
    e.preventDefault();
    dragCounter = 0;
    hideDropZone();
});

dropZone.addEventListener('dragover', function(e) {
    e.preventDefault();
    showDropZone();
});

dropZone.addEventListener('drop', handleDrop);

function handleDrop(e) {
    e.preventDefault();
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
    hideDropZone();
}

function handleFiles(files) {
    if (files.length) {
        fileInput.files = files;
        updateFileInfo();
        // Trigger the existing change event listener
        fileInput.dispatchEvent(new Event('change'));
    }
}

function updateFileInfo() {
    if (fileInput.files.length > 0) {
        uploadButton.style.display = "none";
        runButton.style.display = "inline-block";
        fileInfo.style.display = "flex";
        dropText.style.display = "none"; // Hide the drop text
        fileName.textContent = fileInput.files[0].name.slice(0, 20) + (fileInput.files[0].name.length > 20 ? "..." : "");
        errorMessage.style.display = "none";
    }
}
