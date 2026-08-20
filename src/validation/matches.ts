import { z } from "zod";

// MATCH_STATUS keys in UPPERCASE, values in lowercase
export const MATCH_STATUS = {
  SCHEDULED: "scheduled",
  LIVE: "live",
  FINISHED: "finished",
} as const;

const isIsoDateString = z.iso.datetime();

export const listMatchesQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).optional(),
});

export type ListMatchesQuery = z.infer<typeof listMatchesQuerySchema>;

export const matchIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export type MatchIdParam = z.infer<typeof matchIdParamSchema>;

export const createMatchSchema = z
  .object({
    sport: z.string().nonempty(),
    homeTeam: z.string().nonempty(),
    awayTeam: z.string().nonempty(),
    startTime: isIsoDateString,
    endTime: isIsoDateString,
    homeScore: z.coerce.number().int().nonnegative().optional(),
    awayScore: z.coerce.number().int().nonnegative().optional(),
  })
  .superRefine((data, ctx) => {
    // Only compare when both parseable as dates; individual refinements will report format errors
    const start = Date.parse(data.startTime);
    const end = Date.parse(data.endTime);
    if (isNaN(start) || isNaN(end)) return;
    if (end <= start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "endTime must be chronologically after startTime",
        path: ["endTime"],
      });
    }
  });

export type CreateMatch = z.infer<typeof createMatchSchema>;

export const updateScoreSchema = z.object({
  homeScore: z.coerce.number().int().nonnegative(),
  awayScore: z.coerce.number().int().nonnegative(),
});

export type UpdateScore = z.infer<typeof updateScoreSchema>;
