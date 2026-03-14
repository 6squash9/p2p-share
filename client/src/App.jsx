import {Route, Routes} from "react-router-dom";
import HomePage from "./pages/HomePage";
import RoomPage from "./pages/RoomPage";
import LandingPage from "./pages/LandingPage.jsx";

function App() {
    return (
        <Routes>
            <Route path={"/"} element={<LandingPage/>}/>
            <Route path={"/room"} element={<HomePage/>}/>
            <Route path={"/room/:roomId"} element={<RoomPage/>}/>
        </Routes>
    )
}


export default App
