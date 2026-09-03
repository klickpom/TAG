import { Routes, Route } from "react-router";
import { CatalogProvider } from "@/context/CatalogContext";
import Home from "./pages/Home";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <CatalogProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </CatalogProvider>
  );
}
