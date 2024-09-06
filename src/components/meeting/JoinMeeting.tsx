import { CommunicationUserIdentifier, MicrosoftTeamsUserIdentifier } from '@azure/communication-common';

import { CallAdapterLocator, StartCallIdentifier } from '@azure/communication-react';
import { useEffect, useState } from 'react';
import { isLandscape, isOnIphoneAndNotSafari, useIsMobile } from '../../utils/screenSizeUtils';
import { Call } from '../azure/Call';

interface IJoinMeetingProps {
    participantIdentity: string
    participantToken: string
    meetingId: string
    participantName: string
}

export default function JoinMeeting(props: IJoinMeetingProps) {

    const [displayName, setDisplayName] = useState(props.participantName);
    const [token, setToken] = useState<string>(props.participantToken);
    const [userId, setUserId] = useState<CommunicationUserIdentifier | MicrosoftTeamsUserIdentifier>({ communicationUserId: props.participantIdentity });
    const [callLocator, setCallLocator] = useState<CallAdapterLocator>({ roomId: props.meetingId });
    const [targetCallees, setTargetCallees] = useState<StartCallIdentifier[] | undefined>(undefined);
    const [isTeamsCall, setIsTeamsCall] = useState<boolean>(false);

    // const supportedBrowser = !isOnIphoneAndNotSafari();
    // if (!supportedBrowser) {
    //   return <UnsupportedBrowserPage />;
    // }

    return (
        <Call
            token={token}
            userId={userId}
            displayName={displayName}
            callLocator={callLocator}
            targetCallees={targetCallees}
            isTeamsIdentityCall={isTeamsCall}
        />
    )
}
