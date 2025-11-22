import http.server
import socketserver
import os

PORT = 5500
# 允许访问的文件后缀，防止无限重定向
SAFE_EXTENSIONS = ['.css', '.js', '.png', '.jpg', '.jpeg', 'ico']

class WechatAuthHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # 获取 User-Agent 并转小写
        ua = self.headers.get('User-Agent', '').lower()
        path = self.path.split('?')[0]
        
        # 判断是否为静态资源或已经是不安全页面
        is_static = any(path.endswith(ext) for ext in SAFE_EXTENSIONS)
        is_unsafe_page = path.endswith('unsafe.html')
        
        # # 核心逻辑：如果不是微信，且不是静态资源，且不是unsafe页面 -> 重定向
        # if 'micromessenger' not in ua and not is_static and not is_unsafe_page:
        #     print(f"拦截非微信访问: {self.client_address[0]} - UA: {ua}")
        #     self.send_response(302)
        #     self.send_header('Location', '/unsafe.html')
        #     self.end_headers()
        #     return
            
        super().do_GET()

# 确保工作目录在当前文件夹
os.chdir(os.path.dirname(os.path.abspath(__file__)))

print(f"正在启动服务器 http://0.0.0.0:{PORT}")
print("请注意：在非微信浏览器中访问将被拦截到 unsafe.html")

with socketserver.TCPServer(("", PORT), WechatAuthHandler) as httpd:
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass