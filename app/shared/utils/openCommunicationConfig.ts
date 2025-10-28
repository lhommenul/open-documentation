const openCommunicationApiUrl = process.env.OPEN_COMMUNICATION_API_URL as string;
const openCommunicationApiPort = process.env.OPEN_COMMUNICATION_API_PORT as string;

export const OPEN_COMMUNICATION_API_URL = new URL(openCommunicationApiUrl + openCommunicationApiPort ? ':' + openCommunicationApiPort : '');