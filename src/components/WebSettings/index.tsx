import CrewTable from '../CrewTable';
import SignupForm from '../SignupForm';

const WebSettings = () => {
    return (
        <div className='w-full flex items-center justify-center'>
            <div className="p-4 md:p-6 overflow-y-auto h-full font-[Jura]">
                <h1 className="text-2xl psp-text-gold mb-6 tracking-wide">Web settings</h1>
                <section className="flex flex-col gap-3">
                    <h2 className="text-[10px] tracking-widest uppercase text-zinc-400">Crew management</h2>
                    <div className="flex flex-col md:flex-row gap-6">
                        <SignupForm />
                        <CrewTable />
                    </div>
                </section>
            </div>
        </div>
    );
};

export default WebSettings;
