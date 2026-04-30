import { START_DATE } from './constants';

export function dayToDate(day: number): Date {
    const d = new Date(START_DATE);
    d.setDate(d.getDate() + day);
    return d;
}

export function generateMonths(totalDays: number): { label: string; startDay: number; days: number }[] {
    const out: { label: string; startDay: number; days: number }[] = [];
    let day = 0;
    while (day < totalDays) {
        const d = dayToDate(day);
        const dim = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
        const remaining = dim - (d.getDate() - 1);
        const days = Math.min(remaining, totalDays - day);
        out.push({ label: d.toLocaleString('default', { month: 'long', year: 'numeric' }), startDay: day, days });
        day += days;
    }
    return out;
}

export function daysInMonth(monthIndex: number): number {
    const d = dayToDate(0);
    return new Date(d.getFullYear(), d.getMonth() + monthIndex + 1, 0).getDate();
}
