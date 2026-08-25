import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RoomPage from "./pages/RoomPage";
import LandingPage from "./pages/LandingPage.jsx";  
import PrivacyPage from "./pages/PrivacyPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import TermsPage from "./pages/TermsPage.jsx";
import BlogPage from "./pages/BlogPage.jsx";

function App() {
    return (
        <Routes>
            <Route path={"/"} element={<LandingPage />} />
            <Route path={"/room"} element={<HomePage />} />
            <Route path={"/room/:roomId"} element={<RoomPage />} />
            <Route path={"/privacy"} element={<PrivacyPage />} />
            <Route path={"/contact"} element={<ContactPage />} />
            <Route path={"/about"} element={<AboutPage />} />
            <Route path={"/terms"} element={<TermsPage />} />
            <Route path={"/blog"} element={<BlogPage />} />
        </Routes>
    )
}


export default App
