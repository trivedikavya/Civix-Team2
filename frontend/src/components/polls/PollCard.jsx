import EditPoll from "./EditPoll";
import { useState } from "react";

const PollCard = ({ poll, user, handleVote, handleDeletePoll, handleEdit }) => {

    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const isAuthor = poll.createdBy._id === user._id || poll.createdBy === user._id;
    const userVote = poll.voters.includes(user._id);
    const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
    const authorName = typeof poll.createdBy === 'object' ? poll.createdBy.name : poll.createdBy;
    const isClosed = new Date(poll.closedAt) < new Date();


    return (
        <>
            <EditPoll isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} poll={poll} handleEdit={handleEdit} />
            <div className="bg-[#a8e6f4] border border-gray-200 rounded-3xl shadow-sm p-5 flex flex-col w-full justify-between hover:shadow-lg hover:shadow-gray-400 hover:border-gray-600 transition-transform hover:scale-102 scale-100 duration-200">

                <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600 font-semibold mb-2">
                        Posted by {isAuthor ? "You" : authorName}
                    </p>

                    <div className="flex items-center space-x-3">
                        {/* Check icon with tooltip */}
                        {userVote && (
                            <div className="relative group">
                                <i className="fa-regular fa-circle-check text-green-700 text-lg cursor-pointer"></i>

                                {/* Tooltip */}
                                <span className="absolute right-0 top-6 bg-gray-800 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                                    You voted
                                </span>
                            </div>
                        )}
                        {isAuthor && handleDeletePoll && (<>
                             <button onClick={() => setEditModalOpen(true)} className="text-gray-600 hover:text-blue-600 cursor-pointer">
                                    <i className="fa-solid fa-pencil"></i>
                                </button>
                            <div className="relative group">
                               
                                <button
                                    onClick={() => handleDeletePoll(poll._id)}
                                    className="text-red-500 hover:text-red-700
                 transition-all duration-200 transform hover:scale-110  cursor-pointer p-2"
                                >
                                    <i className="fa-solid fa-trash text-lg"></i>
                                </button>

                                {/* Tooltip */}
                                <span className="absolute right-0 top-9 bg-gray-800 text-white text-xs 
                     rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 
                     transition-opacity duration-200 pointer-events-none 
                     whitespace-nowrap">
                                    Delete poll
                                </span>
                            </div>
                        </>)}
                    </div>
                </div>

                <h3 className="font-bold text-xl text-gray-800">{poll.title}</h3>
                {poll.description && <p className="text-gray-600 mt-2 text-sm">{poll.description}</p>}

                <div className="space-y-3 mt-4">
                    {poll.options.map((option, index) => {
                        const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;

                        return (
                            <div key={index}>
                                {isClosed || userVote ? (
                                    <div className="relative rounded-2xl p-2 bg-white overflow-hidden">
                                        <div
                                            className="absolute top-0 left-0 h-full bg-gray-400/80 rounded-2xl"
                                            style={{ width: `${percentage}%`, transition: 'width 0.5s ease-in-out' }}

                                        ></div>
                                        <div className="relative flex justify-between font-semibold pl-2 pb-1">
                                            <span>{option.optionText}</span>
                                            <span className="text-gray-700">{percentage.toFixed(0)}%</span>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => handleVote(poll._id, index)}
                                        className="relative rounded-2xl p-2 bg-white overflow-hidden w-full cursor-pointer"
                                    >
                                        <div
                                            className="absolute top-0 left-0 h-full bg-gray-400/80 rounded-2xl"
                                            style={{ width: `${percentage}%`, transition: 'width 1s ease-in-out' }}

                                        ></div>
                                        <div className="relative flex justify-between font-semibold pl-2 pb-1">
                                            <span>{option.optionText}</span>
                                            <span className="text-gray-700">{percentage.toFixed(0)}%</span>
                                        </div>
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
                <div className="flex justify-between font-semibold text-sm mt-4">
                    <div className="flex flex-col">
                        {/* Closing date */}
                        <span className="text-gray-700">
                            {new Date(poll.closedAt) >= new Date() ? "🟢 " : "🔴 "}
                            Closing Date:{" "}
                            {new Date(poll.closedAt).toLocaleDateString("en-IN", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                            })}
                        </span>
                    </div>
                    <p className=" text-gray-500">{totalVotes} votes</p>
                </div>
            </div>
        </>
    );
};

export default PollCard;
