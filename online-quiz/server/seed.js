const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./data/quiz.db",
});

const Quiz = require("./models/Quiz")(sequelize, DataTypes);
const Question = require("./models/Question")(sequelize, DataTypes);

async function seed() {
  try {
    await sequelize.sync({ force: true }); // Drops and recreates tables

    const quiz = await Quiz.create({ title: "General Knowledge" });

    const questions = [
  {
    quiz_id: quiz.id,
    text: "What is the capital of France?",
    option_a: "Paris",
    option_b: "Rome",
    option_c: "Madrid",
    option_d: "Berlin",
    correct_option: "a",
  },
  {
    quiz_id: quiz.id,
    text: "Which planet is known as the Red Planet?",
    option_a: "Earth",
    option_b: "Mars",
    option_c: "Jupiter",
    option_d: "Venus",
    correct_option: "b",
  },
  {
    quiz_id: quiz.id,
    text: "What does HTML stand for?",
    option_a: "Hyper Text Markup Language",
    option_b: "High Text Machine Language",
    option_c: "Hyperlinks and Text Markup Language",
    option_d: "",
    correct_option: "a",
  },
  {
    quiz_id: quiz.id,
    text: "Who wrote 'Pride and Prejudice'?",
    option_a: "Charlotte Bronte",
    option_b: "Jane Austen",
    option_c: "Mary Shelley",
    option_d: "Emily Bronte",
    correct_option: "b",
  },
  {
    quiz_id: quiz.id,
    text: "Which gas do plants primarily absorb from the atmosphere?",
    option_a: "Oxygen",
    option_b: "Nitrogen",
    option_c: "Carbon Dioxide",
    option_d: "Hydrogen",
    correct_option: "c",
  }
];


    await Question.bulkCreate(questions);

    console.log("Seeding complete");
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seed();
