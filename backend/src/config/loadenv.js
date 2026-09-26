const dotenv = require("dotenv");

const result = dotenv.config();

if (result.error) {
    console.log("Failed to load .env");
    process.exit(1);
} else {
    console.log("Environment loaded successfully!");
}


