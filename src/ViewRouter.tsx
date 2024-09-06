import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Constants } from "./utils/constants";
import AzureMeeting from "./pages/AzureMeetingPage";
import Home from "./pages/Home";
import AzureChat from "./pages/AzureChatPage";
import DyteMeetingPage from "./pages/DyteMeetingPage";
import DyteChatPage from "./pages/DyteChatPage";

function ViewRouter() {

    return (
        <BrowserRouter basename={`${Constants.URLS.APP_BASE}`}>
            <Routes>
                <Route path="/a/meeting" element={<AzureMeeting />} />
                <Route path="/a/chat" element={<AzureChat />} />
                <Route path="/d/meeting" element={<DyteMeetingPage />} />
                <Route path="/d/chat" element={<DyteChatPage />} />
                <Route path="/" element={<Home />} />
            </Routes>
        </BrowserRouter>
    );
}

export default ViewRouter;