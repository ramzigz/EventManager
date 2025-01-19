import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ConfirmAction from "../ConfirmAction";
import '@testing-library/jest-dom';

const mockProps = {
  title: "Confirm Action",
  message: "Are you sure you want to proceed?",
  onConfirm: jest.fn(),
  onCancel: jest.fn(),
  isOpen: true,
  onClose: jest.fn(),
};

describe("ConfirmAction", () => {
  it("renders the dialog with title and message", () => {
    render(<ConfirmAction {...mockProps} />);

    expect(screen.getByText(/confirm action/i)).toBeInTheDocument();
    expect(screen.getByText(/are you sure you want to proceed\?/i)).toBeInTheDocument();
  });

  it("calls onConfirm when the Continue button is clicked", () => {
    render(<ConfirmAction {...mockProps} />);

    fireEvent.click(screen.getByText(/continue/i));
    expect(mockProps.onConfirm).toHaveBeenCalled();
  });

  it("calls onCancel when the Cancel button is clicked", () => {
    render(<ConfirmAction {...mockProps} />);

    fireEvent.click(screen.getByText(/cancel/i));
    expect(mockProps.onCancel).toHaveBeenCalled();
  });

  it("calls onClose when the dialog is closed", () => {
    render(<ConfirmAction {...mockProps} />);

    fireEvent.click(screen.getByText(/cancel/i));
    expect(mockProps.onClose).toHaveBeenCalledWith(false);
  });
});