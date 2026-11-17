import { serviceCallWithRefresh } from "../manage/ibe_logged-service";
import retrieveGlobalVariables from "./ibe_variables";

const { avatarIBPLUSService } = retrieveGlobalVariables();
const defaultAvatar = 'data:image/jpg;base64,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'


/**
 * @description Get avatar function with error handling and img in base64
 * @returns {Promise<string>} encode image base64
 * @see https://transform.atlassian.net/browse/CPA-185
 */

async function getAvatar() {
  const ibisTK = Cookies.get("IBERIACOM_SSO_ACCESS");
  const salesForceTK = Cookies.get("IBERIACOM_SSO_ACCESS_SALESFORCE");
  return fetch(avatarIBPLUSService, {
    method: "GET",
    credentials: "include",
    headers: {
      Authorization: `Bearer ${ibisTK}`,
      "X-Salesforce-Token": salesForceTK,
    },
  })
    .then((response) => {
      if (response.status === 204) {
        localStorage.setItem("ib-avatar-cache", "EMPTY");
        throw new Error("Empty image");
      } else {
        return response.blob();
      }
    })
    .then((data) => {
      return blobToBase64(data);
    })
    .then((data) => {
      if(data === defaultAvatar) {
        localStorage.setItem("ib-avatar-cache", "EMPTY");
        throw new Error("Empty image");
      }
      localStorage.setItem("ib-avatar-cache", data);
      return data;
    })
    .catch((error) => {
      throw new Error("Server error");
    });
}

/**
 * @description Get avatar function with error handling and img in base64
 * @returns {Promise<string>} encode image base64
 */
async function getLoginAvatar() {
  return serviceCallWithRefresh(getAvatar).catch((error) => {
    return Promise.reject(error);
  });
}

/**
 * @description [CPA-188] Transform image - Transform blob to encode base64 
 * @param {Blob} blob The blob to transform in string
 * @returns {Promise<string>} the base64 encode
 * @see https://transform.atlassian.net/browse/CPA-188
 */
async function blobToBase64(blob) {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

/**
 * @description Function that calls the event to load the avatar
 */
function listenerAvatarEvent() {
  document.addEventListener("ibAvatarUpdate", onIbAvatarUpdateEvent);
  window.addEventListener("storage", onAvatarStorageChangeEvent);
}

/**
 * @description Function that removes the call to the event
 */
function removeAvatarEvent() {
  document.removeEventListener("ibAvatarUpdate", onIbAvatarUpdateEvent);
  window.removeEventListener("storage", onAvatarStorageChangeEvent);
}

function onIbAvatarUpdateEvent() {
  updateLoginAvatar();
}

/**
 * @description Check the cache to avoid having to call the service and thus have it on all open screens
 * @param {String} event event interface parameter
 */
function onAvatarStorageChangeEvent(event) {
  if (
    event.storageArea === localStorage &&
    event.key === "ib-avatar-cache" &&
    event.newValue
  ) {
    updateLoginAvatar();
  }
}

/**
 * @description Function get avatar cache where if it is null or undefined it puts empty
 * @returns {Promise<string>} If it is nothing it returns the localstorage of the image
 */
async function getCacheAvatar() {
  const avatarCache = localStorage.getItem("ib-avatar-cache");
  return avatarCache !== "EMPTY"
    ? Promise.resolve(avatarCache)
    : Promise.reject("Empty cache avatar");
}

/**
 * @description Change avatar where img avatar is if it is null or undefined it puts for default
 * @param {String} imgData Image base64 decode
 */
function changeAvatarImg(imgData) {
  imgData ??= "/wcs_statics/images/modules/icons/svgs/editar_perfil_red.svg";
  $(".ibe-header-new__logged-link>img, .ibe-login__logged-figure>img").each(
    function inside() {
      $(this).attr("src", imgData);
    }
  );
}

/**
 * @description Update Avatar with error handling change with img or not. 
 */
function updateLoginAvatar() {
  getCacheAvatar()
    .then((imgData) => {
      if (imgData) {
        return imgData;
      }
      return getLoginAvatar();
    })
    .then((imgData) => {
      changeAvatarImg(imgData);
    })
    .catch((error) => {
      changeAvatarImg();
    });
}

export {
  getLoginAvatar,
  updateLoginAvatar,
  listenerAvatarEvent,
  removeAvatarEvent,
};
