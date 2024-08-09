package products

import (
	connections "transactions/connections/db"

	"gorm.io/gorm"
)

type ProductsRepo struct {
}

const TestProductSlug = "bike"

func (pr *ProductsRepo) WhereSlug(slug string) *gorm.DB {
	client := connections.DBClient()
	return client.Table("products").
		Where("slug = ?", slug)
}

func (pr *ProductsRepo) SelectAndUpdate() (*Product, error) {
	var product *Product = &Product{Slug: "bike"}

	result := pr.WhereSlug(TestProductSlug).
		Select("stock").
		First(&product)

	if result.Error != nil {
		return nil, result.Error
	}

	err := pr.WhereSlug(TestProductSlug).Update("stock", product.Stock-1).Error

	if err != nil {
		return nil, err
	}

	return product, nil
}
