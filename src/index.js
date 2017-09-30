import utils from './utils';
import './jsondiff.less';

function wrapDiffBlock(html) {
    return '<div class="json-diff-block">' + html + '</div>';
}

function createCollapsedIcon() {
    return '<span class="icon-ell"></span>';
}

function createDiffRow(left, right, path) {
    return '<div class="json-diff-row"' + (path ? (' id="' + path.join(':') + '"') : '') + '><div class="json-diff-left">' + left + '</div><div class="json-diff-right">' + right + '</div></div>';
}

function createExpendIcon() {
    return '<span class="json-diff-expend-icon js-toggle-diff-json">-</span>';
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
        html = '<span class="json-diff-block-token json-diff-block-token-start">{</span>' + this.createCollapsedIcon();
    }
    return html;
}

function createDiffArrayToken(position) {
    var html = '';
    position = position || 'start';
    if (position === 'end') {
        html = '<span class="json-diff-block-token json-diff-array-token-end">]</span>';
    } else {
        html = '<span class="json-diff-block-token json-diff-array-token-start">[</span>' + this.createCollapsedIcon();
    }
    return html;
}

function formatJSONWithKey(obj, key) {
    var html = utils.formatJSONWithKey(obj, key);
    var type = utils.typeIt(obj);
    if (type !== 'object' && type !== 'array') {
        html = '<div class="fixed-json-block">' + html + '</div>';
    }
    return html;
}

function innerDiff(left, right, key, path) {
    var leftType = utils.typeIt(left);
    var rightType = utils.typeIt(right);
    if (leftType === rightType) {
        var html = '';
        var keyHtml = '';
        switch (leftType) {
            case 'object':
                var keysMap = {};
                var keys = [].concat(Object.keys(left)).concat(Object.keys(right));
                keys.forEach(function (key) {
                    keysMap[key] = true;
                });
                keys = Object.keys(keysMap).sort();
                keyHtml = key ? (this.createExpendIcon() + this.createJSONDiffKey(key) + this.createJSONDiffSplitToken()) : this.createExpendIcon();
                keyHtml = keyHtml + this.createDiffBlockToken('start');
                html = html + this.createDiffRow(keyHtml, keyHtml, path);
                html = html + wrapDiffBlock(keys.map((key) => {
                    return this.innerDiff(left[key], right[key], key, path.concat(key));
                }).join(''));
                html = html + this.createDiffRow(this.createDiffBlockToken('end'), this.createDiffBlockToken('end'));
                break;
            case 'array':
                var len = Math.max(left.length, right.length);
                keyHtml = key ? (this.createExpendIcon() + this.createJSONDiffKey(key) + this.createJSONDiffSplitToken()) : this.createExpendIcon();
                keyHtml = keyHtml + this.createDiffArrayToken('start');
                for (var i = 0; i < len; i++) {
                    html = html + this.innerDiff(left[i], right[i], undefined, path.concat('[0]'));
                }
                html = this.createDiffRow(this.createCollapsedIcon(), this.createCollapsedIcon(), path) + this.wrapDiffBlock(html);
                html = html + this.createDiffRow(this.createDiffArrayToken('end'), this.createDiffArrayToken('end'));
                break;
            default:
                var leftHtml = (key ? (this.createJSONDiffKey(key) + this.createJSONDiffSplitToken()) : '') + this.createJSONDiffValue(left);
                var rightHtml = (key ? (this.createJSONDiffKey(key) + this.createJSONDiffSplitToken()) : '') + this.createJSONDiffValue(right);
                html = this.createDiffRow(leftHtml, rightHtml, path);
                break;
        }
        return html;
    } else {
        return this.createDiffRow(this.formatJSONWithKey(left, key), this.formatJSONWithKey(right, key), path);
    }
}

let tools = {
    wrapDiffBlock,
    createCollapsedIcon,
    createDiffRow,
    createExpendIcon,
    createJSONDiffKey,
    createJSONDiffSplitToken,
    createJSONDiffValue,
    createDiffBlockToken,
    createDiffArrayToken,
    formatJSONWithKey,
    innerDiff
};

class JSONDiff {
    constructor(options) {
        this.container = options.container;
        this.data = options.data;
        this.tools = Object.assign(Object.assign({}, tools), options.tools);
        this.render();
        this.bindEvent();
    }
    render() {
        this.container.innerHTML = this.diff(this.data.base, this.data.test);
    }
    diff(base, test) {
        return wrapDiffBlock(this.tools.innerDiff(base, test, undefined, ['']));
    }
    bindEvent() {
        this.container.addEventListener('click', function (e) {
            var target = e.target;
            if (target.className.indexOf('js-toggle-json') !== -1) {
                var block = e.target.parentNode;
                var cls = block.className;
                if (cls.indexOf('collapsed') !== -1) {
                    block.className = cls.replace(' collapsed', '');
                    target.textContent = '-';
                } else {
                    block.className = cls + ' collapsed';
                    target.textContent = '+';
                }
            }
        });
        this.container.addEventListener('click', function (e) {
            var target = e.target;
            if (target.className.indexOf('js-toggle-diff-json') !== -1) {
                var block = target.parentNode.parentNode;
                var cls = block.className;
                var childrens = Array.prototype.slice.call(block.children, 0);
                if (cls.indexOf('collapsed') !== -1) {
                    block.className = cls.replace(' collapsed', '');
                    childrens.forEach(function (item) {
                        item.children[0].textContent = '-';
                    });
                } else {
                    block.className = cls + ' collapsed';
                    childrens.forEach(function (item) {
                        item.children[0].textContent = '+';
                    });
                }
            }
        });
    }
}

module.exports = exports = JSONDiff;