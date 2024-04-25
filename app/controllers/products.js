class ProductException {
    constructor(errorMessage) {
        this.errorMessage = errorMessage;
    }
}

class Product {
    constructor(uuid,title, description, imageUrl, unit, stock, pricePerUnit, category) {
        this.uuid = uuid;
        this.title = title;
        this.description = description;
        this.imageUrl = imageUrl;
        this.unit = unit;
        this.stock = stock;
        this.pricePerUnit = pricePerUnit;
        this.category = category;
    }
    get title() {
        return this._title;
    }
    get description() {
        return this._description;
    }
    get imageUrl() {
        return this._imageUrl;
    }
    get unit() {
        return this._unit;
    }
    get stock() {
        return this._stock;
    }
    get pricePerUnit() {
        return this._pricePerUnit;
    }
    get category() {
        return this._category;
    }

    set title(value) {
        if (typeof value !== 'string' || value.trim() === '') {
            throw new ProductException("Title must be a non-empty string.");
        }
        this._title = value;
    }
    set description(value) {
        if (typeof value !== 'string' || value.trim() === '') {
            throw new ProductException("Description must be a non-empty string.");
        }
        this._description = value;
    }
    set imageUrl(value) {
        if (typeof value !== 'string' || value.trim() === '') {
            throw new ProductException("ImageUrl must be a non-empty string.");
        }
        this._imageUrl = value;
    }
    set unit(value) {
        if (typeof value !== 'string' || value.trim() === '') {
            throw new ProductException("Unit must be a non-empty string.");
        }
        this._unit = value;
    }
    set stock(value) {
        if (typeof value !== 'number' || value < 0) {
            throw new ProductException("Stock must be a non-negative number.");
        }
        this._stock = value;
    }
    set pricePerUnit(value) {
        if (typeof value !== 'number' || value < 0) {
            throw new ProductException("PricePerUnit must be a non-negative number.");
        }
        this._pricePerUnit = value;
    }
    set category(value) {
        if (typeof value !== 'string' || value.trim() === '') {
            throw new ProductException("Category must be a non-empty string.");
        }
        this._category = value;
    }

    //Funciones
    static createFromJson(jsonValue) {
        const parsedJson = JSON.parse(jsonValue);
        return new Product(
            parsedJson.title,
            parsedJson.description,
            parsedJson.imageUrl,
            parsedJson.unit,
            parsedJson.stock,
            parsedJson.pricePerUnit,
            parsedJson.category
        );
    }

    static createFromObject(obj) {
        const product = new Product(
            obj.title,
            obj.description,
            obj.imageUrl,
            obj.unit,
            obj.stock,
            obj.pricePerUnit,
            obj.category
        );
        return Product.cleanObject(product);
    }

    static cleanObject(obj) {
        const cleanedObject = {};
        const allowedKeys = ['title', 'description', 'imageUrl', 'unit', 'stock', 'pricePerUnit', 'category'];
        Object.keys(obj).forEach(key => {
            if (allowedKeys.includes(key)) {
                cleanedObject[key] = obj[key];
            }
        });
        return cleanedObject;
    }
}

module.exports = Product;