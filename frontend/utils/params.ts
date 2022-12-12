export const getParamsWithGuestCode = () => {
    const guestCode = localStorage.getItem('guest-code')

    return {
        "guest-code": guestCode,
    }
}
