import axios from "axios";
import _ from "lodash";
import { AbortSignalLike } from '@azure/abort-controller';

export const refreshAzureTokenAsync = (participantIdentity: string): ((abortSignal?: AbortSignalLike) => Promise<string>) => {
    return async (): Promise<string> => {
        let resp = await axios.post("http://localhost:5000/api/tokens/a/refresh", { "participant_identity": participantIdentity })
        if (resp.status == 200) {
            return _.get(resp.data, "token");
        } else {
            throw new Error('could not refresh token');
        }
    };
};