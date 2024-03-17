import { JELLYFIN_API,JELLYFIN_API_KEY } from '$env/static/private';
import { createAxiosProxyHandlder } from '../../utils';

const handler = createAxiosProxyHandlder("/api/proxy/jellyfin", JELLYFIN_API, {"x-emby-token": JELLYFIN_API_KEY})

export const GET=handler

export const POST=handler

export const PATCH=handler

export const PUT=handler

export const DELETE=handler

export const OPTIONS=handler