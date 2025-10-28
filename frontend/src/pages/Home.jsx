import React from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Home = () => {
  const { user } = useAuth();
  return (
    <div className="container relative">
      {/* <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-primary text-glow">
                Welcome to Code++
            </h1>
            <p className="text-lg text-muted-foreground">
                The ultimate platform for honing your coding skills.
            </p>
            {user ? (
                <div className="mt-8">
                    <p className="text-lg">You are logged in. Let the coding challenges begin!</p>
                    <Link to="/questions" className="mt-4 inline-block bg-primary text-primary-foreground px-8 py-3 rounded-md font-semibold hover:bg-primary/90 transition-colors text-lg">
                        Browse Problems
                    </Link>
                </div>
            ) : (
                <div className="mt-8">
                    <Link to="/login" className="bg-primary text-primary-foreground px-8 py-3 rounded-md font-semibold hover:bg-primary/90 transition-colors text-lg">
                        Get Started
                    </Link>
                </div>
            )} */}
      <img
        src="./images/13.svg"
        alt=""
        className="absolute z-10 left-[50%] top-[10]"
      />
      <img
        src="./images/1.svg"
        alt=""
        className="absolute z-10 left-[50%] bottom-[0]"
      />
      <img
        src="./images/16.svg"
        alt=""
        className="absolute z-10 left-[30%] bottom-[4rem]"
      />{" "}
      <p className="text-white italic font-poppinsthinitalic text-[6rem] absolute top-[4rem] left-10">
        Here coders{" "}
      </p>
      <p className="bg-my-custom-gradient tracking-tight bg-clip-text text-transparent font-poppinsbold text-[23rem] ms-3  ">
        evolve
      </p>
      <p className="font-poppinsthinitalic text-gray-200 absolute bottom-[5rem] left-10 text-[1.7rem]">
        Think beyond syntax
      </p>
      {/* vghj */}
    </div>
  );
};

export default Home;
