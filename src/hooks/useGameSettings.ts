import { useQuery } from "@tanstack/react-query";
import { getGameSettings, type GameSettingRow, type IdProject } from "../lib/supabase/queriesClient";

export type ParsedSection = Record<string, number | boolean | string>;
export type SectionMap = Record<string, ParsedSection>;

function parseValue(value: string, valueType: string): number | boolean | string {
    if (valueType === "boolean") return value === "true";
    if (valueType === "number") return parseFloat(value);
    return value;
}

function groupBySection(rows: GameSettingRow[]): SectionMap {
    const map: SectionMap = {};
    for (const row of rows) {
        if (!map[row.section]) map[row.section] = {};
        map[row.section][row.key] = parseValue(row.value, row.value_type);
    }
    return map;
}

export const useGameSettings = (projectId: IdProject) => {
    const { data, error, isPending } = useQuery({
        queryFn: async () => {
            const result = await getGameSettings(projectId);
            if (result.error) throw new Error(result.error.message);
            return groupBySection(result.data as GameSettingRow[]);
        },
        queryKey: ["gameSettings", projectId],
    });

    return { sections: data ?? null, isPending, error };
};
