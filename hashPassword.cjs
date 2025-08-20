// generate_hash.js

const bcrypt = require("bcryptjs");

// -----------------------------------------------------------
// IMPORTANT: REPLACE 'your_admin_secret_password' with the
// actual password you want to use for your admin account.
// This is a temporary script, so you can safely put it here,
// but remember to delete this file or clear the password after
// generating the hash.
// -----------------------------------------------------------
const passwordToHash = "GENIUS2025"; // <--- CHANGE THIS!
const saltRounds = 10; // The recommended number of salt rounds for bcrypt

console.log(`Hashing password for: "${passwordToHash.substring(0, 5)}..."`); // Show a preview

bcrypt.genSalt(saltRounds, (err, salt) => {
  if (err) {
    console.error("Error generating salt:", err);
    return;
  }
  bcrypt.hash(passwordToHash, salt, (err, hash) => {
    if (err) {
      console.error("Error hashing password:", err);
      return;
    }
    console.log("\n---------------------------------------------------------");
    console.log("COPY THIS HASH AND PASTE IT INTO YOUR MONGODB DOCUMENT:");
    console.log("---------------------------------------------------------\n");
    console.log(hash);
    console.log(
      "\n---------------------------------------------------------\n"
    );
    console.log(
      "Remember to delete this temporary script or clear the password from it."
    );
  });
});
