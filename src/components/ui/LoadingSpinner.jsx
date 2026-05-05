export default function LoadingSpinner({ fullScreen = false }) {
  const wrapper = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-grayMinimal-50/80 z-50'
    : 'flex items-center justify-center p-8'

  return (
    <div className={wrapper}>
      <div className="w-10 h-10 border-4 border-grayMinimal-200 border-t-accent rounded-full animate-spin" />
    </div>
  )
}
