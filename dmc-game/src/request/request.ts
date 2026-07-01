export const httpHandler = async (url: string, body: any, method: "POST" | "GET" | "PUT" | "PATCH" | "DELETE") => {
    const token = localStorage.getItem("accessToken");
    const response = await fetch(process.env.NEXT_PUBLIC_BASE_API + url,
        {
            method: method ? method : "POST",
            headers: {
                "Cache-Control": "no-cache",
                "Content-Type": "application/json",
                // "Access-Control-Allow-Origin": "*",
                'Authorization': token ? `Bearer ${token}` : ''
            },
            credentials: 'include',
            body: method == "GET" ? undefined : JSON.stringify(body),
        })
    const result = await response.json()
    if (result?.error) {
        throw result.error
    }

    return result;
};

export default httpHandler;
