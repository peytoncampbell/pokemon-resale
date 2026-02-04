ALTER TABLE transactions ADD COLUMN shipping_cost decimal(10,2) DEFAULT 0;
ALTER TABLE transactions ADD CONSTRAINT transactions_shipping_cost_non_negative CHECK (shipping_cost >= 0);
