import { RADARR_API,RADARR_API_KEY } from '$env/static/private';
import { createAxiosProxyHandlder } from '../../utils';

const handler = createAxiosProxyHandlder("/api/proxy/radarr", RADARR_API, {"x-api-key": RADARR_API_KEY})

export const GET=handler

export const POST=handler

export const PATCH=handler

export const PUT=handler

export const DELETE=handler

export const OPTIONS=handler