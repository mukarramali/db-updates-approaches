package main

import "transactions/api/products"

func main() {
	repo := products.ProductsRepo{}
	repo.SelectAndUpdate()
}
