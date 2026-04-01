import { type IdProject } from "../../lib/supabase/queriesClient";
import { getProjectByID } from "../../lib/supabase/helpers/helpers";
import { useGameSettings } from "../../hooks/useGameSettings";
import { Spinner } from "../shared/Spinner/spinner";
import SectionCard from "./SectionCard";

const ARCHETYPE_PREFIX = "enemyArchetype:";

const GameSettings = ({ currentProjectID }: { currentProjectID: IdProject }) => {
    const { sections, isPending, error } = useGameSettings(currentProjectID);

    if (isPending) return <div className="flex items-center justify-center h-full"><Spinner /></div>;

    if (error || !sections || Object.keys(sections).length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-zinc-400 text-lg">
                    No game settings for <span className="psp-text-gold">{getProjectByID(currentProjectID)}</span> yet
                </p>
            </div>
        );
    }

    const regularSections = Object.entries(sections).filter(([key]) => !key.startsWith(ARCHETYPE_PREFIX));
    const archetypeSections = Object.entries(sections).filter(([key]) => key.startsWith(ARCHETYPE_PREFIX));

    return (
        <div className="p-4 md:p-6 overflow-y-auto h-full">
            <h2 className="text-2xl psp-text-gold mb-6">Game Balance Settings</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
                {regularSections.map(([sectionKey, data]) => (
                    <SectionCard
                        key={sectionKey}
                        sectionKey={sectionKey}
                        initialData={data}
                        projectId={currentProjectID}
                    />
                ))}
            </div>

            {archetypeSections.length > 0 && (
                <>
                    <h3 className="text-xl psp-text-gold mt-8 mb-4">Enemy Archetypes</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                        {archetypeSections.map(([sectionKey, data]) => (
                            <SectionCard
                                key={sectionKey}
                                sectionKey={sectionKey}
                                initialData={data}
                                projectId={currentProjectID}
                                compact
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default GameSettings;
