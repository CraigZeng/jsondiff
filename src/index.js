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
        this.container.innerHTML = this.renderJSON(data.base);
    }
    renderJSON(jsonObj) {
        utils.formatJSON(jsonObj);
    }
}

module.exports = exports = JSONDiff;