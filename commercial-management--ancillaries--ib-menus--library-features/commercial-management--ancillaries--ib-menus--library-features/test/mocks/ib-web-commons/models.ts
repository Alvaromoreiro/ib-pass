export interface State<T> {
    isLoading: boolean;
    value: T;
}

export interface IberiaWebUser {
    appUserInfo: {
        logged: boolean;
        userType?: string;
    };
    personalInfo: {
        name?: string;
        surname?: string;
        secondSurname?: string;
        gender?: string;
        email?: string;
    };
}

export type IberiaPlusUser = IberiaWebUser;
export type IberiaZeroUser = IberiaWebUser;
export type IberiaONBUser = IberiaWebUser;
