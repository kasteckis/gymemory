const logout = () => {
    localStorage.removeItem('guest-code')
    localStorage.removeItem('jwt')
    localStorage.removeItem('username')
}

export default logout;
