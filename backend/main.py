import os
import json
import base64 # Needed for decoding email body
from fastapi import FastAPI, Depends, Request, HTTPException
from fastapi.responses import RedirectResponse
from dotenv import load_dotenv
import time
from bs4 import BeautifulSoup
import pandas as pd

# --- Google & AI Imports ---
import google.generativeai as genai
from google_auth_oauthlib.flow import Flow
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from google.api_core import exceptions

# --- Custom Imports ---
from auth import verify_token

# Import our REAL database functions
from database import (
    save_google_credentials_to_db,
    get_google_credentials_from_db,
    save_transactions_to_db,
    get_transactions_for_user,
    get_spending_summary
)

# --- INITIAL SETUP ---
load_dotenv()
app = FastAPI()
genai.configure(api_key=os.environ["GOOGLE_API_KEY"])
model = genai.GenerativeModel('gemini-1.5-flash')

# --- OAuth2 Configuration ---
client_config = {
    "web": {
        "client_id": os.environ.get("GOOGLE_CLIENT_ID"),
        "client_secret": os.environ.get("GOOGLE_CLIENT_SECRET"),
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "redirect_uris": [os.environ.get("REDIRECT_URI")],
    }
}
SCOPES = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'openid'
]

# --- GEMINI PARSING LOGIC ---
def parse_email_content(email_content: str) -> dict | None:
    """
    Takes email text, sends it to Gemini, and returns structured JSON.
    Includes a retry mechanism to handle API rate limiting.
    """
# Inside the parse_email_content function in main.py

    prompt = f"""
You are a world-class financial data extraction engine named 'FinParser'. 
Your primary function is to meticulously analyze the following email content and convert it into a structured, detailed JSON object representing a single financial transaction.

**JSON OUTPUT SCHEMA:**
Your output MUST conform to this exact JSON structure.

{{
  "vendorName": "string",                  // The name of the company or service.
  "transactionDate": "string (YYYY-MM-DD)",// The date of the transaction.
  "orderId": "string | null",              // The order or invoice number, if present.
  "transactionType": "string",             // Enum: "Purchase", "Refund", "Subscription", "Bill Payment". Infer this.
  "currency": "string (ISO 4217 code)",    // e.g., "USD", "EUR", "CAD".
  "subtotal": "number | null",             // The total before taxes and shipping.
  "tax": "number | null",                  // The total tax amount.
  "shipping": "number | null",             // The shipping cost.
  "discounts": "number | null",            // Total amount of discounts or savings.
  "totalAmount": "number",                 // The final grand total the user paid. THIS IS CRITICAL.
  "paymentMethod": "string | null",        // e.g., "Visa ending in 1234", "PayPal", "Bank Account".
  "items": [                               // An array of objects, one for each item purchased.
    {{
      "itemName": "string",                // The specific name of the product or service.
      "itemDescription": "string | null",  // A longer description if available.
      "quantity": "number",                // The quantity of this item. Default to 1.
      "unitPrice": "number",               // The price of a single unit of this item.
      "totalPrice": "number"               // The total price for this line item (quantity * unitPrice).
    }}
  ]
}}

**CRITICAL RULES:**
1.  **JSON ONLY:** You MUST return ONLY the raw JSON object and nothing else. Do not wrap it in markdown like ```json or add any explanatory text.
2.  **THE NULL CASE:** If the email is definitively NOT a financial transaction (e.g., a newsletter, a personal conversation, a shipping notification WITHOUT pricing details), you MUST return the single, lowercase word `null`.
3.  **INFERENCE:** Infer data where possible. If a currency symbol is '$' in a US context, assume 'USD'. If a year is missing, assume the most recent plausible year. For `transactionType`, infer "Subscription" for recurring payments, otherwise "Purchase".
4.  **LINE ITEMS ARE KEY:** Be meticulous. Extract every line item you can find and place it in the `items` array. If it's a single-item purchase (like a Netflix subscription), the `items` array should contain exactly one object.
5.  **TOTALS MUST BE ACCURATE:** The top-level `totalAmount` must be the final, grand total.

**EMAIL CONTENT TO ANALYZE:**
---
{email_content}
---
"""
    
    # Retry logic configuration
    max_retries = 3
    retry_count = 0
    
    while retry_count < max_retries:
        try:
            response = model.generate_content(prompt)
            cleaned_text = response.text.strip().replace('```json', '').replace('```', '').strip()
            
            if cleaned_text.lower() == 'null':
                return None
                
            return json.loads(cleaned_text)

        except exceptions.ResourceExhausted as e:
            # This specifically catches the 429 rate limit error
            retry_count += 1
            wait_time = 10 * retry_count # Exponential backoff (10s, 20s, 30s)
            print(f"⚠️ Rate limit hit. Retrying in {wait_time} seconds... ({retry_count}/{max_retries})")
            time.sleep(wait_time)
            
        except (json.JSONDecodeError, Exception) as e:
            print(f"Error parsing email with Gemini: {e}")
            # For any other error, we don't retry, just fail.
            return None

    # If all retries fail
    print("❌ All retries failed. Skipping this email.")
    return None

def convert_html_to_text(html_content: str) -> str:
    """
    Uses BeautifulSoup to parse HTML content and extract the clean, readable text.
    """
    soup = BeautifulSoup(html_content, 'lxml')
    # Use .get_text() to extract all the text from the HTML tags
    text = soup.get_text(separator=' ', strip=True)
    return text

# Add this new helper function to your main.py
# Replace your old get_email_body function with this one
def get_email_body(msg: dict) -> str | None:
    """
    A much more robust function to extract the text body from a Gmail message object.
    It will prioritize the 'text/plain' part, but if it's not available,
    it will fall back to the 'text/html' part and clean it.
    """
    plain_text = None
    html_text = None

    if 'parts' in msg['payload']:
        # This is a multipart message, iterate through the parts
        for part in msg['payload']['parts']:
            if part['mimeType'] == 'text/plain':
                data = part['body'].get('data')
                if data:
                    plain_text = base64.urlsafe_b64decode(data).decode('utf-8')
                    # Prioritize plain text as it's cleaner
                    break 
            elif part['mimeType'] == 'text/html':
                data = part['body'].get('data')
                if data:
                    html_text = base64.urlsafe_b64decode(data).decode('utf-8')
    elif 'body' in msg['payload']:
        # This is a simple message, check its mimetype
        if msg['payload'].get('mimeType') == 'text/plain':
             data = msg['payload']['body'].get('data')
             if data:
                 plain_text = base64.urlsafe_b64decode(data).decode('utf-8')
        elif msg['payload'].get('mimeType') == 'text/html':
             data = msg['payload']['body'].get('data')
             if data:
                 html_text = base64.urlsafe_b64decode(data).decode('utf-8')

    # --- DECISION LOGIC ---
    if plain_text:
        # If we found plain text, it's the best source.
        return plain_text
    elif html_text:
        # If we only found HTML, clean it and return the text.
        print("--- Found HTML content, converting to plain text... ---")
        return convert_html_to_text(html_text)
    
    # If no usable body is found
    return None

# --- API ENDPOINTS ---

@app.get("/")
def read_root():
    return {"status": "API is running!"}

# --- OAUTH2 & AUTH ENDPOINTS ---
@app.get("/auth/google/login")
def auth_google_login(payload: dict = Depends(verify_token)):
    user_id = payload.get("sub")
    flow = Flow.from_client_config(client_config=client_config, scopes=SCOPES, redirect_uri=os.environ.get("REDIRECT_URI"))
    authorization_url, state = flow.authorization_url(access_type='offline', prompt='consent', state=user_id)
    return {"authorization_url": authorization_url}

@app.get("/auth/google/callback")
async def auth_google_callback(request: Request):
    user_id = request.query_params.get('state')
    code = request.query_params.get('code')
    if not user_id: return {"error": "Invalid state. User ID was not found."}

    flow = Flow.from_client_config(client_config=client_config, scopes=SCOPES, redirect_uri=os.environ.get("REDIRECT_URI"))
    flow.fetch_token(code=code)
    credentials = flow.credentials
    credentials_info = {'token': credentials.token, 'refresh_token': credentials.refresh_token, 'token_uri': credentials.token_uri, 'client_id': credentials.client_id, 'client_secret': credentials.client_secret, 'scopes': credentials.scopes}
    
    # Use the REAL database function
    save_google_credentials_to_db(user_id, credentials_info)
    
    return RedirectResponse(url="/?message=Gmail-Account-Linked-Successfully")

@app.get("/user/profile")
def read_user_profile(payload: dict = Depends(verify_token)):
    user_id = payload.get("sub")
    return {"message": "This is a protected endpoint.", "user_id": user_id}

# --- DATA RETRIEVAL & INSIGHTS ENDPOINTS (NEW SECTION) ---
@app.get("/transactions")
def get_user_transactions(payload: dict = Depends(verify_token)):
    """
    Protected endpoint to fetch all transactions for the logged-in user.
    """
    user_id = payload.get("sub")
    transactions = get_transactions_for_user(user_id)
    return {"transactions": transactions}

@app.get("/summary")
def get_user_summary(payload: dict = Depends(verify_token)):
    """
    Protected endpoint to fetch a spending summary for the logged-in user.
    """
    user_id = payload.get("sub")
    summary = get_spending_summary(user_id)
    return summary

@app.post("/insights")
def get_ai_insights(payload: dict = Depends(verify_token)):
    """
    THE "WOW" ENDPOINT.
    Fetches the user's transactions, formats them, and asks Gemini
    for personalized, actionable financial advice.
    """
    user_id = payload.get("sub")
    transactions = get_transactions_for_user(user_id)

    if len(transactions) < 3:
        raise HTTPException(
            status_code=400,
            detail="Not enough transaction data to generate insights. Please sync your emails first."
        )

    # We use pandas to quickly format the data into a clean summary for the AI
    df = pd.DataFrame(transactions)
    # Convert transactionDate to just the date part for cleaner prompting
    try:
        df['transactionDate'] = pd.to_datetime(df['transactionDate']).dt.date.astype(str)
    except Exception:
        # If date conversion fails for any reason, just ignore it
        pass
    
    # Create a string representation of the most recent transactions for the prompt
    recent_transactions_string = df.head(20).to_string(index=False, columns=['vendorName', 'totalAmount', 'category', 'transactionDate'])
    
    summary = get_spending_summary(user_id)
    summary_string = json.dumps(summary, indent=2)
    recent_transactions_json = json.dumps(transactions[:15], indent=2)
    
    prompt = f"""
You are 'Axiom', a hyper-intelligent, data-driven financial analyst AI. Your goal is to provide profound, non-obvious insights to the user by analyzing their financial data. You are encouraging, insightful, and always focused on uncovering hidden patterns and actionable opportunities.

**USER'S FINANCIAL DATA:**

1.  **Spending Summary (High-Level View):**
    ```json
    {summary_string}
    ```

2.  **Recent Transactions (Detailed, Line-Item View):**
    ```json
    {recent_transactions_json}
    ```

**YOUR TASK:**
Analyze the provided data and generate THREE distinct insights. Each insight must be unique and based on a different analytical angle. Avoid generic advice like "spend less on food." Your insights should be the kind that a human would not easily notice.

**ANALYTICAL ANGLES (Choose three from this list for your response):**

1.  **"Synergy & Savings":** Identify two or more purchases that could be bundled or optimized. (e.g., "I noticed you pay for both Spotify and YouTube Premium. Did you know the YouTube Premium family plan includes YouTube Music, which could replace Spotify and save you money?")
2.  **"Hidden Recurring Costs":** Find a purchase that looks like a one-off but might be an unmanaged subscription or a frequently repeated small purchase that adds up. (e.g., "That $7.99 'Pro App' purchase from last week is a monthly subscription. Is it providing continuous value?")
3.  **"Smart Substitution":** Compare a specific line-item from one vendor to a similar, cheaper alternative you know about from general knowledge or see in their other purchases. (e.g., "I see you bought the 'Brand X' coffee pods from Amazon. You also shop at Costco, where their 'Kirkland Signature' pods, which are highly rated, are 30% cheaper per pod.")
4.  **"Timing is Everything":** Notice a pattern in the timing of purchases that could be optimized. (e.g., "You have three separate 'Urban Outfitters' orders this month. By consolidating your purchases into a single order, you could have met the $75 free shipping threshold and saved nearly $18.")
5.  **"Positive Reinforcement":** Find a genuinely positive spending habit and praise it, explaining why it's a smart financial move. (e.g., "Your consistent monthly payment to your Chase Freedom card is excellent! Paying your credit card on time is a fantastic way to build a strong credit score.")
6.  **"Redundancy Check":** Identify purchases of similar items or services that might be redundant. (e.g., "You have active subscriptions to both Netflix and Hulu. While they have different content, it's worth checking if you're getting full value from both, as their purposes overlap significantly.")

**OUTPUT FORMAT:**
You MUST return a single, valid JSON object. The root key must be "insights". This key holds a list of three insight objects. Each insight object must have three keys: `type`, `headline`, and `detail`.

- `type`: A short string identifier for the analytical angle you used (e.g., "SynergySavings", "HiddenCost", "SmartSubstitution", "PositiveReinforcement").
- `headline`: A short, catchy, one-sentence summary of the insight.
- `detail`: A friendly, detailed paragraph (2-3 sentences) explaining the insight and suggesting a clear, actionable next step.

**EXAMPLE OUTPUT:**

{{
  "insights": [
    {{
      "type": "TimingIsEverything",
      "headline": "You could save on shipping fees by bundling your online orders.",
      "detail": "I noticed you placed three separate orders with Amazon this month, each with a small shipping fee. By planning ahead and using the shopping cart to group these into a single order over $35, you could take advantage of free shipping and save that money for something else!"
    }},
    {{
      "type": "HiddenCost",
      "headline": "A recent app purchase might be a recurring subscription.",
      "detail": "That 'Photo Edit Pro' app you bought for $9.99 is a monthly charge. It's a great tool, but it's worth double-checking that you're using it enough to justify the ongoing cost. You can usually manage subscriptions in your phone's app store settings."
    }},
    {{
      "type": "PositiveReinforcement",
      "headline": "Your regular credit card payment is a brilliant financial habit!",
      "detail": "Great job on making that scheduled payment to your Chase card! Consistently paying your credit card bills on time is one of the best ways to build a strong credit history, which opens up better financial opportunities in the future. Keep up the amazing work!"
    }}
  ]
}}
    """
    try:
        response = model.generate_content(prompt)
        # We can reuse the cleaning logic from the email parser
        cleaned_json_string = response.text.strip().replace('```json', '').replace('```', '').strip()
        insights_data = json.loads(cleaned_json_string)
        return insights_data

    except Exception as e:
        print(f"Error getting insights from Gemini: {e}")
        raise HTTPException(status_code=500, detail="Could not generate AI insights at this time.")

# --- CORE FUNCTIONALITY ENDPOINT ---


@app.post("/email/sync")
def sync_emails(payload: dict = Depends(verify_token)):
    """
    FULLY OPERATIONAL ENDPOINT.
    Connects to Gmail using stored credentials, fetches emails, parses them with AI,
    and saves the structured data to MongoDB.
    """
    user_id = payload.get("sub")
    print(f"Starting email sync for user: {user_id}")

    # 1. Get user's Google credentials from the REAL database
    creds_info = get_google_credentials_from_db(user_id)
    if not creds_info or "token" not in creds_info:
        raise HTTPException(status_code=400, detail="User has not linked their Google account. Please link it first.")
    
    creds = Credentials.from_authorized_user_info(creds_info)

    try:
        # 2. Build the Gmail service client
        service = build('gmail', 'v1', credentials=creds)

        # 3. Search for emails with relevant keywords (last 30 days)
        query = """
            (receipt OR invoice OR "billing statement" OR "account statement" OR "monthly statement"
            OR "payment received" OR "payment scheduled" OR "payment confirmation" OR "transaction alert"
            OR "credit card statement" OR "debit card" OR "bank statement" OR "wire transfer"
            OR "direct deposit" OR "ACH transfer" OR "funds received" OR "refund issued" OR "rebate"
            OR "order confirmation" OR "your order" OR "purchase confirmation" OR "purchase receipt"
            OR "shipping confirmation" OR "delivery confirmation" OR "tracking number"
            OR "subscription renewal" OR "subscription receipt" OR "billing notice" OR "charge notice"
            OR "account debit" OR "account credit" OR "payment processed" OR "transaction receipt")
            newer_than:30d
            -has:calendar
            -newsletter -unsubscribe -promotional -promotion -marketing -survey -event -webinar
            -invitation -rsvp -social -noreply -auto -AMA
            """.strip()
        results = service.users().messages().list(userId='me', q=query).execute()
        messages = results.get('messages', [])
        
        parsed_transactions = []
        if not messages:
            return {"message": "No new financial emails found in the last 30 days."}

        print(f"Found {len(messages)} relevant emails. Processing up to 10.")
        # 4. Loop through messages, get content, and parse
        for message in messages[:10]: # Limit to 10 for hackathon speed
            msg = service.users().messages().get(userId='me', id=message['id'], format='full').execute()
            
            # Find the email body and decode it
            # Use our new robust function to get the email body
            email_body_text = get_email_body(msg)
            
            if email_body_text:
                # For debugging, let's print the first few hundred characters of the email we're parsing
                print("--- PARSING EMAIL BODY (first 300 chars) ---")
                print(email_body_text[:300])
                print("---------------------------------------------")

                parsed_data = parse_email_content(email_body_text)
                if parsed_data:
                    print(f"✅ SUCCESS: Parsed transaction: {parsed_data.get('vendorName')}")
                    parsed_transactions.append(parsed_data)
                else:
                    print("❌ FAILED: Gemini returned null for the above email body.")
                
                # 5. Save the results to the REAL database
        save_result = save_transactions_to_db(user_id, parsed_transactions)
        return {"status": "Sync complete", "found_emails": len(messages), "parsed_transactions": len(parsed_transactions), "db_result": save_result}

    except HttpError as error:
        print(f"An error occurred with the Gmail API: {error}")
        raise HTTPException(status_code=500, detail="Failed to connect to Gmail API. The user may need to re-authenticate.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")