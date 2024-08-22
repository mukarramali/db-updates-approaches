package main

import (
	"fmt"
	"net/http"
	"transactions/api/products"
)

var productRepo *products.ProductsRepo

func init() {
	productRepo = &products.ProductsRepo{}
}

func handle(w http.ResponseWriter, r *http.Request) {
	_, error := productRepo.SelectAndUpdate()
	if error != nil {
		fmt.Println(error)
	}
}

func main() {
	http.HandleFunc("/", handle)
	http.ListenAndServe(":8080", nil)
}
