#!/bin/python3

import math
import os
import random
import re
import sys

# This file is modified original code from a different project. New functions were
# added to service the needs to the React Native App. 



import json
# I put settled\pending transaction in OrderDicts to preserve
# order in which they were entered which is important to when 
# generating the output
from collections import OrderedDict

# I originally did everything in just the summarize function 
# and I had to nest layers of conditionals which looked nasty.
# I also was passing 3-5 parameters to other helper functions 
# which could have just been attributes in a class.

# I decided to make the CreditAccount class because this problem
# lends its self very well to OOP. 
class CreditAccount:
    # We turn the data into json using json.loads().
    # We initialize the available credit, the payment balance,
    # as well as the settled and pending transactions.
    # Finally, we call the handle_events() method to
    # produce the final versions of these previous attributes
    # and set them up for generate_account_statement
    def __init__(self, inputJSON, isJSON=False):
        if isJSON:
            input_data = inputJSON
        else:
            input_data = json.loads(inputJSON)
        self.credit_limit = input_data['creditLimit']
        self.available_credit = input_data['creditLimit']
        self.payable_balance = 0
        self.events = input_data['events']
        self.settled = OrderedDict()
        self.pending = OrderedDict()
        
        # Sorts events in ascending order by event time.
        # I believe they are already sorted but this is how you
        # would do it otherwise.
        self.events.sort(key=lambda event: event['eventTime'])
        self.handle_events()
    
    # These next 6 functions are for their corresponding event types.
    # They are called by handle_events. They all vary slightly to meet
    # the requirements.
       
    def txn_authed(self, event):
        if event['amount'] <= self.available_credit:
            self.available_credit -= event['amount']
            self.pending[event['txnId']] = event
        else:
            print('This transaction would exceed the available credit.')
            
    def txn_settled(self, event):
        if event['txnId'] in self.pending:
            initial_transaction = self.pending[event['txnId']]
            if initial_transaction['amount'] < event['amount']:
                self.available_credit -= event['amount'] - initial_transaction['amount']
            if initial_transaction['amount'] > event['amount']:
                self.available_credit -= event['amount'] - initial_transaction['amount']
            self.payable_balance += event['amount']
            if len(self.settled) == 3:
                self.settled.popitem(last=False)
            self.settled[event['txnId']] = event
            self.settled[event['txnId']]['initialTime'] = initial_transaction['eventTime']
            self.pending.pop(event['txnId'])
        else:
            print('Settled Transaction does not exist.')
            
    def txn_auth_cleared(self, event):
        if event['txnId'] in self.pending:
            initial_transaction = self.pending[event['txnId']]
            self.available_credit += initial_transaction['amount']
            self.pending.pop(event['txnId'])
        else:
            print('Cleared Transactions does not exist.')
            
    def payment_initiated(self, event):
        if event['amount'] <= self.payable_balance:
            self.pending[event['txnId']] = event
            self.payable_balance += event['amount']
        else:
            print('This payment would exceed the payable balance.')
            
    def payment_posted(self, event):
        if event['txnId'] in self.pending:
            initial_payment = self.pending[event['txnId']]
            self.available_credit -= initial_payment['amount']
            if len(self.settled) == 3:
                self.settled.popitem(last=False)
            self.settled[event['txnId']] = event
            self.settled[event['txnId']]['initialTime'] = initial_payment['eventTime']
            self.settled[event['txnId']]['amount'] = initial_payment['amount']
            self.pending.pop(event['txnId'])
        else:
            print('Posted Payment does not exist.')
            
    def payment_canceled(self, event):
        if event['txnId'] in self.pending:
            initial_payment = self.pending[event['txnId']]
            self.payable_balance -= initial_payment['amount']
            self.pending.pop(event['txnId'])
        else:
            print('Canceled Payment does not exist.')
    
    def handle_events(self):
        for event in self.events:
            if event['eventType'] == 'TXN_AUTHED':
                self.txn_authed(event)
            elif event['eventType'] == 'TXN_SETTLED':
                self.txn_settled(event)
            elif event['eventType'] == 'TXN_AUTH_CLEARED':
                self.txn_auth_cleared(event)
            elif event['eventType'] == 'PAYMENT_INITIATED':
                self.payment_initiated(event)
            elif event['eventType'] == 'PAYMENT_POSTED':
                self.payment_posted(event)
            elif event['eventType'] == 'PAYMENT_CANCELED':
                self.payment_canceled(event)
            else:
                print("INVALID EVENT TYPE: {event['eventType']} is not a valid event type.")

    # Updates the class from one new event
    def new_event(self, event):
        if event['eventType'] == 'TXN_AUTHED':
            self.txn_authed(event)
        elif event['eventType'] == 'TXN_SETTLED':
            self.txn_settled(event)
        elif event['eventType'] == 'TXN_AUTH_CLEARED':
            self.txn_auth_cleared(event)
        elif event['eventType'] == 'PAYMENT_INITIATED':
            self.payment_initiated(event)
        elif event['eventType'] == 'PAYMENT_POSTED':
            self.payment_posted(event)
        elif event['eventType'] == 'PAYMENT_CANCELED':
            self.payment_canceled(event)
        else:
            print("INVALID EVENT TYPE: {event['eventType']} is not a valid event type.")
             
    # This method generates the account information we want by initializeing
    # an account_info string and then adding all the postions we need by using
    # fstring. 
    def generate_account_statement(self):
        # Adds available credit and payable balance
        # Check for edge cases where they are negative
        if self.available_credit >= 0:
            account_info = f"Available credit: ${self.available_credit}\n"
        else:
            account_info = f"Available credit: -${abs(self.available_credit)}\n"
        if self.payable_balance >= 0:
            account_info += f"Payable balance: ${self.payable_balance}\n\n"
        else:
            account_info += f"Payable balance: -${abs(self.payable_balance)}\n\n"
        
        # Adds pending tranactions
        account_info += 'Pending transactions:\n'
        for eventId in reversed(self.pending):
            event = self.pending[eventId]
            # This amount if statement cover the edge case
            # where amount is negative to avoid producing $-123
            if event['amount'] >= 0:
                amount = f"${event['amount']}"
            else:
                amount = f"-${abs(event['amount'])}"
            account_info += f"{event['txnId']}: {amount} @ time {event['eventTime']}\n"
        
        # Adds Settled Transactions
        account_info += '\nSettled transactions:'
    
        for eventId in reversed(self.settled):
            event = self.settled[eventId]
            if event['amount'] >= 0:
                amount = f"${event['amount']}"
            else:
                amount = f"-${abs(event['amount'])}"
            account_info += f"\n{event['txnId']}: {amount} @ time {event['initialTime']} (finalized @ time {event['eventTime']})"
            
        # Strips trialing newline
        account_info.strip()
    
        return account_info

    def account_info_json(self):
        pending_events = [
            self.pending[id] for id in reversed(self.pending)
        ]
        settled_events = [
            self.settled[id] for id in reversed(self.settled)
        ]
        return {
            'creditLimit': self.credit_limit,
            'availableCredit': self.available_credit,
            'payableBalance': self.payable_balance,
            'pendingEvents': pending_events,
            'settledEvents': settled_events
        }

    def add_event(self, event):
        self.events.append(event)

    def class_json(self):
        return {
            'creditLimit': self.credit_limit,
            'events': self.events
        }

# The summarize function make a new CreditAccount class and feeds it
# inputJSON. It then returns the classes generate_account_statement method.
def summarize(inputJSON):
    transactionHandler = CreditAccount(inputJSON)
    
    return transactionHandler.generate_account_statement()