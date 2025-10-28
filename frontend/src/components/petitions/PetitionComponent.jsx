import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';

function CommentText({ text }) {
    const [expanded, setExpanded] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const pRef = useRef(null);

    useEffect(() => {
        const el = pRef.current;
        if (el) {
            // Calculate based on line-height and number of lines (2 in this case)
            const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
            const maxHeight = lineHeight * 2;
            // Check if the actual scroll height exceeds the max height
            // Adding a small buffer (e.g., 2px) can help with rounding issues
            setIsOverflowing(el.scrollHeight > maxHeight + 2);
        }
    }, [text]); // Re-run when text changes

    return (
        <div>
            <p
                ref={pRef}
                // Apply max-height based on lines (e.g., max-h-[3rem] for 2 lines if line-height is 1.5rem)
                // Use `max-h-none` when expanded
                className={`text-gray-700 leading-6 overflow-hidden transition-all duration-300 ${expanded ? "max-h-none" : "max-h-[3rem]" // Adjust max-h based on your line-height * 2
                    }`}
            >
                {text}
            </p>
            {/* Show button only if text is overflowing */}
            {isOverflowing && (
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-blue-500 text-xs mt-1"
                >
                    {expanded ? "Read less" : "Read more"}
                </button>
            )}
        </div>
    );
}

{ /* Upvote/Downvote and Reply Buttons */ }
const Upvote_Downvote_Reply = ({ comment, setOpenReply, activeReply, setActiveReply, petition, handleReplySubmit, handelVoteSubmit, replyText, setReplyText }) => {
    const { user } = useAuth(); // Use auth context to get current user

    // Handle vote submission, preventing duplicate votes
    const handelVote = (type) => {
        if (!user) return; // Need user to vote

        const userId = user._id;
        const alreadyUpvoted = comment.upVote?.includes(userId);
        const alreadyDownvoted = comment.downVote?.includes(userId);

        if (type === "up" && !alreadyUpvoted) {
            handelVoteSubmit(comment._id, type);
        } else if (type === "down" && !alreadyDownvoted) {
            handelVoteSubmit(comment._id, type);
        }
        // Optionally handle unvoting by calling handelVoteSubmit with a 'none' type or similar
    };


    return <>
        <div className='flex flex-wrap items-stretch mt-2 gap-2'>
            <div className='flex shadow-sm rounded-xl bg-white h-full'>
                {/* Upvote Button */}
                 <button onClick={() => handelVote("up")} className="px-2 py-1 border-r-2 border-gray-100 focus:outline-none cursor-pointer flex items-center disabled:opacity-50" disabled={!user}>
                     {/* Check if current user._id is in the upVote array */}
                    {comment?.upVote && comment.upVote.includes(user?._id) ?
                        <i className="fa-solid fa-thumbs-up text-blue-600"></i> : <i className="fa-regular fa-thumbs-up text-gray-600"></i>}
                    <span className="text-xs text-gray-500 ml-1">{comment?.upVote?.length || 0}</span>
                </button>

                {/* Downvote Button */}
                <button onClick={() => handelVote("down")} className="px-2 py-1 focus:outline-none cursor-pointer flex items-center disabled:opacity-50" disabled={!user}>
                     {/* Check if current user._id is in the downVote array */}
                    {comment?.downVote && comment.downVote.includes(user?._id) ?
                        <i className="fa-solid fa-thumbs-down text-red-500"></i> : <i className="fa-regular fa-thumbs-down text-gray-600"></i>}
                    <span className="text-xs text-gray-500 ml-1">{comment?.downVote?.length || 0}</span>
                </button>
            </div>

            {/* Toggle Replies Visibility Button */}
            {setOpenReply && comment.reply?.length > 0 && <button
                onClick={() => setOpenReply((currentOpenId)=> currentOpenId === comment._id ? null : comment._id)} // Toggle based on ID
                className="px-2.5 bg-white rounded-xl shadow-sm text-xs text-gray-600/90 cursor-pointer">
                <i className="fa-regular fa-comment-dots mr-1"></i>{comment.reply?.length}</button>}

            {/* Reply Button (only if petition is not closed and user is logged in) */}
            {petition && petition.status !== "Closed" && user &&
                <button
                    onClick={() =>
                        setActiveReply(activeReply === comment._id ? null : comment._id) // Toggle based on ID
                    }
                    className="px-2 py-1 bg-white rounded-xl shadow-sm text-xs text-blue-600 cursor-pointer h-full flex items-center"
                >
                    <i className="fa-solid mr-1 fa-reply"></i>
                    {activeReply === comment._id ? "Cancel" : "Reply"}
                </button>}
        </div>
        {/* Reply Input Box */}
        {
            activeReply === comment._id && (
                <div className="mt-2 flex items-center space-x-2"> {/* Use flex for alignment */}
                    <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write a reply..."
                        className="flex-1 border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" // Use flex-1
                    />
                    <button
                        onClick={() => handleReplySubmit(comment._id)}
                        disabled={!replyText.trim()} // Disable if input is empty
                        className="bg-blue-500 text-white text-xs px-3 py-1.5 cursor-pointer rounded-md hover:bg-blue-600 disabled:bg-gray-400" >
                        Send
                    </button>
                </div>
            )
        }
    </>
}

// --- Petition Details Modal Component ---
const PetitionDetailsModal = ({ isOpen, onClose, petition, onCommentAdded }) => {
    const [newComment, setNewComment] = useState("");
    const [comments, setComments] = useState([]);
    const [loadingComment, setLoadingComment] = useState(false);
    const [error, setError] = useState("");
    const { user: currentUser, token } = useAuth(); // Renamed to avoid conflict
    const [activeReply, setActiveReply] = useState(null); // ID of comment being replied to
    const [openReply, setOpenReply] = useState(null); // ID of comment whose replies are shown
    const [replyText, setReplyText] = useState("")

    const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

     // Helper function to safely get user name, providing a default
    const getUserName = (userObject) => {
        if (!userObject) return "User"; // Handle null/undefined case
        if (typeof userObject === 'object' && userObject.name) {
            return userObject.name; // Return name if object structure is correct
        }
        // Add more checks if needed (e.g., if userObject might just be an ID string)
        return "User"; // Fallback for empty object {} or unexpected types
    }

    // Update internal comments state when the petition prop changes
    useEffect(() => {
        if (petition) {
            // Ensure comments is always an array
            setComments(Array.isArray(petition.comments) ? petition.comments : []);
        }
    }, [petition]);


    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setLoadingComment(true);
        setError("");

        try {
            const response = await fetch(`${API_URL}/api/petitions/${petition._id}/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token // Ensure token is passed
                },
                body: JSON.stringify({ text: newComment }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.msg || 'Failed to post comment.');

            // Pass the entire updated petition back to the parent component
            // which should update its state, causing this modal to re-render with new comments
            onCommentAdded(data);
            setNewComment(""); // Clear input after successful submission
        } catch (err) {
            setError(err.message);
        } finally {
            setLoadingComment(false);
        }
    };

    const handelVoteSubmit = async (commentId, type) => {
        if (!currentUser) return; // Need user to vote
        try {
            const response = await fetch(`${API_URL}/api/petitions/${petition._id}/comment/vote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token // Ensure token is passed
                },
                body: JSON.stringify({ commentId, type }),
            });
            const updatedCommentData = await response.json(); // Backend should return the updated comment/reply
            if (!response.ok) throw new Error(updatedCommentData.msg || 'Failed to vote on comment.');

            // Update the specific comment or reply in the local state
            setComments(prevComments => {
                const updateVotes = (comment) => {
                     // Check if this is the comment/reply that was updated
                    if (comment._id === updatedCommentData._id) {
                        return { ...comment, upVote: updatedCommentData.upVote, downVote: updatedCommentData.downVote };
                    }
                     // Recursively check replies if this comment has them
                    if (comment.reply && comment.reply.length > 0) {
                        return { ...comment, reply: comment.reply.map(updateVotes) };
                    }
                    return comment; // Return unchanged if not the target
                };
                 // Map through top-level comments and apply the update logic
                return prevComments.map(updateVotes);
            });

        } catch (err) {
            console.error("Error voting on comment:", err);
            setError(`Voting failed: ${err.message}`); // Show error to user
        }
    }

    const handleReplySubmit = async (parentCommentId) => {
        if (!replyText.trim() || !currentUser) return; // Need text and user

        try {
            const response = await fetch(`${API_URL}/api/petitions/${petition._id}/comment/reply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token // Ensure token is passed
                },
                // Send parentCommentId in the body as expected by backend
                body: JSON.stringify({ text: replyText, parentCommentId: parentCommentId }),
            });
            const updatedPetitionData = await response.json(); // Expecting full updated petition
            if (!response.ok) throw new Error(updatedPetitionData.msg || 'Failed to post reply.');

            // Update the comments state with the new data from the petition
             if (updatedPetitionData && Array.isArray(updatedPetitionData.comments)) {
                 setComments(updatedPetitionData.comments);
             } else {
                 // Fallback: Manually add if backend doesn't return full petition (less ideal)
                 console.warn("Backend did not return full petition on reply, attempting manual update.");
                 // This manual update is complex and prone to errors if backend structure changes.
                 // It's better if the backend returns the fully populated petition.
             }

            setActiveReply(null); // Close the reply input
            setReplyText("");    // Clear the reply input
            setOpenReply(parentCommentId); // Ensure the replies for this comment are open
        } catch (err) {
            console.error("Error adding reply:", err);
             setError(`Replying failed: ${err.message}`); // Show error
        }
    };


    // Utility to format date nicely
    const timeAgo = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const diff = Date.now() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        if (minutes < 1) return "Just now";
        if (minutes < 60) return `${minutes} min ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} hr ago`;
        const days = Math.floor(hours / 24);
        if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`; // Use ~30 days for month cutoff
        const months = Math.floor(days / 30);
        if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
        const years = Math.floor(days / 365);
        return `${years} year${years > 1 ? "s" : ""} ago`;
    };


    // Don't render if not open or petition data is missing
    if (!isOpen || !petition) return null;

    // Safely get author name
    const authorName = getUserName(petition.author);

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-2 sm:p-4">
            {/* Modal Container */}
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl relative border border-black flex flex-col max-h-[90vh]">
                {/* Close Button */}
                <button onClick={onClose} className="absolute top-4 right-4 px-2 pb-1 transition text-gray-400 hover:text-white rounded-md hover:bg-red-600 text-3xl font-light cursor-pointer z-10">&times;</button>

                {/* Scrollable Content Area */}
                <div className="overflow-y-auto p-8">
                    {/* Petition Header */}
                    <h2 className="text-3xl font-bold mb-2">{petition.title || 'Untitled Petition'}</h2>
                    <div className='flex flex-wrap justify-between items-center border-b pb-3 mb-4 text-sm sm:text-base'>
                        <p className="text-gray-900 mb-1">by <b>{authorName}</b></p>
                        <p className="text-gray-700 mb-1"><span className="font-semibold">Category:</span> {petition.category || 'N/A'}</p>
                    </div>

                    {/* Petition Description */}
                    <p className=" whitespace-pre-wrap leading-relaxed pb-3 mb-4 border-b border-gray-300">{petition.description || 'No description.'}</p>

                    {/* Petition Meta Info */}
                    <div className="flex justify-between items-center text-sm text-gray-500 mb-6">
                        <span className='font-semibold'>Created: {petition.date ? new Date(petition.date).toLocaleDateString() : 'Unknown'}</span>
                        <span
                            className={`px-3 py-1 rounded-full font-bold text-xs ${petition.status === "Active"
                                ? "bg-green-100 text-green-800"
                                : petition.status === "Under_Review" // Check for Under_Review explicitly
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800" // Default to Closed style otherwise
                                }`}
                        >
                            {petition.status || 'Unknown'}
                        </span>
                    </div>

                    {/* --- COMMENT SECTION --- */}
                    {/* Only show if onCommentAdded handler is provided (implies commenting is enabled) */}
                    {onCommentAdded && (
                        <div className="border-t border-gray-300 pt-6">
                            <h3 className="text-xl font-bold mb-4">Comments ({Array.isArray(comments) ? comments.length : 0})</h3>

                            {/* Comment Form (only if petition not closed and user logged in) */}
                            {petition.status !== "Closed" && currentUser && (
                                <form onSubmit={handleCommentSubmit} className="mb-6">
                                    <textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Add your comment..."
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400"
                                        rows="3"
                                    ></textarea>
                                    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                                    <button
                                        type="submit"
                                        disabled={loadingComment || !newComment.trim()}
                                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 cursor-pointer disabled:cursor-not-allowed"
                                    >
                                        {loadingComment ? "Posting..." : "Post Comment"}
                                    </button>
                                </form>
                            )}
                            {/* Show message if logged out and commenting enabled */}
                             {!currentUser && petition.status !== "Closed" && (
                                <p className="text-gray-500 text-sm mb-4">Please log in to comment.</p>
                             )}


                            {/* Comment List */}
                            <div className="space-y-4">
                                {Array.isArray(comments) && comments.length > 0 ? (
                                    // Use slice().reverse() to show newest first without mutating original array
                                    comments.slice().reverse().map((comment) => (
                                        <div key={comment._id} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                            {/* Comment Header */}
                                            <div>
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="font-semibold text-gray-800">{getUserName(comment.user)}</span>
                                                    <span className="text-xs text-gray-500">{timeAgo(comment.date)}</span>
                                                </div>
                                                {/* Comment Text (using component for read more) */}
                                                <CommentText text={comment.text || ''}/>
                                            </div>

                                            {/* Actions (Vote, Reply) */}
                                            <Upvote_Downvote_Reply
                                                comment={comment}
                                                setOpenReply={setOpenReply} // Pass handler to toggle replies visibility
                                                activeReply={activeReply} // Pass ID of comment being replied to
                                                setActiveReply={setActiveReply} // Pass handler to set active reply
                                                petition={petition} // Pass petition for status check
                                                handleReplySubmit={handleReplySubmit} // Pass reply submit handler
                                                handelVoteSubmit={handelVoteSubmit} // Pass vote handler
                                                replyText={replyText} // Pass current reply text
                                                setReplyText={setReplyText} // Pass handler to update reply text
                                            />

                                            {/* Replies Section (conditionally rendered) */}
                                            {openReply === comment._id && Array.isArray(comment.reply) && comment.reply.length > 0 && (
                                                <div className="mt-3 pl-4 border-l-2 border-gray-300 space-y-2"> {/* Added space-y-2 */}
                                                    {comment.reply.slice().reverse().map((reply) => ( // Show newest replies first
                                                        <div key={reply._id} className="bg-gray-100 p-2 rounded-lg border border-gray-200">
                                                            {/* Reply Header */}
                                                            <div className="flex justify-between items-center mb-1">
                                                                <span className="font-semibold text-gray-800">{getUserName(reply.user)}</span>
                                                                <span className="text-xs text-gray-500">{timeAgo(reply.date)}</span>
                                                            </div>
                                                            {/* Reply Text */}
                                                            <CommentText text={reply.text || ''}/>
                                                             {/* Reply Actions (Vote only) */}
                                                             <Upvote_Downvote_Reply comment={reply} handelVoteSubmit={handelVoteSubmit} />

                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (petition.status !== "Closed" && // Only show "no comments" if petition is open
                                    <p className="text-gray-500">No comments yet. Be the first to comment!</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


// --- Main Petition Component ---
export default function PetitionComponent({ petition, user, token, handleSignPetition, handleChangePetitionStatus, handleDelete, handleEdit, handleCommentAdded }) {

    const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);

    // --- START: SAFETY CHECKS ---
    // Early return if essential data is missing to prevent rendering errors
    if (!petition || !user) {
         // Log warning for debugging, you might remove this in production
         console.warn("Petition or user data missing for PetitionComponent, skipping render.", { petition, user });
         // Render nothing or a placeholder/error message
         return null; // Or return a placeholder div
    }

    // Safely check array properties and author object
    const signaturesArray = Array.isArray(petition.signatures) ? petition.signatures : [];
    const isSigned = signaturesArray.some(sig => sig?._id === user._id); // Check sig._id existence
    const isAuthor = petition.author && petition.author._id === user._id; // Check author exists
    const isPublic_officer = user.role === 'Public_officer';

    // Safely access potentially missing numeric/string properties with defaults
    const signatureCount = signaturesArray.length;
    const signatureGoal = typeof petition.signatureGoal === 'number' && petition.signatureGoal > 0 ? petition.signatureGoal : 100; // Default goal if invalid
    const signaturePercentage = Math.min(100, (signatureCount / signatureGoal) * 100);
    const petitionStatus = petition.status || 'Active'; // Default status
    const petitionTitle = petition.title || 'Untitled Petition';
    const petitionDescription = petition.description || 'No description provided.';
    // --- END: SAFETY CHECKS ---


    return (
        <>
            <PetitionDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => setDetailsModalOpen(false)}
                petition={petition}
                // user and token are available via useAuth in the modal
                onCommentAdded={handleCommentAdded} // Pass handler for updating comments
            />
            {/* --- CARD CONTAINER --- */}
            <div className="bg-[#a8e6f4] border border-gray-200 rounded-3xl shadow-sm p-5 flex flex-col w-full justify-between hover:shadow-lg hover:shadow-gray-400 hover:border-gray-600 transition-shadow duration-200">
                {/* --- TOP SECTION: Title, Description, Edit/Delete --- */}
                <div>
                    {/* Edit/Delete Icons for Author */}
                    {isAuthor && (handleEdit || handleDelete) && (
                        <div className="flex justify-end space-x-4 mb-1 -mt-2 -mr-1"> {/* Adjust margin */}
                            {handleEdit && (
                                <button onClick={() => handleEdit(petition)} className="text-gray-600 hover:text-blue-600 cursor-pointer p-1">
                                    <i className="fa-solid fa-pencil text-xs"></i> {/* Smaller icon */}
                                </button>
                            )}
                            {handleDelete && (
                                <button onClick={() => handleDelete(petition._id)} className="text-red-500 hover:text-red-700 cursor-pointer p-1">
                                    <i className="fa-solid fa-trash text-xs"></i> {/* Smaller icon */}
                                </button>
                            )}
                        </div>
                    )}
                     {/* Title */}
                    <h3 className="font-bold text-lg mb-1">{petitionTitle}</h3>
                     {/* Description (Clamped) */}
                    <p className="text-gray-600 mb-4 h-[4.5rem] leading-relaxed line-clamp-3 overflow-hidden">{petitionDescription}</p> {/* Set fixed height */}
                </div>

                {/* --- BOTTOM SECTION: Signatures, Status, Actions --- */}
                <div>
                    {/* Signature Progress */}
                    <div className="text-sm font-semibold text-gray-700 mb-4">
                        <div className='flex justify-between items-center'> {/* Use items-center */}
                            {/* Signature Count */}
                            <div>
                                <span className="font-bold">{signatureCount}</span> of {signatureGoal} signatures
                            </div>
                            {/* Status Indicator / Selector */}
                            <div>
                                {isPublic_officer && handleChangePetitionStatus ? (
                                    <select
                                        value={petitionStatus} // Controlled component with fallback
                                        onChange={(e) => handleChangePetitionStatus(petition, e.target.value)}
                                         // Dynamic background/text colors based on status
                                        className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold cursor-pointer border focus:outline-none focus:ring-1 focus:ring-blue-400 ${
                                            petitionStatus === "Active" ? "bg-green-100 text-green-800 border-green-300"
                                            : petitionStatus === "Under_Review" ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                                            : "bg-red-100 text-red-800 border-red-300" // Default/Closed
                                        }`}
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Under_Review">Under Review</option>
                                        <option value="Closed">Closed</option>
                                    </select>
                                ) : (
                                    // Static Status Badge
                                     <span className={`ml-2 px-2 py-0.5 text-xs rounded-full font-semibold ${
                                        petitionStatus === "Active" ? "bg-green-100 text-green-800"
                                        : petitionStatus === "Under_Review" ? "bg-yellow-100 text-yellow-800"
                                        : "bg-red-100 text-red-800" // Default/Closed
                                    }`}>{petitionStatus}</span>
                                )}
                            </div>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                            <div
                                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${signaturePercentage}%` }}
                            ></div>
                        </div>
                    </div>
                     {/* Action Buttons */}
                    <div className="flex justify-between items-center mt-2">
                         {/* View Details Button */}
                        <button onClick={() => setDetailsModalOpen(true)} className="text-blue-600 font-semibold hover:underline text-sm cursor-pointer">View Details</button>
                         {/* Sign Button or Status Badge */}
                        {isSigned || isAuthor ? (
                            // Show 'Author' or 'Signed' badge
                            <span className={`px-3 py-1 text-xs font-bold rounded-full ${isAuthor ? 'bg-gray-200 text-gray-700' : 'bg-green-100 text-green-800'}`}>
                                {isAuthor ? 'Author' : 'Signed'}
                            </span>
                        ) : (
                            // Show 'Sign Petition' button if handler exists and petition is not closed
                            handleSignPetition && (
                                <button
                                    disabled={petitionStatus === "Closed"} // Use safe status
                                    onClick={() => handleSignPetition(petition._id)}
                                    className={`bg-blue-50 font-semibold px-3 py-1 rounded-full hover:bg-blue-200 text-xs transition duration-200 ${petitionStatus === "Closed" ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}>
                                    Sign Petition
                                </button>
                            )
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}