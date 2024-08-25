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

func makeRequest(wg *sync.WaitGroup, successCount *int, failedRequests map[int]int) {
	defer wg.Done()
	sleepRandomLatency()

	t := http.DefaultTransport.(*http.Transport).Clone()
	t.DisableKeepAlives = true
	httpClient := &http.Client{
		Transport: t,
	}

	resp, err := httpClient.Get(fmt.Sprintf(apiURL, strategy))
	if err != nil {
		statusCode := 0
		if resp != nil {
			statusCode = resp.StatusCode
		}
		if statusCode == 0 {
			fmt.Println(err)
		}
		if count, exists := failedRequests[statusCode]; exists {
			failedRequests[statusCode] = count + 1
		} else {
			failedRequests[statusCode] = 1
		}
		return
	}
	*successCount++
}

func main() {
	var wg sync.WaitGroup
	successCount := 0
	failedRequests := map[int]int{}
	wg.Add(CONCURRENT_USERS)

	for i := 0; i < CONCURRENT_USERS; i++ {
		go makeRequest(&wg, &successCount, failedRequests)
	}

	wg.Wait()

	fmt.Printf("%d requests made with %s approach:\n", CONCURRENT_USERS, strategy)
	fmt.Printf("Success: %d, Rejected: %d\n", successCount, failedRequests)
}
