const permissionsCheck = (key: string, permissions: string[]) => {
    const check = permissions && permissions.length > 0 && permissions.includes(key)
    return !check
}

export default permissionsCheck