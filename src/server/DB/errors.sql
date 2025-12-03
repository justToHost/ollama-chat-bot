
CREATE TABLE IF NOT EXISTS unknown_errors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    error_signature TEXT NOT NULL,
    reference_code TEXT,
    user_friendly_title TEXT,
    simple_explanation TEXT,
    user_actions TEXT
);

INSERT INTO unknown_errors (error_signature, reference_code, user_friendly_title, simple_explanation, user_actions) VALUES
('NullReferenceException at line 42 in PaymentProcessor.cs', 'ERR001', 'Payment Processing Error', 'An unexpected error occurred while processing your payment.', 'Please try again later or contact support if the issue persists.')

