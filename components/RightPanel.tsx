import Link from "next/link";



const RightPanel = () => {
    return (
        <section className="sticky top-[73px] h-fit w-full lg:w-[300px] px-4 sm:pr-0 lg:px-0">
            <ul className="bg-orange-50 border border-orange-400 rounded-sm">
                <li className="text-zinc-900">
                    <h4 className="text-[13px] font-semibold px-3 py-2 border-b border-amber-500">RULES</h4>
                    <ul className="text-sm px-3 py-2 space-y-1">
                        <li className="flex gap-2">
                           
                            <p>
                            Please ensure to use appropriate language within the community forum.
                                
                            </p>
                        </li>
                        <li className="flex gap-2">
                            
                            <p>
                            Always strive to contribute positively to the community forum by fostering a welcoming and inclusive environment.
                                
                            </p>
                        </li>
                    </ul>
                </li>
            </ul>
        </section>
    )
};

export default RightPanel;