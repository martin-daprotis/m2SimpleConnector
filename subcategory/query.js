"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var productItemSchema = "\n  name\n  sku\n  url_key\n  thumbnail { url }\n  price_range {\n    minimum_price {\n      regular_price { value currency }\n      final_price { value currency }\n      discount { amount_off percent_off }\n    }\n  }\n\n  ... on ConfigurableProduct {\n    configurable_options {\n      attribute_code\n      values {\n        label\n        swatch_data { value }\n      }\n    }\n    variants {\n      attributes { code label }\n      product {\n        media_gallery { url disabled }\n      }\n    }\n  }\n";
var filtersSchema = "\n  aggregations {\n    attribute_code\n    count\n    label\n    options {\n      count\n      label\n      value\n    }\n  }\n";
var sortSchema = "\n  sort_fields {\n    default\n    options {\n      label\n      value\n    }\n  }\n";
var pageInfoSchema = "\n  total_count\n  page_info {\n    page_size\n    current_page\n    total_pages\n  }\n";
/**
 * Magento 2: subcategory Graph QL query
 */
var query = function (_a) {
    var _b = _a.categoryId, categoryId = _b === void 0 ? null : _b, _c = _a.pageSize, pageSize = _c === void 0 ? 16 : _c, _d = _a.currentPage, currentPage = _d === void 0 ? 1 : _d, _e = _a.filter, filter = _e === void 0 ? '' : _e, _f = _a.sort, sort = _f === void 0 ? '' : _f, _g = _a.search, search = _g === void 0 ? '' : _g;
    var searchQuery = search ? "search: \"" + search + "\"" : '';
    var sortQuery = sort ? "sort: { " + sort + " }" : '';
    var categoryIdQuery = categoryId ? "category_id: { eq: \"" + categoryId + "\" }" : '';
    var filterQuery = categoryIdQuery || filter ? "\n    filter: {\n      " + categoryIdQuery + "\n      " + filter + "\n    }" : '';
    return {
        query: "\n      {\n        products(\n          pageSize: " + pageSize + "\n          currentPage: " + currentPage + "\n          " + sortQuery + "\n          " + filterQuery + "\n          " + searchQuery + "\n        ) {\n          " + filtersSchema + "\n          " + sortSchema + "\n          " + pageInfoSchema + "\n          items {\n            " + productItemSchema + "\n          }\n        }\n      }\n    ",
    };
};
exports.default = query;
