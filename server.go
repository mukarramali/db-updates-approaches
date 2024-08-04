package main

import (
	"net/http"
	"transactions/api/products"
)

var productRepo *products.ProductsRepo

func init() {
	productRepo = &products.ProductsRepo{}
}

func handle(w http.ResponseWriter, r *http.Request) {
	productRepo.SelectAndUpdate()
}

func main() {
	http.HandleFunc("/", handle)
	http.ListenAndServe(":8080", nil)
}
