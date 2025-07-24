const { addUser, login, logout } = require('./app/auth/services');
const { createChat, talkChat, accessChat, scrollDown, addReactions, uploadFile } = require('./app/chat/services');
const { addProfileImage } = require('./app/profile/services');
const { generateAiResponse } = require('./app/ai/services');

const passwd = "123123!@";
const domain = "@test.com";

const filename = './files/test_image.jpeg';
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

// 패턴 단일 테스트
async function wrapperFunction(page) {
  const id = `${group}_${Date.now()}`;

  // await registerUser(page, id);
  // await loginUser(page, id);
  // await createNewChat(page, id);
  // await scrollChat(page, id);
  await sendMessageToChat(page, id);
  // await reactionToMessage(page, id);
  // await uploadFileToChat(page, id);
  // await updateProfileImage(page, id);
  // await generateChatAiResponse(page, id);

}

// 채팅방에서 각종 말하기
async function wrapperFunctionChat(page) {
  const id = `${group}_${Date.now()}`;

  await sendMessageToChat(page, id)
  await uploadFile(page, filename);
  await generateAiResponse(page, aiMention);

  console.log(`모든 채팅방 기능 완료`);

}

// 행동 반복하기
async function wrapperFunctionRepeat(page) {
  const id = `${group}_${Date.now()}`;

  await createNewChat(page, id);
  const repeatCount = 5; // FIXME: 원하는 반복횟수로 수정

  for (let i = 0; i < repeatCount; i++) {
    console.log(`${id}: 시작 (${i + 1}/${repeatCount})`);

    await talkChat(page, msg);;

    console.log(`${id}: 완료`);
    
    await page.waitForTimeout(1000);
  }

}

module.exports = { wrapperFunction, wrapperFunctionChat, wrapperFunctionRepeat };