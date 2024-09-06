import { useDyteMeeting } from "@dytesdk/react-web-core";
import { DyteMeeting } from "@dytesdk/react-ui-kit";

export interface IDyteCallProps {
    participantName : string | null
}

export default function DyteCall(props : IDyteCallProps) {
    const {meeting} = useDyteMeeting();
    
    return <DyteMeeting mode="fill" meeting={meeting} showSetupScreen={!props.participantName}/> ;
}