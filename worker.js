addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url);

  // 处理 OPTIONS 请求（CORS 预检）
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, HEAD, PATCH',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Max-Age': '86400',
      },
      status: 200,
    });
  }

  try {
    // 解码并构建实际 URL
    const actualUrlStr = decodeURIComponent(url.pathname.slice(1)) + url.search + url.hash;
    const actualUrl = new URL(actualUrlStr);

    // 构建新的请求头
    const headers = new Headers(request.headers);
    
    // 设置必要的请求头
    headers.set('Origin', `${actualUrl.protocol}//${actualUrl.host}`);
    headers.set('Referer', `${actualUrl.protocol}//${actualUrl.host}/`);
    headers.set('Host', actualUrl.host);
    
    // 如果没有 User-Agent，设置默认值
    if (!headers.get('User-Agent')) {
      headers.set('User-Agent', 'Mozilla/5.0');
    }

    // 创建新的请求
    const modifiedRequest = new Request(actualUrl, {
      method: request.method,
      headers: headers,
      body: request.body,
      redirect: 'follow',
    });

    // 发送请求
    const response = await fetch(modifiedRequest);

    // 构建新的响应头
    const responseHeaders = new Headers(response.headers);
    responseHeaders.set('Access-Control-Allow-Origin', '*');

    // 创建新的响应
    const modifiedResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });

    return modifiedResponse;

  } catch (error) {
    // 错误处理
    console.error(`Error: ${error.message}`);
    return new Response(`Error: ${error.message}`, {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}



