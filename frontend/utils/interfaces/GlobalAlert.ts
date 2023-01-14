export interface GlobalAlert {
    open: boolean;
    message: string;
    severity: 'success' | 'info' | 'warning' | 'error';
}
