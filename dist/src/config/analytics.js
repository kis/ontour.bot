'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const analytics_node_1 = __importDefault(require('analytics-node'));
exports.Analytics = analytics_node_1.default;
const { SEGMENT_API_KEY } = require('./config');
const analytics = new analytics_node_1.default(SEGMENT_API_KEY);
function getAnalytics() {
  return analytics;
}
exports.getAnalytics = getAnalytics;
//# sourceMappingURL=analytics.js.map
