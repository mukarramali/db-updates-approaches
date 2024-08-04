package products

import (
	"context"
	"transactions/db"
)

type ProductsRepo struct {
}

const TestProductSlug = "bike"

var client *db.PrismaClient
var ctx context.Context

func cleanup() {
	ctx.Done()
	if err := client.Prisma.Disconnect(); err != nil {
		panic(err)
	}
}

func init() {
	ctx = context.Background()
	client = db.NewClient()
	if err := client.Prisma.Connect(); err != nil {
		panic(err)
	}
}

func (order *ProductsRepo) SelectAndUpdate() error {
	stockRes, err := client.Products.
		FindFirst(db.Products.Slug.Equals(TestProductSlug)).
		Select(db.Products.Stock.Field()).
		Exec(ctx)

	if err != nil {
		return err
	}

	_, err = client.Products.
		UpsertOne(db.Products.Slug.Equals(TestProductSlug)).Update(db.Products.Stock.Set(stockRes.Stock - 1)).Exec(ctx)

	return err
}
