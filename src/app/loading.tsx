export default function Loading() {
  return (
    <div className="splash-container bg-gradient-to-br from-primary/10 to-blue/10 dark:from-primary/20 dark:to-blue/20 dark:bg-dark-2">
      <div className="splash-content text-center">
        <div className="animate-fade-in">
          <div className="mb-4">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-primary dark:text-primary-hover mb-2">CentraQu</h2>
          <p className="text-sm text-gray-6 dark:text-gray-4">Loading...</p>
        </div>
      </div>
    </div>
  );
}