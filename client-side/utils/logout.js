
const logout = (history) => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    history.push('/login');
}
export default logout;