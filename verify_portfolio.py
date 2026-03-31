import time
import subprocess
from playwright.sync_api import sync_playwright

def verify_portfolio():
    server = subprocess.Popen(['python3', '-m', 'http.server', '8000'])
    time.sleep(2)

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page()
            page.route("**/*", lambda route: route.continue_() if "localhost" in route.request.url else route.abort())

            page.goto('http://localhost:8000/index.html', wait_until="load")

            # Navegar a la sección de portfolio
            page.click('a[href="#portfolio"]')
            time.sleep(1)

            # Verificar que los elementos de portfolio son visibles
            items = page.query_selector_all('.portfolio-item')
            print(f"Found {len(items)} portfolio items.")

            if len(items) > 0:
                print("Portfolio is correctly initialized.")
                page.screenshot(path="portfolio_check.png", full_page=True)
            else:
                print("Portfolio items not found!")

            browser.close()
    finally:
        server.terminate()

if __name__ == "__main__":
    verify_portfolio()
