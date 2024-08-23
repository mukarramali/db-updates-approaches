package main

import (
	"fmt"
	"math/rand"
	"net/http"
	"sync"
	"time"
)

const (
	CONCURRENT_USERS        = 400
	CONCURRENCY_MAX_LATENCY = 10 * time.Millisecond
	strategy                = "SelectAndUpdate"
	apiURL                  = "http://localhost:8080?type=%s"
)

func sleepRandomLatency() {
	time.Sleep(time.Duration(rand.Intn(int(CONCURRENCY_MAX_LATENCY))))
}

func makeRequest(wg *sync.WaitGroup, successCount *int, failedRequests *map[int64]int64) {
	defer wg.Done()
	sleepRandomLatency()

	resp, err := http.Post(fmt.Sprintf(apiURL, strategy), "application/json", nil)
	if err != nil || resp.StatusCode >= 400 {
		if failedRequests[resp.StatusCode] == nil {
			failedRequests[resp.StatusCode]
		}
		*rejectCount++
		return
	}
	*successCount++
}

func main() {
	var wg sync.WaitGroup
	successCount := 0
	rejectCount := 0
	failedRequests := map[int]int{}
	wg.Add(CONCURRENT_USERS)

	for i := 0; i < CONCURRENT_USERS; i++ {
		go makeRequest(&wg, &successCount, &failedRequests)
	}

	wg.Wait()

	fmt.Printf("%d requests made with %s approach:\n", CONCURRENT_USERS, strategy)
	fmt.Printf("Success: %d, Rejected: %d\n", successCount, rejectCount)
}
