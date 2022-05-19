import mouseDragDirective from "./mouseDrag";

export default {
  install(app) {
    app.directive("mouse-drag", mouseDragDirective);
  },
};
