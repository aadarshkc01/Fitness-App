import { Request, Response } from 'express';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';

/**
 * POST /coach/chat
 * PLACEHOLDER — no RAG/LLM wired in yet, per project scope. Returns a
 * consistent, honest response so the frontend chat UI has something real
 * to render, without pretending to be an AI that isn't there.
 *
 * When RAG/LLM is built, this function's internals change (embed the
 * message, retrieve from the knowledge base, call the LLM API) but the
 * request/response shape stays identical, so no frontend changes needed.
 */
export const chatWithCoach = asyncHandler(async (req: Request, res: Response) => {
  const { message } = req.body;

  return res.json(new ApiResponse(200, {
    reply: "I'm not connected to real coaching intelligence yet — that's coming in a future update. For now, check your Plan page for form cues on each exercise.",
    receivedMessage: message || null,
  }));
});
