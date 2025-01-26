"use client";

import React, { useState } from "react";
import {
  FaArrowRight,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaGithub,
} from "react-icons/fa";

const Card = ({ title, imageUrl, color }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative w-[500px] h-[200px] bg-white overflow-hidden mb-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute top-[-10px] left-8 w-4 h-4 rounded-full bg-[#E6E5E1] z-10"></div>
      <div className="absolute bottom-[-10px] left-8 w-4 h-4 rounded-full bg-[#E6E5E1] z-10"></div>
      <ul className="absolute left-[39px] top-[5px] z-10">
        {[...Array(23)].map((_, i) => (
          <li key={i} className="w-0.5 h-0.5 rounded-full bg-[#E6E5E1] my-1.5"></li>
        ))}
      </ul>
      <h2 className="absolute bottom-0 right-[130px] text-6xl font-bold text-white z-10 pointer-events-none">
        {title}
      </h2>
      <FaArrowRight className="absolute right-[75px] bottom-[25px] text-4xl cursor-pointer z-20" />
      <p
        className={`absolute top-5 right-[70px] text-xs tracking-wider writing-vertical-lr transition-all duration-200 z-10 ${
          isHovered ? "text-white" : "text-gray-700 opacity-70"
        }`}
      >
        a lonely trip.
      </p>
      <div
        className={`w-[400px] h-[200px] bg-cover transition-all duration-300 ${
          isHovered ? "filter-none" : "grayscale"
        }`}
        style={{ backgroundImage: `url(${imageUrl})` }}
      ></div>
      <div className="absolute left-[60px] top-0 flex justify-around items-center w-[180px] h-16 z-10">
        {[FaFacebookF, FaTwitter, FaInstagram, FaGithub].map((Icon, index) => (
          <Icon
            key={index}
            className={`text-lg text-white transition-all duration-200 ${
              isHovered ? "opacity-100 scale-100" : "opacity-0 scale-10"
            }`}
            style={{ transitionDelay: `${0.4 - index * 0.1}s` }}
          />
        ))}
      </div>
      <button
        className={`absolute right-3.5 bottom-3.5 w-[30px] h-[30px] rounded-full border-none cursor-pointer outline-none transition-all duration-300 mix-blend-hard-light ${
          isHovered ? "scale-[16.5]" : ""
        }`}
        style={{ backgroundColor: color }}
      ></button>
    </div>
  );
};

const CardAnimation = (title , imageUrl) => {
  return (
    <div className="w-full h-screen bg-[#E6E5E1] flex justify-center items-center flex-col">
      <Card
        title="North"
        imageUrl="https://images.unsplash.com/photo-1525543907410-b2562b6796d6?ixlib=rb-0.3.5&s=9ff8e5e718a6a40cbd0e1471235912f4&auto=format&fit=crop&w=3452&q=80"
        color="#DA4D1D"
      />
      {/* <Card
        title="Vauxhall"
        imageUrl="https://images.unsplash.com/photo-1528785198459-ec50485704c7?ixlib=rb-0.3.5&s=3a2fc3039516555bbb2e9cd2967bd321&auto=format&fit=crop&w=1537&q=80"
        color="#2b26c3"
      /> */}
      <a
        href="https://dribbble.com/YancyMin"
        className="absolute bottom-4 right-4 w-[100px]"
        target="_blank"
        rel="noopener noreferrer"
      >
        {/* <img
          src="https://cdn.dribbble.com/assets/logo-footer-hd-a05db77841b4b27c0bf23ec1378e97c988190dfe7d26e32e1faea7269f9e001b.png"
          alt="Dribbble"
          className="w-full"
        /> */}
      </a>
    </div>
  );
};

export default CardAnimation;
