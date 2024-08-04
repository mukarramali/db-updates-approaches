# Database Transactions: Understanding Race Conditions

## 1. SQL Scripts Without Transactions

### Order: Create Order and Reduce Stock

#### Example Code

```sql
-- Create an order for the user
INSERT INTO orders (user_id, product_id, quantity) VALUES (1, 101, 2);

-- Reduce the stock of the product
UPDATE products SET stock = stock - 2 WHERE product_id = 101;
```

### Potential Race Conditions

- **Lost Update:**

  - Two users order the same product simultaneously. The stock reduction might not reflect both orders correctly.
  - Example:
    ```text
    T1: INSERT INTO orders (user_id, product_id, quantity) VALUES (1, 101, 2);
    T2: INSERT INTO orders (user_id, product_id, quantity) VALUES (2, 101, 2);
    T1: UPDATE products SET stock = stock - 2 WHERE product_id = 101; -- Stock: 8
    T2: UPDATE products SET stock = stock - 2 WHERE product_id = 101; -- Stock: 8 (should be 6)
    ```

- **Inconsistency:**
  - If the first statement succeeds but the second fails, the database will be in an inconsistent state.
  - Example:
    ```text
    T1: INSERT INTO orders (user_id, product_id, quantity) VALUES (1, 101, 2);
    T1: UPDATE products SET stock = stock - 2 WHERE product_id = 101; -- Fails
    ```

### Return: Remove Order and Increase Stock

#### Example Code

```sql
-- Remove the order for the user
DELETE FROM orders WHERE user_id = 1 AND product_id = 101 AND quantity = 2;

-- Increase the stock of the product
UPDATE products SET stock = stock + 2 WHERE product_id = 101;
```

### Potential Race Conditions

- **Lost Update:**

  - Concurrent returns might not correctly update the stock.
  - Example:
    ```text
    T1: DELETE FROM orders WHERE user_id = 1 AND product_id = 101 AND quantity = 2;
    T2: DELETE FROM orders WHERE user_id = 2 AND product_id = 101 AND quantity = 2;
    T1: UPDATE products SET stock = stock + 2 WHERE product_id = 101; -- Stock: 12
    T2: UPDATE products SET stock = stock + 2 WHERE product_id = 101; -- Stock: 12 (should be 14)
    ```

- **Inconsistency:**
  - If the first statement succeeds but the second fails, the stock count will be incorrect.
  - Example:
    ```text
    T1: DELETE FROM orders WHERE user_id = 1 AND product_id = 101 AND quantity = 2;
    T1: UPDATE products SET stock = stock + 2 WHERE product_id = 101; -- Fails
    ```

==================================================================================================================

## 2. Use Atomic Operations, But Still Without Transactions

### Order: Create Order and Reduce Stock

#### Example Code

```sql
-- Atomic operation using a single statement
WITH new_order AS (
    INSERT INTO orders (user_id, product_id, quantity)
    VALUES (1, 101, 2)
    RETURNING product_id, quantity
)
UPDATE products
SET stock = stock - new_order.quantity
FROM new_order
WHERE products.product_id = new_order.product_id;
```

### Potential Race Conditions

- **Concurrency Issues:**
  - High concurrency can still lead to issues without proper locking mechanisms.
  - Example:
    ```text
    T1: INSERT INTO orders (user_id, product_id, quantity) VALUES (1, 101, 2) RETURNING product_id, quantity;
    T2: INSERT INTO orders (user_id, product_id, quantity) VALUES (2, 101, 2) RETURNING product_id, quantity;
    T1: UPDATE products SET stock = stock - 2 WHERE product_id = 101; -- Stock: 8
    T2: UPDATE products SET stock = stock - 2 WHERE product_id = 101; -- Stock: 8 (should be 6)
    ```

### Return: Remove Order and Increase Stock

#### Example Code

```sql
-- Atomic operation using a single statement
WITH removed_order AS (
    DELETE FROM orders
    WHERE user_id = 1 AND product_id = 101 AND quantity = 2
    RETURNING product_id, quantity
)
UPDATE products
SET stock = stock + removed_order.quantity
FROM removed_order
WHERE products.product_id = removed_order.product_id;
```

### Potential Race Conditions

- **Concurrency Issues:**
  - High concurrency can still lead to issues without proper locking mechanisms.
  - Example:
    ```text
    T1: DELETE FROM orders WHERE user_id = 1 AND product_id = 101 AND quantity = 2 RETURNING product_id, quantity;
    T2: DELETE FROM orders WHERE user_id = 2 AND product_id = 101 AND quantity = 2 RETURNING product_id, quantity;
    T1: UPDATE products SET stock = stock + 2 WHERE product_id = 101; -- Stock: 12
    T2: UPDATE products SET stock = stock + 2 WHERE product_id = 101; -- Stock: 12 (should be 14)
    ```

==================================================================================================================

## 3. Use Transactions

### Order: Create Order and Reduce Stock

#### Example Code

```sql
BEGIN;

-- Create an order for the user
INSERT INTO orders (user_id, product_id, quantity) VALUES (1, 101, 2);

-- Reduce the stock of the product
UPDATE products SET stock = stock - 2 WHERE product_id = 101;

COMMIT;
```

### Benefit

- **Consistency:**
  - Both statements succeed or fail together, ensuring the database remains consistent.

### Return: Remove Order and Increase Stock

#### Example Code

```sql
BEGIN;

-- Remove the order for the user
DELETE FROM orders WHERE user_id = 1 AND product_id = 101 AND quantity = 2;

-- Increase the stock of the product
UPDATE products SET stock = stock + 2 WHERE product_id = 101;

COMMIT;
```

### Benefit

- **Consistency:**
  - Ensures the stock is correctly updated if the order is removed, maintaining database consistency.

==================================================================================================================

## 4. Consider It's a Distributed System

### Order: Create Order and Reduce Stock

#### Example Code Using Two-Phase Commit (2PC)

```sql
-- Phase 1: Prepare
BEGIN;

-- Create an order for the user
INSERT INTO orders (user_id, product_id, quantity) VALUES (1, 101, 2);

-- Reduce the stock of the product
UPDATE products SET stock = stock - 2 WHERE product_id = 101;

PREPARE TRANSACTION 'order_transaction';

-- Phase 2: Commit
COMMIT PREPARED 'order_transaction';
```

### Return: Remove Order and Increase Stock

#### Example Code Using Two-Phase Commit (2PC)

```sql
-- Phase 1: Prepare
BEGIN;

-- Remove the order for the user
DELETE FROM orders WHERE user_id = 1 AND product_id = 101 AND quantity = 2;

-- Increase the stock of the product
UPDATE products SET stock = stock + 2 WHERE product_id = 101;

PREPARE TRANSACTION 'return_transaction';

-- Phase 2: Commit
COMMIT PREPARED 'return_transaction';
```

### Benefit

- **Distributed Consistency:**
  - Ensures that both parts of the operation (order creation and stock reduction, order removal and stock increase) either commit or roll back together, maintaining consistency across distributed systems.

### Potential Race Conditions

- **Network Partitions:**

  - If network issues occur during the two-phase commit, the system might end up in an uncertain state.
  - Example:
    ```text
    T1: BEGIN;
    T1: INSERT INTO orders (user_id, product_id, quantity) VALUES (1, 101, 2);
    T1: UPDATE products SET stock = stock - 2 WHERE product_id = 101;
    Network partition occurs...
    T1: PREPARE TRANSACTION 'order_transaction'; -- Fails
    ```

- **Timeouts:**
  - If a transaction takes too long to complete, it might cause timeouts in other parts of the system.
  - Example:
    ```text
    T1: BEGIN;
    T1: INSERT INTO orders (user_id, product_id, quantity) VALUES (1, 101, 2);
    Long-running operation...
    T1: UPDATE products SET stock = stock - 2 WHERE product_id = 101;
    T1: PREPARE TRANSACTION 'order_transaction'; -- Times out
    ```

By understanding and addressing these potential race conditions, you can design more robust and reliable database transactions, even in complex distributed systems.
