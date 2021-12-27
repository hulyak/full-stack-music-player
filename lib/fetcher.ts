// abstract away HTTP fetching mechanism
export default function fetcher(url: string, data = undefined) {
  return fetch(`${window.location.origin}/api${url}`, {
    method: data ? "POST" : "GET",
    credentials: "include", // jwt credentials
    headers: {
      "Content-Type": "application/json",
    },
    body: data ? JSON.stringify(data) : undefined,
  });
}
