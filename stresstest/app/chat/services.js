const random = require('random');

const accessChat = async (page, chatName) => {
  if (page.url() !== 'https://bootcampchat-fe.run.goorm.site/chat-rooms') {
    console.info('This page is not chat-rooms');
    return;
  }
  const rows = page.locator('tr');
  const targetRow = rows.filter({ hasText: chatName });

  await targetRow.locator("button:has-text('입장')").first().click();
  await page.waitForTimeout(10000);

  console.info('Chat accessed');
};


const createChat = async (page, chatName) => {
  if (page.url() !== 'https://bootcampchat-fe.run.goorm.site/chat-rooms') {
    console.info('This page is not chat-rooms');
    return;
  }

  const newChatButton = page.getByRole('button', { name: '새 채팅방' });
  await newChatButton.click();

  const chatNameInput = page.getByPlaceholder('채팅방 이름을 입력하세요');
  await chatNameInput.fill(chatName);

  const createChatButton = page.getByRole('button', { name: '채팅방 만들기' });
  await createChatButton.click();

  await page.waitForTimeout(10000);
  console.info('Chat created');
};

const talkChat = async (page, text) => {
  if (!page.url().includes('https://bootcampchat-fe.run.goorm.site/chat?room=')) {
    console.info('This page is not rooms');
    return;
  }
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
  if (!page.url().includes('https://bootcampchat-fe.run.goorm.site/chat?room=')) {
    console.info('This page is not rooms');
    return;
  }

  const messagesLocator = await page.locator('div.messages');
  const messages = await messagesLocator.all();
  for (let message of messages) {
    const messageText = await message.locator('div.message-content').innerText();
    if (messageText.includes(findText)) {
      const reactionButton = await message.locator('button[title="리액션 추가"]');
      if (await reactionButton.isVisible()) {
        await reactionButton.click();

        const reactions = await page.locator(`button[aria-label="${reaction}"]`).all();

        if (reactions.length === 1) {
          await reactions[0].click();
          console.info('Reaction added');
        } else {
          const allReactions = await page.locator('button[aria-label]').all();
          if (allReactions.length > 0) {
            const randomReactionIndex = Math.floor(Math.random() * allReactions.length);
            await allReactions[randomReactionIndex].click();
            console.info('Random reaction added');
          }
        }
        await page.waitForTimeout(2000);
      }
    }
  }
};

const scrollDown = async (page) => {
  if (page.url() !== 'https://bootcampchat-fe.run.goorm.site/chat-rooms') {
    console.info(`This page is not chat-rooms: ${page.url()}`);
    return;
  }

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
  try {
    while (true) {
      await page.mouse.wheel(0, 100);
      await page.waitForTimeout(500);
    }
  } catch (e) {
    console.info(`Scrolling stopped manually. Error: ${e}`);
  }
};

const { expect } = require('@playwright/test');
const path = require('path');

const uploadFile = async (page, filename) => {
  if (!page.url().includes('https://bootcampchat-fe.run.goorm.site/chat?room=')) {
    console.info('This page is not rooms');
    return;
  }

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
