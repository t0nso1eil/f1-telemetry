import { SegmentState } from "./segmentState";

export interface SectorState {
    sector: 1 | 2 | 3;

    value?: string | null;
    previousValue?: string | null;

    stopped: boolean;
    statusCode?: number | null;

    personalFastest?: boolean | null;
    overallFastest?: boolean | null;

    segments: SegmentState[];
}