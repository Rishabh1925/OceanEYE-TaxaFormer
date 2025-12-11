"""
Test Simple Analytics System
"""
import requests
import json

def test_simple_analytics():
    API_URL = "http://localhost:8000"  # Change if different
    
    print("🧪 Testing Simple Analytics System...")
    
    # Test 1: Check if endpoint exists
    print("\n1. Testing analytics endpoint...")
    try:
        response = requests.get(f"{API_URL}/api/simple-analytics/test")
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code != 200:
            print("❌ Analytics endpoint not working!")
            return
            
    except Exception as e:
        print(f"❌ Cannot connect to backend: {e}")
        return
    
    # Test 2: Create session
    print("\n2. Creating test session...")
    session_data = {
        "deviceType": "desktop",
        "browserName": "chrome",
        "referrer": "test"
    }
    
    try:
        response = requests.post(f"{API_URL}/api/simple-analytics/session", json=session_data)
        print(f"Status: {response.status_code}")
        result = response.json()
        print(f"Response: {result}")
        
        if result.get("status") == "created":
            session_id = result["sessionId"]
            print(f"✅ Session created: {session_id}")
            
            # Test 3: Track page view
            print("\n3. Tracking page view...")
            page_data = {
                "sessionId": session_id,
                "pagePath": "/test",
                "pageTitle": "Test Page"
            }
            
            response = requests.post(f"{API_URL}/api/simple-analytics/page-view", json=page_data)
            print(f"Status: {response.status_code}")
            print(f"Response: {response.json()}")
            
            print("\n✅ Test completed! Check your Supabase database tables:")
            print("   - user_sessions")
            print("   - page_views")
            
        else:
            print(f"❌ Session creation failed: {result}")
            
    except Exception as e:
        print(f"❌ Test failed: {e}")

if __name__ == "__main__":
    test_simple_analytics()