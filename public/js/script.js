const fileInput = document.getElementById('fileInput');
const uploadButton = document.getElementById('uploadButton');
const runButton = document.getElementById('runButton');
const fileInfo = document.getElementById('fileInfo');
const fileName = document.getElementById('fileName');
const removeButton = document.getElementById('removeButton');

const carImage = document.getElementById('carImage');
const carMake = document.getElementById('carMake');
const carModel = document.getElementById('carModel');
const carColor = document.getElementById('carColor');
const carYear = document.getElementById('carYear');

const errorMessage = document.getElementById('errorMessage');

let isRunning = false; // Flag variable

fileInput.addEventListener('change', function () {
    if (fileInput.files.length > 0) {
        uploadButton.style.display = 'none';
        runButton.style.display = 'inline-block';
        fileInfo.style.display = 'flex';
        fileName.textContent = fileInput.files[0].name.slice(0, 20) + (fileInput.files[0].name.length > 20 ? '...' : '');
        errorMessage.style.display = 'none'; // Clear error message
    }
});

removeButton.addEventListener('click', function () {
    fileInput.value = '';
    uploadButton.style.display = 'inline-block';
    runButton.style.display = 'none';
    fileInfo.style.display = 'none';
    isRunning = false; // Reset the flag when removing the file
    errorMessage.style.display = 'none'; // Clear error message
    resetCarInfo(); // Reset car info fields
});

runButton.addEventListener('click', function (event) {
    event.preventDefault();
    if (!isRunning) {
        isRunning = true;
        runButton.textContent = 'Running...';
        runButton.classList.add('generating');

        const formData = new FormData();
        formData.append('image', fileInput.files[0]);

        fetch('/upload', {
            method: 'POST',
            body: formData,
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.error);
                });
            }
            return response.json();
        })
        .then(data => {
            if (data.carInfo) {
                // Update car card with the new data
                carImage.src = 'data:image/jpeg;base64,' + data.carInfo.imageBase64;
                carMake.textContent = data.carInfo.vehicle.manufacturer;
                carModel.textContent = data.carInfo.vehicle.model;
                carColor.textContent = data.carInfo.vehicle.color;
                carYear.textContent = data.carInfo.vehicle['possible-year'];
                errorMessage.style.display = 'none'; // Clear error message
            } else {
                // Handle unexpected response format
                throw new Error('Unexpected response from the server.');
            }
            resetUploadForm();
            scrollToDetails();
        })
        .catch(error => {
            console.error('Error:', error);
            errorMessage.textContent = error.message; // Display error message
            errorMessage.style.display = 'block'; // Show error message
            resetUploadForm();
            resetCarInfo(); // Reset car info fields
            scrollToDetails();
        });
    }
});

function resetUploadForm() {
    fileInput.value = ''; 
    uploadButton.style.display = 'inline-block'; 
    runButton.style.display = 'none'; 
    fileInfo.style.display = 'none'; 
    runButton.textContent = 'Run'; 
    runButton.classList.remove('generating'); 
    isRunning = false;
}

function resetCarInfo() {
    carImage.src = '/img/default.jpg'; // Reset to default image
    carMake.textContent = 'N/A';
    carModel.textContent = 'N/A';
    carColor.textContent = 'N/A';
    carYear.textContent = 'N/A';
}

function scrollToDetails() {
    document.querySelector('.car-card-section').scrollIntoView({ behavior: 'smooth' });
}
