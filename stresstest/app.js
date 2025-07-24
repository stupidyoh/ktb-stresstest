const { chromium } = require('playwright');
const { addUser, login } = require('./app/auth/services');
const { createChat, talkChat, accessChat, scrollDown, addReactions, uploadFile } = require('./app/chat/services');
const { addProfileImage } = require('./app/profile/services');
const { generateAiResponse } = require('./app/ai/services');
const crypto = require('crypto');

const passwd = "123123";
const domain = "@test.com";

// NOTE: chatName을 지역변수로 변경
// const chatName = "asdfasdf";

// NOTE: site명은 Artillery에서 config.target으로 받도록 변경
// const site = "https://ktb-chat-test.goorm.team/";
// const site = "${$env.baseUrl}" || "https://example.com";

const filename = './photo/test.jpeg';
const aiMention = "@wayneAI";
const findText = "hello";
const msg = "hello";
const group = "group_b";

async function registerUser(page, id) {
  const email = id + domain;

  try {
    await page.goto("/");
  } catch (e) {
    console.error('Error during page navigation:', e);
    await browser.close();
  }

  await addUser(page, id, passwd, email);
};

async function loginUser(page, id) {
  await registerUser(page, id);
};

async function createNewChat(page, id) {
  // await registerUser(page);
  await createChat(page, id);
};

async function scrollChat(page) {
  // await registerUser(page);
  await scrollDown(page);
};

async function sendMessageToChat(page, id) {
  // await registerUser(page);
  await accessChat(page, id);
  await talkChat(page, msg);
};

async function reactionToMessage(page) {
  // await registerUser(page);
  // await accessChat(page, chatName);
  await addReactions(page, findText);
};

async function uploadFileToChat(page) {
  // await registerUser(page);
  // await accessChat(page, chatName);
  await uploadFile(page, filename);
};

async function updateProfileImage(page) {
  // await registerUser(page);
  await addProfileImage(page, filename);
};

// NOTE: (20250724) AI 채팅부분 e2e code 오류로 주석
// async function generateChatAiResponse(page) {
//   // await registerUser(page);
//   await page.goto('/chat-rooms');
//   await accessChat(page, chatName);
//   await generateAiResponse(page, aiMention);
// };

async function runAllUserActionsSequentially(page) {
  const id = `${group}_${Date.now()}`;

  await loginUser(page, id);
  await createNewChat(page, id);
  await scrollChat(page);
  await sendMessageToChat(page, id);
  await reactionToMessage(page);
  await uploadFileToChat(page);
  await updateProfileImage(page);
}

module.exports = { registerUser, loginUser, createNewChat, scrollChat, sendMessageToChat, reactionToMessage, uploadFileToChat, updateProfileImage, runAllUserActionsSequentially };

/* for test
let browserInstance = null;
let pageInstance = null;

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

const run = async () => {
  // await loginUser();
  // await createNewChat();
  // await scrollChat();
  // await sendMessageToChat();
  // await reactionToMessage();
  await uploadFileToChat();
  // await updateProfileImage();
  // await generateChatAiResponse();
};

const main = async () => {
  await run();

  if (browserInstance) {
    await browserInstance.close();
    console.log("Browser closed");
  }
};

main();
*/
