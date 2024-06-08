const fileInput = document.getElementById("fileInput");
const uploadButton = document.getElementById("uploadButton");
const runButton = document.getElementById("runButton");
const fileInfo = document.getElementById("fileInfo");
const fileName = document.getElementById("fileName");
const removeButton = document.getElementById("removeButton");

const carImage = document.getElementById("carImage");
const carMake = document.getElementById("carMake");
const carModel = document.getElementById("carModel");
const carColor = document.getElementById("carColor");
const carYear = document.getElementById("carYear");
const carMakeLogo = document.getElementById("carMakeLogo");

const errorMessage = document.getElementById("errorMessage");

let isRunning = false; // Flag variable

fileInput.addEventListener("change", function () {
    if (fileInput.files.length > 0) {
        uploadButton.style.display = "none";
        runButton.style.display = "inline-block";
        fileInfo.style.display = "flex";
        fileName.textContent =
            fileInput.files[0].name.slice(0, 20) +
            (fileInput.files[0].name.length > 20 ? "..." : "");
        errorMessage.style.display = "none"; // Clear error message
    }
});

removeButton.addEventListener("click", function () {
    fileInput.value = "";
    uploadButton.style.display = "inline-block";
    runButton.style.display = "none";
    fileInfo.style.display = "none";
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
                    const logoUrl = `https://raw.githubusercontent.com/dangnelson/car-makes-icons/2a7f574ce813e1eeddcca955c87847bc5baa28b6/svgs/${formatCarMakeForLogo(make)}.svg`;
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
                resetCarInfo(); // Reset car info fields
                scrollToDetails();
            });
    }
});

function resetUploadForm() {
    fileInput.value = "";
    uploadButton.style.display = "inline-block";
    runButton.style.display = "none";
    fileInfo.style.display = "none";
    runButton.textContent = "Run";
    runButton.classList.remove("generating");
    isRunning = false;
}

function scrollToDetails() {
    document.querySelector(".car-color").scrollIntoView({ behavior: "smooth" });
}
