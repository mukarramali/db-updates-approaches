export class SimpleQueue {
  private queue: (() => Promise<void>)[] = [];
  private processing: boolean;
  constructor() {
    this.queue = [];
    this.processing = false;
  }

  async processQueue() {
    if (this.processing) return;
    this.processing = true;

    while (this.queue.length > 0) {
      const task = this.queue.shift();
      try {
        await task();
      } catch (error) {
        console.error("Error processing task:", error);
      }
    }

    this.processing = false;
  }

  addTask(task: () => Promise<void>) {
    this.queue.push(task);
    this.processQueue();
  }
}

// Usage
export const queue = new SimpleQueue();
