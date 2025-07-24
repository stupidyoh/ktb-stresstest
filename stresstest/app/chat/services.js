const path = require('path');

const accessChat = async (page, chatName) => {
  const targetRow = page.locator('tr.styled-table-row').filter({ hasText: chatName });

  const joinButton = targetRow.locator('button', { hasText: '입장' }).first();
  await joinButton.click({ timeout: 30000 });
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

  await page.waitForTimeout(2000);
  console.info(`${chatName} Chat created`);
};


const talkChat = async (page, text) => {
  const messageInput = page.getByPlaceholder('메시지를 입력하세요... (@를 입력하여 멘션,');
  const sendButton = page.getByRole('button', { name: '메시지 보내기' });

  for (let i = 0; i < 2; i++) {
    await messageInput.fill(text);
    await sendButton.click();
  }
  await page.waitForTimeout(1000);
  console.info('Chat talk completed');
};

const addReactions = async (page, findText, reaction) => {
  await page.waitForTimeout(2000);
  
  const messagesLocator = page.locator('div.messages');
  const messageCount = await messagesLocator.count();
  
  for (let i = 0; i < messageCount; i++) {
    try {
      const message = messagesLocator.nth(i);
      
      const messageText = await message.locator('div.message-content').textContent();
      if (!messageText || !messageText.includes(findText)) {
        continue;
      }
      
      const reactionButton = page.getByLabel('리액션 추가').nth(i);

      const isButtonVisible = await reactionButton.isVisible().catch(() => false);
      if (!isButtonVisible) return;
      
      await reactionButton.click();
      await page.waitForTimeout(500);
      
      const allReactions = page.locator('button[aria-label]');
      const reactionCount = await allReactions.count();
      
      if (reactionCount > 0) {
        const randomReactionIndex = Math.floor(Math.random() * reactionCount);
        const randomReaction = allReactions.nth(randomReactionIndex);
        
        if (await randomReaction.isVisible().catch(() => false)) {
          await randomReaction.click();
        }
      }
      
      await page.waitForTimeout(500);
      
    } catch (error) {
      await page.keyboard.press('Escape').catch(() => {});
    }
  }
};

// const scrollDown = async (page) => {
//   const scrollContainer = page.locator('.chat-rooms-table');
//   await scrollContainer.waitFor({ state: 'visible' });
  
//   console.info('Scroll started');
  
//   let previousScrollTop = -1;
  
//   while (true) {
//     const endMessage = await page.locator('text=모든 채팅방을 불러왔습니다.').isVisible().catch(() => false);
//     if (endMessage) {
//       console.info('All rooms loaded!');
//       break;
//     }
    
//     await scrollContainer.evaluate(el => {
//       el.scrollTop = el.scrollHeight;
//     });
//     await page.waitForTimeout(1000);
    
//     // 새로운 스크롤 위치 확인
//     const newScrollTop = await scrollContainer.evaluate(el => el.scrollTop);
    
//     // 스크롤이 변하지 않았으면 채팅방 목록 헤더 클릭
//     if (newScrollTop === previousScrollTop) {
//       await page.getByRole('button', { name: '채팅방 목록' }).click();
//       await page.waitForTimeout(500);
//     }
    
//     previousScrollTop = newScrollTop;
//   }
  
//   console.info('Scroll ended');
// };

const scrollDown = async (page) => {
  const scrollContainer = page.locator('.chat-rooms-table');
  await scrollContainer.waitFor({ state: 'visible' });
  
  console.info('Scroll started');
  
  const scrollPromise = new Promise(async (resolve) => {
    let previousScrollTop = -1;
    
    while (true) {
      const endMessage = await page.locator('text=모든 채팅방을 불러왔습니다.').isVisible().catch(() => false);
      if (endMessage) {
        console.info('All rooms loaded!');
        resolve();
        break;
      }
      
      await scrollContainer.evaluate(el => {
        el.scrollTop = el.scrollHeight;
      });
      await page.waitForTimeout(1000);
      
      // 새로운 스크롤 위치 확인
      const newScrollTop = await scrollContainer.evaluate(el => el.scrollTop);
      
      // 스크롤이 변하지 않았으면 채팅방 목록 헤더 클릭
      if (newScrollTop === previousScrollTop) {
        await page.getByRole('button', { name: '채팅방 목록' }).click();
        await page.waitForTimeout(500);
      }
      
      previousScrollTop = newScrollTop;
    }
  });

  const timeoutPromise = new Promise((resolve) => {
    setTimeout(() => {
      console.info('Scroll timeout after 15 seconds');
      resolve();
    }, 15000);
  });

  // 15초 또는 스크롤 완료 중 먼저 끝나는 것을 기다림
  await Promise.race([scrollPromise, timeoutPromise]);
  
  console.info('Scroll ended');
};


const uploadFile = async (page, filename) => {
  const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    page.getByLabel('파일 첨부').click(),
  ]);

  await fileChooser.setFiles(path.resolve(filename));

  await page.getByLabel('메시지 보내기').click();

  console.info('File uploaded');
  await page.waitForTimeout(3000);
};

module.exports = { accessChat, createChat, talkChat, addReactions, scrollDown, uploadFile };
