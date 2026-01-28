# Test script to verify the API client configuration
import os
import sys

# Add the frontend/src directory to the Python path to test the configuration
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'frontend', 'src'))

# Test the environment variable logic
def test_api_client_logic():
    print("Testing API client configuration logic...")
    
    # Simulate different environments
    test_cases = [
        {"NEXT_PUBLIC_API_URL": None, "NEXT_PUBLIC_USE_LOCAL_ROUTES": "false", "expected_baseURL": "http://localhost:8080"},
        {"NEXT_PUBLIC_USE_LOCAL_ROUTES": "true", "expected_baseURL": ""},
        {"NEXT_PUBLIC_API_URL": "https://my-backend.onrender.com", "NEXT_PUBLIC_USE_LOCAL_ROUTES": "false", "expected_baseURL": "https://my-backend.onrender.com"},
    ]
    
    for i, case in enumerate(test_cases):
        print(f"\nTest case {i+1}:")
        
        # Mock environment variables
        original_env = {}
        for key in ["NEXT_PUBLIC_API_URL", "NEXT_PUBLIC_USE_LOCAL_ROUTES"]:
            original_env[key] = os.environ.get(key)
            if key in case:
                os.environ[key] = case[key]
            elif key in os.environ:
                del os.environ[key]
        
        # Apply the same logic as in the API client
        useLocalRoutes = os.environ.get('NEXT_PUBLIC_USE_LOCAL_ROUTES') == 'true'
        baseURL = '' if useLocalRoutes else (os.environ.get('NEXT_PUBLIC_API_URL') or 'http://localhost:8080')
        
        print(f"  Input: {case}")
        print(f"  Calculated baseURL: '{baseURL}'")
        print(f"  Expected baseURL: '{case['expected_baseURL']}'")
        print(f"  Result: {'PASS' if baseURL == case['expected_baseURL'] else 'FAIL'}")
        
        # Restore original environment
        for key, value in original_env.items():
            if value is not None:
                os.environ[key] = value
            elif key in os.environ:
                del os.environ[key]

if __name__ == "__main__":
    test_api_client_logic()
    print("\nConfiguration test completed!")