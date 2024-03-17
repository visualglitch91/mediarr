import axios from 'axios';
import { text, type RequestHandler } from '@sveltejs/kit';

export  function createAxiosProxyHandlder(basePath:string,
  baseURL: string,
  headers: Record<string, string>
) {
  const api = axios.create({ baseURL, headers });

  const handler:RequestHandler = async ({url, request}) =>{
    const body = ["GET", "OPTIONS"].includes(request.method) ? undefined : await request.json();

    try {
      const axiosResponse = await api.request({
        url: (url.pathname +url.search).substring(basePath.length),
        method:request.method,
        data: body,
        headers: { "content-type": request.headers.get("content-type") },
        responseType: "arraybuffer",
      });


      const response = new Response(axiosResponse.data, {
        status: axiosResponse.status,
        headers: new Headers({
          "content-type": axiosResponse.headers["content-type"]
        }),
      })

      return response
    } catch (err: any) {
      console.error(err)
      return text(err.message,{status:err.response?.status || 500});
    }
  }

  return handler
}
