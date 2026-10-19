import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const baseUrl = process.env.DEMO_URL ?? "http://localhost:3000";

await mkdir("demo-raw", { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  recordVideo: { dir: "demo-raw", size: { width: 1440, height: 900 } },
});
const page = await context.newPage();

async function pause(ms) {
  await page.waitForTimeout(ms);
}

async function hideDevTools() {
  await page.addStyleTag({
    content: "nextjs-portal{display:none!important}",
  });
}

async function caption(text) {
  await page.evaluate((message) => {
    let bar = document.getElementById("demo-caption");
    if (!bar) {
      bar = document.createElement("div");
      bar.id = "demo-caption";
      bar.style.cssText = [
        "position:fixed",
        "left:276px",
        "bottom:28px",
        "z-index:80",
        "max-width:720px",
        "background:#ffffff",
        "color:#14324c",
        "padding:14px 18px",
        "border-radius:16px",
        "border:1px solid #d5e4f0",
        "border-left:4px solid #1f6feb",
        "font:600 20px/1.35 Figtree, ui-sans-serif, sans-serif",
        "box-shadow:0 16px 40px rgba(18,51,82,0.16)",
      ].join(";");
      document.body.appendChild(bar);
    }
    bar.textContent = message;
  }, text);
}

await page.goto(baseUrl);
await page.evaluate(() => window.localStorage.removeItem("harbor-ats-v1"));
await page.reload();
await hideDevTools();
await page.getByTestId("metrics").waitFor();

await caption("Harbor keeps candidates, stages, and hiring metrics on one desk.");
await pause(2800);

await page.getByTestId("attention-item").first().click();
await page.getByTestId("candidate-drawer").waitFor();
await caption("Open someone who has been waiting, then move their stage.");
await pause(1400);
await page.getByTestId("move-offer").click();
await pause(900);
await page.getByTestId("note-input").fill("Panel approved. Sending the written offer today.");
await page.getByTestId("save-note").click();
await pause(1400);
await page.getByRole("button", { name: "Close", exact: true }).click();

await page.getByRole("link", { name: "Pipeline", exact: true }).click();
await page.getByTestId("pipeline").waitFor();
await caption("The pipeline is the six hiring stages. Move a card from its menu.");
await pause(1200);
await page.getByLabel("Move Ananya Krishnan").selectOption("screening");
await pause(1600);

await page.getByRole("link", { name: "Candidates", exact: true }).click();
await page.getByTestId("candidates").waitFor();
await caption("Search by name, email, skill, city, or role.");
await page.getByTestId("candidate-search").fill("Figma");
await pause(1600);
await page.getByTestId("candidate-search").fill("");
await page.getByTestId("add-candidate").click();
await page.getByTestId("candidate-form").waitFor();
await caption("New candidates start in Applied.");
await page.getByTestId("field-name").fill("Aisha Rahman");
await page.getByTestId("field-email").fill("aisha.rahman@example.com");
await page.getByLabel("City").fill("Bengaluru");
await page.getByTestId("field-role").selectOption("analyst");
await page.getByTestId("field-skills").fill("SQL, Python");
await page.getByTestId("save-candidate").click();
await page.getByRole("heading", { name: "Aisha Rahman" }).waitFor();
await pause(1600);
await page.getByRole("button", { name: "Close", exact: true }).click();

await page.getByRole("link", { name: "Roles", exact: true }).click();
await page.getByTestId("roles").waitFor();
await caption("Each person belongs to a role. Closed roles keep their history.");
await pause(2000);

await page.getByRole("link", { name: "Overview", exact: true }).click();
await page.getByTestId("metrics").waitFor();
await caption("The overview updates as people move.");
await pause(2400);

const video = page.video();
await context.close();
await browser.close();
const path = await video?.path();
console.log(path ?? "no video");
