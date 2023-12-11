from lib import CreditAccount

# In this file there are several testcases that are imported into rest.py to be passed
# into the app. This file can also be ran to test these cases. 

# This first test makes a $500 transaction, pays it, but then has the merchant
# refund it so it increases the available credit past the credit limit and
# makes the payable balance negative. I wanted to test for these two strange edge cases.
testCase1 = {
    "creditLimit": 1000,
    "events": [
        {
            "eventType": "TXN_AUTHED",
            "eventTime": 1,
            "txnId": "t1",
            "amount": 500
        },
        {
            "eventType": "TXN_SETTLED",
            "eventTime": 2,
            "txnId": "t1",
            "amount": 500
        },
        {
            "eventType": "PAYMENT_INITIATED",
            "eventTime": 3,
            "txnId": "p1",
            "amount": -500
        },
        {
            "eventType": "PAYMENT_POSTED",
            "eventTime": 4,
            "txnId": "p1",
        },
        {
            "eventType": "TXN_AUTHED",
            "eventTime": 5,
            "txnId": "t2",
            "amount": -500
        },
        {
            "eventType": "TXN_SETTLED",
            "eventTime": 6,
            "txnId": "t2",
            "amount": -500
        }
    ]
}

testAccount1 = CreditAccount(testCase1, True)
answer1 = (
    "Available credit: $1500\n" \
    "Payable balance: -$500\n\n" \
    "Pending transactions:\n" \
    "\n" \
    "Settled transactions:\n" \
    "t2: -$500 @ time 5 (finalized @ time 6)\n" \
    "p1: -$500 @ time 3 (finalized @ time 4)\n" \
    "t1: $500 @ time 1 (finalized @ time 2)"
)
answer1.strip()
assert testAccount1.generate_account_statement() == answer1

# This second test case tests what happens when a transaction is authorized but then
# a large amount is added to the transactions when it is settled that exceeds
# the available credit.
testCase2 = {
    "creditLimit": 500,
    "events": [
        {
            "eventType": "TXN_AUTHED",
            "eventTime": 1,
            "txnId": "t1",
            "amount": 500
        },
        {
            "eventType": "TXN_SETTLED",
            "eventTime": 2,
            "txnId": "t1",
            "amount": 5000
        },
    ]
}

testAccount2 = CreditAccount(testCase2, True)
answer2 = (
    "Available credit: -$4500\n" \
    "Payable balance: $5000\n\n" \
    "Pending transactions:\n" \
    "\n" \
    "Settled transactions:\n" \
    "t1: $5000 @ time 1 (finalized @ time 2)" \
)

answer2.strip()
assert testAccount2.generate_account_statement() == answer2


# This test case tests the opposite of test case 2 where a transaction has hold
# for a certain amount ($500) but when it is settled the amount is lowered ($50).
# This test case was not explictly stated on the write up but I believe gas stations
# do something like this for debit cards and maybe credit cards. So, I wanted to extend
# this functionality.
testCase3 = {
    "creditLimit": 500,
    "events": [
        {
            "eventType": "TXN_AUTHED",
            "eventTime": 1,
            "txnId": "t1",
            "amount": 500
        },
        {
            "eventType": "TXN_SETTLED",
            "eventTime": 2,
            "txnId": "t1",
            "amount": 50
        },
    ]
}

testAccount3 = CreditAccount(testCase3, True)
answer3 = (
    "Available credit: $450\n" \
    "Payable balance: $50\n\n" \
    "Pending transactions:\n" \
    "\n" \
    "Settled transactions:\n" \
    "t1: $50 @ time 1 (finalized @ time 2)" \
)
answer3.strip()
assert testAccount3.generate_account_statement() == answer3

# This test case tests the behavior of making a transaction authorization that
# exceeds the available credit.

testCase4 = {
    "creditLimit": 500,
    "events": [
        {
            "eventType": "TXN_AUTHED",
            "eventTime": 1,
            "txnId": "t1",
            "amount": 5000
        },
    ]
}

testAccount4 = CreditAccount(testCase4, True)
answer4 = (
    "Available credit: $500\n" \
    "Payable balance: $0\n\n" \
    "Pending transactions:\n" \
    "\n" \
    "Settled transactions:" \
)
answer4.strip()
assert testAccount4.generate_account_statement() == answer4

# This new test case tests for when there are multiple pending transactions.
# Originally I was incorrectly sorting pending transactions.
testCase5 = {
    "creditLimit": 1000,
    "events": [
        {
            "eventType": "TXN_AUTHED",
            "eventTime": 1,
            "txnId": "t1",
            "amount": 500
        },
        {
            "eventType": "TXN_SETTLED",
            "eventTime": 2,
            "txnId": "t1",
            "amount": 500
        },
        {
            "eventType": "PAYMENT_INITIATED",
            "eventTime": 3,
            "txnId": "p1",
            "amount": -500
        },
        {
            "eventType": "PAYMENT_POSTED",
            "eventTime": 4,
            "txnId": "p1",
        },
        {
            "eventType": "TXN_AUTHED",
            "eventTime": 5,
            "txnId": "t2",
            "amount": -500
        },
        {
            "eventType": "TXN_SETTLED",
            "eventTime": 6,
            "txnId": "t2",
            "amount": -500
        },
        {
            "eventType": "TXN_AUTHED",
            "eventTime": 7,
            "txnId": "t3",
            "amount": 100
        },
                    {
            "eventType": "TXN_AUTHED",
            "eventTime": 8,
            "txnId": "t4",
            "amount": 200
        },
                    {
            "eventType": "TXN_AUTHED",
            "eventTime": 9,
            "txnId": "t5",
            "amount": 300
        }
    ]
}

testAccount5 = CreditAccount(testCase5, True)
answer5 = (
    "Available credit: $900\n" \
    "Payable balance: -$500\n\n" \
    "Pending transactions:\n" \
    "t5: $300 @ time 9\n" \
    "t4: $200 @ time 8\n" \
    "t3: $100 @ time 7\n\n" \
    "Settled transactions:\n" \
    "t2: -$500 @ time 5 (finalized @ time 6)\n" \
    "p1: -$500 @ time 3 (finalized @ time 4)\n" \
    "t1: $500 @ time 1 (finalized @ time 2)"
)
answer5.strip()
assert testAccount5.generate_account_statement() == answer5