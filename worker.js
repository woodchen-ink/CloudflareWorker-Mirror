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

  // 当请求根路径时，显示引导页面
  if (url.pathname === '/') {
    return createLandingPage();
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

function createLandingPage() {
  const html = `<!DOCTYPE html>
  <html lang="en">
  
  <head>
  <link rel="shortcut icon" href="https://i-aws.czl.net/r2/2023/06/20/649168ec9d6a8.ico">
  <style>
  body {
    background-color: #fbfbfb;
    background-image: url(https://i-aws.czl.net/r2/2023/05/23/pjbczr.webp);
    background-size:cover;
    font-family: Arial, sans-serif;
    display: flex;
    flex-direction: column;
    justify-content: center;
    
    height: 100vh; /* 让body占据整个视口高度 */
    margin: 0;
  }

  h1 {
    text-align: center;
    color: white;
  }

  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  form {
    background-color: white;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
    padding: 2rem;
    border-radius: 8px;
    width:100%;
    max-width:800px;
    margin-left:auto;
    margin-right:auto;
  }

  input {
    display: block;
    width: 100%;
    font-size: 18px;
    padding: 15px;
    border: solid 1px #ccc;
    border-radius: 8px;
    margin-bottom:1rem;
    
  }

  button {
    padding: 15px;
    background-color: #0288d1;
    color: white;
    font-size: 18px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    width: 100%;
  }

  button:hover {
    background-color: #039BE5;
  }
  input,
  button {
  box-sizing: border-box;
  }
</style>
    <meta charset="UTF-8">
    <title>CZL镜像</title>
  </head>
  <body>
  <div class="container">
    <h1>输入需要镜像的地址</h1>
    <form id="proxy-form">
      <input type="text" id="url" name="url" placeholder="https://q58.org" required />
      <button type="submit">访问</button>
    </form>
  </div>
    <script>
      const form = document.getElementById('proxy-form');
      form.addEventListener('submit', event => {
        event.preventDefault();
        const input = document.getElementById('url');
        const actualUrl = input.value;
        const proxyUrl = '/' + actualUrl;
        location.href = proxyUrl;
      });
    </script>
  </body>
  </html>`; 
  
  return new Response(html, {
    headers: { 
      'Content-Type': 'text/html',
      'Access-Control-Allow-Origin': '*',
    }
  });
}

