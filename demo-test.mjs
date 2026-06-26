import { chromium } from 'playwright';

const browser = await chromium.launch({
  headless: false,
  slowMo: 600,
  args: ['--start-maximized']
});

const context = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  // localStorage 초기화해서 깔끔하게 시작
  storageState: { cookies: [], origins: [] }
});

const page = await context.newPage();
await page.goto('http://localhost:8765/shopping-list.html');
await page.waitForTimeout(800);

// ── 1단계: 항목 3개 추가 ──
const items = ['우유', '계란', '빵'];
for (const item of items) {
  await page.locator('#itemInput').click();
  await page.locator('#itemInput').fill(item);
  await page.waitForTimeout(400);
  await page.locator('#addBtn').click();
  await page.waitForTimeout(500);
}

await page.waitForTimeout(800);

// ── 2단계: 첫 번째 항목(우유) 체크 ──
const checkboxes = page.locator('li input[type="checkbox"]');
await checkboxes.nth(0).click();
await page.waitForTimeout(700);

// ── 3단계: 두 번째 항목(계란) 체크 ──
await checkboxes.nth(1).click();
await page.waitForTimeout(700);

// ── 4단계: 완료 항목 일괄 삭제 ──
await page.locator('#clearCheckedBtn').click();
await page.waitForTimeout(800);

// ── 5단계: 남은 항목(빵) 개별 삭제 ──
const deleteBtn = page.locator('li .delete-btn').first();
await deleteBtn.click();
await page.waitForTimeout(1000);

// 빈 리스트 상태 잠시 보여주기
await page.waitForTimeout(1500);

await browser.close();