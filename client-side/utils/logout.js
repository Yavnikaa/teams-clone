
const logout = (history) => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('id')
    history.push('/login');
}
export default logout;