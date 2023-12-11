# app.py
import os
from supabase import create_client, Client
from flask import Flask, request, jsonify
from lib import CreditAccount

# rest.py is the flask based backend for app. Here we
#
#   1. Import the CreditAccount class from lib
#   2. Make the /account endpoint that deals with updating the creditAccount
#      instance.
#   3. Make the /testcase endpoint that swaps the the current testcase with the next one.

app = Flask(__name__)

global credit_account

url = "https://rmhogcrxfpwwzeejlimk.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtaG9nY3J4ZnB3d3plZWpsaW1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDE1NjI3NjUsImV4cCI6MjAxNzEzODc2NX0.1SJp7YQ-MCzV4svZgLye5oODmuh5lLrwY7qVaGug-Y8"
supabase = create_client(url, key)

response = supabase.table('UserData').select("user_transactions").filter('id', 'in', '("cgarcia0@stanford.edu")').execute()

credit_account = CreditAccount(response.data[0].get('user_transactions', 0), isJSON=True)

# Returns account info
@app.get("/account/<userid>")
def get_account_info(userid):
    global credit_account
    response = supabase.table('UserData').select("user_transactions").filter('id', 'in', f"({userid})").execute()
    credit_account = CreditAccount(response.data[0].get('user_transactions', 0), isJSON=True)
    return jsonify(credit_account.account_info_json())

# Givens a new event to credit_account and passes into the new_event() method
@app.post("/account/<userid>")
def process_transaction(userid):
    global credit_account
    if request.is_json:
        event = request.get_json()
        credit_account.add_event(event)
        supabase.table('UserData').update({'user_transactions': credit_account.class_json()}).eq("id", userid).execute()
        return get_account_info(userid), 201
    return {"error": "Request must be JSON"}, 415
