const XLSX = require("xlsx");
const apiListProductUrl = "https://tiki.vn/api/personalish/v1/blocks/listings?limit=50&sort=top_seller&urlKey=laptop&category=8095";
const apiProductDetailUrl = "https://api.tiki.vn/product-detail/api/v1/products/";

function cleanDescription(htmlDescription) {
    return htmlDescription
        .replace(/<\/?[^>]+(>|$)/g, '')
        .replace(/\s{2,}/g, ' ')
        .trim();
}

async function getProductIds() {
    try {
        const response = await fetch(apiListProductUrl);
        const data = await response.json();
        return data.data.map(product => product.id);
    } catch (error) {
        console.error("Error fetching product IDs:", error);
    }
}

async function getProductDetails(productIds) {
    const products = [];

    try {
        for (const id of productIds) {
            const response = await fetch(`${apiProductDetailUrl}${id}`);
            const productData = await response.json();

            const productDetails = {
                ID: productData.id || "",
                Type: "",
                SKU: productData.sku || "",
                Name: productData.name || "",
                Published: "",
                "Is featured?": "",
                "Visibility in catalog": "",
                "Short description": productData.short_description || "",
                Description: cleanDescription(productData.description || ""),
                "Date sale price starts": "",
                "Date sale price ends": "",
                "Tax status": "",
                "Tax class": "",
                "In stock?": productData.inventory_status || "",
                Stock: "",
                "Low stock amount": "",
                "Backorders allowed?": "",
                "Sold individually?": "",
                "Weight (kg)": "",
                "Length (cm)": "",
                "Width (cm)": "",
                "Height (cm)": "",
                "Allow customer reviews?": "",
                "Purchase note": "",
                "Sale price": productData.price || "",
                "Regular price": productData.original_price || "",
                Categories: "",
                Tags: "",
                "Shipping class": "",
                Images: productData.images ? productData.images.map(img => img.base_url).join(", ") : "",
                "Download limit": "",
                "Download expiry days": "",
                Parent: "",
                "Grouped products": "",
                Upsells: "",
                "Cross-sells": "",
                "External URL": "",
                "Button text": "",
                Position: "",
                "Attribute 1 name": "",
                "Attribute 1 value(s)": "",
                "Attribute 1 visible": "",
                "Attribute 1 global": "",
                "Attribute 2 name": "",
                "Attribute 2 value(s)": "",
                "Attribute 2 visible": "",
                "Attribute 2 global": "",
                "Attribute 3 name": "",
                "Attribute 3 value(s)": "",
                "Attribute 3 visible": "",
                "Attribute 3 global": "",
                "Attribute 4 name": "",
                "Attribute 4 value(s)": "",
                "Attribute 4 visible": "",
                "Attribute 4 global": ""
            };

            products.push(productDetails);
        }
    } catch (error) {
        console.error("Error fetching product details:", error);
    }

    return products;
}

function exportToCSV(products) {
    const worksheet = XLSX.utils.json_to_sheet(products);
    const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
    require("fs").writeFileSync("ProductDetails.csv", csvOutput);
    console.log("CSV file created: ProductDetails.csv");
}

async function main() {
    const productIds = await getProductIds();
    if (productIds) {
        const products = await getProductDetails(productIds);
        exportToCSV(products);
    }
}

main();
