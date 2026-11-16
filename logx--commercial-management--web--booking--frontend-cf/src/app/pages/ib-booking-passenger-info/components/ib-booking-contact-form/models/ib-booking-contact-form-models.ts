export type marketingPermissions = {
    permissionType: marketingPermissionsTypes;
    permissionGranted: boolean;
};

export enum marketingPermissionsTypes {
    COMMERCIAL_CAMPAIGN,
    SURVEYS,
    NEWSLETTER,
    MAGAZINE
}

export type IMarketingPermissions = marketingPermissions[];
