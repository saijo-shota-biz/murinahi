import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ParticipantNameInput } from "../ParticipantNameInput";

describe("ParticipantNameInput", () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it("should render input with correct props", () => {
    render(<ParticipantNameInput value="田中太郎" onChange={mockOnChange} />);

    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("田中太郎");
    expect(input).toHaveAttribute("placeholder", "例: 田中");
    expect(input).toHaveAttribute("maxLength", "20");
  });

  it("should render label with correct text", () => {
    render(<ParticipantNameInput value="" onChange={mockOnChange} />);

    expect(screen.getByText("お名前（任意）")).toBeInTheDocument();
    expect(screen.getByText("入力しない場合は「ななしさん」と表示されます")).toBeInTheDocument();
  });

  it("should update local value on change without calling onChange", () => {
    render(<ParticipantNameInput value="" onChange={mockOnChange} />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "新しい名前" } });

    expect(input).toHaveValue("新しい名前");
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it("should call onChange on blur", () => {
    render(<ParticipantNameInput value="" onChange={mockOnChange} />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "田中太郎" } });
    fireEvent.blur(input);

    expect(mockOnChange).toHaveBeenCalledWith("田中太郎");
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it("should be disabled when disabled prop is true", () => {
    render(<ParticipantNameInput value="" onChange={mockOnChange} disabled={true} />);

    const input = screen.getByRole("textbox");
    expect(input).toBeDisabled();
  });

  it("should show character count when over 15 characters", () => {
    render(<ParticipantNameInput value="1234567890123456" onChange={mockOnChange} />);

    expect(screen.getByText("残り4文字")).toBeInTheDocument();
  });

  it("should not show character count when 15 characters or less", () => {
    render(<ParticipantNameInput value="123456789012345" onChange={mockOnChange} />);

    expect(screen.queryByText(/残り.*文字/)).not.toBeInTheDocument();
  });

  it("should update local value when value prop changes", () => {
    const { rerender } = render(<ParticipantNameInput value="初期値" onChange={mockOnChange} />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("初期値");

    rerender(<ParticipantNameInput value="更新された値" onChange={mockOnChange} />);
    expect(input).toHaveValue("更新された値");
  });

  it("should handle empty value prop", () => {
    render(<ParticipantNameInput value="" onChange={mockOnChange} />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("");
  });

  it("should handle undefined value prop", () => {
    // @ts-expect-error - testing edge case
    render(<ParticipantNameInput onChange={mockOnChange} />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("");
  });
});
