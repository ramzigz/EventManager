import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EventForm from "../EventForm";
import { Event } from "../../app/events/page";

const mockEvent: Event = {
  id: "1",
  title: "Test Event",
  description: "This is a test event",
  date: "2023-01-01",
  category: "Test Category",
};

describe("EventForm", () => {
  it("renders the form with initial data", () => {
    render(
      <EventForm
        event={mockEvent}
        onSave={jest.fn()}
        isOpen={true}
        onClose={jest.fn()}
      />
    );

    expect(screen.getByLabelText(/title/i)).toHaveValue(mockEvent.title);
    expect(screen.getByLabelText(/description/i)).toHaveValue(mockEvent.description);
    expect(screen.getByLabelText(/date/i)).toHaveValue(mockEvent.date);
    expect(screen.getByLabelText(/category/i)).toHaveValue(mockEvent.category);
  });

  it("calls onSave with form data when submitted", () => {
    const onSave = jest.fn();
    render(
      <EventForm
        event={mockEvent}
        onSave={onSave}
        isOpen={true}
        onClose={jest.fn()}
      />
    );

    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: "Updated Event" } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: "Updated description" } });
    fireEvent.change(screen.getByLabelText(/date/i), { target: { value: "2023-02-01" } });
    fireEvent.change(screen.getByLabelText(/category/i), { target: { value: "Updated Category" } });

    fireEvent.click(screen.getByText(/save changes/i));

    expect(onSave).toHaveBeenCalledWith({
      id: "1",
      title: "Updated Event",
      description: "Updated description",
      date: "2023-02-01",
      category: "Updated Category",
    });
  });

  it("resets form data when canceled", async () => {
    const onClose = jest.fn();
    render(
      <EventForm
        event={mockEvent}
        onSave={jest.fn()}
        isOpen={true}
        onClose={onClose}
      />
    );

    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: "Updated Event" } });
    fireEvent.click(screen.getByText(/cancel/i));

    await waitFor(() => {
      expect(screen.getByLabelText(/title/i)).toHaveValue('');
      expect(screen.getByLabelText(/description/i)).toHaveValue('');
      expect(screen.getByLabelText(/date/i)).toHaveValue('');
      expect(screen.getByLabelText(/category/i)).toHaveValue('');
      expect(onClose).toHaveBeenCalled();
    });
  });
});