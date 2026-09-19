import { useState } from "react";

function Header() {

  const [language, setLanguage] =
    useState("English");

  return (
    <header className="header">

      <h2>
        🧠 SMRITI AI
      </h2>

      <select
        value={language}
        onChange={(e) =>
          setLanguage(e.target.value)
        }
      >
        <option>English</option>
        <option>অসমীয়া</option>
      </select>

    </header>
  );
}

export default Header;