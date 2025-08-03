import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ServiceShareButton } from "../ServiceShareButton";

describe("ServiceShareButton", () => {
  it("should render with default props", () => {
    render(<ServiceShareButton />);
    const button = screen.getByRole("button", { name: /ムリな日カレンダーを友達に教える/i });
    expect(button).toBeInTheDocument();
  });

  it("should open modal when clicked", () => {
    render(<ServiceShareButton />);
    const button = screen.getByRole("button", { name: /ムリな日カレンダーを友達に教える/i });

    fireEvent.click(button);

    expect(screen.getByText("ムリな日カレンダーをシェア")).toBeInTheDocument();
  });

  it("should close modal when close button is clicked", () => {
    render(<ServiceShareButton />);
    const button = screen.getByRole("button", { name: /ムリな日カレンダーを友達に教える/i });

    fireEvent.click(button);
    expect(screen.getByText("ムリな日カレンダーをシェア")).toBeInTheDocument();

    const closeButton = screen.getByRole("button", { name: /閉じる/i });
    fireEvent.click(closeButton);

    expect(screen.queryByText("ムリな日カレンダーをシェア")).not.toBeInTheDocument();
  });

  it("should accept custom url and title props", () => {
    const customUrl = "https://example.com/event/123";
    const customTitle = "カスタムタイトル";

    render(<ServiceShareButton url={customUrl} title={customTitle} />);
    const button = screen.getByRole("button", { name: /ムリな日カレンダーを友達に教える/i });

    fireEvent.click(button);

    expect(screen.getByText("ムリな日カレンダーをシェア")).toBeInTheDocument();
    expect(
      screen.getByText((content, _element) => {
        return content.includes(customUrl);
      }),
    ).toBeInTheDocument();
  });

  it("should apply variant and size props", () => {
    render(<ServiceShareButton variant="primary" size="lg" />);
    const button = screen.getByRole("button", { name: /ムリな日カレンダーを友達に教える/i });

    expect(button).toHaveClass("bg-gradient-to-r", "from-red-500", "to-pink-500");
    expect(button).toHaveClass("px-6", "py-3", "text-lg");
  });

  it("should apply custom className", () => {
    render(<ServiceShareButton className="custom-class" />);
    const button = screen.getByRole("button", { name: /ムリな日カレンダーを友達に教える/i });

    expect(button).toHaveClass("custom-class");
  });
});
