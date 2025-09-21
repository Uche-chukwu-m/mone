from pymongo import MongoClient
import os
from dotenv import load_dotenv
from datetime import datetime
import certifi

# Load environment variables
load_dotenv()

# MongoDB connection
MONGO_URI = os.environ.get("MONGO_URI")
client = MongoClient(MONGO_URI, tlsCAFile=certifi.where())
db = client['mono_db']

# Collections
credentials_collection = db['google_credentials']
transactions_collection = db['transactions']

def save_google_credentials_to_db(user_id: str, credentials_info: dict):
    """
    Save Google OAuth credentials to MongoDB.
    """
    try:
        # Upsert user credentials (create or update)
        result = credentials_collection.update_one(
            {"user_id": user_id},
            {
                "$set": {
                    "user_id": user_id,
                    "credentials": credentials_info,
                    "created_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow()
                }
            },
            upsert=True
        )
        print(f"--- REAL DB: Saved Google credentials for user: {user_id} ---")
        return {"success": True, "user_id": user_id}
    except Exception as e:
        print(f"Error saving credentials: {e}")
        return {"success": False, "error": str(e)}

def get_google_credentials_from_db(user_id: str):
    """
    Retrieve Google OAuth credentials from MongoDB.
    """
    try:
        user_doc = credentials_collection.find_one({"user_id": user_id})
        if user_doc and "credentials" in user_doc:
            print(f"--- REAL DB: Retrieved credentials for user: {user_id} ---")
            return user_doc["credentials"]
        else:
            print(f"--- REAL DB: No credentials found for user: {user_id} ---")
            return None
    except Exception as e:
        print(f"Error retrieving credentials: {e}")
        return None

def save_transactions_to_db(user_id: str, transactions: list):
    """
    Save parsed transactions to MongoDB.
    """
    try:
        if not transactions:
            return {"success": True, "message": "No transactions to save", "count": 0}
        
        # Add metadata to each transaction
        for transaction in transactions:
            transaction.update({
                "user_id": user_id,
                "created_at": datetime.utcnow(),
                "source": "email_sync"
            })
        
        # Insert transactions
        result = transactions_collection.insert_many(transactions)
        print(f"--- REAL DB: Saved {len(transactions)} transactions for user: {user_id} ---")
        
        return {
            "success": True,
            "count": len(transactions),
            "inserted_ids": [str(id) for id in result.inserted_ids]
        }
    except Exception as e:
        print(f"Error saving transactions: {e}")
        return {"success": False, "error": str(e)}

def get_transactions_for_user(user_id: str):
    """
    Retrieve all transactions for a user from MongoDB.
    """
    try:
        transactions = list(transactions_collection.find(
            {"user_id": user_id},
            {"_id": 0}  # Exclude the MongoDB _id field
        ).sort("created_at", -1))  # Sort by newest first
        
        print(f"--- REAL DB: Retrieved {len(transactions)} transactions for user: {user_id} ---")
        return transactions
    except Exception as e:
        print(f"Error retrieving transactions: {e}")
        return []

def get_spending_summary(user_id: str):
    """
    Generate a spending summary for a user.
    """
    try:
        # Get all transactions for the user
        transactions = get_transactions_for_user(user_id)
        
        if not transactions:
            return {
                "total_transactions": 0,
                "total_spent": 0,
                "categories": {},
                "vendors": {},
                "monthly_totals": {}
            }
        
        # Calculate summary statistics
        total_spent = sum(t.get('totalAmount', 0) for t in transactions)
        total_transactions = len(transactions)
        
        # Group by vendor
        vendors = {}
        for t in transactions:
            vendor = t.get('vendorName', 'Unknown')
            if vendor not in vendors:
                vendors[vendor] = {"count": 0, "total": 0}
            vendors[vendor]["count"] += 1
            vendors[vendor]["total"] += t.get('totalAmount', 0)
        
        # Sort vendors by total spending
        top_vendors = dict(sorted(vendors.items(), key=lambda x: x[1]["total"], reverse=True)[:10])
        
        # Group by transaction type (as categories)
        categories = {}
        for t in transactions:
            category = t.get('transactionType', 'Other')
            if category not in categories:
                categories[category] = {"count": 0, "total": 0}
            categories[category]["count"] += 1
            categories[category]["total"] += t.get('totalAmount', 0)
        
        return {
            "total_transactions": total_transactions,
            "total_spent": round(total_spent, 2),
            "categories": categories,
            "top_vendors": top_vendors,
            "average_transaction": round(total_spent / total_transactions, 2) if total_transactions > 0 else 0
        }
    except Exception as e:
        print(f"Error generating spending summary: {e}")
        return {
            "total_transactions": 0,
            "total_spent": 0,
            "categories": {},
            "vendors": {},
            "error": str(e)
        }

# Test MongoDB connection
def test_connection():
    """
    Test MongoDB connection.
    """
    try:
        # Test the connection
        client.admin.command('ping')
        print("✅ MongoDB connection successful.")
        return True
    except Exception as e:
        print(f"❌ MongoDB connection failed: {e}")
        return False

# Test connection when module is imported
if __name__ == "__main__":
    test_connection()
else:
    test_connection()
