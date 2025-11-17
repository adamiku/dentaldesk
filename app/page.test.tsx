import { expect, test } from "vitest";
import { render, screen } from "../test-utils/test-utils";
import Page from "./page";

test("Page", () => {
  render(<Page />);
  expect(
    screen.getByRole("heading", { level: 1, name: "DentalDesk" }),
  ).toBeDefined();
});
