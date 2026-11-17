const setLocalStorageValue = (id, data) => {
  if (data && id && typeof id === 'string') {
    if (typeof data === 'string') {
      localStorage.setItem(id, data);
    } else {
      localStorage.setItem(id, JSON.stringify(data));
    }
  }
};

const getLocalStorageValue = (id) => {
  let storageValue = null;
  if (id && typeof id === 'string') {
    storageValue = localStorage.getItem(id);
    if (storageValue) {
      try {
        storageValue = JSON.parse(storageValue);
      } catch (e) { }
    }
  }
  return storageValue;
};

const removeLocalStorageValue = (id) => {
  if (id && typeof id === 'string') {
    localStorage.removeItem(id);
  }
};

const isLocalStorageWritable = () => {
  let supported = true;
  try {
    localStorage.setItem('isWritable', 'true');
  } catch (error) {
    supported = false;
  }
  if (supported === true) {
    removeLocalStorageValue('isWritable');
  }
  return supported;
};

export {
  setLocalStorageValue as set,
  getLocalStorageValue as get,
  removeLocalStorageValue as remove,
  isLocalStorageWritable as isWritable,
};
