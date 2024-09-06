import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import _ from "lodash";
import { CommunicationUserIdentifier, MicrosoftTeamsUserIdentifier } from "@azure/communication-common";
import { CallAdapterLocator, StartCallIdentifier } from "@azure/communication-react";
import JoinMeeting from "../components/meeting/JoinMeeting";
import { Spinner } from "@fluentui/react";

export default function Meeting() {

    const [getParams] = useSearchParams();

    let participantIdentity = getParams.get("participant_identity") || "";
    let participantToken = getParams.get("participant_token") || "";
    let meetingId = getParams.get("meeting_id") || "";
    let participantName = getParams.get("participant_name") || "Raj";

    let [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (
            !_.isEmpty(participantIdentity)
            && !_.isEmpty(participantToken)
            && !_.isEmpty(meetingId)
            && !_.isEmpty(participantName)
        ) {
            setIsReady(true);
        }
    })

    return (
        <div className="customWrapper">
            {
                isReady ?
                    (<JoinMeeting
                        meetingId={meetingId}
                        participantIdentity={participantIdentity}
                        participantName={participantName}
                        participantToken={participantToken}
                    />)
                    : (<Spinner label={'Getting ready'} ariaLive="assertive" labelPosition="top" />)
            }
        </div>
    )
}