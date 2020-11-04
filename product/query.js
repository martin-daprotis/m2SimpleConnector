"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var specsAttributes = [
    'style_general',
    'material',
    'pattern',
    'climate',
    'category_gear',
    'gender',
    'activity',
];
var customAttributeMetadata = "\n  customAttributeMetadata(\n    attributes: [\n      " + specsAttributes.reduce(function (str, spec) { return str + "{\n          attribute_code: \"" + spec + "\",\n          entity_type: \"4\"\n        }\n"; }, '') + "\n    ]\n  ) {\n    items {\n      attribute_code\n      attribute_type\n      attribute_options {\n      value\n      label\n    }\n    }\n  }\n";
/**
 * Magento 2: product query
 */
var query = function (urlKey) { return ({
    query: "\n    {\n      " + customAttributeMetadata + "\n      products(filter: {\n        url_key: {\n          eq: \"" + urlKey + "\"\n        }\n      }) {\n        items {\n          id,\n          image {\n            label\n            url\n          },\n          name,\n          description {\n            html\n          },\n\n          # specs\n          " + specsAttributes.reduce(function (str, val) { return "" + str + val + "\n"; }, '') + "\n\n          sku,\n          media_gallery {\n            label\n            url\n          },\n          only_x_left_in_stock,\n          stock_status,\n          price_range {\n            maximum_price {\n              final_price {\n                currency,\n                value\n              },\n              discount{\n                amount_off\n              },\n              fixed_product_taxes{\n                amount {\n                  currency,\n                  value\n                }, \n                label\n              }\n              regular_price{\n                currency,\n                value\n              }\n            }\n          }\n          ... on ConfigurableProduct {\n            configurable_options {\n              attribute_code,\n              label,\n              id,\n              values {\n                label\n                swatch_data{\n                  value,\n                  ...on ImageSwatchData {\n                    thumbnail\n                  }\n                },\n              }\n            },\n            variants {\n              attributes {\n                code,\n                label\n              },\n              product {\n                name,\n                url_key,\n                url_suffix,\n                sku,\n                swatch_image,\n                media_gallery {\n                  url\n                },\n              }\n            }\n          }\n        }\n      }\n    }\n  ",
}); };
exports.default = query;
