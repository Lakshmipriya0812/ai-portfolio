import { FaGithub, FaLinkedin } from "react-icons/fa";

const HeaderWidget = () => {
  return (
    <div className="absolute top-4 right-4 z-20 flex gap-4 p-2 backdrop-blur bg-white/20 rounded-xl shadow-md">
      <a
        href="https://github.com/Lakshmipriya0812"
        target="_blank"
        rel="noreferrer"
      >
        <FaGithub className="text-black text-2xl hover:text-gray-300" />
      </a>
      <a
        href="https://www.linkedin.com/in/lakshmipriya-r/"
        target="_blank"
        rel="noreferrer"
      >
        <FaLinkedin className="text-black text-2xl hover:text-blue-300" />
      </a>
    </div>
  );
};

export default HeaderWidget;
