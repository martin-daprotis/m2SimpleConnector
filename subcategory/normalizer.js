"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var get_1 = __importDefault(require("lodash/get"));
var groupBy_1 = __importDefault(require("lodash/groupBy"));
var keyBy_1 = __importDefault(require("lodash/keyBy"));
function getSizes(rawProduct) {
    var rawConfigurableOptions = get_1.default(rawProduct, 'configurable_options', []);
    var sizes = get_1.default(keyBy_1.default(rawConfigurableOptions, 'attribute_code'), 'size.values', []);
    return sizes.map(function (size) {
        var text = get_1.default(size, 'label', '');
        var id = get_1.default(size, 'swatch_data.value', '');
        return {
            text: text,
            id: id,
        };
    });
}
function getSwatches(rawProduct) {
    var rawConfigurableOptions = get_1.default(rawProduct, 'configurable_options', []);
    var colors = get_1.default(keyBy_1.default(rawConfigurableOptions, 'attribute_code'), 'color.values', []);
    var rawVariants = get_1.default(rawProduct, 'variants', []);
    var variantsGrouped = groupBy_1.default(rawVariants, function (item) {
        var attrs = get_1.default(item, 'attributes');
        var attrsKeyed = keyBy_1.default(attrs, 'code');
        return get_1.default(attrsKeyed, 'color.label');
    });
    return colors.map(function (color) {
        var text = get_1.default(color, 'label', '');
        var rgb = get_1.default(color, 'swatch_data.value', '');
        var image = get_1.default(variantsGrouped, text + "[0].product.media_gallery[0]url", '');
        var thumbnail = {
            alt: 'thumbnail image',
            src: image,
        };
        return {
            id: rgb,
            css: rgb,
            text: text,
            image: {
                src: "https://via.placeholder.com/48x48/" + rgb.replace('#', '') + "?text=%20",
                alt: text + " swatch",
            },
            media: {
                thumbnail: thumbnail,
                thumbnails: [thumbnail],
            },
        };
    });
}
function normalizeProductItem(rawItem) {
    var thumbnail = get_1.default(rawItem, 'thumbnail.url', '');
    return {
        id: get_1.default(rawItem, 'sku', ''),
        url: "/p/" + get_1.default(rawItem, 'url_key', '') + get_1.default(rawItem, 'url_suffix', ''),
        name: get_1.default(rawItem, 'name', ''),
        price: get_1.default(rawItem, 'price_range.minimum_price.final_price.value', 0),
        basePriceText: "$" + get_1.default(rawItem, 'price_range.minimum_price.final_price.value', 0),
        colors: getSwatches(rawItem),
        sizes: getSizes(rawItem),
        thumbnail: {
            src: thumbnail,
            alt: 'thumbnail',
            type: 'image',
        },
        reviewCount: 0,
    };
}
function getSortData(rawSubcategoryData) {
    var rawSortFields = get_1.default(rawSubcategoryData, 'sort_fields');
    return {
        sortDefault: get_1.default(rawSortFields, 'default', 'position'),
        sortOptions: get_1.default(rawSortFields, 'options', [])
            .map(function (option) { return ({
            name: get_1.default(option, 'label'),
            code: get_1.default(option, 'value'),
        }); }),
    };
}
function getFacetsData(rawSubcategoryData) {
    var rawFacets = get_1.default(rawSubcategoryData, 'aggregations', [])
        .filter(function (facet) { return get_1.default(facet, 'attribute_code') !== 'category_id'; }); // skip categories
    return {
        facets: rawFacets.map(function (rawFilter) {
            var attr = get_1.default(rawFilter, 'attribute_code');
            var isColorFacet = attr === 'color';
            var rawOptions = get_1.default(rawFilter, 'options', []);
            return {
                name: get_1.default(rawFilter, 'label'),
                ui: 'buttons',
                options: rawOptions
                    .map(function (option) { return ({
                    name: get_1.default(option, 'label'),
                    code: attr + ":" + get_1.default(option, 'value'),
                    matches: get_1.default(option, 'count', 0),
                    css: isColorFacet ? get_1.default(option, 'label', '').toLowerCase() : '',
                }); }),
            };
        }),
    };
}
/**
 * Magento 2: subcategory normalizer
 */
function normalizer(rawData) {
    var rawSubcategoryData = get_1.default(rawData, 'data.products', {});
    return __assign(__assign({ total: get_1.default(rawSubcategoryData, 'total_count', 0), totalPages: get_1.default(rawSubcategoryData, 'page_info.total_pages', 1), currentPage: get_1.default(rawSubcategoryData, 'page_info.current_page', 1), products: get_1.default(rawSubcategoryData, 'items', []).map(normalizeProductItem) }, getSortData(rawSubcategoryData)), getFacetsData(rawSubcategoryData));
}
exports.default = normalizer;
