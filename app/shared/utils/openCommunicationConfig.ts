import { useRuntimeConfig } from '#imports';

export function getOpenCommunicationApiUrl(): string {
    const config = useRuntimeConfig();
    const baseUrl = (config.public?.openCommunicationApiUrl as string | undefined) ?? '';
    if (!baseUrl) {
        throw new Error('Missing public runtime config: openCommunicationApiUrl');
    }
    return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
}

export function buildOpenCommunicationUrl(path: string): string {
    return new URL(path, getOpenCommunicationApiUrl()).toString();
}