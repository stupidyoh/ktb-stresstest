const { addUser, login, logout } = require('./app/auth/services');
const { createChat, talkChat, accessChat, scrollDown, addReactions, uploadFile } = require('./app/chat/services');
const { addProfileImage } = require('./app/profile/services');
const { generateAiResponse } = require('./app/ai/services');

const passwd = "123123!@";
const domain = "@test.com";

const filename = './photo/test.jpeg';
const aiMention = "@wayneAI";
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
  await registerUser(page, id);
  await createChat(page, id);
};

async function scrollChat(page, id) {
  await registerUser(page, id);
  await scrollDown(page);
};

async function sendMessageToChat(page, id) {
  await createNewChat(page, id);
  await talkChat(page, msg);
};

async function reactionToMessage(page, id) {
  await sendMessageToChat(page, id)
  await addReactions(page, msg);
};

async function uploadFileToChat(page, id) {
  await createNewChat(page, id);
  await uploadFile(page, filename);
};

async function updateProfileImage(page, id) {
  await registerUser(page, id);
  await addProfileImage(page, filename);
};

async function generateChatAiResponse(page, id) {
  await createNewChat(page, id);
  await generateAiResponse(page, aiMention);
};

async function wrapperFunction(page) {
  const id = `${group}_${Date.now()}`;

  await loginUser(page, id);
}


module.exports = { wrapperFunction };