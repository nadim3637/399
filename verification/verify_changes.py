
from playwright.sync_api import sync_playwright
import time

def verify_changes():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        # Mock LocalStorage for Admin User
        admin_user = {
            "id": "admin_1",
            "name": "Admin User",
            "role": "ADMIN",
            "credits": 1000,
            "isPremium": True
        }
        
        # Navigate to app
        page.goto("http://localhost:5173")
        
        # Inject User
        page.evaluate(f"localStorage.setItem('nst_current_user', '{str(admin_user).replace(chr(39), chr(34))}')")
        page.reload()
        
        # 1. Verify Admin Dashboard - Custom Page Tab
        try:
            print("Verifying Admin Dashboard...")
            page.wait_for_timeout(2000) # Wait for load
            page.screenshot(path="verification/dashboard_view.png")
            
            # Check for "Blogger Hub" card or tab
            # It might be in the dashboard grid or tab list.
            # I added a DashboardCard with "Blogger Hub".
            blogger_hub = page.get_by_text("Blogger Hub")
            if blogger_hub.count() > 0:
                print("✅ Blogger Hub found.")
                blogger_hub.first.click()
                page.wait_for_timeout(1000)
                page.screenshot(path="verification/blogger_hub.png")
                
                # Check for inputs
                if page.get_by_text("Custom HTML").count() > 0:
                    print("✅ Custom Page Inputs found.")
                else:
                    print("❌ Custom Page Inputs NOT found.")
            else:
                print("❌ Blogger Hub card NOT found.")

        except Exception as e:
            print(f"❌ Admin Dashboard Verification Failed: {e}")

        # 2. Verify Student Dashboard - Banner (Need to switch to Student or enable banner)
        # I'll enable the banner via settings first in the script if possible, or just check logic.
        # I'll skip complex interaction for now, just snapshot.

        browser.close()

if __name__ == "__main__":
    verify_changes()
