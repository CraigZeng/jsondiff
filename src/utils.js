
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
            html = '<span class="json-value json-string">"' + value + '"</span>';
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

function canExpend(value) {
    var type = typeIt(value);
    return type === 'object' || type === 'array';
}

function createExpendIcon() {
    return '<span class="json-expend-icon js-toggle-json">-</span>';
}

function createCollapsedIcon() {
    return '<span class="icon-ell"></span>';
}

function wrapJSONBlock(html) {
    return '<div class="json-block">' + html + '</div>';
}

function wrapJSONProp(html, canExpend) {
    if (canExpend) {
        html = createExpendIcon() + html;
    }
    return '<div class="json-prop' + (canExpend ? ' can-expend' : '') + '">' + html + '</div>';
}

function wrapJSONArrItem(html, canExpend) {
    if (canExpend) {
        html = createExpendIcon() + html;
    }
    return '<div class="json-arr-item' + (canExpend ? ' can-expend' : '') + '">' + html + '</div>';
}

function formatInnerJSON(jsonObj, key) {
    var type = typeIt(jsonObj);
    var html = '';
    switch (type) {
        case 'object':
            var keys = Object.keys(jsonObj);
            html = createJSONBlockToken('start') + wrapJSONBlock(keys.sort().map(function (key) {
                return formatInnerJSON(jsonObj[key], key);
            }).join('')) + createCollapsedIcon() + createJSONBlockToken('end');
            html = wrapJSONProp((key ? (createJSONKey(key) + createJSONSplitToken()) : '') + html, true);
            break;
        case 'array':
            html = createJSONArrayToken('start') + wrapJSONBlock(jsonObj.map(function (item) {
                return wrapJSONArrItem(formatInnerJSON(item), canExpend(item));
            }).join('')) + createCollapsedIcon() + createJSONArrayToken('end');
            html = wrapJSONProp((key ? (createJSONKey(key) + createJSONSplitToken()) : '') + html, true);
            break;
        case 'number':
            html = key
                ? wrapJSONProp(createJSONKey(key) + createJSONSplitToken() + createJSONValue('number', jsonObj), false)
                : createJSONValue('number', jsonObj);
            break;
        case 'string':
            html = key
                ? wrapJSONProp(createJSONKey(key) + createJSONSplitToken() + createJSONValue('string', jsonObj), false)
                : createJSONValue('string', jsonObj);
            break;
        case 'null':
            html = key
                ? wrapJSONProp(createJSONKey(key) + createJSONSplitToken() + createJSONValue('null', jsonObj), false)
                : createJSONValue('null', jsonObj);
            break;
        default:
            html = key
                ? wrapJSONProp(createJSONKey(key) + createJSONSplitToken() + createJSONValue('', jsonObj), false)
                : createJSONValue('', jsonObj);
            break;
    }
    return html;
}

function formatJSON(jsonObj) {
    return wrapJSONBlock(formatInnerJSON(jsonObj));
}

function formatJSONWithKey(jsonObj, key) {
    formatInnerJSON(jsonObj, key);
}

function addCollapsedHandle(container) {
    container.addEventListener('click', function (e) {
        var block = e.target.parentNode;
        var cls = block.getAttribute('class');
        if (cls.indexOf('collapsed') !== -1) {
            block.setAttribute('class', cls.replace(' collapsed', ''));
        } else {
            block.setAttribute('class', cls + ' collapsed');
        }
    });
}

export default {
    typeIt,
    escapeHtml,
    formatJSONWithKey,
    addCollapsedHandle
}