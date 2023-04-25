/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 *
 */

import fs from "fs";

const options = require('./optiondata/echarts-option-outline.json')


const toSchema = (obj: any, index: number | undefined | null = null) => {

    let _obj = structuredClone(obj);
    let type
    try {
        type = _obj.type[0].toLowerCase();
    } catch (e) {

    }


    let schema: any = {
        [_obj.prop]: {
            "title": _obj.prop,
            "type": type,
        }
    }


    if (_obj.children) {
        let child = _obj.children.map((item: any, index: number) => {
            return toSchema(item, index)
        }).reduce(function (result: any, item: any) {
            var key = Object.keys(item)[0];
            var type = Object.keys(item)[1];
            var properties = Object.keys(item)[2];


            if (properties == "properties") {
                let properties = item.properties.reduce(function (res1: any, item1: any) {
                    let key = Object.keys(item1)[0]; //first property: a, b, c
                    res1[key] = item1[key];
                    return res1;
                })
                result[key] = {
                    type,
                    properties
                };

            } else {
                result[key] = item[key];
            }

            return result;
        }, {});


        if (obj.isObject) {
            schema[obj.prop].properties = child

        } else if (obj.isArray) {
            schema[obj.prop].type = "array"
            schema[obj.prop].items = child
        }
    } else {

        let defaultValue = undefined;
        switch (type) {
            case 'object':
            case 'color':
                schema[obj.prop].type = "string"
                break;
            case 'number':
                defaultValue = !isNaN(Number(_obj.default)) ? Number(_obj.default) : undefined
                break
        }

        schema[obj.prop].defaultValue = defaultValue

    }

    return schema
}

let schema = {}
for (const option of options.children) {
    Object.assign(schema, toSchema(option))
}


fs.writeFile('./data/schema.json', JSON.stringify(schema, null, 2), function (err) {
    if (err) throw err;
    console.log('File is created successfully.');
});

