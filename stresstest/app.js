const { chromium } = require('playwright');
const { addUser, login } = require('./app/auth/services');
const { createChat, talkChat, accessChat, scrollDown, addReactions, uploadFile } = require('./app/chat/services');
const { addProfileImage } = require('./app/profile/services');
const { generateAiResponse } = require('./app/ai/services');
const crypto = require('crypto');

// 아래의 변수들은 외부 주입 또는 의존적이지 않은 변수는 랜덤으로 정의해도 무방
// config.json 변경 
const id = "user7";                                         // 아이디
const passwd = "123123";                                    // 패스워드
const email = "test@test9.com";                             // 로그인 이메일
const domain = "@test.com";                                 // 도메인
const chatName = "Video-Test-7dog";                         // 채팅방 이름
const site = "https://bootcampchat-fe.run.goorm.site/";     // 사이트 주소
const filename = '/Users/goorm/Desktop/test.jpeg';          // 파일 경로
const aiMention = "@wayneAI";                               // AI 호출 키워드
const findText = "hello";                                   // 리액션을 추가할 텍스트
const reaction = "🥴";                                      // 리액션
const msg = "hello";                                        // 채팅 메시지
const group = "group_a";                                    // 그룹 이름

function generateGroupName() {
  const timestamp = Date.now();
  const hash = crypto.createHash('sha256').update(timestamp.toString()).digest('hex');
  return `${group}_${timestamp}_${hash}`;
}

const getPage = async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(site);
  return page;
}

const registerUser = async (context, vuContext, events) => {
  const email = generateGroupName() + domain
  const id = generateGroupName()
  const page = await getPage();

  await addUser(page, id, passwd, email);
  return email
};

const loginUser = async (context, vuContext, events) => {
  const email = await registerUser();
  const page = await getPage();

  await login(page, email, passwd);
};

const createNewChat = async (context, vuContext, events) => {
  const email = await registerUser();
  const page = await getPage();

  await login(page, email, passwd);
  await createChat(page, chatName);
};

const scrollChat = async (context, vuContext, events) => {
  const email = await registerUser();
  const page = await getPage();

  await login(page, email, passwd);
  await scrollDown(page);
};

const sendMessageToChat = async (context, vuContext, events) => {
  const email = await registerUser();
  const page = await getPage();

  await login(page, email, passwd);
  await accessChat(page, chatName);
  await talkChat(page, msg);
};

const reactToMessage = async (context, vuContext, events) => {
  const email = await registerUser();
  const page = await getPage();

  await login(page, email, passwd);
  await accessChat(page, chatName);
  await addReactions(page, findText, reaction);
};

const uploadFileToChat = async (context, vuContext, events) => {
  const email = await registerUser();
  const page = await getPage();

  await login(page, email, passwd);
  await accessChat(page, chatName);
  await uploadFile(page, filename);
};

const updateProfileImage = async (context, vuContext, events) => {
  const email = await registerUser();
  const page = await getPage();

  await login(page, email, passwd);
  await addProfileImage(page, filename);
};

const generateChatAiResponse = async (context, vuContext, events) => {
  const email = vuContext.vars.email
  const passwd = vuContext.vars.password

  const page = await getPage();
  await login(page, email, passwd);
  await accessChat(page, chatName);
  await generateAiResponse(page, aiMention);
};

// 기능 별 테스트 실행
const run = async () => {
  // await registerUser();
  await loginUser();
  // await createNewChat();
  // await scrollChat();
  // await sendMessageToChat();
  // await reactToMessage();
  // await uploadFileToChat();
  // await updateProfileImage();
  // await generateChatAiResponse();
  
};

const main = async () => {
  await run();
};

main();

module.exports = { registerUser, loginUser, createNewChat, scrollChat, sendMessageToChat, reactToMessage, uploadFileToChat, updateProfileImage, generateChatAiResponse };