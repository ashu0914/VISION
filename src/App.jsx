import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import DestinationsPage from "./pages/DestinationsPage";
import ContactPage from "./pages/ContactPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/destinations" element={<DestinationsPage />} />
      <Route path="/contact" element={<ContactPage />} />
    </Routes>
  );
}
