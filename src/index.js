import utils from './utils';
import './jsondiff.less';

class JSONDiff {
    constructor(options) {
        this.container = options.container;
        this.data = options.data;
        this.render();
    }
    render() {
        this.container.innerHTML = this.renderJSON(this.data.base);
        utils.addCollapsedHandle(this.container);
    }
    renderJSON(jsonObj) {
        return utils.formatJSON(jsonObj);
    }
}

module.exports = exports = JSONDiff;