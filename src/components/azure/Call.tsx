import { AzureCommunicationTokenCredential, CommunicationTokenRefreshOptions, CommunicationUserIdentifier, MicrosoftTeamsUserIdentifier } from "@azure/communication-common";
import { AzureCommunicationCallAdapterOptions, CallAdapter, CallAdapterLocator, CallAdapterState, CommonCallAdapter, onResolveVideoEffectDependencyLazy, Profile, StartCallIdentifier, TeamsAdapterOptions, TeamsCallAdapter, toFlatCommunicationIdentifier, useAzureCommunicationCallAdapter, useTeamsCallAdapter } from "@azure/communication-react";
import { useCallback, useMemo, useRef } from "react";
import { refreshAzureTokenAsync } from "../../utils/serviceUtils";
import { CallCompositeContainer } from "./CallCompositeContainer";

export interface CallProps {
    token: string;
    userId: CommunicationUserIdentifier | MicrosoftTeamsUserIdentifier;
    callLocator?: CallAdapterLocator;
    targetCallees?: StartCallIdentifier[];
    displayName: string;
    isTeamsIdentityCall?: boolean;
}

export const Call = (props: CallProps): JSX.Element => {
    const { token, userId, isTeamsIdentityCall } = props;
    const callIdRef = useRef<string>();

    const subscribeAdapterEvents = useCallback((adapter: CommonCallAdapter) => {
        adapter.on('error', (e) => {
            // Error is already acted upon by the Call composite, but the surrounding application could
            // add top-level error handling logic here (e.g. reporting telemetry).
            console.log('Adapter error event:', e);
        });
        adapter.onStateChange((state: CallAdapterState) => {

            console.log(convertPageStateToString(state));

            if (state?.call?.id && callIdRef.current !== state?.call?.id) {
                callIdRef.current = state?.call?.id;
                console.log(`Call Id: ${callIdRef.current}`);
            }
        });
        adapter.on('transferAccepted', (e) => {
            console.log('Call being transferred to: ' + e);
        });
    }, []);

    const afterCallAdapterCreate = useCallback(
        async (adapter: CallAdapter): Promise<CallAdapter> => {
            subscribeAdapterEvents(adapter);
            return adapter;
        },
        [subscribeAdapterEvents]
    );

    const afterTeamsCallAdapterCreate = useCallback(
        async (adapter: TeamsCallAdapter): Promise<TeamsCallAdapter> => {
            subscribeAdapterEvents(adapter);
            return adapter;
        },
        [subscribeAdapterEvents]
    );

    const credential = useMemo(() => {
        if (isTeamsIdentityCall) {
            return new AzureCommunicationTokenCredential(token);
        }
        return createAutoRefreshingCredential(toFlatCommunicationIdentifier(userId), token);
    }, [token, userId, isTeamsIdentityCall]);

    if (isTeamsIdentityCall) {
        return <TeamsCallScreen afterCreate={afterTeamsCallAdapterCreate} credential={credential} {...props} />;
    }
    if (props.callLocator) {
        return <AzureCommunicationCallScreen afterCreate={afterCallAdapterCreate} credential={credential} {...props} />;
    } else {
        return (
            <AzureCommunicationOutboundCallScreen afterCreate={afterCallAdapterCreate} credential={credential} {...props} />
        );
    }
};

type TeamsCallScreenProps = CallProps & {
    afterCreate?: (adapter: TeamsCallAdapter) => Promise<TeamsCallAdapter>;
    credential: AzureCommunicationTokenCredential;
};

const TeamsCallScreen = (props: TeamsCallScreenProps): JSX.Element => {
    const { afterCreate, callLocator: locator, userId, ...adapterArgs } = props;
    if (!(locator && 'meetingLink' in locator)) {
        throw new Error('A teams meeting locator must be provided for Teams Identity Call.');
    }

    if (!('microsoftTeamsUserId' in userId)) {
        throw new Error('A MicrosoftTeamsUserIdentifier must be provided for Teams Identity Call.');
    }

    const teamsAdapterOptions: TeamsAdapterOptions = useMemo(
        () => ({
            videoBackgroundOptions: {
                videoBackgroundImages
            }
        }),
        []
    );

    const adapter = useTeamsCallAdapter(
        {
            ...adapterArgs,
            userId,
            locator,
            options: teamsAdapterOptions
        },
        afterCreate
    );
    return <CallCompositeContainer {...props} adapter={adapter} />;
};

type AzureCommunicationCallScreenProps = CallProps & {
    afterCreate?: (adapter: CallAdapter) => Promise<CallAdapter>;
    credential: AzureCommunicationTokenCredential;
};

const AzureCommunicationCallScreen = (props: AzureCommunicationCallScreenProps): JSX.Element => {
    const { afterCreate, callLocator: locator, userId, ...adapterArgs } = props;

    if (!('communicationUserId' in userId)) {
        throw new Error('A MicrosoftTeamsUserIdentifier must be provided for Teams Identity Call.');
    }

    const callAdapterOptions: AzureCommunicationCallAdapterOptions = useMemo(() => {
        return {
            videoBackgroundOptions: {
                videoBackgroundImages,
                onResolveDependency: onResolveVideoEffectDependencyLazy
            },
            callingSounds: {
                callEnded: { url: '/assets/sounds/callEnded.mp3' },
                callRinging: { url: '/assets/sounds/callRinging.mp3' },
                callBusy: { url: '/assets/sounds/callBusy.mp3' }
            },
            reactionResources: {
                likeReaction: { url: '/assets/reactions/likeEmoji.png', frameCount: 102 },
                heartReaction: { url: '/assets/reactions/heartEmoji.png', frameCount: 102 },
                laughReaction: { url: '/assets/reactions/laughEmoji.png', frameCount: 102 },
                applauseReaction: { url: '/assets/reactions/clapEmoji.png', frameCount: 102 },
                surprisedReaction: { url: '/assets/reactions/surprisedEmoji.png', frameCount: 102 }
            }
        };
    }, []);

    const adapter = useAzureCommunicationCallAdapter(
        {
            ...adapterArgs,
            userId,
            locator,
            options: callAdapterOptions
        },
        afterCreate
    );

    return <CallCompositeContainer {...props} adapter={adapter} />;
};

const AzureCommunicationOutboundCallScreen = (props: AzureCommunicationCallScreenProps): JSX.Element => {
    const { afterCreate, targetCallees: targetCallees, userId, ...adapterArgs } = props;

    if (!('communicationUserId' in userId)) {
        throw new Error('A MicrosoftTeamsUserIdentifier must be provided for Teams Identity Call.');
    }

    const callAdapterOptions: AzureCommunicationCallAdapterOptions = useMemo(() => {
        return {
            videoBackgroundOptions: {
                videoBackgroundImages,
                onResolveDependency: onResolveVideoEffectDependencyLazy
            },
            callingSounds: {
                callEnded: { url: './sounds/callEnded.mp3' },
                callRinging: { url: './sounds/callRinging.mp3' },
                callBusy: { url: './sounds/callBusy.mp3' }
            },
            reactionResources: {
                likeReaction: { url: './images/reactions/likeEmoji.png', frameCount: 102 },
                heartReaction: { url: './images/reactions/heartEmoji.png', frameCount: 102 },
                laughReaction: { url: './images/reactions/laughEmoji.png', frameCount: 102 },
                applauseReaction: { url: './images/reactions/clapEmoji.png', frameCount: 102 },
                surprisedReaction: { url: './images/reactions/surprisedEmoji.png', frameCount: 102 }
            },
            onFetchProfile: async (userId: string, defaultProfile?: Profile): Promise<Profile | undefined> => {
                if (userId === '<28:orgid:Enter your teams app here>') {
                    return { displayName: 'Teams app display name' };
                }
                return defaultProfile;
            }
        };
    }, []);

    const adapter = useAzureCommunicationCallAdapter(
        {
            ...adapterArgs,
            userId,
            targetCallees: targetCallees,
            options: callAdapterOptions
        },
        afterCreate
    );

    return <CallCompositeContainer {...props} adapter={adapter} />;
};

const convertPageStateToString = (state: CallAdapterState): string => {
    switch (state.page) {
        case 'accessDeniedTeamsMeeting':
            return 'error';
        case 'badRequest':
            return 'error';
        case 'leftCall':
            return 'end call';
        case 'removedFromCall':
            return 'end call';
        default:
            return `${state.page}`;
    }
};

const videoBackgroundImages = [
    {
        key: 'batman',
        url: './images/background/batman.jpeg',
        tooltipText: 'I am Batman'
    },
    {
        key: 'joker',
        url: './images/background/joker.jpeg',
        tooltipText: 'I am Joker'
    }
];

function createAutoRefreshingCredential(userId: string, token: string): any {
    const options: CommunicationTokenRefreshOptions = {
        token: token,
        tokenRefresher: refreshAzureTokenAsync(userId),
        refreshProactively: true
      };
      return new AzureCommunicationTokenCredential(options);
}
