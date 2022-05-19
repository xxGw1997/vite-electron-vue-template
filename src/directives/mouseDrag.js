const mouseDragDirective = {
  mounted(el, binding) {
    const handler = binding.value;
    let isDown = false,
      baseX = 0,
      baseY = 0;

    el.addEventListener("mousedown", (e) => {
      isDown = true;
      (baseX = e.x), (baseY = e.y);
    });

    document.addEventListener("mousemove", (e) => {
      if (isDown) {
        const x = e.screenX - baseX;
        const y = e.screenY - baseY;
        handler({ x, y });
      }
    });

    document.addEventListener("mouseup", () => {
      isDown = false;
    });
  },
};

export default mouseDragDirective;
