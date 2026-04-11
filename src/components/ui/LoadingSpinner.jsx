export default function LoadingSpinner({ fullScreen = false }) {
  const wrapper = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-pink-50/80 z-50'
    : 'flex items-center justify-center p-8'

  return (
    <div className={wrapper}>
      <div className="w-10 h-10 border-4 border-pink-200 border-t-pink-400 rounded-full animate-spin" />
    </div>
  )
}
