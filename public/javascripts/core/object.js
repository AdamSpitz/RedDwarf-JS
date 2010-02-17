if (! Object.extend) {
  // Got the idea from Prototype (http://prototypejs.org/)
  Object.extend = function extend(destination, source) {
    for (var property in source)
      destination[property] = source[property];
    return destination;
  };
}
