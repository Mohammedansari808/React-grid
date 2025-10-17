import React from "react";
import "./index.css";
import { Download } from "lucide-react";
export default function Navbar() {
    const downloadReadme = () => {
    const link = document.createElement("a");
    link.href = "/README.md"; // Vite serves from /public/
    link.download = "README.md";
    link.click();
  };

  
  
  return (
    <nav className="w-full  text-white flex items-center justify-between shadow-md">
      <div className="flex items-center gap-2">
        <img
          src="/animaker-logo.png"
          alt="Animaker"
          style={{height : '40px'}}
        />
      </div>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium">
        <div className="flex items-center gap-1 cursor-pointer hover:text-gray-200">
          Product <span className="text-xs">▼</span>
        </div>
        <div className="flex items-center gap-1 cursor-pointer hover:text-gray-200">
          Resources <span className="text-xs">▼</span>
        </div>
        <span className="cursor-pointer hover:text-gray-200">Features</span>
        <span className="cursor-pointer hover:text-gray-200">Pricing</span>
      </div>

      <div className="flex items-center gap-3">
        <button className="login-button">
          Login
        </button>
        <button onClick={downloadReadme} className="signin-button !hover:text-[rgb(241, 130, 30)]">
          <Download size={'13px'}/> README
        </button>
      </div>
    </nav>
  );
}
