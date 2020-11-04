"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var get_1 = __importDefault(require("lodash/get"));
var isEmpty_1 = __importDefault(require("lodash/isEmpty"));
function getThumbnail(rawProduct) {
    return {
        src: get_1.default(rawProduct, 'image.url', ''),
        alt: get_1.default(rawProduct, 'image.label', 'thumbnail'),
        type: 'image',
    };
}
function getMedia(rawProduct) {
    var thumbnail = getThumbnail(rawProduct);
    var thumbnails = get_1.default(rawProduct, 'media_gallery', []).map(function (item, i) { return ({
        src: get_1.default(item, 'url', ''),
        alt: get_1.default(item, 'label', "thumbnail " + i),
    }); });
    return {
        thumbnail: thumbnail,
        thumbnails: thumbnails,
        full: thumbnails,
    };
}
function getSizes(rawProduct) {
    var configurableOptions = get_1.default(rawProduct, 'configurable_options', []);
    var sizeOption = configurableOptions.find(function (obj) { return obj.attribute_code === 'size'; });
    return get_1.default(sizeOption, 'values', [])
        .map(function (opt) { return ({
        text: get_1.default(opt, 'label'),
        id: get_1.default(opt, 'swatch_data.value'),
    }); });
}
function getColors(rawProduct) {
    var configurableOptions = get_1.default(rawProduct, 'configurable_options', []);
    var colorOption = configurableOptions.find(function (obj) { return obj.attribute_code === 'color'; });
    var rawProductVariants = get_1.default(rawProduct, 'variants', []);
    return get_1.default(colorOption, 'values', [])
        .map(function (opt) {
        var color = get_1.default(opt, 'label');
        var variant = rawProductVariants.find(function (_variant) { return get_1.default(_variant, 'product.sku', '').includes("-" + color); });
        var thumbnails = get_1.default(variant, 'product.media_gallery', []).map(function (mediaGalleryObj) { return ({
            src: get_1.default(mediaGalleryObj, 'url'),
            alt: color,
        }); });
        return {
            id: color,
            text: color,
            css: get_1.default(opt, 'swatch_data.value'),
            image: {
                alt: color,
                // @TODO: add support of RGB color code in ProductOptionSelector component:
                src: "https://via.placeholder.com/48x48/" + get_1.default(opt, 'swatch_data.value').replace('#', '') + "?text=%20",
            },
            media: {
                thumbnails: thumbnails,
                thumbnail: thumbnails[0],
                full: thumbnails,
            },
        };
    });
}
function getSpecs(rawProduct, rawCustomAttributes) {
    var specsAttributes = [
        {
            name: 'Style',
            key: 'style_general',
        },
        {
            name: 'Material',
            key: 'material',
        },
        {
            name: 'Pattern',
            key: 'pattern',
        },
        {
            name: 'Climate',
            key: 'climate',
        },
        {
            name: 'Activity',
            key: 'activity',
        },
        {
            name: 'Gender',
            key: 'gender',
        },
        {
            name: 'Category',
            key: 'category_gear',
        },
    ];
    return specsAttributes
        .map(function (specsAttribute) {
        var spec = specsAttribute.key;
        var specName = specsAttribute.name;
        var attr = rawCustomAttributes.find(function (_attr) { return get_1.default(_attr, 'attribute_code') === spec; });
        var rawValue = get_1.default(rawProduct, spec) || '';
        var value = rawValue
            .split(',')
            .map(function (x) {
            var opts = get_1.default(attr, 'attribute_options', []);
            var opt = opts.find(function (_attr) { return _attr.value === x.trim(); });
            return get_1.default(opt, 'label', '');
        })
            .join(', ');
        if (!value) {
            return null;
        }
        return {
            name: specName,
            value: value,
        };
    })
        .filter(Boolean);
}
function specsToHtml(specs) {
    return specs
        .filter(function (spec) { return spec.name && spec.value; })
        .map(function (spec) { return "<b>" + spec.name + ":</b> " + spec.value; })
        .join('<br/>');
}
/**
 * Magento 2: product normalizer
 */
function normalizer(rawData, productId) {
    var rawProduct = get_1.default(rawData, 'data.products.items[0]');
    var rawCustomAttributes = get_1.default(rawData, 'data.customAttributeMetadata.items', []);
    if (!rawProduct) {
        return null;
    }
    var colors = getColors(rawProduct);
    var sizes = getSizes(rawProduct);
    var isConfigurableProduct = !isEmpty_1.default(get_1.default(rawProduct, 'configurable_options'));
    var price = get_1.default(rawProduct, 'price_range.maximum_price.final_price.value');
    return {
        isConfigurableProduct: isConfigurableProduct,
        id: productId,
        reviewsKey: get_1.default(rawProduct, 'id'),
        sku: get_1.default(rawProduct, 'sku'),
        url: "/p/" + productId + ".html",
        name: get_1.default(rawProduct, 'name'),
        description: get_1.default(rawProduct, 'description.html'),
        price: price,
        priceText: "$" + price.toFixed(2),
        sizes: sizes,
        colors: colors,
        thumbnail: getThumbnail(rawProduct),
        media: getMedia(rawProduct),
        specs: specsToHtml(getSpecs(rawProduct, rawCustomAttributes)),
    };
}
exports.default = normalizer;
