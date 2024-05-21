// 7117325295:AAGapWUoaa5oLG0JUDe2vJeGGfkwhISqvQs
// https://t.me/YuraMyFirstBot

const { gameOptions, againOptions } = require("./options");

const TelegramApi = require("node-telegram-bot-api");
const { stc } = require("./stickers");
const TOKEN = "7117325295:AAGapWUoaa5oLG0JUDe2vJeGGfkwhISqvQs";

const bot = new TelegramApi(TOKEN, { polling: true });

const chats = {};

// START GAME
const startGame = async (chatId) => {
  await bot.sendSticker(chatId, stc.startGame);
  await bot.sendMessage(
    chatId,
    `Сейчас я загадаю цифру от 0 до 9, а ты должен ее угадать!`
  );
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, "Отгадывай", gameOptions);
  await bot.sendMessage(chatId, `${JSON.stringify(chats)}`);
};

const start = async () => {
  bot.setMyCommands([
    { command: "/start", description: "Начальное приветствие" },
    { command: "/info", description: "Получить информацию о пользователе" },
    { command: "/game", description: "Игра угадай цифру" },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    // ${JSON.stringify(msg)}
    //   bot.sendMessage(chatId, `Ты написал мне = ${text}`);
    if (text === "/start") {
      await bot.sendSticker(chatId, stc.intro);
      return bot.sendMessage(
        chatId,
        `Добро пожаловать в телеграм бот YuraFirstBot`
      );
    }

    if (text === "/info") {
      return bot.sendMessage(
        chatId,
        `Тебя зовут ${msg.from.first_name} username: ${msg.from.username}, `
      );
    }

    if (text === "/game") {
      return startGame(chatId);
    }

    return bot.sendMessage(chatId, "Я тебя не понимаю, попробуй еще раз!)");
  });

  // ----------- ответы
  bot.on("callback_query", async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    // await bot.sendMessage(chatId, `Ты выбрал ${data}`);
    if (data === "/again") {
      return startGame(chatId);
    }
    if (data == chats[chatId]) {
      //   user.right += 1;
      await bot.sendSticker(chatId, stc.ok);
      return bot.sendMessage(
        chatId,
        `Поздравляю, ты отгадал цифру ${chats[chatId]}, ..... Ты выбрал ${data}`,
        againOptions
      );
    } else {
      await bot.sendSticker(chatId, stc.ops);
      //   user.wrong += 1;
      return bot.sendMessage(
        chatId,
        `К сожалению ты не угадал, бот загадал цифру ${chats[chatId]}, ..... Ты выбрал ${data}`,
        againOptions
      );
    }
  });
}; // start

start();
