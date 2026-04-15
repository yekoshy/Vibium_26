import { browser } from 'vibium';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it, before, after } from 'node:test';

// Resolve the directory of this file so paths work no matter where Node is run from
const __dirname = dirname(fileURLToPath(import.meta.url));
const testCasesPath = join(__dirname, 'testcases.json');
const vibiumExecutablePath = join(__dirname, '..','..', 'node_modules', '@vibium','win32-x64', 'bin', 'vibium.exe'); // Adjust if Vibium is installed globally or in a different location
const testCases = JSON.parse(readFileSync(testCasesPath, 'utf8'));

    
    describe(`7 Char Val Tests - Running on Chrome `, () => {
        let vibe;

        // Setup: Launch Vibium for the specific browser before running the suite
        before(async () => {
            vibe = await browser.start({ 
                headless: false,  // Set to false if you want to watch the browser open and type
                executablePath: vibiumExecutablePath
                
            });

            
        });

        // Teardown: Close the browser after the suite finishes
        after(async () => {
            if (vibe) {
                await vibe.stop();
            }
        });

        // 3. Iterate through each test case in the JSON dynamically
        for (const tc of testCases) {
            it(tc.title, async () => {
                const page = await vibe.page()
                // Navigate to the EvilTester micro-app
                await page.go('https://testpages.eviltester.com/apps/7-char-val/');
                
                // Find the input field. Vibium can use standard CSS or semantic text locators.
                const inputField = await page.find('input[name="characters"]');
                
                // Type the payload (skipping if the input testcase is intended to be blank)
                if (tc.input && tc.input.length > 0) {
                    await inputField.type(tc.input);
                }

                // Find the validation submission button and click it
                const submitBtn = await page.find('input[type="button"]');
                await submitBtn.click();

                // Wait and capture all the visible text on the page.
                // Vibium handles the auto-waiting natively via WebDriver BiDi.
                
                
                const outputField = await page.find('input[name="validation_message"]');
                const pageText  = await outputField.value();
                // Normalize the expected condition string to handle complex JSON statements 
                // e.g., "Invalid Value (or the UI prevents typing...)" -> "Invalid Value"
                const expectedStatus = tc.expected.includes("Valid Value") 
                    ? "Valid Value" 
                    : "Invalid Value";
                
                // Assert that the page's resulting text includes the expected validation message
                assert.ok(
                    pageText.includes(expectedStatus),
                    `Test Failed. Input "${tc.input}" expected to result in "${expectedStatus}".`
                );
            });
        }
    });