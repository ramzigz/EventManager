import express from 'express';
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from '../controllers/events.controller';
import {
  validateCreateEvent,
  validateEventId,
  validateUpdateEvent,
} from '../validations/events.validations';
import { handleValidationErrors } from '../middlewares/validation.middleware';

const routes = express.Router();

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Create a new event
 *     description: This endpoint allows you to create a new event.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: The event was successfully created
 *       500:
 *         description: Internal server error
 */
// Create a new event
routes.post('/', validateCreateEvent, handleValidationErrors, createEvent);

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Retrieve all events with pagination
 *     description: This endpoint allows you to retrieve all events with pagination support.
 *     parameters:
 *       - in: query
 *         name: limit
 *         description: Number of events to fetch (default is 10)
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: skip
 *         description: Number of events to skip (for pagination)
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: A list of events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date-time
 *                   category:
 *                     type: string
 *       500:
 *         description: Internal server error
 */
// Retrieve all events with pagination
routes.get('/', getAllEvents);

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Retrieve a single event by ID
 *     description: This endpoint fetches a single event based on the provided ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the event to fetch
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A event object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 date:
 *                   type: string
 *                   format: date-time
 *                 category:
 *                   type: string
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal server error
 */
// Retrieve a single event by ID
routes.get('/:id', validateEventId, handleValidationErrors, getEventById);

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Update an event by ID
 *     description: This endpoint allows you to update an event's details based on the provided ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the event to update
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: The event was successfully updated
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal server error
 */
// Update an event by ID
routes.put('/:id', validateUpdateEvent, handleValidationErrors, updateEvent);

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Delete an event by ID
 *     description: This endpoint allows you to delete an event based on the provided ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the event to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Event successfully deleted (No Content)
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal server error
 */
// Delete an event by ID
routes.delete('/:id', validateEventId, handleValidationErrors, deleteEvent);

export default routes;