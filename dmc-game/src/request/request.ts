export const requestAPI = async (url: string, body: any, mothod: "POST" | "GET" | "PUT" | "PATCH" | "DELETE") => {
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
};
