
const fixHeight = (container) => {
  // If container is taller than window, limit its height
if (container.clientHeight > window.innerHeight) {
    container.style.maxHeight = window.innerHeight + 'px';
    container.style.overflowY = 'auto'; // Add scroll if needed
}
}

export default fixHeight