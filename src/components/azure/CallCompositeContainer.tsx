// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { GroupCallLocator, TeamsMeetingLinkLocator } from '@azure/communication-calling';
import { CallAdapterLocator, CallComposite, CallCompositeOptions, CommonCallAdapter } from '@azure/communication-react';
import { Spinner } from '@fluentui/react';
import { useEffect, useMemo } from 'react';
import { CallProps } from './Call';
import { isIOS, useIsMobile } from '../../utils/screenSizeUtils';

export type CallCompositeContainerProps = CallProps & { adapter?: CommonCallAdapter };

export const CallCompositeContainer = (props: CallCompositeContainerProps): JSX.Element => {
    const { adapter } = props;
    const isMobileSession = useIsMobile();
    const shouldHideScreenShare = isMobileSession || isIOS();

    useEffect(() => {
        /**
         * We want to make sure that the page is up to date. If for example a browser is dismissed
         * on mobile, the page will be stale when opened again. This event listener will reload the page
         */
        window.addEventListener('pageshow', (event) => {
            if (event.persisted) {
                window.location.reload();
            }
        });
        return () => {
            window.removeEventListener('pageshow', () => {
                window.location.reload();
            });
        };
    }, []);

    const options: CallCompositeOptions = useMemo(
        () => ({
            surveyOptions: {
                disableSurvey: true,
            },
            callControls: {
                screenShareButton: shouldHideScreenShare ? false : undefined,
                endCallButton: {
                    hangUpForEveryone: false,
                    disableEndCallModal: true,
                }
            },
            autoShowDtmfDialer: true
        }),
        [shouldHideScreenShare]
    );

    // Dispose of the adapter in the window's before unload event.
    // This ensures the service knows the user intentionally left the call if the user
    // closed the browser tab during an active call.
    useEffect(() => {
        const disposeAdapter = (): void => adapter?.dispose();
        window.addEventListener('beforeunload', disposeAdapter);
        return () => window.removeEventListener('beforeunload', disposeAdapter);
    }, [adapter]);

    if (!adapter) {
        return <Spinner label={'Creating adapter'} ariaLive="assertive" labelPosition="top" />;
    }

    let callInvitationUrl: string | undefined = window.location.href;
    // Only show the call invitation url if the call is a group call or Teams call, do not show for Rooms, 1:1 or 1:N calls
    if (props.callLocator && !isGroupCallLocator(props.callLocator) && !isTeamsMeetingLinkLocator(props.callLocator)) {
        callInvitationUrl = undefined;
    }

    return (
        <CallComposite
            adapter={adapter}
            callInvitationUrl={callInvitationUrl}
            formFactor={isMobileSession ? 'mobile' : 'desktop'}
            options={options}
        />
    );
};

const isTeamsMeetingLinkLocator = (locator: CallAdapterLocator): locator is TeamsMeetingLinkLocator => {
    return 'meetingLink' in locator;
};

const isGroupCallLocator = (locator: CallAdapterLocator): locator is GroupCallLocator => {
    return 'groupId' in locator;
};
