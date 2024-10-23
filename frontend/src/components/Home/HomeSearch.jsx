import axios from "axios";
import React, { useState } from "react";
import { useSelector } from "react-redux"; // Import useSelector to access Redux state
import { useNavigate } from "react-router";

const HomeSearch = () => {
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  const [searchDisabled, setSearchDisabled] = useState(true);

  // Access dark mode state from Redux
  const isDarkMode = useSelector((state) => state.mode.value);

  const search = () => {
    setResults([]);
    setShowResults(false);
    navigate(`/home/videos/search/${query}`);
  };

  const getSearchResults = async () => {
    try {
      const res = await axios.post("/api/v1/videos/search", { query: query });
      setResults(res.data.data);
      setShowResults(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    if (e.target.value.length === 0) {
      setQuery("");
      setSearchDisabled(true);
      setShowResults(false);
      return;
    }
    setSearchDisabled(false);
    setShowResults(false);
    setQuery(e.target.value);
    getSearchResults();
  };

  const clearQuery = () => {
    setQuery("");
    setSearchDisabled(true);
    setShowResults(false);
  };

  // Define styles based on dark mode
  const containerStyle = isDarkMode ? "bg-gray-900" : "";
  const inputStyle = isDarkMode
    ? "bg-gradient-to-r from-gray-800 to-gray-700 text-white border-gray-600"
    : "bg-gradient-to-r from-white to-gray-100 text-gray-700 border-gray-300";
  const resultsContainerStyle = isDarkMode
    ? "bg-gray-800 border-gray-600 text-gray-300"
    : "bg-white border-gray-300 text-gray-700";
  const resultItemStyle = isDarkMode
    ? "hover:bg-gray-700 text-gray-300"
    : "hover:bg-blue-50 text-gray-700";

  return (
    <div className={`relative w-full max-w-lg mx-auto  `}>
      {/* Search Input */}
      <div className="flex items-center justify-center gap-5 max-[972px]:mt-20">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={handleChange}
            placeholder="Search for videos..."
            className={`w-full p-4 border rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 ease-in-out ${inputStyle}`}
          />

          {/* Clear Button */}
          {query && (
            <div
              className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer transition duration-200 ease-in-out"
              size={24}
              onClick={clearQuery}
            >
              <i class="fa-solid fa-c"></i>
            </div>
          )}
        </div>
        <button
          className="px-8 py-4 bg-blue-700 rounded-full grid place-items-center"
          onClick={search}
          disabled={searchDisabled}
        >
          Search
        </button>
      </div>

      {/* Results Wrapper */}
      {showResults && (
        <div
          className={`absolute top-full left-0 w-full mt-2 border rounded-lg shadow-lg max-h-60 overflow-y-auto z-10 transition-all duration-300 ease-in-out ${resultsContainerStyle}`}
        >
          {results.length > 0 ? (
            results.map((result, index) => (
              <div
                key={index}
                className={`p-4 cursor-pointer border-b last:border-b-0 transition-all duration-200 ease-in-out ${resultItemStyle}`}
                onClick={() => setQuery(result)}
              >
                {result}
              </div>
            ))
          ) : (
            <div className="p-4 text-gray-500">No results found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default HomeSearch;
