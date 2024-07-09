# Vehicle AI

![Vehicle AI](https://img.shields.io/badge/Vehicle%20AI-v1.0.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-20.14.0-brightgreen)
![Express](https://img.shields.io/badge/Express-4.19.2-orange)
![@google/generative-ai](https://img.shields.io/badge/%40google%2Fgenerative--ai-0.12.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

![](https://i.ibb.co/X29RQtV/gif-Vehicle.gif)

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Dependencies](#dependencies)
- [Contributing](#contributing)
- [License](#license)

## Introduction

**Vehicle AI** is a web app that uses Generative AI to identify any vehicle. Utilizing Google's Gemini model, it can detect a vehicle's make, model, color, and year from an image.

## Features

- Image upload through file selection or drag-and-drop.
- AI-based identification of vehicle make, model, color, and year.
- Display of car manufacturer logo (when available).
- User-friendly interface with animations.
- Responsive design.

## Installation

To get started with Vehicle AI, follow these steps:

1. **Clone the repository:**
    ```bash
    git clone https://github.com/detalhe/vehicle-ai.git
    cd vehicle-ai
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and add your Google Gemini API key:
   ```
   GOOGLE_API_KEY=your_google_api_key
   ```
   To get an API key, visit [ai.google.dev](https://ai.google.dev) and follow the instructions to create a project and generate a key.

4. **Run the application:**
    ```bash
    npm start
    ```

5. **Deploy on Vercel (Optional):**
    Ensure you have the `vercel.json` configuration file in place and deploy using Vercel CLI:
    ```bash
    vercel
    ```

## Usage

1. Open your browser and navigate to `http://localhost:3000`.
2. Upload an image of a vehicle.
3. Wait for the AI to analyze the image and display the vehicle information.

## Project Structure

```plaintext
vehicle-ai/
├── node_modules/
├── public/
│   ├── css/
│   │   └── index.css
│   ├── img/
│   │   ├── favicon.ico
│   │   ├── default.jpg
│   │   └── preview.jpg
│   └── js/
│       └── script.js
├── views/
│   └── index.ejs
├── .env
├── index.js
├── package.json
├── package-lock.json
└── vercel.json
```

- **public/**: Contains static assets such as CSS, images, and JavaScript files.
- **views/**: Contains EJS templates for rendering HTML.
- **index.js**: Main server file.
- **vercel.json**: Configuration for deploying on Vercel.

## Dependencies

The project relies on the following npm packages:

- `@google/generative-ai`: ^0.12.0
- `axios`: ^1.7.2
- `dotenv`: ^16.4.5
- `ejs`: ^3.1.10
- `express`: ^4.19.2
- `multer`: ^1.4.5-lts.1
- `uuid`: ^9.0.1

## Contributing

Contributions are welcome! :)

## Acknowledgments

- Thanks to [Dan Nelson](https://github.com/dangnelson) for the [car-makes-icons](https://github.com/dangnelson/car-makes-icons) repository, which provides the car manufacturer logos used in this project.


## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
