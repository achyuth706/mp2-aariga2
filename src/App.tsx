import { NavLink, Route, Routes, useLocation } from "react-router-dom";
import ListView from "./views/ListView";
import GalleryView from "./views/GalleryView";
import DetailView from "./views/DetailView";
import "./App.css";


export default function App() {
  const location = useLocation();

  return (
    <div className="app">
      <header className="topbar">
        <h1>Pokémon Finder</h1>
        <nav>
          <NavLink to="/" end>List</NavLink>
          <NavLink to="/gallery">Gallery</NavLink>
        </nav>
      </header>

      <main>
    
        <div key={location.pathname} className="routeContainer">
          <Routes location={location}>
            <Route path="/" element={<ListView />} />
            <Route path="/gallery" element={<GalleryView />} />
            <Route path="/pokemon/:id" element={<DetailView />} />
          </Routes>
        </div>
      </main>

      <footer className="foot">
        Built with ❤️ using React Router, Axios, TypeScript
      </footer>
    </div>
  );
}
