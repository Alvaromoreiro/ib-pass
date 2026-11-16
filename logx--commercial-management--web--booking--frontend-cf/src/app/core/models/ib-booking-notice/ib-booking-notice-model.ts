export interface Notice {
    type?: string,
    title: string,
    text: string,
    action?: Action,
    closeAction?: string,
    actionButtonDisabled?: false,
    outAction?: Action,
    subtitle?: string
}

export type Action = {
    text: string,
    title: string,
    callback?: string,
    target?: string,
    url?: string,
    icon?: string
};
