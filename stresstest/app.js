const { chromium } = require('playwright');
const { addUser, login } = require('./app/auth/services');
const { createChat, talkChat, accessChat, scrollDown, addReactions, uploadFile } = require('./app/chat/services');
const { addProfileImage } = require('./app/profile/services');
const { generateAiResponse } = require('./app/ai/services');
const crypto = require('crypto');

const id = "user7";
const passwd = "123123";
const email = "test@test9.com";
const domain = "@test.com";
const chatName = "asdfasdf";
const site = "https://bootcampchat-fe.run.goorm.site";
const filename = './photo/test.jpeg';
const aiMention = "@wayneAI";
const findText = "hello";
const msg = "hello";
const group = "group_a";

let browserInstance = null;
let pageInstance = null;

async function generateGroupName() {
  const timestamp = Date.now();
  const hash = crypto.createHash('sha256').update(timestamp.toString()).digest('hex');
  return `${group}_${timestamp}`;
}

const getPage = async () => {
  if (!browserInstance) {
    browserInstance = await chromium.launch({ headless: true });
    console.log("Browser launched");
  }

  if (!pageInstance) {
    pageInstance = await browserInstance.newPage();
    console.log("Page created");
    await pageInstance.goto(site);
  }
  return pageInstance;
};

async function registerUser(page) {
  await page.goto(site);
  id = await generateGroupName();
  email = id + domain;
  await addUser(page, id, passwd, email);
};

const loginUser = async (page) => {
  await login(page, email, passwd);
};

async function createNewChat(page) {
  await registerUser(page);
  await createChat(page, chatName);
};

const scrollChat = async () => {
  email, page = await registerUser();

  await scrollDown(page);
};

const sendMessageToChat = async () => {
  email, page = await registerUser();

  await accessChat(page, chatName);
  await talkChat(page, msg);
};

async function reactionToMessage(page) {
  email = await registerUser();

  await accessChat(page, chatName);
  await addReactions(page, findText);
};

const uploadFileToChat = async () => {
  email, page = await registerUser();

  await accessChat(page, chatName);
  await uploadFile(page, filename);
};

const updateProfileImage = async () => {
  email, page = await registerUser();

  await addProfileImage(page, filename);
};

const generateChatAiResponse = async () => {
  email, page = await registerUser();

  await accessChat(page, chatName);
  await generateAiResponse(page, aiMention);
};

// const run = async () => {
//   // await loginUser();
//   // await createNewChat();
//   // await scrollChat();
//   // await sendMessageToChat();
//   // await reactionToMessage();
//   await uploadFileToChat();
//   // await updateProfileImage();
//   // await generateChatAiResponse();
// };

// const main = async () => {
//   await run();

//   if (browserInstance) {
//     await browserInstance.close();
//     console.log("Browser closed");
//   }
// };

// main();

module.exports = { registerUser, loginUser, createNewChat, scrollChat, sendMessageToChat, reactionToMessage, uploadFileToChat, updateProfileImage, generateChatAiResponse };
