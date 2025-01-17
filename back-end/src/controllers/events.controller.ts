import { Request, Response } from 'express';
import {
  createNewEvent,
  fetchAllEvents,
  fetchEventById,
  updateEventById,
  deleteEventById,
} from '../services';

export const createEvent = async (req: Request, res: Response) => {
  try {
    const newEvent = await createNewEvent(req.body);
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const { limit, skip, select } = req.query;
    const events = await fetchAllEvents(
      limit ? Number(limit) : undefined,
      skip ? Number(skip) : undefined,
      select as string
    );
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    const event = await fetchEventById(req.params.id);
    res.status(200).json(event);
  } catch (error) {
    res.status(404).json({ error: 'Event not found' });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const updatedEvent = await updateEventById(req.params.id, req.body);
    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(404).json({ error: 'Event not found' });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    await deleteEventById(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: 'Event not found' });
  }
};
