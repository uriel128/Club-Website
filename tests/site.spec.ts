import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
});

test("renders chapter content without browser errors or horizontal overflow", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await expect(page).toHaveTitle(/ColorStack at Farmingdale/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Find your",
  );
  await expect(
    page.getByRole("heading", { name: "Uriel Vasquez", exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Frank Victor", { exact: true })).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
  for (const image of await page.locator("img").all())
    expect(
      await image.evaluate(
        (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
      ),
    ).toBe(true);
});

test("membership dialog supports keyboard closing and restores focus", async ({
  page,
}) => {
  const join = page.getByRole("button", { name: "Find your community" });
  await join.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Request the roster form" }),
  ).toHaveAttribute("href", /^mailto:colorstackfsc@gmail.com/);
  const issues = await new AxeBuilder({ page }).include("dialog").analyze();
  expect(issues.violations).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(join).toBeFocused();
});

test("filters real resources and opens program details", async ({ page }) => {
  await page.getByRole("button", { name: "Career", exact: true }).click();
  await expect(page.locator(".resource-card")).toHaveCount(2);
  await expect(
    page.getByRole("link", { name: /FSC Career Development/ }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Community", exact: true }).click();
  await expect(page.locator(".resource-card")).toHaveCount(2);
  await expect(
    page.getByRole("link", { name: /ColorStack National.*national community/ }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "All resources", exact: true })
    .click();
  await expect(page.locator(".resource-card")).toHaveCount(6);
  await page.getByRole("button", { name: "Explore technical growth" }).click();
  await expect(page.getByRole("dialog")).toContainText(
    "Specific sessions, dates, and locations will be shared once confirmed.",
  );
  await page.getByRole("button", { name: "Close dialog" }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
});

test("contact form validates and prepares an accurate email without sending data", async ({
  page,
}) => {
  let posts = 0;
  page.on("request", (request) => {
    if (request.method() === "POST") posts++;
  });
  await page.getByRole("button", { name: "Prepare your email" }).click();
  await expect(page.locator(".draft-result")).not.toBeVisible();
  await page.getByLabel("Your name", { exact: true }).fill("Test Student");
  await page
    .getByLabel("Email address", { exact: true })
    .fill("student@example.com");
  await page.getByLabel("What’s on your mind?").selectOption("Membership");
  await page
    .getByLabel("Your message", { exact: true })
    .fill("I would love to join & learn about the chapter.");
  await page.getByRole("button", { name: "Prepare your email" }).click();
  await expect(page.getByText("Your email draft is ready.")).toBeVisible();
  const href = await page
    .getByRole("link", { name: "Open email app" })
    .getAttribute("href");
  expect(href).toContain("mailto:colorstackfsc@gmail.com");
  expect(decodeURIComponent(href!)).toContain(
    "I would love to join & learn about the chapter.",
  );
  expect(decodeURIComponent(href!)).toContain("Reply to: student@example.com");
  expect(posts).toBe(0);
});

test("FAQ, Discord logo links, and reduced-motion controls work", async ({
  page,
}) => {
  const faq = page.getByRole("button", {
    name: "Does it cost anything to join?",
  });
  await faq.click();
  await expect(faq).toHaveAttribute("aria-expanded", "true");
  await expect(
    page.getByRole("region", { name: "Does it cost anything to join?" }),
  ).toContainText("no mandatory chapter membership dues");
  for (const discord of await page.locator("a.discord-link").all()) {
    await expect(discord).toHaveAttribute(
      "href",
      "https://discord.gg/B9UbpKtjQu",
    );
    await expect(discord.locator("svg").first()).toBeAttached();
  }
  expect(
    (await page.locator("html").getAttribute("class")) ?? "",
  ).not.toContain("lenis");
  await page.getByRole("button", { name: "Pause motion" }).click();
  await expect(
    page.getByRole("button", { name: "Resume motion" }),
  ).toHaveAttribute("aria-pressed", "true");
});

test("mobile navigation is operable and anchored sections are reachable", async ({
  page,
  isMobile,
}) => {
  if (!isMobile) return;
  await page.getByRole("button", { name: "Open navigation" }).click();
  const navigation = page.getByRole("navigation", {
    name: "Mobile navigation",
  });
  await expect(navigation).toBeVisible();
  await navigation.getByRole("link", { name: "Our team" }).click();
  await expect(navigation).not.toBeVisible();
  await expect(page).toHaveURL(/#team$/);
  await expect(page.locator("#team")).toBeInViewport();
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
