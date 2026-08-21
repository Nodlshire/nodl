package pricing

import (
	"encoding/json"
	"net/http"
	"time"
)

// FetchAllMarketData runs all fetchers and returns a flattened list of rates.
func FetchAllMarketData() []MarketRate {
	rates := []MarketRate{}
	
	// 1. AWS Spot
	awsRates, _ := fetchAWSSpot()
	rates = append(rates, awsRates...)
	
	// 2. Azure Retail
	azureRates, _ := fetchAzureRetail()
	rates = append(rates, azureRates...)
	
	// 3. GCP Spot
	gcpRates, _ := fetchGCPSpot()
	rates = append(rates, gcpRates...)
	
	// 4. Lambda Labs
	lambdaRates, _ := fetchLambda()
	rates = append(rates, lambdaRates...)

	// 5. Paperspace
	paperspaceRates, _ := fetchPaperspace()
	rates = append(rates, paperspaceRates...)
	
	return rates
}

func fetchAWSSpot() ([]MarketRate, error) {
	// Simulated parse of public AWS Spot Price History (via community/public datasets)
	return []MarketRate{
		{Source: SourceAWS, Price: 0.005, Timestamp: time.Now()}, // t3.nano
		{Source: SourceAWS, Price: 0.02, Timestamp: time.Now()},  // t3.medium
		{Source: SourceAWS, Price: 0.12, Timestamp: time.Now()},  // g4dn.xlarge
		{Source: SourceAWS, Price: 0.45, Timestamp: time.Now()},  // c5.large
		{Source: SourceAWS, Price: 2.50, Timestamp: time.Now()},  // p3.2xlarge
	}, nil
}

func fetchAzureRetail() ([]MarketRate, error) {
	url := "https://prices.azure.com/api/retail/prices?$filter=serviceName eq 'Virtual Machines' and priceType eq 'Consumption'"
	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var data struct {
		Items []struct {
			ArmSkuName string  `json:"armSkuName"`
			RetailPrice float64 `json:"retailPrice"`
		} `json:"Items"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
		return nil, err
	}

	rates := []MarketRate{}
	for _, item := range data.Items {
		rates = append(rates, MarketRate{
			Source: SourceAzure,
			Price:  item.RetailPrice,
			Timestamp: time.Now(),
		})
	}
	return rates, nil
}

func fetchGCPSpot() ([]MarketRate, error) {
	// Simulated parse of public GCP Spot Pricing API results
	return []MarketRate{
		{Source: SourceGCP, Price: 0.004, Timestamp: time.Now()}, // e2-micro
		{Source: SourceGCP, Price: 0.08, Timestamp: time.Now()},  // n2-standard-2
		{Source: SourceGCP, Price: 1.20, Timestamp: time.Now()},  // a2-highgpu-1g
	}, nil
}

func fetchLambda() ([]MarketRate, error) {
	// Simulated parse of Lambda Labs public pricing feed
	return []MarketRate{
		{Source: SourceLambda, Price: 0.60, Timestamp: time.Now()},  // A10
		{Source: SourceLambda, Price: 2.14, Timestamp: time.Now()},  // A100
		{Source: SourceLambda, Price: 4.50, Timestamp: time.Now()},  // H100
	}, nil
}

func fetchPaperspace() ([]MarketRate, error) {
	// Simulated parse of Paperspace public pricing data
	return []MarketRate{
		{Source: SourcePaperspace, Price: 0.07, Timestamp: time.Now()}, // Standard CPU
		{Source: SourcePaperspace, Price: 0.35, Timestamp: time.Now()}, // Mid GPU
		{Source: SourcePaperspace, Price: 1.80, Timestamp: time.Now()}, // A100 Tier
	}, nil
}
