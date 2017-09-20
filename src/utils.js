
function typeIt(obj) {
    var type = Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
    return type;
}

function escapeHtml(str) {
    return str;
}

function createJSONKey(key) {
    return '<span class="json-key">' + escapeHtml(key) + '</span>';
}

function createJSONValue(type, value) {
    var html = '';
    value = escapeHtml(value);
    switch (type) {
        case 'number':
            html = '<span class="json-value json-number">' + value + '</span>';
            break;
        case 'string':
            html = '<span class="json-value json-string">' + value + '</span>';
            break;
        case 'null':
            html = '<span class="json-value json-null">' + value + '</span>';
            break;
        default:
            html = '<span class="json-value json-unknown">' + value + '</span>';
            break;
    }
    return html;
}

function createJSONSplitToken(char) {
    char = char || ':'
    return '<span class="json-split-token">' + char + '</span>';
}

function createJSONBlockToken(position) {
    position = position || 'start';
    if (position === 'end') {
        return '<span class="json-block-token json-block-token-end">}</span>';
    } else {
        return '<span class="json-block-token json-block-token-start">{</span>';
    }
}

function createJSONArrayToken(position) {
    position = position || 'start';
    if (position === 'end') {
        return '<span class="json-block-token json-array-token-end">]</span>';
    } else {
        return '<span class="json-block-token json-array-token-start">[</span>';
    }
}

function wrapJSONBlock(html) {
    return '<div class="json-block">' + html + '</div>';
}

function wrapJSONProp(html) {
    return '<div class="json-prop">' + html + '</div>';
}

function wrapJSONArrItem(html) {
    return '<div class="json-arr-item">' + html + '</div>';
}

function formatInnerJSON(jsonObj) {
    var type = typeIt(jsonObj);
    var html = '';
    switch (type) {
        case 'object':
            var keys = Object.keys(jsonObj);
            html = createJSONBlockToken('start') + wrapJSONBlock(keys.sort().map(function (key) {
                return wrapJSONProp(createJSONKey(key) + createJSONSplitToken() + formatInnerJSON(jsonObj[key]));
            }).join('')) + createJSONBlockToken('end');
            break;
        case 'array':
            html = createJSONArrayToken('start') + wrapJSONBlock(jsonObj.map(function (item) {
                return wrapJSONArrItem(formatInnerJSON(item));
            }).join('')) + createJSONArrayToken('end');
            break;
        case 'number':
            html = createJSONValue('number', jsonObj);
            break;
        case 'string':
            html = createJSONValue('string', jsonObj);
            break;
        case 'null':
            html = createJSONValue('null', jsonObj);
            break;
        default:
            html = createJSONValue('', jsonObj);
            break;
    }
    return html;
}

function formatJSON(jsonObj) {
    return '<div class="json-block">' + formatInnerJSON(jsonObj) + '</div>';
}

export default {
    typeIt,
    formatJSON
}