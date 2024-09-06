import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Constants } from "./utils/constants";
import Meeting from "./pages/Meeting";
import Chat from "./pages/Chat";
import Home from "./pages/Home";

function ViewRouter() {

    return (
        <BrowserRouter basename={`${Constants.URLS.APP_BASE}/a`}>
            <Routes>
                <Route path="/meeting" element={<Meeting />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/" element={<Home />} />
            </Routes>
        </BrowserRouter>
    );
}

export default ViewRouter;