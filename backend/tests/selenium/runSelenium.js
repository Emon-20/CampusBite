const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const BASE_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

async function runSeleniumTests() {
  const options = new chrome.Options();
  options.addArguments('--headless=new', '--no-sandbox', '--disable-dev-shm-usage', '--window-size=1280,800');

  const driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

  try {
    console.log('--- Selenium Workflow 1: Student Login ---');
    await driver.get(`${BASE_URL}/login`);
    await driver.wait(until.elementLocated(By.id('login-email')), 10000);
    await driver.findElement(By.id('login-email')).sendKeys('rahim@student.ruet.ac.bd');
    await driver.findElement(By.id('login-password')).sendKeys('Password@123');
    await driver.findElement(By.css('button[type="submit"]')).click();

    await driver.wait(until.elementLocated(By.css('[data-testid="nav-cart"]')), 10000);
    console.log('PASS: Student logged in and redirected to menu.');

    console.log('--- Selenium Workflow 2: Browse Food and Add Item to Cart ---');
    const addBtn = await driver.wait(
      until.elementLocated(By.css('[data-testid="add-to-cart-Chips"]')),
      10000
    );
    await addBtn.click();

    const cartLink = await driver.findElement(By.css('[data-testid="nav-cart"]'));
    await driver.wait(async () => {
      const text = await cartLink.getText();
      return text.includes('1');
    }, 5000);
    await cartLink.click();
    console.log('PASS: Chips added to cart and navigated to /cart.');

    console.log('--- Selenium Workflow 3: Place Order and View Confirmation ---');
    const confirmBtn = await driver.wait(
      until.elementLocated(By.css('[data-testid="confirm-order-btn"]')),
      10000
    );
    await confirmBtn.click();

    const receipt = await driver.wait(
      until.elementLocated(By.css('[data-testid="order-receipt"]')),
      10000
    );
    const receiptText = await receipt.getText();
    if (!receiptText.includes('Order Confirmed!') || !receiptText.includes('Cash on Pickup')) {
      throw new Error(`Unexpected receipt content: ${receiptText}`);
    }
    console.log('PASS: Order placed and confirmation receipt displayed.');
    console.log('ALL 3 SELENIUM WORKFLOWS PASSED!');
  } finally {
    await driver.quit();
  }
}

runSeleniumTests().catch((err) => {
  console.error('SELENIUM TEST FAILED:', err);
  process.exit(1);
});
