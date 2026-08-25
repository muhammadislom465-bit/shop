import sys
import os
import time

# Set up test using FastAPI TestClient
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_full_system():
    print("--- 1. Root & Healthcheck Test ---")
    res = client.get("/")
    assert res.status_code == 200, f"Root failed: {res.text}"
    print(" Root API working:", res.json())

    print("\n--- 2. Default Super Admin Login Test (admin123 / admin1234567890) ---")
    res = client.post("/api/auth/login", json={
        "username_or_email": "admin123",
        "password": "admin1234567890"
    })
    assert res.status_code == 200, f"Admin login failed: {res.text}"
    admin_data = res.json()
    admin_token = admin_data["access_token"]
    assert admin_data["user"]["is_admin"] == True, "User is not admin!"
    print(" Admin login successful! Token received. is_admin =", admin_data["user"]["is_admin"])

    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    print("\n--- 3. Regular User Registration & Login Test ---")
    test_username = f"user_{int(time.time())}"
    res = client.post("/api/auth/register", json={
        "username": test_username,
        "email": f"{test_username}@test.com",
        "password": "secretpassword123"
    })
    assert res.status_code == 200, f"Register failed: {res.text}"
    user_data = res.json()
    user_token = user_data["access_token"]
    assert user_data["user"]["is_admin"] == False, "Normal user should not be admin!"
    print(" Regular user registered successfully:", user_data["user"]["username"])

    print("\n--- 4. Categories & Products List Test ---")
    res = client.get("/api/categories")
    assert res.status_code == 200
    categories = res.json()
    print(f" Loaded {len(categories)} categories.")

    res = client.get("/api/products")
    assert res.status_code == 200
    products = res.json()
    print(f" Loaded {len(products)} products.")
    assert len(products) > 0, "Products list should not be empty!"
    sample_prod = products[0]

    print("\n--- 5. Action Templates & News Test ---")
    res = client.get("/api/news/templates/list")
    assert res.status_code == 200
    templates = res.json()
    print(f" Loaded {len(templates)} action templates.")
    assert len(templates) > 0, "Templates list should not be empty!"

    # Test applying a template to create a news announcement
    template_to_apply = templates[0]
    res = client.post(f"/api/news/apply-template/{template_to_apply['id']}", headers=admin_headers)
    assert res.status_code == 201, f"Apply template failed: {res.text}"
    applied_news = res.json()
    print(" Applied template successfully created news:", applied_news["title"])

    print("\n--- 6. Order Creation & Checkout Test ---")
    order_payload = {
        "customer_name": "Alisher Navoiy",
        "customer_phone": "+998 90 999 88 77",
        "shipping_address": "Toshkent sh., Yunusobod t., Amir Temur shoh ko'chasi 15-uy",
        "payment_method": "cash",
        "items": [
            {
                "product_id": sample_prod["id"],
                "title": sample_prod["title"],
                "price": sample_prod["discount_price"] or sample_prod["price"],
                "quantity": 2,
                "image_url": sample_prod["image_url"]
            }
        ]
    }
    user_headers = {"Authorization": f"Bearer {user_token}"}
    res = client.post("/api/orders", json=order_payload, headers=user_headers)
    assert res.status_code == 201, f"Order creation failed: {res.text}"
    order_res = res.json()
    print(f" Order created successfully! ID: #{order_res['id']}, Total: {order_res['total_amount']}")

    print("\n--- 7. Admin Dashboard Stats Test ---")
    res = client.get("/api/admin/stats", headers=admin_headers)
    assert res.status_code == 200, f"Admin stats failed: {res.text}"
    stats = res.json()
    print(" Admin Stats retrieved successfully:")
    print(f"   - Total Users: {stats['total_users']}")
    print(f"   - Total Products: {stats['total_products']}")
    print(f"   - Total Orders: {stats['total_orders']}")
    print(f"   - Total Revenue: {stats['total_revenue']} UZS")

    print("\n==========================================")
    print(" ALL BACKEND AND SECURITY TESTS PASSED! ")
    print("==========================================")

if __name__ == "__main__":
    test_full_system()
