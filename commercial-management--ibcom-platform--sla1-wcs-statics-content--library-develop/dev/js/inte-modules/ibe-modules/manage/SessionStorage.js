const setSessionStorageValue = (id, data) => {
  if (data && id && typeof id === 'string') {
    if (typeof data === 'string') {
      sessionStorage.setItem(id, data);
    } else {
      sessionStorage.setItem(id, JSON.stringify(data));
    }
  }
};

const getSessionStorageValue = (id) => {
  let storageValue = null;
  if (id && typeof id === 'string') {
    storageValue = sessionStorage.getItem(id);
    if (storageValue) {
      try {
        storageValue = JSON.parse(storageValue);
      } catch (e) { }
    }
  }
  return storageValue;
};

const removeSessionStorageValue = (id) => {
  if (id && typeof id === 'string') {
    sessionStorage.removeItem(id);
  }
};

const isSessionStorageWritable = () => {
  let supported = true;
  try {
    sessionStorage.setItem('isWritable', 'true');
  } catch (error) {
    supported = false;
  }
  if (supported === true) {
    removeSessionStorageValue('isWritable');
  }
  return supported;
};
export {
  setSessionStorageValue as set,
  getSessionStorageValue as get,
  removeSessionStorageValue as remove,
  isSessionStorageWritable as isWritable

};