export const getParamsWithGuestCode = () => {
    const guestCode = localStorage.getItem('guest-code')
    const jwt = localStorage.getItem('jwt')

    return {
        params: {
            "guest-code": guestCode,
        },
        headers: {
            'Authorization': jwt ? `Bearer ${jwt}` : null,
        }
    }
}
