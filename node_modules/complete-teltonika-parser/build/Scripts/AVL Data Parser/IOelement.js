"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IOelement = exports.isIOelement = exports.getNonFMSorPhysical = exports.getAnalogInputs = exports.getDigitalOutputs = exports.getDigitalInputs = exports.getOrganizedElements = exports.getElementsWithoutFMS = exports.getFMSelements = exports.castAVLIDtoAVLName = exports.getBooleanDigitalAnalog = exports.isFMSorPhysical = exports.isFMSid = exports.isPhysical = exports.isAnalogInput = exports.isDigitalOutput = exports.isDigitalInput = exports.AnalogInputsId = exports.DigitalOutputsId = exports.DigitalInputsId = void 0;
const avlDict_1 = require("./FMB640/avlDict");
exports.DigitalInputsId = [1, 2, 3, 4];
exports.DigitalOutputsId = [179, 180, 50, 51];
exports.AnalogInputsId = [9, 10, 11, 245];
let isDigitalInput = (id) => [1, 2, 3, 4].includes(id);
exports.isDigitalInput = isDigitalInput;
let isDigitalOutput = (id) => [179, 180, 50, 51].includes(id);
exports.isDigitalOutput = isDigitalOutput;
let isAnalogInput = (id) => [9, 10, 11, 245].includes(id);
exports.isAnalogInput = isAnalogInput;
let isPhysical = (id) => (0, exports.isDigitalInput)(id) || (0, exports.isDigitalOutput)(id) || (0, exports.isAnalogInput)(id);
exports.isPhysical = isPhysical;
function isFMSid(id) {
    return ((id >= 79 && id <= 113) ||
        (id >= 122 && id <= 128) ||
        (id >= 135 && id <= 139) ||
        (id >= 10348 && id <= 10431));
}
exports.isFMSid = isFMSid;
function isFMSorPhysical(id) {
    return (0, exports.isPhysical)(id) || isFMSid(id);
}
exports.isFMSorPhysical = isFMSorPhysical;
function getBooleanDigitalAnalog(id, value) {
    if (exports.AnalogInputsId.includes(id)) {
        return value > 6000;
    }
    if (exports.DigitalInputsId.includes(id) || exports.DigitalOutputsId.includes(id)) {
        return value == 1;
    }
    throw new Error(`Id is not from digital or analog element.`);
}
exports.getBooleanDigitalAnalog = getBooleanDigitalAnalog;
function castAVLIDtoAVLName(elements = null, avlidDictionary = avlDict_1.avlidDictionary) {
    var avl_names = {};
    //if (elements == null) elements = this.Elements
    if (!elements)
        return avl_names;
    var keys = Object.keys(elements);
    for (var i = 0; i < keys.length; i++) {
        var id = keys[i];
        // @ts-ignore
        var value = elements[id];
        if (id == "FMS") {
            avl_names["FMS"] = castAVLIDtoAVLName(value);
            continue;
        }
        if (!avlidDictionary.hasOwnProperty(id))
            continue;
        var translated = avlidDictionary[Number(id)];
        if (translated == null)
            continue;
        if (typeof translated === "string") {
            avl_names[translated] = value;
        }
    }
    return avl_names;
}
exports.castAVLIDtoAVLName = castAVLIDtoAVLName;
function getFMSelements(_elements) {
    let elements = isIOelement(_elements) ? _elements.Elements : _elements;
    var obj = {};
    var keys = Object.keys(elements);
    for (var i = 0; i < keys.length; i++) {
        var id = Number(keys[i]);
        if (!isFMSid(id))
            continue;
        var value = elements[id];
        obj[id] = value;
    }
    return obj;
}
exports.getFMSelements = getFMSelements;
function getElementsWithoutFMS(elements) {
    var obj = {};
    var keys = Object.entries(elements)
        .map((x) => {
        return { id: Number(x[0]), value: x[1] };
    })
        .filter((x) => !isFMSid(x.id));
    for (let { id, value } of keys) {
        obj[id] = value;
    }
    return obj;
}
exports.getElementsWithoutFMS = getElementsWithoutFMS;
function getOrganizedElements(_elements) {
    let elements = isIOelement(_elements) ? _elements.Elements : _elements;
    var obj = getElementsWithoutFMS(elements);
    obj["FMS"] = getFMSelements(elements);
    return obj;
}
exports.getOrganizedElements = getOrganizedElements;
function getDigitals(elements, ids) {
    if (ids.length != 4)
        throw new Error("Physical values must have length 4.");
    let obj = {};
    for (let i = 0; i < 4; i++) {
        let value = elements[ids[i]];
        if (value != null)
            obj[i + 1] = value == 1;
    }
    return obj;
}
function getDigitalInputs(_elements) {
    let elements = isIOelement(_elements) ? _elements.Elements : _elements;
    return getDigitals(elements, [1, 2, 3, 4]);
    // return {
    //     1: elements[1] == 1,
    //     2: elements[2] == 1,
    //     3: elements[3] == 1,
    //     4: elements[4] == 1
    // }
}
exports.getDigitalInputs = getDigitalInputs;
function getDigitalOutputs(_elements) {
    let elements = isIOelement(_elements) ? _elements.Elements : _elements;
    return getDigitals(elements, [179, 180, 50, 51]);
    // return {
    //     1: elements[179] == 1,
    //     2: elements[180] == 1,
    //     3: elements[50] == 1,
    //     4: elements[51] == 1
    // }
}
exports.getDigitalOutputs = getDigitalOutputs;
function getAnalogInputs(_elements) {
    let elements = isIOelement(_elements) ? _elements.Elements : _elements;
    let analogs = {};
    if (typeof elements[9] == "number")
        analogs[1] = elements[9];
    if (typeof elements[10] == "number")
        analogs[2] = elements[10];
    if (typeof elements[11] == "number")
        analogs[3] = elements[11];
    if (typeof elements[245] == "number")
        analogs[4] = elements[245];
    return analogs;
}
exports.getAnalogInputs = getAnalogInputs;
function getNonFMSorPhysical(_elements) {
    let elements = hasElements(_elements) ? _elements.Elements : _elements;
    let nonFMSorPhysical = {};
    for (let [key, value] of Object.entries(elements)) {
        let id = Number(key);
        if (Number.isNaN(id))
            throw new Error(`Invalid id in 'getNonFMSorPhysical'. Parameter elements: ${JSON.stringify(elements)}`);
        if (isFMSorPhysical(id))
            continue;
        nonFMSorPhysical[id] = value;
    }
    return nonFMSorPhysical;
}
exports.getNonFMSorPhysical = getNonFMSorPhysical;
function hasElements(obj) {
    return obj && obj.Elements;
}
// export function getNotFMSorPhysical(elements: { [id: number]: number | string }) {
//     let elements = isIOelement(_elements) ? _elements.Elements : _elements
//     return getNotFMSorPhysical(elements)
// }
function isIOelement(obj) {
    return (typeof obj === "object" &&
        typeof obj.EventID === "number" &&
        typeof obj.ElementCount === "number");
}
exports.isIOelement = isIOelement;
class IOelement {
    constructor(reader, on_error, codec_id) {
        if (reader == null) {
            throw new Error(`Reader not given`);
        }
        if (codec_id == null) {
            throw new Error(`Codec Id not given.`);
        }
        var id_size = codec_id == 0x08 ? 1 : 2;
        this.EventID = reader.read(id_size);
        this.ElementCount = reader.read(id_size);
        var element_value_length = 1;
        this.Elements = {};
        var elements_count = reader.read(id_size);
        let safeSet = (id, value) => {
            if (this.Elements.hasOwnProperty(`${id}`)) {
                throw new Error(`Repeated id '${id}' in IOElement.`);
            }
            this.Elements[id] = value;
        };
        try {
            while (true) {
                while (elements_count < 1 && element_value_length < 8) {
                    //if (element_value_length == 8) break
                    elements_count = reader.read(id_size);
                    element_value_length *= 2;
                }
                if (elements_count-- <= 0)
                    break;
                //elements_count--;
                var id = reader.read(id_size);
                var value = reader.read(element_value_length);
                safeSet(id, value);
                // if (this.Elements.hasOwnProperty(`${id}`)) {
                //     throw new Error(`Repeated id '${id}' in IOElement.`);
                // }
                // this.Elements[id] = value;
            }
            if (codec_id == 0x08) {
                while (element_value_length < 8) {
                    reader.read(id_size);
                    element_value_length *= 2;
                }
            }
            if (codec_id == 0x8e) {
                if (element_value_length != 8) {
                    throw new Error(`Element value length should be 8. Got ${element_value_length}.`);
                }
                elements_count = reader.read(2);
                for (var i = 0; i < elements_count; i++) {
                    var id = reader.read(2);
                    element_value_length = reader.read(2);
                    var value = reader.read(element_value_length);
                    safeSet(id, value);
                }
            }
        }
        catch (e) {
            if (on_error != null)
                on_error(e);
        }
    }
}
exports.IOelement = IOelement;
