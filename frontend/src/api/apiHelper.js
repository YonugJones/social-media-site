export const handleApiError = (err) => {
  console.error('API error:', err)
  throw err.response?.data?.message || 'Something went wrong.'
}