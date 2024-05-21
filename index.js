// 7117325295:AAGapWUoaa5oLG0JUDe2vJeGGfkwhISqvQs
// https://t.me/YuraMyFirstBot

const { gameOptions, againOptions } = require("./options");

const TelegramApi = require("node-telegram-bot-api");
const { stc } = require("./stickers");
const { sequelize } = require("./db");
const { UserModel } = require("./models");

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
  // await bot.sendMessage(chatId, `${JSON.stringify(chats)}`);
};

const start = async () => {
  //проверка базы
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("Соединение с БД было успешно установлено");
  } catch (e) {
    console.log("Невозможно выполнить подключение к БД: ", e);
  }

  bot.setMyCommands([
    { command: "/start", description: "Начальное приветствие" },
    { command: "/info", description: "Получить информацию о пользователе" },
    { command: "/game", description: "Игра угадай цифру" },
  ]);

  bot.on("message", async (msg) => {
    // console.log(JSON.stringify(msg));

    const text = msg.text;
    const chatId = msg.chat.id;

    // bot.sendMessage(chatId, `${JSON.stringify(msg)}`);
    // bot.sendMessage(chatId, `Ты  = ${chatId}`);
    try {
      if (text === "/start") {
        const user = await UserModel.findOne({ where: { chatId } });
        // console.log("-----------------user: ", !user);
        if (!user) {
          // await UserModel.sync({ chatId });
          await UserModel.create({ chatId });
        }

        await bot.sendSticker(chatId, stc.intro);
        return bot.sendMessage(
          chatId,
          `Добро пожаловать в телеграм бот YuraFirstBot`
        );
      }

      if (text === "/info") {
        // @ts-ignore
        // chatId = chatId.toString();
        const user = await UserModel.findOne({ where: { chatId } });

        // await bot.sendMessage(chatId, `msg ${JSON.stringify(msg)}`);
        // await bot.sendMessage(chatId, `user.chatId ${user.chatId}`);

        return bot.sendMessage(
          chatId,
          `Тебя зовут ${msg.from.first_name} username: ${msg.from.username}, в игре у тебя правильных ответов ${user.right}, неправильных ${user.wrong} `
        );
      }

      if (text === "/game") {
        return startGame(chatId);
      }

      return bot.sendMessage(chatId, "Я тебя не понимаю, попробуй еще раз!)");
    } catch (e) {
      return bot.sendMessage(chatId, "Произошла какая то ошибочка!)");
    }
  });

  // ----------- ответы
  bot.on("callback_query", async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    const user = await UserModel.findOne({ where: { chatId } });
    // await bot.sendMessage(chatId, `Ты выбрал ${data}`);
    // await bot.sendMessage(chatId, `Ты game ${user.chatId}`);
    if (data === "/again") {
      return startGame(chatId);
    }

    if (data == chats[chatId]) {
      user.right += 1;
      await bot.sendSticker(chatId, stc.ok);
      await bot.sendMessage(
        chatId,
        `Поздравляю, ты отгадал цифру ${chats[chatId]}, ..... Ты выбрал ${data}`,
        againOptions
      );
    } else {
      await bot.sendSticker(chatId, stc.ops);
      user.wrong += 1;
      await bot.sendMessage(
        chatId,
        `К сожалению ты не угадал, бот загадал цифру ${chats[chatId]}, ..... Ты выбрал ${data}`,
        againOptions
      );
    }

    await user.save();
  });
}; // start

start();
