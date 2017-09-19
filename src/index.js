import utils from './utils';

class JSONDiff {
    constructor(options) {
        this.container = options.container;
        this.data = options.data;
        this.render();
    }
    renderDiff() {

    }
    renderToken() {

    }
    renderSame() {

    }
    render() {
        this.container.innerHTML = this.renderJSON(this.data.base);
    }
    renderJSON(jsonObj) {
        return utils.formatJSON(jsonObj);
    }
}

module.exports = exports = JSONDiff;