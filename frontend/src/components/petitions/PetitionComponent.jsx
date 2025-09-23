export default function PetitionComponent({ petition, user, handleSignPetition, viewDetails, handleChangePetitionStatus }) {


    if (!user) return null;

    const isSigned = petition.signatures.some(sig => sig._id === user._id);
    const isAuthor = petition.author._id === user._id;
    const isPublic_officer = user.role === 'Public_officer';


    return (
        <div key={petition._id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 flex flex-col justify-between hover:shadow-lg hover:shadow-gray-400 transition-shadow">
            <div>
                <h3 className="font-bold text-lg mb-1">{petition.title}</h3>
                <p className="text-sm text-gray-500 mb-3">by {petition.author.name}</p>
                <p className="text-gray-600 mb-4 h-24 overflow-hidden text-ellipsis leading-relaxed">{petition.description}</p>
            </div>
            <div>
                <div className="text-sm font-semibold text-gray-700 mb-4">
                    <span className="font-bold">{petition.signatures.length}</span> of {petition.signatureGoal} signatures
                    {isPublic_officer ?
                        <select
                            onChange={(e) => handleChangePetitionStatus(petition._id, e.target.value)}
                            className={`ml-2 px-2 py-0.5 ${petition.status === "Active"
                                ? "text-green-800 bg-green-100"
                                : "bg-red-100 text-red-800"
                                } rounded-full text-xs font-semibold`}
                        >
                            <option value="Active">Active</option>
                            <option value="Closed">Closed</option>
                        </select>
                        :
                        <span className={`ml-2 px-2 py-0.5 ${(petition.status === "Active") ? "text-green-800 bg-green-100" : "bg-red-100 text-red-800"} rounded-full text-xs font-semibold`}>{petition.status}</span>}

                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2 mt-2">
                        <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: `${(petition.signatures.length / petition.signatureGoal) * 100}%` }}
                        ></div>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <button onClick={() => viewDetails(petition)} className="text-blue-600 font-semibold hover:underline text-sm">View Details</button>
                    {isSigned || isAuthor ? (
                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${isAuthor ? 'bg-gray-200 text-gray-700' : 'bg-green-200 text-green-800'}`}>
                            {isAuthor ? 'Author' : 'Signed'}
                        </span>
                    ) : (
                        <button onClick={() => handleSignPetition(petition._id)} className="bg-blue-100 text-blue-800 font-semibold px-4 py-1.5 rounded-md hover:bg-blue-200 text-sm cursor-pointer">Sign</button>
                    )}
                </div>
            </div>
        </div>
    )
}