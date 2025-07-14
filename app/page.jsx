import Feed from "@components/Feed";

const Home = () => (
  <section className="w-full flex-center flex-col">
    <h1 className="head_text text-center">
      <span className="text-[#f8a124]">Discover</span> And{" "}
      <span className="text-[#e74133]">Share</span>
      <br className="max-md:hidden" />
      <span className="orange_gradient text-center">
        {" "}
        Ideas, Thoughts and, Prompts
      </span>
    </h1>
    <p className="desc text-center">
      Welcome to <strong>KavyaPosts. </strong>
      <strong>Sign In</strong> to your google account, Click the{" "}
      <strong>Profile</strong> picture {"(on phone and tablets)"}, Select
      <strong> Create Post </strong> and start sharing your posts and ideas💡!
    </p>

    <Feed />
  </section>
);

export default Home;
