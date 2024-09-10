import { useDyteMeeting } from "@dytesdk/react-web-core";
import { DyteMeeting } from "@dytesdk/react-ui-kit";
import { Constants } from "../../utils/constants";
import _ from "lodash";

export interface IDyteCallProps {
    participantName : string | null
}

export default function DyteCall(props : IDyteCallProps) {
    const {meeting} = useDyteMeeting();

    meeting.participants.joined.on("participantJoined", (participant)=>{
        let y = _.get(window, Constants.GENERAL.CHANNEL_NAME)
        if(y){
            y.postMessage(JSON.stringify({ type: 'message', message: `${participant.name}` }))
        }
        window.parent.postMessage({type: "onParticipantJoined", data : `${participant.name}`}, "http://localhost:8080");
    })
    
    return <DyteMeeting mode="fill" meeting={meeting} showSetupScreen={!props.participantName}/> ;
}