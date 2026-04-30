export const DAY_WIDTH = 32;
export const ROW_HEIGHT = 60;
export const LABEL_WIDTH = 200;
export const MIN_DURATION = 1;

export const COLORS = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
    '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316',
];

export const START_DATE = new Date(2026, 0, 1);
export const TODAY_DAY = Math.floor((Date.now() - START_DATE.getTime()) / 86400000);
