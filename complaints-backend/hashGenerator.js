const bcrypt = require("bcrypt");

const password = "6969"; // Change this if needed

bcrypt.hash(password, 10).then((hashedPassword) => {
    console.log("Generated Hash:", hashedPassword);
}).catch((err) => console.error("Error hashing password:", err));
