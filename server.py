import http.server
import socketserver
import webbrowser
import os
import sys

# Ensure UTF-8 output on Windows console
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

PORT = int(os.environ.get("PORT", 3000))
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def log_message(self, format, *args):
        try:
            sys.stderr.write(f"[{self.log_date_time_string()}] {args[0]} {args[1]}\n")
        except Exception:
            pass

def run():
    os.chdir(DIRECTORY)
    is_cloud = "PORT" in os.environ
    if is_cloud:
        with socketserver.TCPServer(("0.0.0.0", PORT), Handler) as httpd:
            print(f"TalkRiva AI running on 0.0.0.0:{PORT}")
            httpd.serve_forever()
    else:
        for port in range(PORT, PORT + 20):
            try:
                with socketserver.TCPServer(("", port), Handler) as httpd:
                    url = f"http://localhost:{port}"
                    print("=" * 60)
                    print(f"  TalkRiva AI - English Speaking Partner Running!")
                    print(f"  Local URL: {url}")
                    print(f"  Project Directory: {DIRECTORY}")
                    print("=" * 60)
                    try:
                        webbrowser.open(url)
                    except Exception:
                        pass
                    httpd.serve_forever()
                    break
            except OSError:
                continue

if __name__ == "__main__":
    try:
        run()
    except KeyboardInterrupt:
        print("\nServer stopped.")
