
function Home() {

    const categories = ['All Categories', 'Environment', 'Infrastructure', 'Education', 'Public Safety', 'Transportation', 'Healthcare', 'Housing'];

    return (
        <div className="pt-22 md:pt-25 p-2 md:px-10 lg:px-40 bg-gradient-to-b from-sky-200 to-gray-500 min-h-screen">

            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <h1 className="text-xl font-semibold italic">
                    welcome back, <span className="font-bold">Sri!</span>
                </h1>
                <p className="text-gray-600 mt-2">
                    See what's happening in your community and make your voice heard.
                </p>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">

                <div className="bg-white rounded-lg shadow p-4 text-center">
                    <h2 className="text-2xl font-bold">0</h2>
                    <p className="text-gray-700">My Petitions</p>
                </div>

                <div className="bg-white rounded-lg shadow p-4 text-center">
                    <h2 className="text-2xl font-bold">0</h2>
                    <p className="text-gray-700">Successful Petitions</p>
                    <p className="text-sm text-gray-400">or under review</p>
                </div>

                <div className="bg-white rounded-lg shadow p-4 text-center">
                    <h2 className="text-2xl font-bold">0</h2>
                    <p className="text-gray-700">Polls Created</p>
                </div>
            </div>

            {/* Active Petitions */}
            <div className="flex justify-between items-center mb-4 p-4">
                <h2 className="text-lg font-semibold">Active Petitions Near You</h2>

                <p className="text-gray-900 text-md flex">Showing for:
                    <span className="bg-gray-500 font-semibold  px-2.5 rounded-lg ml-1">san Diego, CA
                    </span></p>
            </div>
            <div className=" flex flex-wrap gap-4" >
                {categories.map((categori) =>
                    (<div className="border bg-white rounded-2xl px-4 py-1 text-center " key={categori}>{categori}</div>)
                )}
            </div>
        </div>
    )
}

export default Home;