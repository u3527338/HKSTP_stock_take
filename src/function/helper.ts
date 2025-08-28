const isScriptLoaded = (id: string) => {
  var scripts = document.getElementsByTagName("script");
  for (var i = scripts.length; i--; ) {
    if (scripts[i].id == id) return true;
  }
  return false;
};

export const loadScript = ({ id, src }) => {
  if (isScriptLoaded(id)) return;
  const script = document.createElement("script");
  script.src = src;
  script.id = id;
  script.async = true;
  script.defer = true;
  document.body.appendChild(script);
};

export const useState = (component, key) => {
  const getter = component.state[key];

  const setter = (newValue) => {
    const newState = { [key]: newValue };
    component.setState(newState);
  };

  return [getter, setter];
};
