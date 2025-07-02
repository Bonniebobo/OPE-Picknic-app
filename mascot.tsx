// Shared mascot component
export const PicknicMascot = () => {
  return (
    <div className="flex justify-center mb-6">
      <div className="relative">
        {/* Character Body */}
        <div className="w-24 h-24 bg-orange-200 rounded-full flex items-end justify-center">
          {/* Character Head */}
          <div className="w-20 h-20 bg-orange-300 rounded-full relative mb-2 flex items-center justify-center">
            {/* Eyes */}
            <div className="absolute top-6 left-5 w-2 h-2 bg-gray-800 rounded-full"></div>
            <div className="absolute top-6 right-5 w-2 h-2 bg-gray-800 rounded-full"></div>

            {/* Mouth */}
            <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-3 h-1.5 bg-gray-800 rounded-full"></div>

            {/* Cheek blush */}
            <div className="absolute top-8 left-3 w-2 h-1 bg-pink-300 rounded-full opacity-60"></div>
            <div className="absolute top-8 right-3 w-2 h-1 bg-pink-300 rounded-full opacity-60"></div>

            {/* Chef hat */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-16 h-8 bg-white rounded-t-full"></div>
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-12 h-3 bg-white rounded-full"></div>
          </div>

          {/* Arms */}
          <div className="absolute top-16 -left-2 w-4 h-8 bg-orange-200 rounded-full transform -rotate-12"></div>
          <div className="absolute top-16 -right-2 w-4 h-8 bg-orange-200 rounded-full transform rotate-12"></div>
        </div>

        {/* Floating food elements */}
        <div
          className="absolute -top-2 -left-4 text-lg animate-bounce"
          style={{ animationDelay: "0s", animationDuration: "2s" }}
        >
          🍎
        </div>
        <div
          className="absolute -top-1 -right-4 text-lg animate-bounce"
          style={{ animationDelay: "0.5s", animationDuration: "2s" }}
        >
          🥕
        </div>
        <div
          className="absolute top-8 -left-6 text-lg animate-bounce"
          style={{ animationDelay: "1s", animationDuration: "2s" }}
        >
          🍞
        </div>
      </div>
    </div>
  )
}
