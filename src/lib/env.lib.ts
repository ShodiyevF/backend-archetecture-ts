import dotenv from "dotenv";

const result = dotenv.config();

if (result.error) {
  throw result.error;
}

console.log(result.parsed); // faqat .env fayldagi o‘zgaruvchilar
