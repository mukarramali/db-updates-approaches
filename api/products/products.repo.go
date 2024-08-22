package products

import (
	"transactions/connections/db"
	"transactions/connections/db/models"

	"gorm.io/gorm"
)

type ProductsRepo struct {
}

const TestProductSlug = "bike"

func (pr *ProductsRepo) WhereSlug(slug string) *gorm.DB {
	client := db.DBClient()
	return client.Table("products").
		Where("slug = ?", slug)
}

func (pr *ProductsRepo) Select(slug string) *models.Product {
	var product *models.Product = &models.Product{Slug: "bike"}

	pr.WhereSlug(TestProductSlug).
		Select("stock").
		First(&product)
	return product
}

func (pr *ProductsRepo) SelectAndUpdate() (*models.Product, error) {
	var product *models.Product = &models.Product{Slug: "bike"}

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
