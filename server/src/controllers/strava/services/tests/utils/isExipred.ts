export const isExpired = (expiresAt: number) => {
  const currentTime = Math.floor(Date.now() / 1000)
  return currentTime > expiresAt
}
