"""
Test script for Taxaformer backend
Run this to verify the backend is working correctly
"""
import requests
import json
from pathlib import Path

# Configuration
API_URL = "http://localhost:8000"  # Change to your ngrok URL if testing remotely

def test_health_check():
    """Test the health check endpoint"""
    print("\n" + "="*60)
    print("Testing Health Check Endpoint")
    print("="*60)
    
    try:
        response = requests.get(f"{API_URL}/health")
        response.raise_for_status()
        
        data = response.json()
        print("✅ Health check passed")
        print(json.dumps(data, indent=2))
        return True
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False

def test_analyze_endpoint():
    """Test the analyze endpoint with sample data"""
    print("\n" + "="*60)
    print("Testing Analyze Endpoint")
    print("="*60)
    
    # Create a sample FASTA file
    sample_fasta = """
>seq1
ATCGATCGATCGATCGATCGATCGATCG
>seq2
GCTAGCTAGCTAGCTAGCTAGCTAGCTA
>seq3
TTAATTAATTAATTAATTAATTAATTAA
>seq4
CGGCCGGCCGGCCGGCCGGCCGGCCGGC
>seq5
AGCTAGCTAGCTAGCTAGCTAGCTAGCT
""".strip()
    
    # Save to temporary file
    temp_file = Path("test_sample.fasta")
    temp_file.write_text(sample_fasta)
    
    try:
        # Send file to API
        with open(temp_file, 'rb') as f:
            files = {'file': ('test_sample.fasta', f, 'text/plain')}
            
            print(f"📤 Sending request to {API_URL}/analyze")
            response = requests.post(f"{API_URL}/analyze", files=files)
            response.raise_for_status()
            
            data = response.json()
            
            if data.get('status') == 'success':
                print("✅ Analyze endpoint passed")
                print("\n📊 Response Summary:")
                print(f"  - Status: {data['status']}")
                
                if 'data' in data:
                    metadata = data['data'].get('metadata', {})
                    print(f"  - Total Sequences: {metadata.get('totalSequences', 'N/A')}")
                    print(f"  - Sample Name: {metadata.get('sampleName', 'N/A')}")
                    print(f"  - Processing Time: {metadata.get('processingTime', 'N/A')}")
                    print(f"  - Avg Confidence: {metadata.get('avgConfidence', 'N/A')}%")
                    
                    print(f"\n📈 Taxonomy Groups: {len(data['data'].get('taxonomy_summary', []))}")
                    for group in data['data'].get('taxonomy_summary', [])[:3]:
                        print(f"  - {group['name']}: {group['value']} sequences")
                
                print("\n✅ Full response received and valid")
                return True
            else:
                print(f"❌ Unexpected status: {data.get('status')}")
                print(f"   Message: {data.get('message', 'No message')}")
                return False
                
    except Exception as e:
        print(f"❌ Analyze endpoint failed: {e}")
        return False
    finally:
        # Clean up
        if temp_file.exists():
            temp_file.unlink()

def test_cors():
    """Test CORS configuration"""
    print("\n" + "="*60)
    print("Testing CORS Configuration")
    print("="*60)
    
    try:
        response = requests.options(f"{API_URL}/analyze")
        
        cors_headers = {
            'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
            'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
            'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers')
        }
        
        print("CORS Headers:")
        for key, value in cors_headers.items():
            status = "✅" if value else "⚠️"
            print(f"  {status} {key}: {value or 'Not set'}")
        
        return True
    except Exception as e:
        print(f"❌ CORS test failed: {e}")
        return False

def main():
    """Run all tests"""
    print("\n" + "="*60)
    print("🧪 TAXAFORMER BACKEND TEST SUITE")
    print("="*60)
    print(f"API URL: {API_URL}")
    print("="*60)
    
    # Run tests
    results = {
        "Health Check": test_health_check(),
        "CORS Configuration": test_cors(),
        "Analyze Endpoint": test_analyze_endpoint()
    }
    
    # Summary
    print("\n" + "="*60)
    print("📋 TEST SUMMARY")
    print("="*60)
    
    for test_name, passed in results.items():
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status}: {test_name}")
    
    total = len(results)
    passed = sum(results.values())
    
    print("="*60)
    print(f"Result: {passed}/{total} tests passed")
    print("="*60)
    
    if passed == total:
        print("\n🎉 All tests passed! Backend is working correctly.")
        print("\n📝 Next steps:")
        print("1. Update frontend API_URL with your ngrok URL")
        print("2. Test file upload from frontend")
        print("3. Check results display correctly")
    else:
        print("\n⚠️  Some tests failed. Please check:")
        print("1. Backend server is running")
        print("2. API_URL is correct")
        print("3. All dependencies installed")
        print("4. Check backend logs for errors")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Tests interrupted by user")
    except Exception as e:
        print(f"\n\n❌ Test suite error: {e}")
