# Why do we need Transactions?

In the harsh reality of data systems, many things can go wrong:

• The database software or hardware may fail at any time (including in the middle of a write operation).
• The application may crash at any time (including halfway through a series of operations).
• Interruptions in the network can unexpectedly cut off the application from the database, or one database node from another.
• Several clients may write to the database at the same time, overwriting each other’s changes.
• A client may read data that doesn’t make sense because it has only partially been updated.
• Race conditions between clients can cause surprising bugs.
