const { expect } = require('@playwright/test');
const path = require('path');

const addProfileImage = async (page, filename) => {
  await page.getByRole('button', { name: '프로필' }).click();

  await page.waitForTimeout(2000);
  const cameraButton = await page.getByRole('button', { name: '이미지 변경' })

  console.log(page.url());
  const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    cameraButton.click(),
  ]);

  await fileChooser.setFiles(path.resolve(filename));
  await page.getByRole('button', { name: '저장' }).click();
  await page.waitForTimeout(3000);

  console.info('Profile image added');
};

module.exports = { addProfileImage };
