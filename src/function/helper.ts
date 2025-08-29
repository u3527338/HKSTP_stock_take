const isScriptLoaded = (id: string, type) => {
  var scripts = document.getElementsByTagName(type);
  for (var i = scripts.length; i--; ) {
    if (scripts[i].id == id) return true;
  }
  return false;
};

export const loadScript = ({ id, src }) => {
  return new Promise((resolve, reject) => {
    if (document.getElementById(id)) {
      resolve(""); // already loaded
      return;
    }
    const script = document.createElement("script");
    script.id = id;
    script.src = src;
    script.onload = () => resolve("");
    script.onerror = () => reject(new Error(`Failed to load script ${src}`));
    document.head.appendChild(script);
  });
};

export const loadStyleSheet = ({ id, href }) => {
  if (isScriptLoaded(id, "link")) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  link.id = id;
  document.body.appendChild(link);
};

export const loadResources = (resources) => {
  const promises = resources.map((res) => {
    if (res.type === "script") {
      return loadScript({ id: res.id, src: res.src });
    } else if (res.type === "style") {
      return loadStyleSheet({ id: res.id, href: res.href });
    }
    return Promise.reject(new Error("Unknown resource type"));
  });
  return Promise.all(promises);
};

export const useState = (component, key) => {
  const getter = component.state[key];

  const setter = (newValue) => {
    const newState = { [key]: newValue };
    component.setState(newState);
  };

  return [getter, setter];
};

export const generateUUID = () => Math.random().toString(36).substring(2, 9);
