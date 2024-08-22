package models

type Product struct {
	ID      string `gorm:"type:uuid;primaryKey"`
	Slug    string `gorm:"unique"`
	Stock   int64  `gorm:"default:0"`
	Version int8   `gorm:"default:0"`
}

func (Product) TableName() string {
	return "products"
}
