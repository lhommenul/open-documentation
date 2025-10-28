import type { Turple } from "~/shared/types/Turple";
import { OPEN_COMMUNICATION_API_URL } from "~/shared/utils/openCommunicationConfig";

export async function uploadImage(file: File): Promise<Turple<unknown>> {
    
    try{

        const response = await fetch(OPEN_COMMUNICATION_API_URL + '/upload', {
            method: 'POST',
            body: file
        });

        if ( !response.ok ) {
            return [new Error('Failed to upload image: ' + response.statusText), null];
        }

        const data = await response.json();

        return [null, data];

    } catch (error) {

        return [new Error('Failed to upload image'), null];

    }

}