import { useCrew } from '../../hooks/useCrew';
import { Spinner } from '../shared/Spinner/spinner';

const CrewTable = () => {
    const { crew, isPending, error } = useCrew();

    return (
        <div className="w-full max-w-md bg-zinc-900 border border-[#cea86f]/30 rounded-sm text-white font-[Jura]">
            <div className="px-6 py-4 border-b border-[#cea86f]/30">
                <h2 className="text-sm tracking-widest uppercase psp-text-gold">Crew roster</h2>
                <p className="text-zinc-400 text-xs mt-1">{crew.length} member{crew.length !== 1 ? 's' : ''} registered</p>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-zinc-700">
                            <th className="text-left px-6 py-3 text-[10px] tracking-widest uppercase text-[#cea86f]/70 font-normal w-12">
                                ID
                            </th>
                            <th className="text-left px-6 py-3 text-[10px] tracking-widest uppercase text-[#cea86f]/70 font-normal">
                                Name
                            </th>
                            <th className="text-left px-6 py-3 text-[10px] tracking-widest uppercase text-[#cea86f]/70 font-normal">
                                Email
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {isPending && (
                            <tr>
                                <td colSpan={3} className="px-6 py-8 text-center text-zinc-400">
                                    <Spinner className="animate-spin inline-block" />
                                </td>
                            </tr>
                        )}
                        {error && (
                            <tr>
                                <td colSpan={3} className="px-6 py-6 text-center text-red-400 text-xs">
                                    {error.message}
                                </td>
                            </tr>
                        )}
                        {!isPending && crew.length === 0 && (
                            <tr>
                                <td colSpan={3} className="px-6 py-6 text-center text-zinc-500 text-xs tracking-wide">
                                    No crew members yet
                                </td>
                            </tr>
                        )}
                        {crew.map((member, i) => (
                            <tr
                                key={member.id}
                                className={`border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors ${i === crew.length - 1 ? 'border-b-0' : ''}`}
                            >
                                <td className="px-6 py-3 text-zinc-400 text-xs tabular-nums">{member.id}</td>
                                <td className="px-6 py-3 text-white">{member.name ?? '—'}</td>
                                <td className="px-6 py-3 text-zinc-400 text-xs">{member.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CrewTable;
