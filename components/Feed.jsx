"use client";

import { useState, useEffect } from "react";
import PromptCard from "./PromptCard";
import LoadingDots from "./LoadingDots";

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  );
};

const Feed = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState([]);

  const fetchPosts = async () => {
    try {
      setIsLoading(true); // Start loading
      const response = await fetch("/api/prompt");
      const data = await response.json();
      setAllPosts(data.reverse()); // Reverse the order of posts
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filterPrompts = (searchtext) => {
    const regex = new RegExp(searchtext, "i"); // 'i' flag for case-insensitive search
    return allPosts.filter(
      (item) =>
        regex.test(item.creator.username) ||
        regex.test(item.tag) ||
        regex.test(item.prompt)
    );
  };

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    // debounce method
    setSearchTimeout(
      setTimeout(() => {
        const searchResult = filterPrompts(e.target.value);
        setSearchedResults(searchResult);
      }, 500)
    );
  };

  const handleTagClick = (tagName) => {
    setSearchText(tagName);

    const searchResult = filterPrompts(tagName);
    setSearchedResults(searchResult);
  };

  return (
    <section className="feed">
      {isLoading ? (
        // Loading screen
        <LoadingDots />
      ) : (
        <>
          <form className="relative w-full flex-center">
            <input
              type="text"
              placeholder="Search for a tag or a username"
              value={searchText}
              onChange={handleSearchChange}
              required
              className="search_input peer"
            />
          </form>

          {/* All Prompts */}
          {searchText ? (
            <PromptCardList
              data={searchedResults}
              handleTagClick={handleTagClick}
            />
          ) : (
            <>
              <h1 className="text-left text-4xl font-bold text-black mt-5">
                Recent Posts:
              </h1>
              <PromptCardList data={allPosts} handleTagClick={handleTagClick} />
            </>
          )}
        </>
      )}
    </section>
  );
};

export default Feed;
