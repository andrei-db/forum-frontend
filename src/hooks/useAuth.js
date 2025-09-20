export function useAuth() {
  const token = localStorage.getItem("token");
  return { authed: !!token };
}