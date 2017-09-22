import utils from './utils';
import './jsondiff.less';

function wrapDiffBlock(html) {
    return '<div class="json-diff-block">' + html + '</div>';
}

function createDiffRow(left, right) {
    return '<div class="json-diff-row"><div class="json-diff-left">' + left + '</div><div class="json-diff-right">' + right + '</div></div>';
}

function createJSONDiffKey(key) {
    return '<span class="json-diff-key">' + key + '</span>';
}

function createJSONDiffSplitToken(char) {
    char = char || ':'
    return '<span class="json-diff-split-token">' + char + '</span>';
}

function createJSONDiffValue(value) {
    var html = '';
    var type = utils.typeIt(value);
    value = utils.escapeHtml(value);
    switch (type) {
        case 'number':
            html = '<span class="json-diff-value json-diff-number">' + value + '</span>';
            break;
        case 'string':
            html = '<span class="json-diff-value json-diff-string">"' + value + '"</span>';
            break;
        case 'null':
            html = '<span class="json-diff-value json-diff-null">' + value + '</span>';
            break;
        default:
            html = '<span class="json-diff-value json-diff-unknown">' + value + '</span>';
            break;
    }
    return html;
}

function createDiffBlockToken(position) {
    var html = '';
    position = position || 'start';
    if (position === 'end') {
        html = '<span class="json-diff-block-token json-diff-block-token-end">}</span>';
    } else {
        html = '<span class="json-diff-block-token json-diff-block-token-start">{</span>';
    }
    return html;
}

function createDiffArrayToken(position) {
    var html = '';
    position = position || 'start';
    if (position === 'end') {
        html = '<span class="json-diff-block-token json-diff-array-token-end">]</span>';
    } else {
        html = '<span class="json-diff-block-token json-diff-array-token-start">[</span>';
    }
    return html;
}


function innerDiff(left, right, key) {
    debugger;
    var leftType = utils.typeIt(left);
    var rightType = utils.typeIt(right);
    if (leftType === rightType) {
        var html = '';
        switch (leftType) {
            case 'object':
                var keysMap = {};
                var keys = [].concat(Object.keys(left)).concat(Object.keys(right));
                keys.forEach(function (key) {
                    keysMap[key] = true;
                });
                keys = Object.keys(keysMap).sort();
                html = html + (key ? (createJSONDiffKey(key) + createJSONDiffSplitToken()) : '');
                html = html + createDiffBlockToken('start');
                html = html + createDiffRow(html, html);
                html = html + wrapDiffBlock(keys.map(function (key) {
                    return innerDiff(left[key], right[key], key);
                }).join(''));
                html = html + createDiffRow(createDiffBlockToken('end'), createDiffBlockToken('end'));
                break;
            case 'array':
                var len = Math.max(left.length, right.length);
                var keyHtml = key ? (createJSONDiffKey(key) + createJSONDiffSplitToken()) : '';
                keyHtml = keyHtml + createDiffArrayToken('start');
                for (var i = 0; i < len; i++) {
                    html = html + innerDiff(left[i], right[i]);
                }
                html = createDiffRow(keyHtml, keyHtml) + wrapDiffBlock(html);
                html = html + createDiffRow(createDiffArrayToken('end'), createDiffArrayToken('end'));
                break;
            default:
                var leftHtml = (key ? (createJSONDiffKey(key) + createJSONDiffSplitToken()) : '') + createJSONDiffValue(left);
                var rightHtml = (key ? (createJSONDiffKey(key) + createJSONDiffSplitToken()) : '') + createJSONDiffValue(right);
                html = createDiffRow(leftHtml, rightHtml);
                break;
        }
        return html;
    } else {
        return createDiffRow(utils.formatJSONWithKey(left, key), utils.formatJSONWithKey(right, key));
    }
}

class JSONDiff {
    constructor(options) {
        this.container = options.container;
        this.data = options.data;
        this.render();
    }
    render() {
        this.container.innerHTML = this.diff(this.data.base, this.data.test);
        utils.addCollapsedHandle(this.container);
    }
    diff(base, test) {
        return wrapDiffBlock(innerDiff(base, test));
    }
}

module.exports = exports = JSONDiff;