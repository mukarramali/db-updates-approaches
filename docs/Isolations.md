# Transactions

## Weak Isolation Levels

### Read Committed

1. **Reads:** Only committed data is visible (no dirty reads).
2. **Writes:** Only committed data is overwritten (no dirty writes).

### Snapshot Isolation

- **Overview:** Takes a snapshot of the data at the beginning of a transaction. Reads see a consistent snapshot regardless of changes made by other transactions.
- **Indexes:** Point to all versions; a garbage collector cleans older versions or creates a new B Tree copy for each transaction (compaction required).

### Repeatable Read

- **Definition:** Once a transaction reads data, it ensures the same data will not be changed by other transactions until it completes.
- **Mechanism:** Locks the rows it reads.

### Write Skew

- **Occurrence:** When two transactions read the same objects and then update some of those objects.
- **Anomalies:**
  - **Dirty Write:** Different transactions update the same object.
  - **Lost Update:** Depending on timing.
- **Example:** Meeting room booking, signing off from on-call duty, preventing double spending.
- **Phantoms:** A write in one transaction changes the result of a search query in another transaction.

#### Materialize Conflict

- **Mechanism:** Create records for booking a room, then transactions request locks. Used as a last resort.

### Preventing Lost Updates

- **Cause:** Happens in read-modify-write cycles.
- **Solutions:**
  1. **Atomic Write Operations:**
     ```sql
     UPDATE counters SET value = value + 1 WHERE key = 'foo';
     ```
  2. **INCR/DECR Operations:** Provided by the DB.
  3. **Explicit Locking:**
     ```sql
     BEGIN TRANSACTION;
     SELECT * FROM figures WHERE name = 'robot' AND game_id = 222 FOR UPDATE;
     UPDATE figures SET position = 'c4' WHERE id = 1234;
     COMMIT;
     ```
  4. **Automatic Detection by DB.**
  5. **Compare-and-Set:**
     ```sql
     UPDATE wiki_pages SET content = 'new content' WHERE id = 1234 AND content = 'old content';
     ```

## Strongest Isolation

### Serializability

1. **Execution:** Literally executing transactions in serial order.
2. **Two-Phase Locking:** The traditional viable option for several decades.
3. **Optimistic Concurrency Control:** Techniques such as serializable snapshot isolation.

#### Actual Serialization and Single-Threaded Concept

- **Advantages:**
  1. **RAM Efficiency:** RAM is cheaper, and data can be in memory.
  2. **OLTP (Online Transaction Processing):** Smaller DBs supported by RAM; OLAP (Online Analytical Processing) can be done by snapshot isolation.
  - **Performance:** Avoids the coordination overhead of locking.
  - **Example:** Redis.
  - **Stored Procedures:** Reduce multiple network calls with DB.
  - **Write Throughput:** Must be low enough for a single CPU core, or transactions need partitioning without requiring cross-partition coordination.
- **Cross-Partition Transactions:** Possible but limited in extent.
