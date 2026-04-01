import { useState } from "react";
import { type IdProject, updateGameSettingsSection } from "../../lib/supabase/queriesClient";
import type { ParsedSection } from "../../hooks/useGameSettings";
import SettingsSection from "./SettingsSection";

const ARCHETYPE_PREFIX = "enemyArchetype:";

function formatSectionTitle(section: string): string {
    if (section.startsWith(ARCHETYPE_PREFIX)) {
        return section
            .slice(ARCHETYPE_PREFIX.length)
            .replace(/_/g, " ")
            .replace(/\s*AI\s*Variant\s*/i, "")
            .replace(/\s*AI\s*/i, "")
            .trim();
    }
    return section.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
}

const SectionCard = ({
    sectionKey,
    initialData,
    projectId,
    compact,
}: {
    sectionKey: string;
    initialData: ParsedSection;
    projectId: IdProject;
    compact?: boolean;
}) => {
    const [data, setData] = useState<ParsedSection>(initialData);
    const [savedData, setSavedData] = useState<ParsedSection>(initialData);
    const [isSaving, setIsSaving] = useState(false);

    const isDirty = Object.keys(data).some((key) => data[key] !== savedData[key]);

    const handleChange = (field: string, value: number | boolean | string) => {
        setData((prev) => ({ ...prev, [field]: value }));
    };

    const handleUpdate = async () => {
        setIsSaving(true);
        try {
            await updateGameSettingsSection(projectId, sectionKey, data);
            setSavedData({ ...data });
        } catch (err) {
            console.error(`Failed to update ${sectionKey}:`, err);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <SettingsSection
            title={formatSectionTitle(sectionKey)}
            data={data}
            onChange={handleChange}
            onUpdate={handleUpdate}
            isDirty={isDirty}
            isSaving={isSaving}
            compact={compact}
        />
    );
};

export default SectionCard;
