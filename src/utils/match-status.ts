import { MATCH_STATUS } from "../validation/matches.js";

export function getMatchStatus(
  startTime: string,
  endTime: string,
  now = new Date(),
) {
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return null;
  }

  if (now < start) {
    return MATCH_STATUS.SCHEDULED;
  }

  if (now >= end) {
    return MATCH_STATUS.FINISHED;
  }

  return MATCH_STATUS.LIVE;
}

type matchStatusProps = {
  startTime: string;
  endTime: string;
  status: string;
};

type updateStatusFn = (newStatus: string) => Promise<void>;

export async function syncMatchStatus(
  match: matchStatusProps,
  updateStatus: updateStatusFn,
) {
  const nextStatus = getMatchStatus(match.startTime, match.endTime);

  if (!nextStatus) {
    return match.status;
  }

  if (match.status !== nextStatus) {
    await updateStatus(nextStatus);
    match.status = nextStatus;
  }

  return match.status;
}
