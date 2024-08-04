package products

import (
	"fmt"
	"transactions/api/db"

	sq "github.com/Masterminds/squirrel"
)

type Products struct {
	id      string
	stock   uint8
	slug    string
	version uint8
}

type ProductsRepo struct {
}

const TestProductSlug = "bike"

func (order *ProductsRepo) SelectAndUpdate() error {
	getStockQuery := sq.Select("stock").From("products").Where(sq.Eq{"slug": TestProductSlug}).Limit(1)

	stockRes, err := getStockQuery.RunWith(db.DB()).Query()

	queryStr, _, _ := getStockQuery.ToSql()
	fmt.Println("Query:", queryStr)
	fmt.Println("Res:", stockRes)
	fmt.Println("Err:", err)

	rawQ, err := db.DB().Query("SELECT stock FROM products WHERE slug = $1", TestProductSlug)

	fmt.Println("rawQ:", rawQ)
	fmt.Println("Err:", err)

	// updateStatement := sq.Update("products").Set("stock", stockRes).Where(sq.Eq{"slug": TestProductSlug})

	// stockRes, err := getStockQuery.RunWith(db.DB()).Query()

	return err
}
