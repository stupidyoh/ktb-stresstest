const { expect } = require('@playwright/test');
const path = require('path');

const addProfileImage = async (page, filename) => {
  await page.waitForTimeout(1000);
  await page.locator('//*[@id="__next"]/div/nav/div/div/div[3]/div/button').click();
  await page.locator('//*[@id="__next"]/div/nav/div/div/div[3]/div/div/button[1]').click();
  
  const [fileChooser] = await Promise.all([
    page.waitForTimeout(3000),
    page.waitForEvent('filechooser'),
    page.locator('//*[@id="radix-:rf:"]/div/div/div/div[2]/button').click(),
  ]);
  console.log(fileChooser);
  await fileChooser.setFiles(path.resolve(filename));
  await page.getByRole('button', { name: '저장' }).click();
  await page.waitForTimeout(3000);

  console.info('Profile image added');
};

module.exports = { addProfileImage };
