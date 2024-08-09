package products

type Product struct {
	ID      string `gorm:"primaryKey"`
	Slug    string
	Stock   int64
	Version int8
}

func (Product) TableName() string {
	return "products"
}
