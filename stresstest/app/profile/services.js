const { expect } = require('@playwright/test');
const path = require('path');

const addProfileImage = async (page, filename) => {
  await page.locator('//*[@id="__next"]/div/nav/div/div/div[3]/div/button').click();
  await page.locator('//*[@id="__next"]/div/nav/div/div/div[3]/div/div/button[1]').click();

  await page.waitForTimeout(3000);
  const cameraButton = await page.locator('button[class*="vapor-Button-md"]');

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
