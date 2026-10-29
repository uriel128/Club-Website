import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
});

test("chapter introduction renders cleanly on desktop and mobile", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.reload();
  await expect(page).toHaveTitle(/ColorStack at Farmingdale/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Find your",
  );
  await expect(
    page.locator("#team, #events, #resources, #faq, dialog, form"),
  ).toHaveCount(0);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
  for (const image of await page.locator("img").all()) {
    expect(
      await image.evaluate(
        (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
      ),
    ).toBe(true);
  }
});

test("registration explains both steps and opens the application directly", async ({
  page,
}) => {
  const steps = page.locator(".registration-steps > li");
  await expect(steps).toHaveCount(2);
  await expect(steps.nth(0).getByRole("link")).toHaveAttribute(
    "href",
    "https://app.colorstack.io/apply",
  );
  await expect(steps.nth(1).getByRole("link")).toHaveAttribute(
    "href",
    "https://discord.gg/B9UbpKtjQu",
  );
  await expect(steps.nth(1)).toContainText(
    "Follow the directions there to finish joining.",
  );
  const applyLinks = page.getByRole("link", { name: /^Apply/ });
  expect(await applyLinks.count()).toBeGreaterThan(0);
  for (const link of await applyLinks.all()) {
    await expect(link).toHaveAttribute(
      "href",
      "https://app.colorstack.io/apply",
    );
  }
  await page.route("https://app.colorstack.io/apply", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "<h1>ColorStack application</h1>",
    }),
  );
  await page
    .getByRole("link", { name: "Apply to ColorStack", exact: true })
    .first()
    .click();
  await expect(page).toHaveURL("https://app.colorstack.io/apply");
});

test("Discord logos, email, and motion preferences remain available", async ({
  page,
}) => {
  for (const discord of await page.locator("a.discord-link").all()) {
    await expect(discord).toHaveAttribute(
      "href",
      "https://discord.gg/B9UbpKtjQu",
    );
    await expect(discord.locator("svg").first()).toBeAttached();
    await expect(discord).toHaveAccessibleName(/Discord/);
  }
  await expect(
    page.getByRole("link", { name: "colorstackfsc@gmail.com" }),
  ).toHaveAttribute("href", "mailto:colorstackfsc@gmail.com");
  expect(
    (await page.locator("html").getAttribute("class")) ?? "",
  ).not.toContain("lenis");
  await page.getByRole("button", { name: "Pause motion" }).click();
  await expect(
    page.getByRole("button", { name: "Resume motion" }),
  ).toHaveAttribute("aria-pressed", "true");
});

test("page passes automated accessibility checks", async ({ page }) => {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    results.violations.map((violation) => ({
      id: violation.id,
      nodes: violation.nodes.map((node) => ({
        target: node.target,
        summary: node.failureSummary,
      })),
    })),
  ).toEqual([]);
});
