const path = require('path');

const accessChat = async (page, chatName) => {
  const rows = await page.locator('tr');
  const targetRow = await rows.filter({ hasText: chatName });

  await targetRow.locator("button:has-text('입장')").first().click({ timeout: 10000 });
  await page.waitForTimeout(3000);

  console.info(`${chatName} Chat accessed`);
};

const createChat = async (page, chatName) => {
  const newChatButton = page.getByRole('button', { name: '새 채팅방' });
  await newChatButton.click();

  const chatNameInput = page.getByPlaceholder('채팅방 이름을 입력하세요');
  await chatNameInput.fill(chatName);

  const createChatButton = page.getByRole('button', { name: '채팅방 만들기' });
  await createChatButton.click();

  await page.waitForTimeout(3000);
  console.info(`${chatName} Chat created`);
};


const talkChat = async (page, text) => {
  const messageInput = page.getByPlaceholder('메시지를 입력하세요... (@를 입력하여 멘션,');
  const sendButton = page.getByRole('button', { name: '메시지 보내기' });

  for (let i = 0; i < 3; i++) {
    await messageInput.fill(text);
    await sendButton.click();
  }
  await page.waitForTimeout(1000);
  console.info('Chat talk completed');
};

const addReactions = async (page, findText, reaction) => {
  // 채팅방 목록에 접근했을 때의 문자열만 이모지 추가
  // 모든 글이 필요하면 맨 위 휠로 접근해서 진행 필요
  await page.waitForTimeout(2000);
  const messagesLocator = await page.locator('div.messages');
  const messages = await messagesLocator.all();
  console.log("message count: ", messages.length);
  await Promise.all(
    messages.map(async (message) => {
      try {
        const messageText = await message.locator('div.message-content').innerText();
        if (!messageText.includes(findText)) return;

        const reactionButton = await message.locator('button[title="리액션 추가"]');
        if (!await reactionButton.isVisible()) return;

        await reactionButton.click();
        const allReactions = await page.locator('button[aria-label]').all();
        if (allReactions.length > 0) {
          const randomReactionIndex = Math.floor(Math.random() * allReactions.length);
          const randomReaction = allReactions[randomReactionIndex];

          if (await randomReaction.isVisible()) {
            await randomReaction.click({ force: true });
            console.info(`${randomReactionIndex} Random reaction added`);
          } else {
            console.warn('Reaction not visible, skipping');
          }
        }
      } catch (error) {
        console.error('Error processing message:', error);
      }
    })
  );
};

const scrollDown = async (page) => {
  const tableHeader = page.locator('#table-wrapper table thead tr');
  const boundingBox = await tableHeader.boundingBox();
  if (!boundingBox) {
    console.info('Bounding box not found for the element.');
    return;
  }

  await page.mouse.move(
    boundingBox.x + boundingBox.width / 2,
    boundingBox.y + boundingBox.height / 2
  );

  console.info('Scroll started');
  let stopScrolling = false;

  setTimeout(() => {
    console.info('Scroll stopped after 5 seconds.');
    stopScrolling = true;
  }, 10000);

  try {
    while (!stopScrolling) {
      await page.mouse.wheel(0, 100);
      await page.waitForTimeout(500);
    }
  } finally {
    console.info('Scroll ended');
  }
};


const uploadFile = async (page, filename) => {
  const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    page.click('//*[@id="__next"]/div/main/div/article/footer/div/div/div[3]/div/button[2]'),
  ]);

  await fileChooser.setFiles(path.resolve(filename));

  await page.click('//*[@id="__next"]/div/main/div/article/footer/div/div/div[4]/button');

  console.info('File uploaded');
  await page.waitForTimeout(3000);
};


module.exports = { accessChat, createChat, talkChat, addReactions, scrollDown, uploadFile };
