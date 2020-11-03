export const getCookie = name => {
    const value = '; ' + document.cookie
    const parts = value.split('; ' + name + '=')
    if (parts.length === 2) {
        return parts
            .pop()
            .split(';')
            .shift()
    }
}

export const isAuthed = () => {
    return getCookie('syte3auth') ? true : false
}
