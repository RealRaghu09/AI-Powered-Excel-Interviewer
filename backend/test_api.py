#!/usr/bin/env python3
"""
Test script to verify backend API endpoints
"""

import requests
import json
import sys

def test_backend():
    """Test if backend is running and responding"""
    base_url = "http://localhost:5000"
    
    print("Testing AI Excel Agent Backend API")
    print("=" * 40)
    
    # Test 1: Health check
    try:
        response = requests.get(f"{base_url}/", timeout=5)
        if response.status_code == 200:
            print("✓ Backend is running")
            print(f"  Response: {response.json()}")
        else:
            print(f"✗ Backend returned status {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("✗ Cannot connect to backend. Is it running?")
        print("  Start backend with: python app.py")
        return False
    except Exception as e:
        print(f"✗ Error connecting to backend: {e}")
        return False
    
    # Test 2: Questions endpoint
    try:
        response = requests.get(f"{base_url}/questions", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"✓ Questions endpoint working")
            print(f"  Found {len(data.get('questions', []))} questions")
        else:
            print(f"✗ Questions endpoint returned status {response.status_code}")
    except Exception as e:
        print(f"✗ Error testing questions endpoint: {e}")
    
    # Test 3: Random question
    try:
        response = requests.get(f"{base_url}/questions/random", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"✓ Random question endpoint working")
            if data.get('status') == 'success':
                question = data.get('question', {})
                print(f"  Sample question: {question.get('question', 'N/A')[:50]}...")
            else:
                print(f"  Error: {data.get('message', 'Unknown error')}")
        else:
            print(f"✗ Random question endpoint returned status {response.status_code}")
    except Exception as e:
        print(f"✗ Error testing random question endpoint: {e}")
    
    # Test 4: Data summary
    try:
        response = requests.get(f"{base_url}/data/summary", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"✓ Data summary endpoint working")
            if data.get('status') == 'success':
                summary = data.get('summary', {})
                print(f"  Total records: {summary.get('total_records', 'N/A')}")
            else:
                print(f"  Error: {data.get('message', 'Unknown error')}")
        else:
            print(f"✗ Data summary endpoint returned status {response.status_code}")
    except Exception as e:
        print(f"✗ Error testing data summary endpoint: {e}")
    
    print("\n" + "=" * 40)
    print("Backend API test completed!")
    return True

if __name__ == "__main__":
    success = test_backend()
    sys.exit(0 if success else 1)
