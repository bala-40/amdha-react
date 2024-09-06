import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { DyteProvider, useDyteClient } from "@dytesdk/react-web-core";
import DyteCall from "../components/dyte/DyteCall";

export default function DyteMeetingPage(){

    const [getParams] = useSearchParams();
    const [meeting, initMeeting] = useDyteClient();

    const authToken = getParams.get('auth_token') || "";
    const participantName = getParams.get('participant_name');

    useEffect(() => {
        initMeeting({
            authToken: authToken,
            defaults : {
                audio : true,
                video : true
            }
        });

    }, []);

    return (
        <div className="customWrapper">
            <DyteProvider value={meeting}>
                <DyteCall participantName={participantName}/>
            </DyteProvider>
        </div>
    );
}